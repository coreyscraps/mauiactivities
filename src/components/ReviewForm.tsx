/**
 * Review Form Component
 * Let users submit ratings and reviews
 */

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

interface ReviewFormProps {
  activityId: string;
  onReviewSubmitted?: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  activityId,
  onReviewSubmitted,
}) => {
  const { user, isLoggedIn } = useAuth();
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!comment.trim()) {
      setError('Please enter a comment');
      return;
    }

    if (comment.length < 10) {
      setError('Comment must be at least 10 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id || '',
        },
        body: JSON.stringify({
          activity_id: activityId,
          rating,
          title: title || null,
          comment,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit review');
      }

      setSuccess(true);
      setRating(5);
      setTitle('');
      setComment('');

      // Reload reviews after submission
      onReviewSubmitted?.();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="review-form">
        <div className="login-prompt">
          <p>👤 Please log in to leave a review</p>
        </div>
      </div>
    );
  }

  return (
    <div className="review-form">
      <h3>Leave a Review</h3>
      <p className="subtitle">Share your experience with other travelers</p>

      {error && <div className="alert alert-error">{error}</div>}
      {success && (
        <div className="alert alert-success">
          ✓ Your review has been posted!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="rating">Rating</label>
          <div className="rating-selector">
            {[1, 2, 3, 4, 5].map((r) => (
              <button
                key={r}
                type="button"
                className={`star-btn ${rating >= r ? 'filled' : ''}`}
                onClick={() => setRating(r)}
                title={`Rate ${r} stars`}
              >
                ⭐
              </button>
            ))}
            <span className="rating-text">{rating} stars</span>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="title">Title (Optional)</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="E.g., Amazing experience!"
            className="form-input"
            maxLength={100}
          />
        </div>

        <div className="form-group">
          <label htmlFor="comment">Your Review</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What did you think about this activity? Please share details about your experience..."
            className="form-textarea"
            rows={5}
            required
            minLength={10}
          />
          <small className="char-count">
            {comment.length} characters
          </small>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="submit-btn"
        >
          {loading ? 'Posting...' : 'Post Review'}
        </button>
      </form>

      <style jsx>{`
        .review-form {
          background: #f9f9f9;
          padding: 24px;
          border-radius: 8px;
          border: 1px solid #e0e0e0;
          margin-bottom: 32px;
        }

        .review-form h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: 600;
          color: #333;
        }

        .subtitle {
          margin: 0 0 24px 0;
          font-size: 14px;
          color: #666;
        }

        .login-prompt {
          text-align: center;
          padding: 24px;
          background: white;
          border-radius: 6px;
          color: #666;
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

        .form-group {
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #333;
        }

        .rating-selector {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .star-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          opacity: 0.3;
          transition: opacity 0.2s;
        }

        .star-btn:hover,
        .star-btn.filled {
          opacity: 1;
          color: #ffc107;
        }

        .rating-text {
          margin-left: 12px;
          font-size: 14px;
          color: #666;
          font-weight: 500;
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

        .form-textarea {
          padding: 10px 12px;
          border: 2px solid #e0e0e0;
          border-radius: 4px;
          font-size: 14px;
          font-family: inherit;
          resize: vertical;
          transition: border-color 0.2s;
        }

        .form-textarea:focus {
          outline: none;
          border-color: #2196f3;
        }

        .char-count {
          margin-top: 4px;
          font-size: 12px;
          color: #999;
        }

        .submit-btn {
          background: #2196f3;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 4px;
          font-size: 14px;
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
      `}</style>
    </div>
  );
};

export default ReviewForm;
