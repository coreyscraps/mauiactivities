/**
 * Deals Showcase Component
 * Displays real-time deals detected by price scraper
 */

import React, { useEffect, useState } from 'react';

interface Deal {
  id: string;
  deal_title: string;
  deal_description?: string;
  discount_percent: number;
  discount_amount: number;
  original_price: number;
  deal_price: number;
  deal_end_date: string;
  vendors: {
    name: string;
    rating: number;
    website: string;
  };
}

interface DealsShowcaseProps {
  limit?: number;
  sortBy?: 'discount_percent' | 'newest' | 'ending_soon';
}

export const DealsShowcase: React.FC<DealsShowcaseProps> = ({
  limit = 12,
  sortBy = 'discount_percent',
}) => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/activities/deals-v2?limit=${limit}&sort=${sortBy}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch deals');
        }

        const data = await response.json();
        setDeals(data.deals || []);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
        setDeals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
    // Refresh deals every 5 minutes
    const interval = setInterval(fetchDeals, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [limit, sortBy]);

  const formatEndDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const daysLeft = Math.ceil(
      (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysLeft <= 0) return 'Expired';
    if (daysLeft === 1) return 'Ends today';
    if (daysLeft <= 3) return `Ends in ${daysLeft} days`;
    return `${date.toLocaleDateString()}`;
  };

  if (loading) {
    return (
      <div className="deals-container">
        <div className="deals-loading">
          <div className="spinner"></div>
          <p>Loading deals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="deals-container">
        <div className="deals-error">
          <p>⚠️ Failed to load deals</p>
          <p className="error-text">{error}</p>
        </div>
      </div>
    );
  }

  if (deals.length === 0) {
    return (
      <div className="deals-container">
        <div className="deals-empty">
          <p>🎯 No deals found right now</p>
          <p className="empty-text">Check back soon for amazing offers!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="deals-container">
      <div className="deals-header">
        <h2>🔥 Hot Deals & Discounts</h2>
        <p className="deals-subtitle">
          Real-time deals detected from vendor websites
        </p>
      </div>

      <div className="deals-grid">
        {deals.map((deal) => (
          <div key={deal.id} className="deal-card">
            {/* Discount Badge */}
            <div className="discount-banner">
              <div className="discount-text">
                <span className="discount-percent">
                  {deal.discount_percent.toFixed(0)}%
                </span>
                <span className="discount-label">OFF</span>
              </div>
            </div>

            {/* Deal Content */}
            <div className="deal-content">
              <h3 className="deal-title">{deal.deal_title}</h3>

              {deal.deal_description && (
                <p className="deal-description">{deal.deal_description}</p>
              )}

              {/* Vendor Info */}
              <div className="vendor-badge">
                <span className="vendor-name">{deal.vendors.name}</span>
                <span className="vendor-rating">
                  ⭐ {deal.vendors.rating.toFixed(1)}
                </span>
              </div>

              {/* Price Breakdown */}
              <div className="price-breakdown">
                <div className="original">
                  <span className="label">Was</span>
                  <span className="price">
                    ${deal.original_price.toFixed(2)}
                  </span>
                </div>
                <div className="arrow">→</div>
                <div className="current">
                  <span className="label">Now</span>
                  <span className="price">${deal.deal_price.toFixed(2)}</span>
                </div>
              </div>

              {/* Savings Highlight */}
              <div className="savings">
                💰 Save ${deal.discount_amount.toFixed(2)}
              </div>

              {/* Expiration */}
              <div className="expiration">
                ⏱️ {formatEndDate(deal.deal_end_date)}
              </div>

              {/* Book Button */}
              <a
                href={deal.vendors.website}
                target="_blank"
                rel="noopener noreferrer"
                className="book-deal-btn"
              >
                Book This Deal →
              </a>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .deals-container {
          margin: 32px 0;
        }

        .deals-header {
          margin-bottom: 24px;
        }

        .deals-header h2 {
          font-size: 28px;
          margin: 0 0 8px 0;
          color: #333;
        }

        .deals-subtitle {
          color: #666;
          margin: 0;
          font-size: 14px;
        }

        .deals-loading,
        .deals-error,
        .deals-empty {
          text-align: center;
          padding: 40px 20px;
          background: #f5f5f5;
          border-radius: 8px;
        }

        .spinner {
          display: inline-block;
          width: 40px;
          height: 40px;
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

        .deals-error {
          background: #ffebee;
          color: #c62828;
        }

        .error-text {
          font-size: 12px;
          margin: 8px 0 0 0;
        }

        .deals-empty {
          background: #e3f2fd;
          color: #1565c0;
        }

        .empty-text {
          font-size: 13px;
          margin: 8px 0 0 0;
        }

        .deals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }

        .deal-card {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          position: relative;
          border: 2px solid #fff3cd;
        }

        .deal-card:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
          transform: translateY(-4px);
          border-color: #ffc107;
        }

        .discount-banner {
          background: linear-gradient(135deg, #ff4444 0%, #ff6b6b 100%);
          color: white;
          padding: 16px;
          text-align: center;
        }

        .discount-percent {
          font-size: 36px;
          font-weight: 700;
          display: block;
        }

        .discount-label {
          font-size: 12px;
          font-weight: 600;
          display: block;
          margin-top: 4px;
        }

        .deal-content {
          padding: 16px;
        }

        .deal-title {
          margin: 0 0 8px 0;
          font-size: 15px;
          font-weight: 600;
          color: #333;
          line-height: 1.3;
        }

        .deal-description {
          margin: 0 0 12px 0;
          font-size: 13px;
          color: #666;
          line-height: 1.4;
        }

        .vendor-badge {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          padding: 8px;
          background: #f9f9f9;
          border-radius: 4px;
          font-size: 12px;
        }

        .vendor-name {
          font-weight: 600;
          color: #333;
        }

        .vendor-rating {
          color: #ff9800;
        }

        .price-breakdown {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          padding: 12px;
          background: #f5f5f5;
          border-radius: 4px;
        }

        .original,
        .current {
          text-align: center;
          flex: 1;
        }

        .original .label,
        .current .label {
          display: block;
          font-size: 11px;
          color: #999;
          margin-bottom: 4px;
        }

        .original .price {
          font-size: 14px;
          color: #999;
          text-decoration: line-through;
        }

        .current .price {
          font-size: 18px;
          font-weight: 700;
          color: #ff4444;
        }

        .arrow {
          margin: 0 8px;
          color: #ddd;
          font-weight: bold;
        }

        .savings {
          background: #d4edda;
          color: #155724;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 8px;
          text-align: center;
        }

        .expiration {
          font-size: 12px;
          color: #ff6b6b;
          margin-bottom: 12px;
          text-align: center;
          font-weight: 500;
        }

        .book-deal-btn {
          display: block;
          background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
          color: white;
          padding: 10px;
          border-radius: 4px;
          text-decoration: none;
          text-align: center;
          font-weight: 600;
          font-size: 13px;
          transition: all 0.2s;
          cursor: pointer;
        }

        .book-deal-btn:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 12px rgba(33, 150, 243, 0.4);
        }

        @media (max-width: 768px) {
          .deals-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default DealsShowcase;
