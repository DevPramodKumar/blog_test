import { Link } from 'react-router-dom';
import './BlogCard.css';

const PLACEHOLDER_GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
];

const BlogCard = ({ post }) => {
  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const gradientIndex = post.title.length % PLACEHOLDER_GRADIENTS.length;

  return (
    <article className="blog-card card">
      <Link to={`/post/${post.id}`} className="blog-card-image">
        {post.image ? (
          <img src={post.image} alt={post.title} loading="lazy" />
        ) : (
          <div
            className="blog-card-placeholder"
            style={{ background: PLACEHOLDER_GRADIENTS[gradientIndex] }}
          >
            <span>{post.title.charAt(0).toUpperCase()}</span>
          </div>
        )}
        <div className="blog-card-overlay" />
      </Link>

      <div className="blog-card-body">
        <div className="blog-card-meta">
          <span className="blog-card-author">{post.author?.name || 'Unknown'}</span>
          <span className="blog-card-dot" />
          <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
        </div>

        <h2 className="blog-card-title">
          <Link to={`/post/${post.id}`}>{post.title}</Link>
        </h2>

        <p className="blog-card-desc">{post.description}</p>

        <Link to={`/post/${post.id}`} className="blog-card-link">
          Read article
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
};

export default BlogCard;
