import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: NextRequest) {
  if (req.method === 'GET') {
    return handleGet(req);
  } else if (req.method === 'POST') {
    return handlePost(req);
  } else {
    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );
  }
}

async function handleGet(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const activityId = searchParams.get('activityId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!activityId) {
      return NextResponse.json(
        { error: 'Activity ID is required' },
        { status: 400 }
      );
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

    return NextResponse.json(
      {
        reviews: data || [],
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
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

async function handlePost(req: NextRequest) {
  try {
    const payload = await verifyAuth(req);
    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { activityId, rating, title, text } = body;

    // Validate input
    if (!activityId || !rating) {
      return NextResponse.json(
        { error: 'Activity ID and rating are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Check if user already reviewed this activity
    const { data: existingReview } = await supabaseAdmin
      .from('reviews')
      .select('id')
      .eq('activity_id', activityId)
      .eq('user_id', payload.userId)
      .single();

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this activity' },
        { status: 409 }
      );
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
      return NextResponse.json(
        { error: 'Failed to create review' },
        { status: 500 }
      );
    }

    // Update activity rating
    await updateActivityRating(activityId);

    return NextResponse.json(
      {
        message: 'Review posted successfully',
        review,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/reviews:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
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
