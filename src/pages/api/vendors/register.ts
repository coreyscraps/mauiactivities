import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyAuth, unauthorizedResponse } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { sendVendorOnboardingEmail } from '@/lib/email';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = await verifyAuth(req);
    if (!payload) {
      { const { status, error } = unauthorizedResponse(); return res.status(status).json({ error }); }
    }

    const body = await req.json();
    const {
      businessName,
      contactPerson,
      phone,
      website,
      plan = 'starter',
    } = body;

    // Validate input
    if (!businessName) {
      return res.status(400).json({ error: 'Business name is required' });
    }

    // Get user
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', payload.userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already a vendor
    const { data: existingVendor } = await supabaseAdmin
      .from('vendors')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (existingVendor) {
      return res.status(409).json({ error: 'You are already registered as a vendor' });
    }

    // Determine monthly fee based on plan
    const monthlyFees: Record<string, number> = {
      starter: 0,
      professional: 50,
      enterprise: 200,
    };

    // Create vendor
    const { data: vendor, error } = await supabaseAdmin
      .from('vendors')
      .insert({
        user_id: user.id,
        business_name: businessName,
        email: user.email,
        contact_person: contactPerson || null,
        phone: phone || null,
        website: website || null,
        plan,
        monthly_fee: monthlyFees[plan] || 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating vendor:', error);
      return res.status(500).json({ error: 'Failed to create vendor profile' });
    }

    // Update user to be a vendor
    await supabaseAdmin
      .from('users')
      .update({ is_vendor: true })
      .eq('id', user.id);

    // Send onboarding email
    try {
      const activationLink = `${process.env.NEXT_PUBLIC_API_URL}/vendor/onboarding/${vendor.id}`;
      await sendVendorOnboardingEmail(user.email, businessName, activationLink);
    } catch (emailError) {
      console.error('Error sending onboarding email:', emailError);
    }

    return res.json(
      {
        message: 'Vendor account created successfully',
        vendor: {
          id: vendor.id,
          businessName: vendor.business_name,
          email: vendor.email,
          plan: vendor.plan,
          monthlyFee: vendor.monthly_fee,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in vendor register:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
