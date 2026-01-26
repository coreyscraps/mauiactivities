/**
 * Activities Page - Main marketplace view
 * Shows deals, search, filters, and activity listings
 */

import React, { useState, useCallback, useEffect } from 'react';
import Head from 'next/head';
import { SearchFilters } from '@/components/SearchFilters';
import { ActivityCard } from '@/components/ActivityCard';
import { DealsShowcase } from '@/components/DealsShowcase';

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
  const [activities, setActivities] = useState<Activity[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
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

  // Search activities when filters change
  useEffect(() => {
    searchActivities(filters);
  }, [filters]);

  const searchActivities = useCallback(async (filterObj: FilterOptions) => {
    try {
      setLoading(true);
      setError(null);

      // Build query string
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

      const response = await fetch(`/api/activities/search?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to search activities');
      }

      const data = await response.json();
      setActivities(data.activities || []);
      setPagination({
        page: data.page,
        limit: data.limit,
        total: data.totalCount,
        pages: data.totalPages,
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

      <div className="activities-page">
        {/* Hero Section */}
        <div className="hero">
          <div className="hero-content">
            <h1>Discover Activities in Maui</h1>
            <p>Compare prices across vendors • Find the best deals • Book instantly</p>
          </div>
        </div>

        {/* Hot Deals Section */}
        <div className="container">
          <DealsShowcase limit={6} sortBy="discount_percent" />
        </div>

        {/* Search & Filters */}
        <div className="container">
          <SearchFilters
            categories={categories}
            locations={locations}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Results */}
        <div className="container">
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading activities...</p>
            </div>
          ) : activities.length > 0 ? (
            <>
              <div className="results-header">
                <h2>
                  {pagination.total} Activities Found
                  {filters.q && ` for "${filters.q}"`}
                </h2>
                <p className="results-subtext">
                  Showing {(pagination.page - 1) * pagination.limit + 1}–
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                  {pagination.total}
                </p>
              </div>

              <div className="activities-grid">
                {activities.map((activity) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    onFavorite={handleFavorite}
                    isFavorited={favorites.has(activity.id)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="pagination">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        className={`pagination-btn ${
                          pagination.page === page ? 'active' : ''
                        }`}
                        onClick={() =>
                          setPagination((prev) => ({ ...prev, page }))
                        }
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <p>😕 No activities found</p>
              <p className="empty-subtext">
                Try adjusting your filters or search terms
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .activities-page {
          min-height: 100vh;
          background: #f5f5f5;
        }

        .hero {
          background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
          color: white;
          padding: 60px 20px;
          text-align: center;
        }

        .hero-content h1 {
          font-size: 40px;
          margin: 0 0 16px 0;
          font-weight: 700;
        }

        .hero-content p {
          font-size: 18px;
          margin: 0;
          opacity: 0.95;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
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

        .results-header {
          margin-bottom: 24px;
        }

        .results-header h2 {
          margin: 0 0 8px 0;
          font-size: 24px;
          color: #333;
        }

        .results-subtext {
          margin: 0;
          color: #666;
          font-size: 14px;
        }

        .activities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .pagination {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-bottom: 40px;
        }

        .pagination-btn {
          padding: 8px 12px;
          border: 2px solid #e0e0e0;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
        }

        .pagination-btn:hover {
          border-color: #2196f3;
          color: #2196f3;
        }

        .pagination-btn.active {
          background: #2196f3;
          color: white;
          border-color: #2196f3;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 8px;
          margin: 40px 0;
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
          .hero-content h1 {
            font-size: 28px;
          }

          .hero-content p {
            font-size: 16px;
          }

          .activities-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
