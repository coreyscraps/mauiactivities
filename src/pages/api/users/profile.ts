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
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    const payload = await verifyAuth(req);
    if (!payload) {
      { const { status, error } = unauthorizedResponse(); return res.status(status).json({ error }); }
    }

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', payload.userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const passExpired = isPassExpired(user.pass_expires_at);
    const daysUntilExpiry = getDaysUntilExpiry(user.pass_expires_at);

    return res.json(
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
    return res.status(500).json({ error: 'Failed to fetch profile' });
  }
}

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  try {
    const payload = await verifyAuth(req);
    if (!payload) {
      { const { status, error } = unauthorizedResponse(); return res.status(status).json({ error }); }
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
      return res.status(500).json({ error: 'Failed to update user' });
    }

    return res.json(
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
    return res.status(500).json({ error: 'Failed to update profile' });
  }
}
