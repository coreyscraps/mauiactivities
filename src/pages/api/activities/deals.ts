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
    // Get cheapest activity in each category
    const { data: categories, error: catError } = await supabaseAdmin
      .from('categories')
      .select('id, name');

    if (catError) {
      return res.status(400).json({ error: catError.message });
    }

    const deals = [];

    for (const category of categories || []) {
      const { data: cheapest, error: dealError } = await supabaseAdmin
        .from('activities')
        .select(
          `
          id,
          name,
          base_price,
          original_price,
          discount_percent,
          rating,
          image_url,
          booking_url,
          vendors!inner(name)
          `
        )
        .eq('status', 'published')
        .eq('category_id', category.id)
        .order('base_price', { ascending: true })
        .limit(1);

      if (!dealError && cheapest && cheapest.length > 0) {
        deals.push({
          category: category.name,
          deal: cheapest[0],
        });
      }
    }

    return res.status(200).json({
      deals,
    });
  } catch (error) {
    console.error('Deals error:', error);
    return res.status(500).json({ error: 'Failed to fetch deals' });
  }
}
