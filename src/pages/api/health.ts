import { NextRequest, NextResponse } from 'next/server';

export const config = {
  runtime: 'nodejs',
};

export default function handler(req: NextRequest) {
  if (req.method !== 'GET') {
    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );
  }

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    message: 'Maui Activities Hub API is running',
  });
}
