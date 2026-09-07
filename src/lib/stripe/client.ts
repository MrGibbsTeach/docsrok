import Stripe from 'stripe'

// Deliberately NOT throwing at module scope. Vercel evaluates modules during
// static page generation ("Collecting page data"), so a module-level throw
// fails the whole build rather than just the route that needs the key.
// Routes that use Stripe should rely on `isStripeConfigured` at request time.
const secretKey = process.env.STRIPE_SECRET_KEY ?? 'missing'

export const isStripeConfigured = process.env.STRIPE_SECRET_KEY !== undefined

export const stripe = new Stripe(secretKey, {
  apiVersion: '2026-06-24.dahlia',
  typescript: true,
})

export const STRIPE_PRICES: Record<string, string | undefined> = {
  core: process.env.STRIPE_PRICE_CORE,
  plus: process.env.STRIPE_PRICE_PLUS,
  team: process.env.STRIPE_PRICE_TEAM,
}
