import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Advertisement from '../Advertisement';
import './Footer.css';

const Footer = () => {
  const { user } = useAuth();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <Advertisement position="bottom-banner" />
      </div>

      <div className="footer-main">
        <div className="container footer-inner">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="navbar-logo">✦</span>
              BlogPlatform
            </Link>
            <p className="footer-tagline">Stories, ideas, and insights for curious minds.</p>
          </div>

          <div className="footer-links-group">
            <h4>Explore</h4>
            <div className="footer-links">
              <Link to="/">Home</Link>
              {!user && <Link to="/login">Login</Link>}
              {!user && <Link to="/register">Register</Link>}
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>&copy; {year} BlogPlatform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
