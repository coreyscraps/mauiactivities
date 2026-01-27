/**
 * Reviews List Component
 * Displays reviews for an activity
 */

import React, { useState, useEffect } from 'react';

interface Review {
  id: string;
  rating: number;
  title?: string;
  comment: string;
  verified_user: boolean;
  created_at: string;
  users?: {
    email: string;
  };
}

interface ReviewsListProps {
  activityId: string;
  onReviewAdded?: () => void;
}

export const ReviewsList: React.FC<ReviewsListProps> = ({
  activityId,
  onReviewAdded,
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReviews();
  }, [activityId, onReviewAdded]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/reviews?activityId=${activityId}`);

      if (!response.ok) {
        throw new Error('Failed to load reviews');
      }

      const data = await response.json();
      setReviews(data.reviews || []);
      setAvgRating(data.averageRating || 0);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return '⭐'.repeat(Math.round(rating));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return <div className="reviews-loading">Loading reviews...</div>;
  }

  return (
    <div className="reviews-section">
      <div className="reviews-header">
        <h3>Customer Reviews</h3>
        <div className="rating-summary">
          <div className="avg-rating">
            <span className="rating-value">{avgRating.toFixed(1)}</span>
            <span className="rating-stars">{renderStars(avgRating)}</span>
          </div>
          <span className="review-count">
            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
          </span>
        </div>
      </div>

      {error && <div className="error-message">Error: {error}</div>}

      {reviews.length > 0 ? (
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <div className="review-rating">{renderStars(review.rating)}</div>
                {review.verified_user && (
                  <span className="verified-badge">✓ Verified User</span>
                )}
              </div>

              {review.title && <h4 className="review-title">{review.title}</h4>}

              <p className="review-comment">{review.comment}</p>

              <div className="review-footer">
                <span className="review-date">{formatDate(review.created_at)}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-reviews">
          <p>No reviews yet. Be the first to review!</p>
        </div>
      )}

      <style jsx>{`
        .reviews-section {
          margin: 32px 0;
          background: white;
          padding: 24px;
          border-radius: 8px;
          border: 1px solid #e0e0e0;
        }

        .reviews-header {
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid #f0f0f0;
        }

        .reviews-header h3 {
          margin: 0 0 16px 0;
          font-size: 20px;
          color: #333;
        }

        .rating-summary {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .avg-rating {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .rating-value {
          font-size: 24px;
          font-weight: 700;
          color: #333;
        }

        .rating-stars {
          font-size: 16px;
          color: #ff9800;
        }

        .review-count {
          color: #666;
          font-size: 14px;
        }

        .reviews-loading {
          text-align: center;
          padding: 24px;
          color: #999;
        }

        .error-message {
          background: #ffebee;
          color: #c62828;
          padding: 12px 16px;
          border-radius: 4px;
          margin-bottom: 16px;
          font-size: 14px;
        }

        .reviews-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .review-item {
          padding: 16px;
          background: #f9f9f9;
          border-radius: 6px;
          border-left: 4px solid #2196f3;
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .review-rating {
          font-size: 14px;
          color: #ff9800;
        }

        .verified-badge {
          background: #e8f5e9;
          color: #2e7d32;
          padding: 4px 8px;
          border-radius: 3px;
          font-size: 12px;
          font-weight: 600;
        }

        .review-title {
          margin: 0 0 8px 0;
          font-size: 15px;
          font-weight: 600;
          color: #333;
        }

        .review-comment {
          margin: 0 0 12px 0;
          font-size: 14px;
          color: #666;
          line-height: 1.5;
        }

        .review-footer {
          font-size: 12px;
          color: #999;
        }

        .empty-reviews {
          text-align: center;
          padding: 32px;
          color: #999;
        }

        .empty-reviews p {
          margin: 0;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default ReviewsList;
