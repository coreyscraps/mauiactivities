/**
 * Logout Handler
 * Clears auth token and redirects
 */

import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear auth data
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_id');

    // Redirect to home
    router.push('/');
  }, [router]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
    }}>
      <div style={{ textAlign: 'center' }}>
        <h2>Logging out...</h2>
        <p>Redirecting to home page</p>
      </div>
    </div>
  );
}
