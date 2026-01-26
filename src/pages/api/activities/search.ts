import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const location = searchParams.get('location');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minRating = searchParams.get('minRating');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    let query = supabaseAdmin
      .from('activities')
      .select('*')
      .eq('status', 'published')
      .order('rating', { ascending: false })
      .order('created_at', { ascending: false });

    // Apply filters
    if (type) {
      query = query.eq('type', type);
    }

    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    if (minRating) {
      query = query.gte('rating', parseFloat(minRating));
    }

    // Price filtering with JSONB
    // Note: This assumes prices are stored with a 'direct' key
    if (minPrice || maxPrice) {
      // This is a simplified approach - you may need to adjust based on your prices structure
      let activities = [];
      const { data, error } = await query;

      if (!error && data) {
        activities = data.filter((activity) => {
          const directPrice = activity.prices?.direct;
          if (!directPrice) return false;
          if (minPrice && directPrice < parseFloat(minPrice)) return false;
          if (maxPrice && directPrice > parseFloat(maxPrice)) return false;
          return true;
        });
      }

      return NextResponse.json(
        {
          activities: activities.slice((page - 1) * limit, page * limit),
          pagination: {
            page,
            limit,
            total: activities.length,
            pages: Math.ceil(activities.length / limit),
          },
        },
        { status: 200 }
      );
    }

    const { data, error, count } = await query.range(
      (page - 1) * limit,
      page * limit - 1
    );

    if (error) {
      throw error;
    }

    return NextResponse.json(
      {
        activities: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          pages: Math.ceil((count || 0) / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error searching activities:', error);
    return NextResponse.json(
      { error: 'Failed to search activities' },
      { status: 500 }
    );
  }
}
