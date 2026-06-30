import { useState, useEffect, useCallback } from 'react';
import { postsAPI } from '../services/api';
import BlogCard from '../components/BlogCard';
import Pagination from '../components/Pagination';
import Advertisement from '../components/Advertisement';
import './Home.css';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPosts = useCallback(async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await postsAPI.getAll({
        page,
        limit: 6,
        search: search || undefined,
        status: 'published',
      });
      setPosts(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchPosts(1);
  }, [fetchPosts]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPosts(1);
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-bg" />
        <div className="container hero-inner">
          <span className="hero-badge">✦ Discover Stories</span>
          <h1 className="hero-title">
            Ideas worth <em>reading</em>
          </h1>
          <p className="hero-subtitle">
            Explore thoughtful articles, insights, and stories from our community of writers.
          </p>
          <form onSubmit={handleSearch} className="hero-search">
            <svg className="hero-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              placeholder="Search articles by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>
      </section>

      <div className="ad-strip">
        <div className="container">
          <Advertisement position="top-banner" />
        </div>
      </div>

      <div className="container home-layout">
        <main className="home-main">
          <div className="home-section-header">
            <div>
              <span className="section-label">Latest</span>
              <h2 className="home-section-title">Blog Posts</h2>
            </div>
            {!loading && pagination.total > 0 && (
              <span className="post-count">{pagination.total} articles</span>
            )}
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {loading ? (
            <div className="loading-spinner">
              <div className="spinner" />
            </div>
          ) : posts.length === 0 ? (
            <div className="empty-state">
              <p className="empty-icon">📝</p>
              <p>No posts found. Try a different search.</p>
            </div>
          ) : (
            <div className="posts-grid">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}

          <Pagination
            page={pagination.page}
            pages={pagination.pages}
            onPageChange={fetchPosts}
          />
        </main>

        <aside className="home-sidebar">
          <div className="sidebar-card card">
            <h3>Stay Updated</h3>
            <p>Fresh stories and insights delivered to your feed.</p>
          </div>
          <Advertisement position="sidebar" />
        </aside>
      </div>

      <Advertisement position="sticky-footer" />
    </div>
  );
};

export default Home;
