/**
 * Activities Page - Main marketplace view
 */

import React, { useState, useCallback, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '@/lib/auth-context';
import { SearchFilters } from '@/components/SearchFilters';
import { ActivityCard } from '@/components/ActivityCard';
import { DealsShowcase } from '@/components/DealsShowcase';

interface Activity {
  id: string;
  name: string;
  description: string;
  base_price: number;
  currency: string;
  rating: number;
  review_count: number;
  view_count: number;
  image_url?: string;
  booking_url?: string;
  discount_percent?: number;
  original_price?: number;
  duration_minutes?: number;
  vendors?: {
    id: string;
    name: string;
    rating: number;
    website: string;
  };
  categories?: {
    name: string;
  };
  locations?: {
    name: string;
    region: string;
  };
}

interface Category {
  id: string;
  name: string;
}

interface Location {
  id: string;
  name: string;
  region: string;
}

interface FilterOptions {
  q?: string;
  category?: string;
  location?: string;
  priceMin?: number;
  priceMax?: number;
  minRating?: number;
  sortBy?: string;
}

export default function ActivitiesPage() {
  const { isLoggedIn, user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState<FilterOptions>({});
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Load categories and locations on mount
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const [categoriesRes, locationsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/locations'),
        ]);

        if (categoriesRes.ok) {
          const data = await categoriesRes.json();
          setCategories(data.categories || []);
        }

        if (locationsRes.ok) {
          const data = await locationsRes.json();
          setLocations(data.locations || []);
        }
      } catch (err) {
        console.error('Failed to load metadata:', err);
      }
    };

    loadMetadata();
  }, []);

  // Load favorites if logged in
  useEffect(() => {
    if (isLoggedIn && user?.id) {
      const loadFavorites = async () => {
        try {
          const response = await fetch('/api/users/favorites', {
            headers: {
              'x-user-id': user.id,
            },
          });

          if (response.ok) {
            const data = await response.json();
            const favoriteIds = new Set<string>(
              data.favorites.map((fav: any) => fav.activity_id)
            );
            setFavorites(favoriteIds);
          }
        } catch (err) {
          console.error('Failed to load favorites:', err);
        }
      };

      loadFavorites();
    }
  }, [isLoggedIn, user?.id]);

  // Search activities when filters change
  useEffect(() => {
    searchActivities(filters);
  }, [filters]);

  const searchActivities = useCallback(async (filterObj: FilterOptions) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filterObj.q) params.append('q', filterObj.q);
      if (filterObj.category) params.append('category', filterObj.category);
      if (filterObj.location) params.append('location', filterObj.location);
      if (filterObj.priceMin !== undefined) params.append('priceMin', String(filterObj.priceMin));
      if (filterObj.priceMax !== undefined) params.append('priceMax', String(filterObj.priceMax));
      if (filterObj.minRating !== undefined) params.append('minRating', String(filterObj.minRating));
      if (filterObj.sortBy) params.append('sortBy', filterObj.sortBy);
      params.append('page', '1');
      params.append('limit', '20');

      const response = await fetch(`/api/activities?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to search activities');
      }

      const data = await response.json();
      setActivities(data.activities || []);
      setPagination({
        page: data.pagination?.page || 1,
        limit: data.pagination?.limit || 20,
        total: data.pagination?.total || 0,
        pages: data.pagination?.pages || 0,
      });
    } catch (err) {
      setError((err as Error).message);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFilterChange = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleFavorite = useCallback((activityId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(activityId)) {
        next.delete(activityId);
      } else {
        next.add(activityId);
      }
      return next;
    });
    // TODO: Save to backend
  }, []);

  return (
    <>
      <Head>
        <title>Activities - Maui Activities Hub</title>
        <meta name="description" content="Compare prices for activities in Maui" />
      </Head>

      <div style={{ padding: '0' }}>
        {/* Hero Section */}
        <div style={{
          background: 'linear-gradient(135deg, #0077b6 0%, #00b4d8 100%)',
          color: 'white',
          padding: '60px 20px',
          textAlign: 'center',
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Browse Activities</h1>
            <p style={{ fontSize: '1.1rem', opacity: 0.95 }}>
              Discover amazing experiences across Maui
            </p>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
          {/* Search & Filters */}
          <SearchFilters
            categories={categories}
            locations={locations}
            onFilterChange={handleFilterChange}
          />

          {/* Error Message */}
          {error && (
            <div style={{
              background: '#ffebee',
              color: '#c62828',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '24px',
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
            }}>
              <div style={{
                display: 'inline-block',
                width: '50px',
                height: '50px',
                border: '4px solid #e0e0e0',
                borderTop: '4px solid #0077b6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}></div>
              <p style={{ color: '#666' }}>Loading activities...</p>
            </div>
          ) : activities.length > 0 ? (
            <>
              {/* Results Header */}
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', margin: '0 0 8px 0', color: '#333' }}>
                  {pagination.total} Activities Found
                  {filters.q && ` for "${filters.q}"`}
                </h2>
                <p style={{
                  margin: '0',
                  color: '#666',
                  fontSize: '14px',
                }}>
                  Showing {(pagination.page - 1) * pagination.limit + 1}–
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                </p>
              </div>

              {/* Activities Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '20px',
                marginBottom: '40px',
              }}>
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    style={{
                      background: 'white',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(0,119,182,0.15)';
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    }}
                  >
                    {/* Image */}
                    <div style={{
                      width: '100%',
                      height: '200px',
                      background: 'linear-gradient(135deg, #0077b6, #00b4d8)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '3rem',
                    }}>
                      {activity.image_url ? (
                        <img src={activity.image_url} alt={activity.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        '🏝️'
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ padding: '20px' }}>
                      {/* Category */}
                      {activity.categories?.name && (
                        <div style={{ color: '#0077b6', fontSize: '0.85rem', marginBottom: '12px' }}>
                          {activity.categories.name}
                        </div>
                      )}

                      {/* Title */}
                      <h3 style={{
                        fontSize: '1.1rem',
                        color: '#1a1a1a',
                        marginBottom: '8px',
                        margin: '0 0 8px 0',
                        fontWeight: 600,
                      }}>
                        {activity.name}
                      </h3>

                      {/* Price */}
                      <div style={{
                        fontSize: '1.4rem',
                        color: '#0077b6',
                        fontWeight: 700,
                        marginBottom: '12px',
                      }}>
                        ${activity.base_price}
                      </div>

                      {/* Rating */}
                      <div style={{
                        color: '#ffc107',
                        fontSize: '0.9rem',
                        marginBottom: '12px',
                      }}>
                        ★★★★★ ({activity.rating} rating, {activity.review_count} reviews)
                      </div>

                      {/* Vendor */}
                      {activity.vendors?.name && (
                        <div style={{
                          color: '#666',
                          fontSize: '0.9rem',
                          marginBottom: '12px',
                        }}>
                          by {activity.vendors.name}
                        </div>
                      )}

                      {/* Location */}
                      {activity.locations?.name && (
                        <div style={{
                          color: '#666',
                          fontSize: '0.9rem',
                          marginBottom: '16px',
                        }}>
                          📍 {activity.locations.name}
                        </div>
                      )}

                      {/* Book Button */}
                      <button
                        style={{
                          width: '100%',
                          padding: '12px',
                          background: 'linear-gradient(135deg, #0077b6, #00b4d8)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.opacity = '0.9';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.opacity = '1';
                        }}
                      >
                        View & Book
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '8px',
                  marginBottom: '40px',
                }}>
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      style={{
                        padding: '8px 12px',
                        border: pagination.page === page ? 'none' : '2px solid #e0e0e0',
                        background: pagination.page === page ? '#0077b6' : 'white',
                        color: pagination.page === page ? 'white' : '#0077b6',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 500,
                        transition: 'all 0.2s',
                      }}
                      onClick={() => setPagination((prev) => ({ ...prev, page }))}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: 'white',
              borderRadius: '8px',
              margin: '40px 0',
            }}>
              <p style={{ fontSize: '18px', color: '#333' }}>😕 No activities found</p>
              <p style={{ color: '#999', fontSize: '14px' }}>
                Try adjusting your filters or search terms
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}
