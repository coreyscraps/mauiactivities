import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyAuth, unauthorizedResponse, getDaysUntilExpiry, isPassExpired } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return handleGet(req);
  } else if (req.method === 'PUT') {
    return handlePut(req);
  } else {
    return res.status(
      { error: 'Method not allowed' },
      { status: 405 }
    );
  }
}

async function handleGet(req: NextRequest) {
  try {
    const payload = await verifyAuth(req);
    if (!payload) {
      return unauthorizedResponse();
    }

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', payload.userId)
      .single();

    if (error || !user) {
      return res.status(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const passExpired = isPassExpired(user.pass_expires_at);
    const daysUntilExpiry = getDaysUntilExpiry(user.pass_expires_at);

    return res.status(
      {
        user: {
          id: user.id,
          email: user.email,
          subscriptionStatus: user.subscription_status,
          passExpiresAt: user.pass_expires_at,
          isPassExpired: passExpired,
          daysUntilExpiry: passExpired ? 0 : daysUntilExpiry,
          isVendor: user.is_vendor,
          isAdmin: user.is_admin,
          createdAt: user.created_at,
          lastLogin: user.last_login,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching profile:', error);
    return res.status(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

async function handlePut(req: NextRequest) {
  try {
    const payload = await verifyAuth(req);
    if (!payload) {
      return unauthorizedResponse();
    }

    const body = await req.json();
    const { email, subscriptionStatus } = body;

    const updateData: any = {};
    if (email) updateData.email = email;
    if (subscriptionStatus) updateData.subscription_status = subscriptionStatus;

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .update(updateData)
      .eq('id', payload.userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      return res.status(
        { error: 'Failed to update user' },
        { status: 500 }
      );
    }

    return res.status(
      {
        message: 'Profile updated successfully',
        user: {
          id: user.id,
          email: user.email,
          subscriptionStatus: user.subscription_status,
          passExpiresAt: user.pass_expires_at,
          isVendor: user.is_vendor,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
