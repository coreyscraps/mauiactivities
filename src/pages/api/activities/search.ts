import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      q,
      category,
      location,
      sortBy = 'popularity',
      priceMin = 0,
      priceMax = 10000,
      minRating = 0,
      page = '1',
      limit = '20',
    } = req.query;

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 20;
    const offset = (pageNum - 1) * limitNum;

    // Build query
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
        booking_url,
        duration_minutes,
        category_id,
        location_id,
        vendor_id,
        vendors!inner(id, name, rating, review_count, website),
        categories(name),
        locations(name, region)
        `,
        { count: 'exact' }
      )
      .eq('status', 'published')
      .gte('base_price', priceMin)
      .lte('base_price', priceMax)
      .gte('rating', minRating);

    // Apply category filter
    if (category) {
      query = query.eq('category_id', category);
    }

    // Apply location filter
    if (location) {
      query = query.eq('location_id', location);
    }

    // Apply search term
    if (q) {
      query = query.or(
        `name.ilike.%${q}%,description.ilike.%${q}%`
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'price_asc':
        query = query.order('base_price', { ascending: true });
        break;
      case 'price_desc':
        query = query.order('base_price', { ascending: false });
        break;
      case 'rating':
        query = query.order('rating', { ascending: false });
        break;
      case 'popularity':
        query = query.order('view_count', { ascending: false });
        break;
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      default:
        query = query.order('view_count', { ascending: false });
    }

    // Pagination
    const { data: activities, error, count } = await query.range(offset, offset + limitNum - 1);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      activities: activities || [],
      totalCount: count || 0,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil((count || 0) / limitNum),
    });
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ error: 'Search failed' });
  }
}
