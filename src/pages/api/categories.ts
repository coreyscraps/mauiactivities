/**
 * Get all activity categories
 */

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
    const { data: categories, error } = await supabaseAdmin
      .from('categories')
      .select('id, name, description, icon')
      .order('name', { ascending: true });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      categories: categories || [],
    });
  } catch (error) {
    console.error('Categories error:', error);
    return res.status(500).json({ error: 'Failed to fetch categories' });
  }
}
