import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyAuth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return handleGet(req, res);
  } else if (req.method === 'POST') {
    return handlePost(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    const activityId = req.query.activityId as string;
    const page = parseInt((req.query.page as string) || '1');
    const limit = parseInt((req.query.limit as string) || '10');

    if (!activityId) {
      return res.status(400).json({ error: 'Activity ID is required' });
    }

    const { data, error, count } = await supabaseAdmin
      .from('reviews')
      .select('*')
      .eq('activity_id', activityId)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      throw error;
    }

    return res.status(200).json({
      reviews: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return res.status(500).json({ error: 'Failed to fetch reviews' });
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const payload = await verifyAuth(req);
    if (!payload) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { activityId, rating, title, text } = body;

    // Validate input
    if (!activityId || !rating) {
      return res.status(400).json({ error: 'Activity ID and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Check if user already reviewed this activity
    const { data: existingReview } = await supabaseAdmin
      .from('reviews')
      .select('id')
      .eq('activity_id', activityId)
      .eq('user_id', payload.userId)
      .single();

    if (existingReview) {
      return res.status(409).json({ error: 'You have already reviewed this activity' });
    }

    // Create review
    const { data: review, error } = await supabaseAdmin
      .from('reviews')
      .insert({
        activity_id: activityId,
        user_id: payload.userId,
        rating,
        title: title || null,
        text: text || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating review:', error);
      return res.status(500).json({ error: 'Failed to create review' });
    }

    // Update activity rating
    await updateActivityRating(activityId);

    return res.status(201).json({
      message: 'Review posted successfully',
      review,
    });
  } catch (error) {
    console.error('Error in POST /api/reviews:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateActivityRating(activityId: string): Promise<void> {
  try {
    const { data: reviews } = await supabaseAdmin
      .from('reviews')
      .select('rating')
      .eq('activity_id', activityId);

    if (!reviews || reviews.length === 0) {
      return;
    }

    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await supabaseAdmin
      .from('activities')
      .update({
        rating: parseFloat(avgRating.toFixed(2)),
        review_count: reviews.length,
      })
      .eq('id', activityId);
  } catch (error) {
    console.error('Error updating activity rating:', error);
  }
}
