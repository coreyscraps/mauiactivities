import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: NextRequest) {
  if (req.method !== 'GET') {
    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );
  }

  try {
    // Check database connection
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('count', { count: 'exact', head: true });

    const dbHealthy = !error;

    return NextResponse.json(
      {
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        database: {
          connected: dbHealthy,
        },
        features: {
          stripe: !!process.env.STRIPE_SECRET_KEY,
          sendgrid: !!process.env.SENDGRID_API_KEY,
          supabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        },
      },
      { status: dbHealthy ? 200 : 503 }
    );
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
