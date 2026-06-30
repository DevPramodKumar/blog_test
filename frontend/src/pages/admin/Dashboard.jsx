import { useState, useEffect } from 'react';
import { postsAPI } from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await postsAPI.getDashboardStats();
        setStats(data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner" />
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="dashboard">
      <h1 className="page-title">Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card card">
          <span className="stat-label">Total Users</span>
          <span className="stat-value">{stats.totalUsers}</span>
        </div>
        <div className="stat-card card">
          <span className="stat-label">Total Posts</span>
          <span className="stat-value">{stats.totalPosts}</span>
        </div>
        <div className="stat-card card">
          <span className="stat-label">Published</span>
          <span className="stat-value stat-success">{stats.publishedPosts}</span>
        </div>
        <div className="stat-card card">
          <span className="stat-label">Drafts</span>
          <span className="stat-value stat-warning">{stats.draftPosts}</span>
        </div>
      </div>

      <div className="card activity-card">
        <h2>Recent Activity</h2>
        {stats.activities.length === 0 ? (
          <p className="empty-state">No recent activity</p>
        ) : (
          <ul className="activity-list">
            {stats.activities.map((activity, i) => (
              <li key={i} className="activity-item">
                <span className={`activity-icon activity-${activity.type}`}>
                  {activity.type === 'post' ? 'P' : 'U'}
                </span>
                <div className="activity-content">
                  <p>{activity.message}</p>
                  <time>{formatDate(activity.date)}</time>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
