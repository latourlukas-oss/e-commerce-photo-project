import Stripe from 'stripe';

// Initialize Stripe with your secret key
// IMPORTANT: Add your Stripe secret key to .env as STRIPE_SECRET_KEY
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.warn('⚠️ STRIPE_SECRET_KEY is not set. Stripe payments will not work.');
}

export const stripe = stripeSecretKey 
  ? new Stripe(stripeSecretKey, { apiVersion: '2026-01-28.clover' })
  : null;

export function isStripeConfigured(): boolean {
  return !!stripeSecretKey;
}
