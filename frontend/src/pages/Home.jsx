import { useState, useEffect, useCallback } from 'react';
import { postsAPI } from '../services/api';
import BlogCard from '../components/BlogCard';
import Pagination from '../components/Pagination';
import Advertisement from '../components/Advertisement';
import './Home.css';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
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
      <Advertisement position="top-banner" />

      <div className="container home-layout">
        <main className="home-main">
          <div className="home-header">
            <h1 className="page-title">Latest Blog Posts</h1>
            <form onSubmit={handleSearch} className="search-bar">
              <input
                type="text"
                placeholder="Search by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">
                Search
              </button>
            </form>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {loading ? (
            <div className="loading-spinner">
              <div className="spinner" />
            </div>
          ) : posts.length === 0 ? (
            <div className="empty-state">No posts found.</div>
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
          <Advertisement position="sidebar" />
        </aside>
      </div>

      <Advertisement position="sticky-footer" />
    </div>
  );
};

export default Home;
