import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">🤖</span>
          <span className="logo-text">AI Assistant</span>
        </Link>
        
        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            <span className="nav-icon">🏠</span>
            Home
          </Link>
          <Link 
            to="/chat" 
            className={`nav-link ${location.pathname === '/chat' ? 'active' : ''}`}
          >
            <span className="nav-icon">💬</span>
            Chat Bot
          </Link>
          <Link 
            to="/classifier" 
            className={`nav-link ${location.pathname === '/classifier' ? 'active' : ''}`}
          >
            <span className="nav-icon">🖼️</span>
            Image Classifier
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;