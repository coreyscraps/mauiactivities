import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, unauthorizedResponse, calculatePassExpiryDate } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { createPassRenewalIntent } from '@/lib/stripe';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: NextRequest) {
  if (req.method === 'POST') {
    return handlePost(req);
  } else {
    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );
  }
}

async function handlePost(req: NextRequest) {
  try {
    const payload = await verifyAuth(req);
    if (!payload) {
      return unauthorizedResponse();
    }

    // Get user
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', payload.userId)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create Stripe payment intent
    const paymentIntent = await createPassRenewalIntent(user.id, user.email);

    // Log the payment
    await supabaseAdmin.from('payments').insert({
      user_id: user.id,
      amount: parseInt(process.env.PASS_RENEWAL_COST || '10'),
      status: 'pending',
      payment_type: 'pass_renewal',
      stripe_payment_intent_id: paymentIntent.id,
    });

    return NextResponse.json(
      {
        message: 'Payment intent created',
        paymentIntent: {
          id: paymentIntent.id,
          clientSecret: paymentIntent.client_secret,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in renew-pass:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}

/**
 * This function is called by Stripe webhook after successful payment
 * It extends the user's pass by 180 days
 */
export async function renewUserPass(userId: string): Promise<boolean> {
  try {
    const newExpiryDate = calculatePassExpiryDate();

    const { error } = await supabaseAdmin
      .from('users')
      .update({
        pass_expires_at: newExpiryDate,
        subscription_status: 'active',
      })
      .eq('id', userId);

    if (error) {
      console.error('Error renewing pass:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in renewUserPass:', error);
    return false;
  }
}
