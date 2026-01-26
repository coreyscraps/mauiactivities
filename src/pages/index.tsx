import React from 'react';

export default function Home() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Maui Activities Hub API</h1>
      <p><strong>Version:</strong> 1.0.0</p>
      <p><strong>Status:</strong> Running ✓</p>
      
      <h2>API Endpoints</h2>
      <ul>
        <li><a href="/api/health">/api/health</a></li>
        <li><a href="/api/activities">/api/activities</a></li>
        <li>/api/auth/login</li>
        <li>/api/auth/signup</li>
        <li>/api/auth/verify</li>
        <li>/api/users/profile</li>
        <li>/api/users/renew-pass</li>
        <li>/api/vendors/register</li>
        <li>/api/vendors/[id]/analytics</li>
        <li>/api/bookings</li>
        <li>/api/reviews</li>
        <li>/api/webhooks/stripe</li>
      </ul>
    </div>
  );
}
