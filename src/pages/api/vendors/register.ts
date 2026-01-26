import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyAuth, unauthorizedResponse } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { sendVendorOnboardingEmail } from '@/lib/email';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(
      { error: 'Method not allowed' },
      { status: 405 }
    );
  }

  try {
    const payload = await verifyAuth(req);
    if (!payload) {
      return unauthorizedResponse();
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
      return res.status(
        { error: 'Business name is required' },
        { status: 400 }
      );
    }

    // Get user
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', payload.userId)
      .single();

    if (userError || !user) {
      return res.status(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if already a vendor
    const { data: existingVendor } = await supabaseAdmin
      .from('vendors')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (existingVendor) {
      return res.status(
        { error: 'You are already registered as a vendor' },
        { status: 409 }
      );
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
      return res.status(
        { error: 'Failed to create vendor profile' },
        { status: 500 }
      );
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

    return res.status(
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
    return res.status(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
