/**
 * Navigation Bar Component
 * Shows logo, navigation links, and auth buttons
 */

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/router';

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link href="/" className="navbar-logo">
          🌺 Maui Activities Hub
        </Link>

        {/* Navigation Links */}
        <div className="navbar-links">
          <Link href="/" className="nav-link">
            Activities
          </Link>
          {isLoggedIn && (
            <Link href="/favorites" className="nav-link">
              ♥ Favorites
            </Link>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="navbar-auth">
          {isLoggedIn ? (
            <>
              <div className="user-info">
                <span className="user-email">{user?.email}</span>
              </div>
              <button onClick={handleLogout} className="auth-btn logout-btn">
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="auth-btn login-btn">
                Log In
              </Link>
              <Link href="/auth/signup" className="auth-btn signup-btn">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .navbar {
          background: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .navbar-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 70px;
        }

        .navbar-logo {
          font-size: 20px;
          font-weight: 700;
          color: #2196f3;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: color 0.2s;
        }

        .navbar-logo:hover {
          color: #1976d2;
        }

        .navbar-links {
          display: flex;
          gap: 24px;
          flex: 1;
          margin-left: 40px;
        }

        .nav-link {
          color: #333;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
          font-size: 14px;
        }

        .nav-link:hover {
          color: #2196f3;
        }

        .navbar-auth {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .user-email {
          color: #666;
          font-size: 14px;
          font-weight: 500;
        }

        .auth-btn {
          padding: 8px 16px;
          border-radius: 4px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .login-btn {
          color: #2196f3;
          background: white;
          border: 2px solid #2196f3;
        }

        .login-btn:hover {
          background: #f0f7ff;
        }

        .signup-btn {
          background: #2196f3;
          color: white;
        }

        .signup-btn:hover {
          background: #1976d2;
        }

        .logout-btn {
          color: white;
          background: #f44336;
        }

        .logout-btn:hover {
          background: #d32f2f;
        }

        @media (max-width: 768px) {
          .navbar-container {
            flex-wrap: wrap;
            height: auto;
            padding: 12px 20px;
          }

          .navbar-logo {
            flex-basis: 100%;
            margin-bottom: 12px;
          }

          .navbar-links {
            flex-basis: 100%;
            margin-left: 0;
            margin-bottom: 12px;
            gap: 16px;
          }

          .navbar-auth {
            flex-basis: 100%;
            gap: 8px;
          }

          .user-email {
            display: none;
          }

          .auth-btn {
            padding: 8px 12px;
            font-size: 13px;
          }
        }
      `}</style>
    </nav>
  );
}
