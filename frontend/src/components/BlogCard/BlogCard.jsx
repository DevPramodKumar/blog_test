import { Link } from 'react-router-dom';
import './BlogCard.css';

const BlogCard = ({ post }) => {
  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  return (
    <article className="blog-card card">
      {post.image && (
        <Link to={`/post/${post.id}`} className="blog-card-image">
          <img src={post.image} alt={post.title} loading="lazy" />
        </Link>
      )}
      <div className="blog-card-body">
        <div className="blog-card-meta">
          <span>{post.author?.name || 'Unknown'}</span>
          <span>&middot;</span>
          <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
        </div>
        <h2 className="blog-card-title">
          <Link to={`/post/${post.id}`}>{post.title}</Link>
        </h2>
        <p className="blog-card-desc">{post.description}</p>
        <Link to={`/post/${post.id}`} className="blog-card-link">
          Read more &rarr;
        </Link>
      </div>
    </article>
  );
};

export default BlogCard;
