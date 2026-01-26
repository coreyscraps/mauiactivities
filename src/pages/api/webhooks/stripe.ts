import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyWebhookSignature } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';
import { renewUserPass } from '../users/renew-pass';
import Stripe from 'stripe';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return res.status(400).json({ error: 'Missing stripe signature' });
    }

    // Verify webhook signature
    const event = verifyWebhookSignature(body, signature);

    if (!event) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      case 'charge.refunded':
        await handleChargeRefunded(event.data.object as Stripe.Charge);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Webhook handler error' });
  }
}

async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent
): Promise<void> {
  try {
    const userId = paymentIntent.metadata?.userId;
    const vendorId = paymentIntent.metadata?.vendorId;
    const paymentType = paymentIntent.metadata?.type;

    // Update payment record
    await supabaseAdmin
      .from('payments')
      .update({
        status: 'succeeded',
        stripe_charge_id: paymentIntent.latest_charge as string,
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_payment_intent_id', paymentIntent.id);

    // Handle different payment types
    if (paymentType === 'pass_renewal' && userId) {
      const success = await renewUserPass(userId);
      if (!success) {
        console.error('Failed to renew user pass for user:', userId);
      }
    } else if (paymentType === 'vendor_subscription' && vendorId) {
      // Handle vendor subscription payment
      await supabaseAdmin
        .from('vendors')
        .update({
          stripe_account_id: (paymentIntent.latest_charge as string) || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', vendorId);
    }

    console.log(`Payment succeeded: ${paymentIntent.id}`);
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

async function handlePaymentIntentFailed(
  paymentIntent: Stripe.PaymentIntent
): Promise<void> {
  try {
    const errorMessage =
      paymentIntent.last_payment_error?.message || 'Unknown error';

    // Update payment record
    await supabaseAdmin
      .from('payments')
      .update({
        status: 'failed',
        error_message: errorMessage,
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_payment_intent_id', paymentIntent.id);

    console.log(`Payment failed: ${paymentIntent.id} - ${errorMessage}`);
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

async function handleChargeRefunded(charge: Stripe.Charge): Promise<void> {
  try {
    // Find the payment record
    const { data: payment } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('stripe_charge_id', charge.id)
      .single();

    if (!payment) {
      console.log(`No payment found for charge: ${charge.id}`);
      return;
    }

    // Update payment record
    await supabaseAdmin
      .from('payments')
      .update({
        status: 'refunded',
        updated_at: new Date().toISOString(),
      })
      .eq('id', payment.id);

    console.log(`Charge refunded: ${charge.id}`);
  } catch (error) {
    console.error('Error handling refund:', error);
  }
}
