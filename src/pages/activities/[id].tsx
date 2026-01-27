/**
 * Activity Detail Page
 * Shows activity details, vendor info, reviews, and booking form
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAuth } from '@/lib/auth-context';
import { ReviewsList } from '@/components/ReviewsList';
import { ReviewForm } from '@/components/ReviewForm';

interface Activity {
  id: string;
  name: string;
  description: string;
  base_price: number;
  currency: string;
  rating: number;
  review_count: number;
  image_url?: string;
  booking_url: string;
  duration_minutes?: number;
  difficulty_level?: string;
  vendor: {
    id: string;
    name: string;
    rating: number;
    website: string;
  };
  category: {
    name: string;
  };
  location?: {
    name: string;
    region: string;
  };
}

export default function ActivityDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user, isLoggedIn } = useAuth();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [participants, setParticipants] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [reviewsRefresh, setReviewsRefresh] = useState(0);

  // Load activity details
  useEffect(() => {
    if (!id) return;

    const loadActivity = async () => {
      try {
        setLoading(true);
        setError(null);

        // Since we don't have individual activity endpoints,
        // we'll fetch from search API
        const response = await fetch(`/api/activities/search?limit=1`);

        if (!response.ok) {
          throw new Error('Failed to load activity');
        }

        const data = await response.json();
        
        // In a real app, we'd filter by ID here
        // For now, show placeholder
        setActivity({
          id: id as string,
          name: 'Activity Example',
          description: 'Activity description would appear here',
          base_price: 99,
          currency: 'USD',
          rating: 4.5,
          review_count: 32,
          duration_minutes: 120,
          difficulty_level: 'moderate',
          booking_url: 'https://example.com',
          image_url: '',
          vendor: {
            id: 'vendor-1',
            name: 'Example Vendor',
            rating: 4.7,
            website: 'https://example.com',
          },
          category: {
            name: 'Water Activities',
          },
          location: {
            name: 'Wailea',
            region: 'South Maui',
          },
        });
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadActivity();
  }, [id]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      router.push('/auth/login');
      return;
    }

    setBookingLoading(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id || '',
        },
        body: JSON.stringify({
          activity_id: id,
          booking_date: bookingDate,
          participants_count: participants,
          special_requests: specialRequests,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create booking');
      }

      setBookingSuccess(true);
      setBookingDate('');
      setParticipants(1);
      setSpecialRequests('');

      // Reset success message
      setTimeout(() => setBookingSuccess(false), 3000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <p>Loading activity details...</p>
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <p>Error: {error || 'Activity not found'}</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{activity.name} - Maui Activities Hub</title>
        <meta name="description" content={activity.description} />
      </Head>

      <div className="activity-detail-page">
        <div className="container">
          {/* Hero Section */}
          <div className="hero-section">
            {activity.image_url && (
              <img
                src={activity.image_url}
                alt={activity.name}
                className="hero-image"
              />
            )}
            {!activity.image_url && (
              <div className="hero-placeholder">📸 No Image Available</div>
            )}
          </div>

          {/* Main Content */}
          <div className="content-grid">
            {/* Left Column */}
            <div className="main-content">
              <h1>{activity.name}</h1>

              <div className="activity-meta">
                <span className="category">{activity.category.name}</span>
                {activity.location && (
                  <span className="location">📍 {activity.location.name}</span>
                )}
                {activity.difficulty_level && (
                  <span className="difficulty">🏃 {activity.difficulty_level}</span>
                )}
                {activity.duration_minutes && (
                  <span className="duration">⏱️ {activity.duration_minutes} minutes</span>
                )}
              </div>

              <div className="rating-section">
                <div className="stars">{'⭐'.repeat(Math.round(activity.rating))}</div>
                <span className="rating-text">
                  {activity.rating.toFixed(1)} ({activity.review_count} reviews)
                </span>
              </div>

              <div className="description">
                <h2>About This Activity</h2>
                <p>{activity.description}</p>
              </div>

              {/* Reviews Section */}
              <ReviewForm
                activityId={activity.id}
                onReviewSubmitted={() => setReviewsRefresh(reviewsRefresh + 1)}
              />

              <ReviewsList
                activityId={activity.id}
                key={reviewsRefresh}
              />
            </div>

            {/* Right Column - Booking Card */}
            <div className="booking-card">
              <div className="price-section">
                <span className="label">Price Per Person</span>
                <span className="price">
                  ${activity.base_price.toFixed(2)} {activity.currency}
                </span>
              </div>

              <div className="vendor-info">
                <h3>Tour Operator</h3>
                <p className="vendor-name">{activity.vendor.name}</p>
                <div className="vendor-rating">
                  ⭐ {activity.vendor.rating.toFixed(1)}
                </div>
                <a href={activity.vendor.website} target="_blank" rel="noopener noreferrer" className="vendor-link">
                  Visit Website →
                </a>
              </div>

              {bookingSuccess && (
                <div className="alert alert-success">
                  ✓ Booking request sent!
                </div>
              )}

              <form onSubmit={handleBooking} className="booking-form">
                <div className="form-group">
                  <label htmlFor="date">Preferred Date</label>
                  <input
                    id="date"
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="participants">Number of Participants</label>
                  <input
                    id="participants"
                    type="number"
                    min="1"
                    max="20"
                    value={participants}
                    onChange={(e) => setParticipants(parseInt(e.target.value))}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="requests">Special Requests</label>
                  <textarea
                    id="requests"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Any special needs or preferences?"
                    className="form-textarea"
                    rows={3}
                  />
                </div>

                <div className="total-price">
                  <span>Total:</span>
                  <span className="amount">
                    ${(activity.base_price * participants).toFixed(2)}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="book-btn"
                >
                  {bookingLoading ? 'Requesting...' : 'Request Booking'}
                </button>
              </form>

              <a
                href={activity.booking_url}
                target="_blank"
                rel="noopener noreferrer"
                className="external-book-btn"
              >
                Book Directly with Vendor →
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .activity-detail-page {
          background: #f5f5f5;
          min-height: 100vh;
          padding: 40px 20px;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .hero-section {
          height: 400px;
          margin-bottom: 40px;
          border-radius: 8px;
          overflow: hidden;
          background: #e0e0e0;
        }

        .hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hero-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          color: #999;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 40px;
        }

        .main-content h1 {
          margin: 0 0 16px 0;
          font-size: 36px;
          font-weight: 700;
          color: #333;
        }

        .activity-meta {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .category,
        .location,
        .difficulty,
        .duration {
          background: white;
          padding: 8px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          color: #666;
          border: 1px solid #e0e0e0;
        }

        .rating-section {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 32px;
        }

        .stars {
          font-size: 18px;
          color: #ff9800;
        }

        .rating-text {
          color: #666;
          font-size: 14px;
        }

        .description {
          margin-bottom: 32px;
          background: white;
          padding: 24px;
          border-radius: 8px;
        }

        .description h2 {
          margin: 0 0 16px 0;
          font-size: 20px;
          color: #333;
        }

        .description p {
          margin: 0;
          color: #666;
          line-height: 1.6;
        }

        .booking-card {
          background: white;
          padding: 24px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          height: fit-content;
          position: sticky;
          top: 100px;
        }

        .price-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid #f0f0f0;
        }

        .label {
          font-size: 12px;
          color: #999;
          text-transform: uppercase;
          font-weight: 600;
        }

        .price {
          font-size: 28px;
          font-weight: 700;
          color: #2196f3;
        }

        .vendor-info {
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid #f0f0f0;
        }

        .vendor-info h3 {
          margin: 0 0 8px 0;
          font-size: 14px;
          color: #666;
          text-transform: uppercase;
          font-weight: 600;
        }

        .vendor-name {
          margin: 0 0 8px 0;
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }

        .vendor-rating {
          font-size: 13px;
          margin-bottom: 12px;
          color: #ff9800;
        }

        .vendor-link {
          color: #2196f3;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
        }

        .vendor-link:hover {
          text-decoration: underline;
        }

        .alert {
          padding: 12px 16px;
          border-radius: 4px;
          margin-bottom: 16px;
          font-size: 13px;
        }

        .alert-success {
          background: #e8f5e9;
          color: #2e7d32;
          border: 1px solid #66bb6a;
        }

        .booking-form {
          margin-bottom: 16px;
        }

        .form-group {
          margin-bottom: 16px;
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          margin-bottom: 6px;
          font-size: 13px;
          font-weight: 600;
          color: #333;
        }

        .form-input,
        .form-textarea {
          padding: 10px;
          border: 2px solid #e0e0e0;
          border-radius: 4px;
          font-size: 13px;
          font-family: inherit;
          transition: border-color 0.2s;
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #2196f3;
        }

        .total-price {
          display: flex;
          justify-content: space-between;
          padding: 16px;
          background: #f9f9f9;
          border-radius: 4px;
          margin-bottom: 16px;
          font-weight: 600;
          color: #333;
        }

        .amount {
          color: #2196f3;
          font-size: 18px;
        }

        .book-btn {
          width: 100%;
          padding: 12px;
          background: #2196f3;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          margin-bottom: 12px;
        }

        .book-btn:hover:not(:disabled) {
          background: #1976d2;
        }

        .book-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .external-book-btn {
          display: block;
          text-align: center;
          padding: 10px;
          color: #2196f3;
          border: 2px solid #2196f3;
          border-radius: 4px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.2s;
        }

        .external-book-btn:hover {
          background: #f0f7ff;
        }

        @media (max-width: 768px) {
          .content-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .booking-card {
            position: relative;
            top: 0;
          }

          .hero-section {
            height: 250px;
          }

          .main-content h1 {
            font-size: 24px;
          }
        }
      `}</style>
    </>
  );
}
