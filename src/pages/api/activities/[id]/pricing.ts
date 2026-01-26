import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(
      { error: 'Method not allowed' },
      { status: 405 }
    );
  }

  try {
    const { pathname } = new URL(req.url);
    const id = pathname.split('/')[4]; // Extract ID from /api/activities/[id]/pricing

    if (!id) {
      return res.status(
        { error: 'Activity ID is required' },
        { status: 400 }
      );
    }

    // Get activity
    const { data: activity, error } = await supabaseAdmin
      .from('activities')
      .select('id, name, prices, insider_discount')
      .eq('id', id)
      .eq('status', 'published')
      .single();

    if (error || !activity) {
      return res.status(
        { error: 'Activity not found' },
        { status: 404 }
      );
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

    return res.status(
      {
        activityId: activity.id,
        activityName: activity.name,
        prices: pricesWithDiscount,
        insiderDiscount: activity.insider_discount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching pricing:', error);
    return res.status(
      { error: 'Failed to fetch pricing' },
      { status: 500 }
    );
  }
}
