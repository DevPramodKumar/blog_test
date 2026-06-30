import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { postsAPI } from '../services/api';
import BlogCard from '../components/BlogCard';
import Advertisement from '../components/Advertisement';
import './PostDetail.css';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError('');
      try {
        const [postRes, relatedRes] = await Promise.all([
          postsAPI.getById(id),
          postsAPI.getRelated(id),
        ]);
        setPost(postRes.data.data);
        setRelated(relatedRes.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Post not found');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container" style={{ padding: '3rem 0' }}>
        <div className="alert alert-error">{error || 'Post not found'}</div>
        <Link to="/">&larr; Back to Home</Link>
      </div>
    );
  }

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const contentParts = post.content.split('\n\n');
  const midPoint = Math.ceil(contentParts.length / 2);
  const firstHalf = contentParts.slice(0, midPoint).join('\n\n');
  const secondHalf = contentParts.slice(midPoint).join('\n\n');

  return (
    <article className="post-detail">
      <div className="container" style={{ paddingTop: '1.5rem' }}>
        <Link to="/" className="post-back-link">
          ← Back to articles
        </Link>
      </div>

      <div className="container">
        <Advertisement position="top-banner" />
      </div>

      <div className="container post-detail-layout">
        <main className="post-detail-main">
          {post.image && (
            <div className="post-detail-image">
              <img src={post.image} alt={post.title} />
            </div>
          )}

          <header className="post-detail-header">
            <h1>{post.title}</h1>
            <div className="post-detail-meta">
              <span>By {post.author?.name || 'Unknown'}</span>
              <span>&middot;</span>
              <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
            </div>
            <p className="post-detail-desc">{post.description}</p>
          </header>

          <div className="post-detail-content">
            {firstHalf.split('\n').map((para, i) => (
              <p key={`a-${i}`}>{para}</p>
            ))}
          </div>

          <Advertisement position="content-1" />

          <div className="post-detail-content">
            {secondHalf.split('\n').map((para, i) => (
              <p key={`b-${i}`}>{para}</p>
            ))}
          </div>

          <Advertisement position="content-2" />

          {related.length > 0 && (
            <section className="related-posts">
              <h2>Related Posts</h2>
              <div className="related-grid">
                {related.map((p) => (
                  <BlogCard key={p.id} post={p} />
                ))}
              </div>
            </section>
          )}
        </main>

        <aside className="post-detail-sidebar">
          <div className="author-card card">
            <h3>About the Author</h3>
            <p className="author-name">{post.author?.name}</p>
            <p className="author-email">{post.author?.email}</p>
          </div>
          <Advertisement position="sidebar" />
        </aside>
      </div>

      <Advertisement position="sticky-footer" />
    </article>
  );
};

export default PostDetail;
