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
    const { limit = '10' } = req.query;
    const limitNum = parseInt(limit as string) || 10;

    // Get trending activities (most views in last 7 days)
    const { data: trending, error } = await supabaseAdmin
      .from('activities')
      .select(
        `
        id,
        name,
        base_price,
        currency,
        rating,
        review_count,
        view_count,
        booking_count,
        image_url,
        booking_url,
        vendor_id,
        vendors!inner(name, rating),
        categories(name),
        locations(name)
        `
      )
      .eq('status', 'published')
      .order('view_count', { ascending: false })
      .limit(limitNum);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      trending: trending || [],
    });
  } catch (error) {
    console.error('Trending error:', error);
    return res.status(500).json({ error: 'Failed to fetch trending' });
  }
}
