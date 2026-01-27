import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyAuth, requireVendor, unauthorizedResponse } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return handleGet(req, res);
  } else if (req.method === 'POST') {
    return handlePost(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    const page = parseInt((req.query.page as string) || '1');
    const limit = parseInt((req.query.limit as string) || '20');
    const categoryId = req.query.category_id as string;
    const locationId = req.query.location_id as string;

    let query = supabaseAdmin
      .from('activities')
      .select(
        `
        id,
        name,
        description,
        base_price,
        currency,
        rating,
        review_count,
        view_count,
        booking_count,
        image_url,
        images,
        booking_url,
        duration_minutes,
        difficulty_level,
        group_size_min,
        group_size_max,
        insider_discount,
        vendor_id,
        category_id,
        location_id,
        status,
        created_at,
        vendors(id, name, rating, review_count, website),
        categories(id, name),
        locations(id, name, region)
        `,
        { count: 'exact' }
      )
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    if (locationId) {
      query = query.eq('location_id', locationId);
    }

    const { data, error, count } = await query.range(
      (page - 1) * limit,
      page * limit - 1
    );

    if (error) {
      throw error;
    }

    return res.status(200).json({
      activities: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    return res.status(500).json({ error: 'Failed to fetch activities' });
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Verify auth
    const payload = await verifyAuth(req);
    if (!payload) {
      const { status, error } = unauthorizedResponse();
      return res.status(status).json({ error });
    }

    // Check if vendor
    if (!requireVendor(payload)) {
      return res.status(403).json({ error: 'Only vendors can create activities' });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const {
      name,
      description,
      category_id,
      location_id,
      duration_minutes,
      difficulty_level,
      group_size_min,
      group_size_max,
      base_price,
      currency,
      image_url,
      images,
      booking_url,
      insider_discount,
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
        description,
        category_id,
        location_id,
        duration_minutes,
        difficulty_level,
        group_size_min,
        group_size_max,
        base_price,
        currency: currency || 'USD',
        image_url,
        images: images || [],
        booking_url,
        insider_discount: insider_discount || 0,
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
