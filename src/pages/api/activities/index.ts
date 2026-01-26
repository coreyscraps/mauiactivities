import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, requireVendor, unauthorizedResponse } from '@/lib/auth';
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
    const { searchParams } = new URL(req.url || '/');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const type = searchParams.get('type');
    const location = searchParams.get('location');

    let query = supabaseAdmin
      .from('activities')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (type) {
      query = query.eq('type', type);
    }

    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    const { data, error, count } = await query.range(
      (page - 1) * limit,
      page * limit - 1
    );

    if (error) {
      throw error;
    }

    return res.json(
      {
        activities: data || [],
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
    console.error('Error fetching activities:', error);
    return res.status(500).json({ error: 'Failed to fetch activities' });
  }
}

async function handlePost(req: NextRequest) {
  try {
    // Verify auth
    const payload = await verifyAuth(req);
    if (!payload) {
      { const { status, error } = unauthorizedResponse(); return res.status(status).json({ error }); }
    }

    // Check if vendor
    if (!requireVendor(payload)) {
      return res.status(403).json({ error: 'Only vendors can create activities' });
    }

    const body = await req.json();
    const {
      name,
      type,
      location,
      description,
      durationMinutes,
      difficultyLevel,
      maxParticipants,
      minAge,
      prices,
      insiderDiscount,
      photos,
      tags,
    } = body;

    // Get vendor
    const { data: vendor, error: vendorError } = await supabaseAdmin
      .from('vendors')
      .select('id')
      .eq('user_id', payload.userId)
      .single();

    if (vendorError || !vendor) {
      return res.status(404).json({ error: 'Vendor profile not found' });
    }

    // Create activity
    const { data: activity, error } = await supabaseAdmin
      .from('activities')
      .insert({
        vendor_id: vendor.id,
        name,
        type,
        location,
        description,
        duration_minutes: durationMinutes,
        difficulty_level: difficultyLevel,
        max_participants: maxParticipants,
        min_age: minAge,
        prices: prices || {},
        insider_discount: insiderDiscount || 0,
        photos: photos || [],
        tags: tags || [],
        status: 'draft',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating activity:', error);
      return res.status(500).json({ error: 'Failed to create activity' });
    }

    return res.status(201).json({
        message: 'Activity created successfully',
        activity,
      });
  } catch (error) {
    console.error('Error in POST /api/activities:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
