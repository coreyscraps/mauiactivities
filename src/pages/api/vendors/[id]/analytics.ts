import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyAuth, unauthorizedResponse, requireVendor } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(
      { error: 'Method not allowed' },
      { status: 405 }
    );
  }

  try {
    const payload = await verifyAuth(req);
    if (!payload || !requireVendor(payload)) {
      return unauthorizedResponse();
    }

    const { pathname } = new URL(req.url);
    const vendorId = pathname.split('/')[4]; // Extract vendor ID

    if (!vendorId) {
      return res.status(
        { error: 'Vendor ID is required' },
        { status: 400 }
      );
    }

    // Verify vendor ownership
    const { data: vendor, error: vendorError } = await supabaseAdmin
      .from('vendors')
      .select('*')
      .eq('id', vendorId)
      .eq('user_id', payload.userId)
      .single();

    if (vendorError || !vendor) {
      return res.status(
        { error: 'Vendor not found or unauthorized' },
        { status: 404 }
      );
    }

    // Get analytics data
    const { data: clicks, error: clicksError } = await supabaseAdmin
      .from('bookings')
      .select('id')
      .eq('vendor_id', vendorId)
      .eq('conversion_status', 'click');

    const { data: conversions, error: conversionsError } = await supabaseAdmin
      .from('bookings')
      .select('id, commission_amount')
      .eq('vendor_id', vendorId)
      .eq('conversion_status', 'conversion');

    const { data: activities, error: activitiesError } = await supabaseAdmin
      .from('activities')
      .select('id, rating, review_count')
      .eq('vendor_id', vendorId)
      .eq('status', 'published');

    const totalClicks = clicks?.length || 0;
    const totalConversions = conversions?.length || 0;
    const totalEarnings = conversions?.reduce(
      (sum, b) => sum + (b.commission_amount || 0),
      0
    ) || 0;
    const conversionRate =
      totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : '0';
    const avgActivityRating =
      activities && activities.length > 0
        ? (
            activities.reduce((sum, a) => sum + (a.rating || 0), 0) /
            activities.length
          ).toFixed(2)
        : '0';

    return res.status(
      {
        analytics: {
          vendorId,
          businessName: vendor.business_name,
          totalActivities: activities?.length || 0,
          totalClicks,
          totalConversions,
          conversionRate: parseFloat(conversionRate as string),
          totalEarnings: parseFloat(totalEarnings.toFixed(2)),
          avgActivityRating: parseFloat(avgActivityRating as string),
          plan: vendor.plan,
          monthlyFee: vendor.monthly_fee,
          verified: vendor.verified,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return res.status(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
