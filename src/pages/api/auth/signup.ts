import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase';
import { hashPassword, generateToken, calculatePassExpiryDate } from '@/lib/auth';
import { sendWelcomeEmail } from '@/lib/email';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = await req.json();
    const { email, password, isVendor = false } = body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Calculate pass expiry (180 days)
    const passExpiresAt = calculatePassExpiryDate();

    // Create user
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .insert({
        email,
        password_hash: passwordHash,
        subscription_status: 'active',
        pass_expires_at: passExpiresAt,
        is_vendor: isVendor,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ error: 'Failed to create user' });
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      isVendor: user.is_vendor,
    });

    // Send welcome email
    try {
      await sendWelcomeEmail(email, email.split('@')[0]);
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      // Continue even if email fails
    }

    return res.json(
      {
        message: 'User created successfully',
        user: {
          id: user.id,
          email: user.email,
          passExpiresAt: user.pass_expires_at,
          isVendor: user.is_vendor,
        },
        token,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in signup:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
