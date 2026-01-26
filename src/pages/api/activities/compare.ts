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
    const { categoryId, locationId } = req.query;

    if (!categoryId) {
      return res.status(400).json({ error: 'categoryId is required' });
    }

    let query = supabaseAdmin
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
        booking_url,
        vendors!inner(id, name, rating, website),
        categories(name),
        locations(name)
        `
      )
      .eq('status', 'published')
      .eq('category_id', categoryId);

    if (locationId) {
      query = query.eq('location_id', locationId);
    }

    const { data: activities, error } = await query.order('base_price', {
      ascending: true,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (!activities || activities.length === 0) {
      return res.status(404).json({ error: 'No activities found' });
    }

    // Find cheapest, best rated, most popular
    const cheapest = activities[0];
    const bestRated = activities.reduce((prev, current) =>
      (current.rating || 0) > (prev.rating || 0) ? current : prev
    );
    const mostPopular = activities.reduce((prev, current) =>
      (current.view_count || 0) > (prev.view_count || 0) ? current : prev
    );

    return res.status(200).json({
      category: activities[0].categories?.name,
      location: locationId ? activities[0].locations?.name : 'All',
      vendors: activities.map((a) => ({
        id: a.id,
        activity: a.name,
        vendor: a.vendors?.name,
        vendorRating: a.vendors?.rating,
        price: a.base_price,
        currency: a.currency,
        activityRating: a.rating,
        reviews: a.review_count,
        views: a.view_count,
        bookings: a.booking_count,
        bookingUrl: a.booking_url,
      })),
      cheapest: {
        id: cheapest.id,
        vendor: cheapest.vendors?.name,
        price: cheapest.base_price,
      },
      bestRated: {
        id: bestRated.id,
        vendor: bestRated.vendors?.name,
        rating: bestRated.rating,
      },
      mostPopular: {
        id: mostPopular.id,
        vendor: mostPopular.vendors?.name,
        views: mostPopular.view_count,
      },
    });
  } catch (error) {
    console.error('Compare error:', error);
    return res.status(500).json({ error: 'Comparison failed' });
  }
}
