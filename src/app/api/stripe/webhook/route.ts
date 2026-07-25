import { stripe } from '@/lib/stripe/client'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type Stripe from 'stripe'

// Map Stripe plan nickname / price ID to our plan names
function planFromPrice(priceId: string): 'core' | 'plus' | 'team' {
  if (priceId === process.env.STRIPE_PRICE_CORE) return 'core'
  if (priceId === process.env.STRIPE_PRICE_PLUS) return 'plus'
  if (priceId === process.env.STRIPE_PRICE_TEAM) return 'team'
  return 'core'
}

// Newer Stripe API versions moved `current_period_end` from the top-level
// Subscription object down to each subscription item. Check both locations
// so this keeps working regardless of API version, and never throws if the
// field is genuinely absent (RangeError: Invalid time value otherwise).
function getCurrentPeriodEndIso(sub: Stripe.Subscription): string | null {
  const raw =
    (sub as any).current_period_end ??
    sub.items?.data?.[0]?.current_period_end
  if (typeof raw !== 'number' || !Number.isFinite(raw)) return null
  return new Date(raw * 1000).toISOString()
}

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.supabase_user_id
        if (!userId || !session.subscription) break

        // Fetch full subscription from Stripe
        const stripeSub = await stripe.subscriptions.retrieve(
          session.subscription as string
        ) as unknown as Stripe.Subscription
        const priceId = stripeSub.items.data[0]?.price.id
        const plan = planFromPrice(priceId)

        await supabase
          .from('subscriptions')
          .update({
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            plan,
            status: 'active',
            trial_ends_at: null,
            current_period_end: getCurrentPeriodEndIso(stripeSub),
          })
          .eq('user_id', userId)
        break
      }

      case 'customer.subscription.updated': {
        const stripeSub = event.data.object as Stripe.Subscription
        const userId = stripeSub.metadata?.supabase_user_id

        // Look up by stripe_subscription_id if no metadata
        const query = userId
          ? supabase.from('subscriptions').update({}).eq('user_id', userId)
          : supabase.from('subscriptions').update({}).eq('stripe_subscription_id', stripeSub.id)

        const priceId = stripeSub.items.data[0]?.price.id
        const plan = planFromPrice(priceId)

        await supabase
          .from('subscriptions')
          .update({
            plan,
            status: stripeSub.status === 'active' ? 'active'
              : stripeSub.status === 'past_due' ? 'past_due'
              : stripeSub.status === 'canceled' ? 'canceled'
              : 'active',
            current_period_end: getCurrentPeriodEndIso(stripeSub),
          })
          .eq('stripe_subscription_id', stripeSub.id)
        break
      }

      case 'customer.subscription.deleted': {
        const stripeSub = event.data.object as Stripe.Subscription
        await supabase
          .from('subscriptions')
          .update({ status: 'canceled', plan: 'trial' })
          .eq('stripe_subscription_id', stripeSub.id)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as any
        if (invoice.subscription) {
          await supabase
            .from('subscriptions')
            .update({ status: 'past_due' })
            .eq('stripe_subscription_id', invoice.subscription as string)
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook handler error:', err)
    return NextResponse.json({ error: 'Handler error' }, { status: 500 })
  }
}
