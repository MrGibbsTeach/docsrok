import { createClient } from '@/lib/supabase/server'
import { stripe, STRIPE_PRICES } from '@/lib/stripe/client'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { plan } = await request.json() as { plan: 'core' | 'plus' | 'team' }

    const priceId = STRIPE_PRICES[plan]
    if (!priceId || priceId.startsWith('price_your')) {
      return NextResponse.json(
        { error: 'Stripe price not configured. Add STRIPE_PRICE_* to .env.local.' },
        { status: 400 }
      )
    }

    // Get or create Stripe customer
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single()

    let customerId = subscription?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email!,
        metadata: { supabase_user_id: user.id },
      })
      customerId = customer.id

      await supabase
        .from('subscriptions')
        .update({ stripe_customer_id: customerId })
        .eq('user_id', user.id)
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: `${appUrl}/dashboard?success=true`,
      cancel_url: `${appUrl}/upgrade`,
      metadata: { supabase_user_id: user.id, plan },
      // Stamp the Subscription itself too, so later subscription.* webhook
      // events can find the user even before stripe_subscription_id is stored.
      subscription_data: {
        metadata: { supabase_user_id: user.id, plan },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Checkout failed' },
      { status: 500 }
    )
  }
}
