import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json({
    name: 'Maui Activities Hub Backend API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      auth: ['/api/auth/signup', '/api/auth/login', '/api/auth/verify'],
      activities: [
        '/api/activities',
        '/api/activities/search',
        '/api/activities/[id]/pricing',
      ],
      users: ['/api/users/profile', '/api/users/renew-pass'],
      vendors: ['/api/vendors/register', '/api/vendors/[id]/analytics'],
      bookings: ['/api/bookings'],
      reviews: ['/api/reviews'],
      system: ['/api/health', '/api/webhooks/stripe'],
    },
    documentation: 'See API_DOCS.md for full documentation',
    timestamp: new Date().toISOString(),
  });
}
