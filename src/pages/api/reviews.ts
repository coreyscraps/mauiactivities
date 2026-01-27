/**
 * Reviews API
 * GET: Get reviews for an activity
 * POST: Create a new review
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase';

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
    const { activityId } = req.query;

    if (!activityId) {
      return res.status(400).json({ error: 'Activity ID is required' });
    }

    const { data: reviews, error } = await supabaseAdmin
      .from('reviews')
      .select(
        `
        id,
        activity_id,
        user_id,
        rating,
        title,
        comment,
        helpful_count,
        verified_user,
        created_at,
        users(email)
        `
      )
      .eq('activity_id', activityId as string)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      throw error;
    }

    // Calculate average rating
    const avgRating =
      reviews && reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    return res.status(200).json({
      reviews: reviews || [],
      averageRating: parseFloat(avgRating.toFixed(2)),
      totalReviews: reviews?.length || 0,
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return res.status(500).json({ error: 'Failed to fetch reviews' });
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const userId = req.headers['x-user-id'] as string;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { activity_id, rating, title, comment } = req.body;

    if (!activity_id || !rating || !comment) {
      return res.status(400).json({
        error: 'Missing required fields: activity_id, rating, comment',
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Check if user already reviewed this activity
    const { data: existingReview } = await supabaseAdmin
      .from('reviews')
      .select('id')
      .eq('user_id', userId)
      .eq('activity_id', activity_id)
      .single();

    if (existingReview) {
      return res.status(409).json({ error: 'You have already reviewed this activity' });
    }

    // Create review
    const { data: review, error } = await supabaseAdmin
      .from('reviews')
      .insert({
        user_id: userId,
        activity_id,
        rating,
        title: title || null,
        comment,
        verified_user: true, // Assuming user is verified if logged in
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return res.status(201).json({
      message: 'Review created successfully',
      review,
    });
  } catch (error) {
    console.error('Error creating review:', error);
    return res.status(500).json({ error: 'Failed to create review' });
  }
}
