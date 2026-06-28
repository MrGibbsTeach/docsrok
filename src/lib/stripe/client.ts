import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-05-28.basil',
  typescript: true,
})

export const STRIPE_PRICES: Record<string, string | undefined> = {
  core: process.env.STRIPE_PRICE_CORE,
  plus: process.env.STRIPE_PRICE_PLUS,
  team: process.env.STRIPE_PRICE_TEAM,
}
