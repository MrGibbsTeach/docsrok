import { stripe } from '@/lib/stripe/client'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import type Stripe from 'stripe'

// Map Stripe price ID to our plan names
function planFromPrice(priceId: string | undefined): 'core' | 'plus' | 'team' {
  if (priceId && priceId === process.env.STRIPE_PRICE_CORE) return 'core'
  if (priceId && priceId === process.env.STRIPE_PRICE_PLUS) return 'plus'
  if (priceId && priceId === process.env.STRIPE_PRICE_TEAM) return 'team'
  console.warn('planFromPrice: unrecognised price ID, defaulting to core', { priceId })
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

  // IMPORTANT: a Stripe webhook carries no user session, so the cookie-based
  // anon-key client cannot satisfy Row Level Security on `subscriptions` and
  // every UPDATE silently affects zero rows. Use the service-role client here.
  let supabase: ReturnType<typeof createAdminClient>
  try {
    supabase = createAdminClient()
  } catch (err) {
    console.error('Webhook cannot reach Supabase:', err)
    // 500 so Stripe retries once the env var is in place.
    return NextResponse.json({ error: 'Supabase admin client unavailable' }, { status: 500 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.supabase_user_id

        if (!userId || !session.subscription) {
          console.error('checkout.session.completed: missing userId or subscription', {
            userId,
            subscription: session.subscription,
            metadata: session.metadata,
          })
          break
        }

        const stripeSub = (await stripe.subscriptions.retrieve(
          session.subscription as string
        )) as unknown as Stripe.Subscription
        const priceId = stripeSub.items.data[0]?.price.id
        const plan = planFromPrice(priceId)

        const { error: updateError, data: updateData } = await supabase
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
          .select()

        if (updateError) {
          console.error('checkout.session.completed: update failed', { userId, updateError })
          return NextResponse.json({ error: 'Subscription update failed' }, { status: 500 })
        }

        if (!updateData || updateData.length === 0) {
          // The customer has paid but we have no row to mark active. Return 500
          // so Stripe retries rather than losing the event silently.
          console.error('checkout.session.completed: no subscriptions row matched user_id', {
            userId,
          })
          return NextResponse.json({ error: 'No subscription row for user' }, { status: 500 })
        }

        console.log('checkout.session.completed: subscription activated', {
          userId,
          plan,
          rowsUpdated: updateData.length,
        })
        break
      }

      case 'customer.subscription.updated': {
        const stripeSub = event.data.object as Stripe.Subscription
        const priceId = stripeSub.items.data[0]?.price.id
        const plan = planFromPrice(priceId)

        const status =
          stripeSub.status === 'active'
            ? 'active'
            : stripeSub.status === 'past_due'
            ? 'past_due'
            : stripeSub.status === 'canceled'
            ? 'canceled'
            : 'active'

        const patch = {
          plan,
          status,
          current_period_end: getCurrentPeriodEndIso(stripeSub),
        }

        // Prefer matching on the subscription id. Fall back to the user id from
        // subscription metadata for the first event after checkout, before
        // stripe_subscription_id has been written.
        const { error, data } = await supabase
          .from('subscriptions')
          .update(patch)
          .eq('stripe_subscription_id', stripeSub.id)
          .select()

        if (error) {
          console.error('customer.subscription.updated: update failed', error)
          return NextResponse.json({ error: 'Subscription update failed' }, { status: 500 })
        }

        if (!data || data.length === 0) {
          const userId = stripeSub.metadata?.supabase_user_id
          if (userId) {
            const { error: fallbackError } = await supabase
              .from('subscriptions')
              .update({ ...patch, stripe_subscription_id: stripeSub.id })
              .eq('user_id', userId)
            if (fallbackError) {
              console.error('customer.subscription.updated: fallback failed', fallbackError)
              return NextResponse.json({ error: 'Subscription update failed' }, { status: 500 })
            }
          } else {
            console.error('customer.subscription.updated: no matching row and no metadata', {
              subscriptionId: stripeSub.id,
            })
          }
        }
        break
      }

      case 'customer.subscription.deleted': {
        const stripeSub = event.data.object as Stripe.Subscription
        const { error } = await supabase
          .from('subscriptions')
          .update({ status: 'canceled', plan: 'trial' })
          .eq('stripe_subscription_id', stripeSub.id)
        if (error) {
          console.error('customer.subscription.deleted: update failed', error)
          return NextResponse.json({ error: 'Subscription update failed' }, { status: 500 })
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as any
        const subscriptionId =
          invoice.subscription ?? invoice.parent?.subscription_details?.subscription
        if (subscriptionId) {
          const { error } = await supabase
            .from('subscriptions')
            .update({ status: 'past_due' })
            .eq('stripe_subscription_id', subscriptionId as string)
          if (error) {
            console.error('invoice.payment_failed: update failed', error)
            return NextResponse.json({ error: 'Subscription update failed' }, { status: 500 })
          }
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
