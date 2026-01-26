import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { pathname } = new URL(req.url);
    const id = pathname.split('/')[4]; // Extract ID from /api/activities/[id]/pricing

    if (!id) {
      return res.status(400).json({ error: 'Activity ID is required' });
    }

    // Get activity
    const { data: activity, error } = await supabaseAdmin
      .from('activities')
      .select('id, name, prices, insider_discount')
      .eq('id', id)
      .eq('status', 'published')
      .single();

    if (error || !activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    const prices = {
      direct: activity.prices?.direct || null,
      viator: activity.prices?.viator || null,
      getyourguide: activity.prices?.getyourguide || null,
      other: activity.prices?.other || null,
    };

    // Add insider discount if applicable
    const pricesWithDiscount: Record<string, any> = {};
    Object.entries(prices).forEach(([source, price]) => {
      if (price) {
        pricesWithDiscount[source] = {
          price,
          discount: activity.insider_discount || 0,
          finalPrice: price * (1 - (activity.insider_discount || 0) / 100),
        };
      }
    });

    return res.status(200).json({
        activityId: activity.id,
        activityName: activity.name,
        prices: pricesWithDiscount,
        insiderDiscount: activity.insider_discount,
      });
  } catch (error) {
    console.error('Error fetching pricing:', error);
    return res.status(500).json({ error: 'Failed to fetch pricing' });
  }
}
