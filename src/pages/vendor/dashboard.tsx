/**
 * Vendor Dashboard
 * Protected page for vendors to manage their activities
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

interface Activity {
  id: string;
  name: string;
  base_price: number;
  rating: number;
  view_count: number;
  booking_count: number;
  status: string;
  created_at: string;
}

interface VendorStats {
  totalViews: number;
  totalBookings: number;
  averageRating: number;
  activitiesCount: number;
}

export default function VendorDashboard() {
  const router = useRouter();
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<VendorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is vendor and redirect if not
  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push('/auth/login');
    }
  }, [isLoggedIn, authLoading, router]);

  // Load vendor activities
  useEffect(() => {
    if (isLoggedIn && user?.id) {
      loadVendorData();
    }
  }, [isLoggedIn, user?.id]);

  const loadVendorData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get vendor's activities from search API
      const response = await fetch('/api/activities?limit=100', {
        headers: {
          'x-vendor-id': user?.id || '',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load vendor data');
      }

      const data = await response.json();
      const vendorActivities = data.activities || [];

      setActivities(vendorActivities);

      // Calculate stats
      const totalViews = vendorActivities.reduce(
        (sum: number, a: Activity) => sum + (a.view_count || 0),
        0
      );
      const totalBookings = vendorActivities.reduce(
        (sum: number, a: Activity) => sum + (a.booking_count || 0),
        0
      );
      const avgRating =
        vendorActivities.length > 0
          ? vendorActivities.reduce(
              (sum: number, a: Activity) => sum + (a.rating || 0),
              0
            ) / vendorActivities.length
          : 0;

      setStats({
        totalViews,
        totalBookings,
        averageRating: parseFloat(avgRating.toFixed(2)),
        activitiesCount: vendorActivities.length,
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (activityId: string) => {
    try {
      const response = await fetch(`/api/activities/${activityId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-vendor-id': user?.id || '',
        },
        body: JSON.stringify({ status: 'published' }),
      });

      if (response.ok) {
        loadVendorData();
      }
    } catch (err) {
      console.error('Error publishing activity:', err);
    }
  };

  const handleDelete = async (activityId: string) => {
    if (!confirm('Are you sure you want to delete this activity?')) {
      return;
    }

    try {
      const response = await fetch(`/api/activities/${activityId}`, {
        method: 'DELETE',
        headers: {
          'x-vendor-id': user?.id || '',
        },
      });

      if (response.ok) {
        loadVendorData();
      }
    } catch (err) {
      console.error('Error deleting activity:', err);
    }
  };

  if (authLoading || loading) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Vendor Dashboard - Maui Activities Hub</title>
        <meta name="description" content="Manage your activities and bookings" />
      </Head>

      <div className="vendor-dashboard">
        <div className="container">
          <h1>Vendor Dashboard</h1>
          <p className="subtitle">Manage your activities and bookings</p>

          {error && <div className="alert alert-error">{error}</div>}

          {/* Stats Section */}
          {stats && (
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Total Views</div>
                <div className="stat-value">{stats.totalViews.toLocaleString()}</div>
              </div>

              <div className="stat-card">
                <div className="stat-label">Bookings</div>
                <div className="stat-value">{stats.totalBookings.toLocaleString()}</div>
              </div>

              <div className="stat-card">
                <div className="stat-label">Average Rating</div>
                <div className="stat-value">⭐ {stats.averageRating.toFixed(1)}</div>
              </div>

              <div className="stat-card">
                <div className="stat-label">Active Activities</div>
                <div className="stat-value">{stats.activitiesCount}</div>
              </div>
            </div>
          )}

          {/* Create Activity Button */}
          <div className="action-bar">
            <Link href="/vendor/create-activity" className="create-btn">
              + Create New Activity
            </Link>
          </div>

          {/* Activities List */}
          <div className="activities-section">
            <h2>Your Activities</h2>

            {activities.length > 0 ? (
              <div className="activities-table">
                <table>
                  <thead>
                    <tr>
                      <th>Activity Name</th>
                      <th>Price</th>
                      <th>Rating</th>
                      <th>Views</th>
                      <th>Bookings</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities.map((activity) => (
                      <tr key={activity.id}>
                        <td className="activity-name">{activity.name}</td>
                        <td>${activity.base_price.toFixed(2)}</td>
                        <td>
                          <span className="rating">
                            ⭐ {activity.rating.toFixed(1)}
                          </span>
                        </td>
                        <td>{activity.view_count.toLocaleString()}</td>
                        <td>{activity.booking_count.toLocaleString()}</td>
                        <td>
                          <span className={`status status-${activity.status}`}>
                            {activity.status}
                          </span>
                        </td>
                        <td className="actions">
                          <Link
                            href={`/vendor/activities/${activity.id}/edit`}
                            className="action-btn edit-btn"
                          >
                            Edit
                          </Link>

                          {activity.status === 'draft' && (
                            <button
                              onClick={() => handlePublish(activity.id)}
                              className="action-btn publish-btn"
                            >
                              Publish
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(activity.id)}
                            className="action-btn delete-btn"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <p>No activities yet</p>
                <p className="empty-subtext">
                  Create your first activity to get started
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .vendor-dashboard {
          background: #f5f5f5;
          min-height: 100vh;
          padding: 40px 20px;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .vendor-dashboard h1 {
          margin: 0 0 8px 0;
          font-size: 32px;
          font-weight: 700;
          color: #333;
        }

        .subtitle {
          margin: 0 0 32px 0;
          color: #666;
          font-size: 14px;
        }

        .alert {
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 32px;
          font-size: 14px;
        }

        .alert-error {
          background: #ffebee;
          color: #c62828;
          border: 1px solid #ef5350;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: white;
          padding: 24px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .stat-label {
          font-size: 12px;
          color: #999;
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: #2196f3;
        }

        .action-bar {
          margin-bottom: 32px;
        }

        .create-btn {
          display: inline-block;
          background: #4caf50;
          color: white;
          padding: 12px 24px;
          border-radius: 4px;
          text-decoration: none;
          font-weight: 600;
          transition: background 0.2s;
        }

        .create-btn:hover {
          background: #45a049;
        }

        .activities-section {
          background: white;
          padding: 24px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .activities-section h2 {
          margin: 0 0 20px 0;
          font-size: 20px;
          color: #333;
        }

        .activities-table {
          width: 100%;
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          background: #f5f5f5;
          padding: 12px;
          text-align: left;
          font-weight: 600;
          color: #666;
          font-size: 13px;
          border-bottom: 2px solid #e0e0e0;
        }

        td {
          padding: 16px 12px;
          border-bottom: 1px solid #f0f0f0;
          font-size: 14px;
        }

        .activity-name {
          font-weight: 600;
          color: #333;
        }

        .rating {
          color: #ff9800;
          font-weight: 600;
        }

        .status {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 3px;
          font-size: 12px;
          font-weight: 600;
        }

        .status-published {
          background: #e8f5e9;
          color: #2e7d32;
        }

        .status-draft {
          background: #fff3e0;
          color: #e65100;
        }

        .actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          padding: 6px 12px;
          border-radius: 3px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          text-decoration: none;
          transition: all 0.2s;
          display: inline-block;
        }

        .edit-btn {
          background: #2196f3;
          color: white;
        }

        .edit-btn:hover {
          background: #1976d2;
        }

        .publish-btn {
          background: #4caf50;
          color: white;
        }

        .publish-btn:hover {
          background: #45a049;
        }

        .delete-btn {
          background: #f44336;
          color: white;
        }

        .delete-btn:hover {
          background: #d32f2f;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #999;
        }

        .empty-state p {
          margin: 0 0 8px 0;
          font-size: 16px;
        }

        .empty-subtext {
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .activities-table {
            font-size: 12px;
          }

          th,
          td {
            padding: 8px 6px;
          }

          .action-btn {
            padding: 4px 8px;
            font-size: 11px;
          }
        }
      `}</style>
    </>
  );
}
