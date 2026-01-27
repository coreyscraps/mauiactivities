/**
 * User Favorites API
 * GET: List user's favorite activities
 * POST: Add activity to favorites
 * DELETE: Remove activity from favorites
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase';

// Helper to get user ID from token
function getUserIdFromToken(req: NextApiRequest): string | null {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return null;
  }
  
  // In a real app, you'd verify and decode the JWT token
  // For now, we'll use a simpler approach with localStorage token
  // The actual user ID should be passed in the header or body
  return null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get user ID from headers (comes from frontend)
  const userId = req.headers['x-user-id'] as string;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized - User ID required' });
  }

  if (req.method === 'GET') {
    return handleGet(req, res, userId);
  } else if (req.method === 'POST') {
    return handlePost(req, res, userId);
  } else if (req.method === 'DELETE') {
    return handleDelete(req, res, userId);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { data: favorites, error } = await supabaseAdmin
      .from('user_favorites')
      .select(
        `
        id,
        activity_id,
        created_at,
        activities(
          id,
          name,
          description,
          base_price,
          currency,
          rating,
          review_count,
          image_url,
          booking_url,
          duration_minutes,
          vendor_id,
          category_id,
          location_id,
          vendors(id, name, rating),
          categories(name),
          locations(name, region)
        )
        `
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return res.status(200).json({
      favorites: favorites || [],
      total: favorites?.length || 0,
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return res.status(500).json({ error: 'Failed to fetch favorites' });
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { activity_id } = req.body;

    if (!activity_id) {
      return res.status(400).json({ error: 'Activity ID is required' });
    }

    // Check if already favorited
    const { data: existing } = await supabaseAdmin
      .from('user_favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('activity_id', activity_id)
      .single();

    if (existing) {
      return res.status(409).json({ error: 'Already favorited' });
    }

    // Add to favorites
    const { data: favorite, error } = await supabaseAdmin
      .from('user_favorites')
      .insert({
        user_id: userId,
        activity_id,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return res.status(201).json({
      message: 'Added to favorites',
      favorite,
    });
  } catch (error) {
    console.error('Error adding favorite:', error);
    return res.status(500).json({ error: 'Failed to add favorite' });
  }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { activity_id } = req.body;

    if (!activity_id) {
      return res.status(400).json({ error: 'Activity ID is required' });
    }

    // Remove from favorites
    const { error } = await supabaseAdmin
      .from('user_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('activity_id', activity_id);

    if (error) {
      throw error;
    }

    return res.status(200).json({
      message: 'Removed from favorites',
    });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return res.status(500).json({ error: 'Failed to remove favorite' });
  }
}
