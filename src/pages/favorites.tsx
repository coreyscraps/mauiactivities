/**
 * Favorites Page
 * Shows user's saved activities
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAuth } from '@/lib/auth-context';
import { ActivityCard } from '@/components/ActivityCard';

interface Activity {
  id: string;
  name: string;
  base_price: number;
  currency: string;
  rating: number;
  review_count: number;
  view_count: number;
  image_url?: string;
  booking_url: string;
  discount_percent?: number;
  original_price?: number;
  duration_minutes?: number;
  vendor: {
    id: string;
    name: string;
    rating: number;
  };
  category: {
    name: string;
  };
  location?: {
    name: string;
  };
}

export default function FavoritesPage() {
  const router = useRouter();
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push('/auth/login');
    }
  }, [isLoggedIn, authLoading, router]);

  // Load favorites
  useEffect(() => {
    if (isLoggedIn && user?.id) {
      loadFavorites();
    }
  }, [isLoggedIn, user?.id]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/users/favorites', {
        method: 'GET',
        headers: {
          'x-user-id': user?.id || '',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load favorites');
      }

      const data = await response.json();
      
      // Extract activities from favorites
      const activities = data.favorites
        .map((fav: any) => fav.activities)
        .filter(Boolean);
      
      setFavorites(activities);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = (activityId: string) => {
    setFavorites(favorites.filter(a => a.id !== activityId));
  };

  if (authLoading) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>My Favorites - Maui Activities Hub</title>
        <meta name="description" content="View your saved activities" />
      </Head>

      <div className="favorites-page">
        <div className="container">
          <h1>My Favorites</h1>
          
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading your favorites...</p>
            </div>
          ) : favorites.length > 0 ? (
            <>
              <p className="subtitle">
                You have {favorites.length} saved {favorites.length === 1 ? 'activity' : 'activities'}
              </p>
              <div className="activities-grid">
                {favorites.map((activity) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    onFavorite={handleRemoveFavorite}
                    isFavorited={true}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state">
              <p>💚 No favorites yet</p>
              <p className="empty-subtext">
                Browse activities and click the heart icon to save them here
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .favorites-page {
          min-height: 100vh;
          background: #f5f5f5;
          padding: 40px 20px;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .favorites-page h1 {
          margin: 0 0 24px 0;
          font-size: 32px;
          font-weight: 700;
          color: #333;
        }

        .subtitle {
          margin: 0 0 24px 0;
          color: #666;
          font-size: 14px;
        }

        .error-message {
          background: #ffebee;
          color: #c62828;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 24px;
        }

        .loading-state {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 8px;
        }

        .spinner {
          display: inline-block;
          width: 50px;
          height: 50px;
          border: 4px solid #e0e0e0;
          border-top: 4px solid #2196f3;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .activities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 8px;
        }

        .empty-state p {
          font-size: 18px;
          color: #333;
          margin: 0 0 8px 0;
        }

        .empty-subtext {
          color: #999;
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .favorites-page h1 {
            font-size: 24px;
          }

          .activities-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
