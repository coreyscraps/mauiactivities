import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, isPassExpired, getDaysUntilExpiry } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: NextRequest) {
  if (req.method !== 'GET') {
    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );
  }

  try {
    // Verify JWT token
    const payload = await verifyAuth(req);
    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user from database
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', payload.userId)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const passExpired = isPassExpired(user.pass_expires_at);
    const daysUntilExpiry = getDaysUntilExpiry(user.pass_expires_at);

    return NextResponse.json(
      {
        valid: true,
        user: {
          id: user.id,
          email: user.email,
          subscriptionStatus: user.subscription_status,
          passExpiresAt: user.pass_expires_at,
          isVendor: user.is_vendor,
          isPassExpired: passExpired,
          daysUntilExpiry: passExpired ? 0 : daysUntilExpiry,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in verify:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
