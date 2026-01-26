import { NextResponse } from 'next/server';

export default function handler() {
  return NextResponse.json({
    message: 'Maui Activities Hub API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      activities: '/api/activities',
      auth: {
        login: '/api/auth/login',
        signup: '/api/auth/signup',
        verify: '/api/auth/verify',
      },
      users: {
        profile: '/api/users/profile',
        renewPass: '/api/users/renew-pass',
      },
      vendors: {
        register: '/api/vendors/register',
        analytics: '/api/vendors/[id]/analytics',
      },
      bookings: '/api/bookings',
      reviews: '/api/reviews',
      webhooks: {
        stripe: '/api/webhooks/stripe',
      },
    },
  });
}
