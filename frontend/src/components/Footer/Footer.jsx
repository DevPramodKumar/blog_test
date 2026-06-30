import Advertisement from '../Advertisement';
import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <Advertisement position="bottom-banner" />
      <div className="container footer-inner">
        <p>&copy; {year} BlogPlatform. All rights reserved.</p>
        <div className="footer-links">
          <a href="/">Home</a>
          <a href="/login">Login</a>
          <a href="/register">Register</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
