import React, { useState, useEffect } from 'react';
import Head from 'next/head';

interface Activity {
  id: string;
  name: string;
  description: string;
  base_price: number;
  rating: number;
  review_count: number;
  duration_minutes?: number;
  vendors?: {
    name: string;
    website: string;
  };
  categories?: {
    name: string;
  };
  locations?: {
    name: string;
  };
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch('/api/activities');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setActivities(data.activities || []);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return (
    <>
      <Head>
        <title>Activities - Maui Activities Hub</title>
      </Head>

      <div>
        {/* Navbar */}
        <nav style={{
          background: 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          padding: '16px 20px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <a href="/" style={{ fontSize: '20px', fontWeight: 700, color: '#2196f3', textDecoration: 'none' }}>🌺 Maui Activities Hub</a>
            <div>
              <a href="/auth/login" style={{ marginRight: '16px', color: '#2196f3', textDecoration: 'none' }}>Log In</a>
              <a href="/auth/signup" style={{ color: 'white', background: '#2196f3', padding: '8px 16px', borderRadius: '4px', textDecoration: 'none' }}>Sign Up</a>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <div style={{
          background: 'linear-gradient(135deg, #0077b6 0%, #00b4d8 100%)',
          color: 'white',
          padding: '60px 20px',
          textAlign: 'center',
        }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Browse Activities</h1>
          <p>Discover amazing experiences across Maui</p>
        </div>

        {/* Content */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
          {error && (
            <div style={{
              background: '#ffebee',
              color: '#c62828',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '24px',
            }}>
              Error: {error}
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ display: 'inline-block', fontSize: '2rem', animation: 'spin 1s linear infinite' }}>⏳</div>
              <p>Loading activities...</p>
            </div>
          ) : activities.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p>No activities found</p>
            </div>
          ) : (
            <>
              <h2 style={{ marginBottom: '30px' }}>{activities.length} Activities Available</h2>
              
              {/* Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '20px',
              }}>
                {activities.map((activity) => (
                  <div key={activity.id} style={{
                    background: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    padding: '20px',
                  }}>
                    {/* Icon */}
                    <div style={{
                      fontSize: '3rem',
                      marginBottom: '16px',
                    }}>🏝️</div>

                    {/* Category */}
                    {activity.categories?.name && (
                      <div style={{ color: '#0077b6', fontSize: '0.85rem', marginBottom: '8px' }}>
                        {activity.categories.name}
                      </div>
                    )}

                    {/* Title */}
                    <h3 style={{ fontSize: '1.1rem', margin: '0 0 8px 0', color: '#1a1a1a' }}>
                      {activity.name}
                    </h3>

                    {/* Description */}
                    <p style={{ fontSize: '0.9rem', color: '#666', margin: '0 0 12px 0', lineHeight: '1.4' }}>
                      {activity.description}
                    </p>

                    {/* Price */}
                    <div style={{ fontSize: '1.4rem', color: '#0077b6', fontWeight: 700, margin: '12px 0' }}>
                      ${activity.base_price}
                    </div>

                    {/* Rating */}
                    <div style={{ color: '#666', fontSize: '0.9rem', margin: '8px 0' }}>
                      ⭐ {activity.rating} ({activity.review_count} reviews)
                    </div>

                    {/* Vendor */}
                    {activity.vendors?.name && (
                      <div style={{ color: '#666', fontSize: '0.9rem', margin: '8px 0' }}>
                        by {activity.vendors.name}
                      </div>
                    )}

                    {/* Location */}
                    {activity.locations?.name && (
                      <div style={{ color: '#666', fontSize: '0.9rem', margin: '12px 0' }}>
                        📍 {activity.locations.name}
                      </div>
                    )}

                    {/* Button */}
                    <button style={{
                      width: '100%',
                      padding: '12px',
                      background: 'linear-gradient(135deg, #0077b6, #00b4d8)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      marginTop: '16px',
                    }}>
                      View & Book
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
