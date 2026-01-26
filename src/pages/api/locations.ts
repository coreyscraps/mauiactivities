/**
 * Get all Maui locations
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
    const { data: locations, error } = await supabaseAdmin
      .from('locations')
      .select('id, name, region')
      .order('name', { ascending: true });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      locations: locations || [],
    });
  } catch (error) {
    console.error('Locations error:', error);
    return res.status(500).json({ error: 'Failed to fetch locations' });
  }
}
