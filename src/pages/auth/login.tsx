/**
 * Login Page
 * Email/password login form
 */

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      // Store token in localStorage
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_email', data.user.email);
      localStorage.setItem('user_id', data.user.id);

      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (err) {
      setError((err as Error).message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login - Maui Activities Hub</title>
        <meta name="description" content="Login to your account" />
      </Head>

      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <h1>Welcome Back</h1>
            <p className="subtitle">Log in to your Maui Activities Hub account</p>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="form-input"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="submit-btn"
              >
                {loading ? 'Logging in...' : 'Log In'}
              </button>
            </form>

            <div className="auth-footer">
              <p>Don't have an account? <Link href="/auth/signup">Sign up</Link></p>
            </div>
          </div>

          <div className="auth-sidebar">
            <h2>Discover Maui Activities</h2>
            <p>
              Get a pass for access to all activities and exclusive deals on tours, 
              water sports, and adventures across Maui.
            </p>
            <ul className="benefits">
              <li>✅ Compare prices across vendors</li>
              <li>✅ Find the best deals</li>
              <li>✅ Book instantly</li>
              <li>✅ Save your favorites</li>
            </ul>
          </div>
        </div>
      </div>

      <style jsx>{`
        .auth-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .auth-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          max-width: 900px;
          width: 100%;
        }

        .auth-card {
          background: white;
          border-radius: 8px;
          padding: 40px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        }

        .auth-card h1 {
          margin: 0 0 8px 0;
          font-size: 28px;
          font-weight: 700;
          color: #333;
        }

        .subtitle {
          margin: 0 0 24px 0;
          color: #666;
          font-size: 14px;
        }

        .alert {
          padding: 12px 16px;
          border-radius: 4px;
          margin-bottom: 20px;
          font-size: 14px;
        }

        .alert-error {
          background: #ffebee;
          color: #c62828;
          border: 1px solid #ef5350;
        }

        .alert-success {
          background: #e8f5e9;
          color: #2e7d32;
          border: 1px solid #66bb6a;
        }

        .auth-form {
          margin-bottom: 24px;
        }

        .form-group {
          margin-bottom: 16px;
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          margin-bottom: 6px;
          font-size: 14px;
          font-weight: 600;
          color: #333;
        }

        .form-input {
          padding: 10px 12px;
          border: 2px solid #e0e0e0;
          border-radius: 4px;
          font-size: 14px;
          transition: border-color 0.2s;
        }

        .form-input:focus {
          outline: none;
          border-color: #2196f3;
        }

        .submit-btn {
          width: 100%;
          padding: 12px 16px;
          background: #2196f3;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .submit-btn:hover:not(:disabled) {
          background: #1976d2;
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .auth-footer {
          text-align: center;
          border-top: 1px solid #e0e0e0;
          padding-top: 20px;
        }

        .auth-footer p {
          margin: 0;
          font-size: 14px;
          color: #666;
        }

        .auth-footer a {
          color: #2196f3;
          text-decoration: none;
          font-weight: 600;
        }

        .auth-footer a:hover {
          text-decoration: underline;
        }

        .auth-sidebar {
          color: white;
        }

        .auth-sidebar h2 {
          margin: 0 0 16px 0;
          font-size: 24px;
          font-weight: 700;
        }

        .auth-sidebar p {
          margin: 0 0 24px 0;
          line-height: 1.6;
          opacity: 0.95;
        }

        .benefits {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .benefits li {
          margin-bottom: 12px;
          font-size: 14px;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .auth-container {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .auth-sidebar {
            display: none;
          }

          .auth-card {
            padding: 30px;
          }
        }
      `}</style>
    </>
  );
}
