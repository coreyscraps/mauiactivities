/**
 * Activity Card Component
 * Displays a single activity with price, rating, vendor info
 */

import React from 'react';
import Link from 'next/link';

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

interface ActivityCardProps {
  activity: Activity;
  onFavorite?: (activityId: string) => void;
  isFavorited?: boolean;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onFavorite,
  isFavorited = false,
}) => {
  const savings = activity.original_price
    ? activity.original_price - activity.base_price
    : 0;

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    onFavorite?.(activity.id);
  };

  return (
    <div className="activity-card">
      <div className="activity-image-container">
        {activity.image_url && (
          <img
            src={activity.image_url}
            alt={activity.name}
            className="activity-image"
          />
        )}
        {!activity.image_url && (
          <div className="activity-image-placeholder">
            📸 No Image
          </div>
        )}

        {activity.discount_percent && activity.discount_percent > 0 && (
          <div className="discount-badge">
            SAVE {activity.discount_percent.toFixed(0)}%
          </div>
        )}

        <button
          className={`favorite-btn ${isFavorited ? 'favorited' : ''}`}
          onClick={handleFavorite}
          title="Save to favorites"
        >
          ♥
        </button>
      </div>

      <div className="activity-content">
        <h3 className="activity-name">{activity.name}</h3>

        <div className="vendor-info">
          <span className="vendor-name">{activity.vendor.name}</span>
          <div className="vendor-rating">
            ⭐ {activity.vendor.rating.toFixed(1)}
          </div>
        </div>

        <div className="activity-meta">
          {activity.category && (
            <span className="category-badge">{activity.category.name}</span>
          )}
          {activity.location && (
            <span className="location-badge">📍 {activity.location.name}</span>
          )}
          {activity.duration_minutes && (
            <span className="duration">⏱️ {activity.duration_minutes}min</span>
          )}
        </div>

        <div className="activity-rating">
          <div className="stars">
            {'⭐'.repeat(Math.round(activity.rating))}
          </div>
          <span className="review-count">
            {activity.review_count} reviews
          </span>
        </div>

        <div className="activity-price">
          {activity.original_price && activity.original_price > activity.base_price ? (
            <>
              <span className="original-price">
                ${activity.original_price.toFixed(2)}
              </span>
              <span className="current-price">
                ${activity.base_price.toFixed(2)}
              </span>
              <span className="savings">
                Save ${savings.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="current-price">
              ${activity.base_price.toFixed(2)}
            </span>
          )}
        </div>

        <a
          href={activity.booking_url}
          target="_blank"
          rel="noopener noreferrer"
          className="book-btn"
        >
          View & Book →
        </a>
      </div>

      <style jsx>{`
        .activity-card {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .activity-card:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
          transform: translateY(-4px);
        }

        .activity-image-container {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
          background: #f0f0f0;
        }

        .activity-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .activity-image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          color: #ccc;
        }

        .discount-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #ff4444;
          color: white;
          padding: 6px 12px;
          border-radius: 4px;
          font-weight: bold;
          font-size: 12px;
        }

        .favorite-btn {
          position: absolute;
          top: 10px;
          left: 10px;
          background: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          font-size: 20px;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: all 0.2s;
        }

        .favorite-btn:hover {
          transform: scale(1.1);
        }

        .favorite-btn.favorited {
          color: #ff4444;
        }

        .activity-content {
          padding: 16px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .activity-name {
          margin: 0 0 8px 0;
          font-size: 16px;
          font-weight: 600;
          color: #333;
          line-height: 1.3;
        }

        .vendor-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          font-size: 13px;
        }

        .vendor-name {
          color: #666;
          font-weight: 500;
        }

        .vendor-rating {
          color: #ff9800;
          font-size: 12px;
        }

        .activity-meta {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-bottom: 8px;
          font-size: 12px;
        }

        .category-badge,
        .location-badge,
        .duration {
          background: #f0f0f0;
          padding: 4px 8px;
          border-radius: 3px;
          color: #666;
        }

        .activity-rating {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          font-size: 13px;
        }

        .stars {
          color: #ff9800;
        }

        .review-count {
          color: #999;
        }

        .activity-price {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          margin-top: auto;
        }

        .original-price {
          text-decoration: line-through;
          color: #999;
          font-size: 13px;
        }

        .current-price {
          font-size: 20px;
          font-weight: 700;
          color: #333;
        }

        .savings {
          background: #d4edda;
          color: #155724;
          padding: 4px 8px;
          border-radius: 3px;
          font-size: 12px;
          font-weight: 600;
        }

        .book-btn {
          background: #2196f3;
          color: white;
          padding: 10px 16px;
          border-radius: 4px;
          text-decoration: none;
          text-align: center;
          font-weight: 600;
          transition: all 0.2s;
          cursor: pointer;
          border: none;
        }

        .book-btn:hover {
          background: #1976d2;
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default ActivityCard;
