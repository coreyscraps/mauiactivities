import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, unauthorizedResponse, requireVendor } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: NextRequest) {
  if (req.method === 'GET') {
    return handleGet(req);
  } else if (req.method === 'POST') {
    return handlePost(req);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleGet(req: NextRequest) {
  try {
    const payload = await verifyAuth(req);
    if (!payload) {
      { const { status, error } = unauthorizedResponse(); return res.status(status).json({ error }); }
    }

    const { searchParams } = new URL(req.url || '/');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    let query = supabaseAdmin.from('bookings').select('*');

    // Users see their own bookings
    if (!payload || !requireVendor(payload)) {
      query = query.eq('user_id', payload.userId);
    } else {
      // Vendors see bookings for their activities
      const { data: vendor } = await supabaseAdmin
        .from('vendors')
        .select('id')
        .eq('user_id', payload.userId)
        .single();

      if (vendor) {
        query = query.eq('vendor_id', vendor.id);
      }
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      throw error;
    }

    return res.json(
      {
        bookings: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          pages: Math.ceil((count || 0) / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return res.status(500).json({ error: 'Failed to fetch bookings' });
  }
}

async function handlePost(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      activityId,
      vendorId,
      bookingDate,
      affiliateSource,
      externalBookingId,
      externalPlatform,
      totalPrice,
    } = body;

    // Validate input
    if (!activityId || !vendorId) {
      return res.status(400).json({ error: 'Activity ID and Vendor ID are required' });
    }

    // Calculate commission (default 15%)
    const commissionRate =
      parseInt(process.env.DEFAULT_AFFILIATE_COMMISSION_RATE || '15') / 100;
    const commissionAmount = totalPrice ? totalPrice * commissionRate : 0;

    // Create booking
    const { data: booking, error } = await supabaseAdmin
      .from('bookings')
      .insert({
        user_id: userId || null,
        activity_id: activityId,
        vendor_id: vendorId,
        booking_date: bookingDate || new Date().toISOString().split('T')[0],
        conversion_status: 'click',
        affiliate_source: affiliateSource || 'direct',
        external_booking_id: externalBookingId || null,
        external_platform: externalPlatform || 'direct',
        commission_amount: commissionAmount,
        total_price: totalPrice || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating booking:', error);
      return res.status(500).json({ error: 'Failed to create booking' });
    }

    return res.status(201).json({
        message: 'Booking tracked successfully',
        booking,
      });
  } catch (error) {
    console.error('Error in POST /api/bookings:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
