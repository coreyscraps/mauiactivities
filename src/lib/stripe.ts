import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';

if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not defined');
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16',
  typescript: true,
});

export const PASS_RENEWAL_AMOUNT = parseInt(process.env.PASS_RENEWAL_COST || '10') * 100; // in cents

/**
 * Create a payment intent for pass renewal
 */
export async function createPassRenewalIntent(
  userId: string,
  email: string
): Promise<Stripe.PaymentIntent> {
  return stripe.paymentIntents.create({
    amount: PASS_RENEWAL_AMOUNT,
    currency: 'usd',
    payment_method_types: ['card'],
    metadata: {
      userId,
      type: 'pass_renewal',
    },
    receipt_email: email,
  });
}

/**
 * Create a payment intent for vendor subscription
 */
export async function createVendorSubscriptionIntent(
  vendorId: string,
  amount: number,
  email: string
): Promise<Stripe.PaymentIntent> {
  return stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: 'usd',
    payment_method_types: ['card'],
    metadata: {
      vendorId,
      type: 'vendor_subscription',
    },
    receipt_email: email,
  });
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  body: string,
  signature: string
): Stripe.Event | null {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
  try {
    return stripe.webhooks.constructEvent(body, signature, webhookSecret) as Stripe.Event;
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return null;
  }
}

/**
 * Retrieve payment intent
 */
export async function getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
  return stripe.paymentIntents.retrieve(paymentIntentId);
}

/**
 * Handle successful payment
 */
export async function handlePaymentSuccess(
  paymentIntent: Stripe.PaymentIntent
): Promise<{ userId?: string; vendorId?: string; type?: string }> {
  return {
    userId: paymentIntent.metadata?.userId,
    vendorId: paymentIntent.metadata?.vendorId,
    type: paymentIntent.metadata?.type,
  };
}
