/**
 * Get special deals detected by price monitoring
 * GET /api/activities/deals-v2?limit=20&sort=discount_percent
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { limit = '20', sort = 'discount_percent' } = req.query;
    const limitNum = parseInt(limit as string) || 20;

    // Get active deals sorted by discount percent
    let query = supabaseAdmin
      .from('special_deals')
      .select(
        `
        id,
        vendor_id,
        deal_title,
        deal_description,
        discount_percent,
        discount_amount,
        original_price,
        deal_price,
        deal_start_date,
        deal_end_date,
        deal_url,
        is_active,
        vendors!inner(id, name, website, rating),
        activities(id, name, category_id)
        `
      )
      .eq('is_active', true)
      .gt('deal_end_date', new Date().toISOString())
      .limit(limitNum);

    // Apply sorting
    if (sort === 'discount_percent') {
      query = query.order('discount_percent', { ascending: false });
    } else if (sort === 'newest') {
      query = query.order('created_at', { ascending: false });
    } else if (sort === 'ending_soon') {
      query = query.order('deal_end_date', { ascending: true });
    }

    const { data: deals, error } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      deals: deals || [],
      totalCount: (deals || []).length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Deals error:', error);
    return res.status(500).json({ error: 'Failed to fetch deals' });
  }
}
