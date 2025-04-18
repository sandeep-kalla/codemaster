import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';

// Simple toast notification component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">{message}</div>
      <button className="toast-close" onClick={onClose}>×</button>
    </div>
  );
};

// Toast container component
const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Add to window for global access
  useEffect(() => {
    window.showToast = addToast;
    return () => {
      delete window.showToast;
    };
  }, []);

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast 
          key={toast.id} 
          message={toast.message} 
          type={toast.type} 
          onClose={() => removeToast(toast.id)} 
        />
      ))}
    </div>
  );
};

// Navbar component
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          CodeMaster
        </Link>
        
        <div className="navbar-toggle" onClick={() => setIsOpen(!isOpen)}>
          <span className="navbar-toggle-icon"></span>
        </div>
        
        <ul className={`navbar-menu ${isOpen ? 'active' : ''}`}>
          <li className="navbar-item">
            <Link to="/" className="navbar-link">Home</Link>
          </li>
          <li className="navbar-item">
            <Link to="/problems" className="navbar-link">Problems</Link>
          </li>
          <li className="navbar-item">
            <Link to="/profile" className="navbar-link">Profile</Link>
          </li>
          <li className="navbar-item">
            <Link to="/auth" className="navbar-link navbar-button">Sign In</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

// Footer component
const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <h3>
              <span className="logo-icon">&lt;/&gt;</span> CodeMaster
            </h3>
            <p>Enhance your coding skills with our interactive platform featuring algorithmic challenges and daily practice.</p>
          </div>
          
          <div className="footer-links">
            <div className="footer-links-column">
              <h4>Features</h4>
              <ul>
                <li><Link to="/problems">Problems</Link></li>
                <li><Link to="/daily">Daily Challenge</Link></li>
                <li><Link to="/editor">Code Editor</Link></li>
              </ul>
            </div>
            
            <div className="footer-links-column">
              <h4>Account</h4>
              <ul>
                <li><Link to="/auth">Sign In</Link></li>
                <li><Link to="/auth?mode=signup">Register</Link></li>
                <li><Link to="/profile">Profile</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} CodeMaster. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// Home page component
const Home = () => {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Master Coding Challenges</h1>
            <p>Enhance your coding skills with our interactive platform featuring algorithmic challenges and daily practice.</p>
            <div className="hero-buttons">
              <Link to="/problems" className="btn btn-primary">Explore Problems</Link>
              <Link to="/auth" className="btn btn-secondary">Sign Up Free</Link>
            </div>
          </div>
        </div>
      </section>
      
      <section className="features">
        <div className="container">
          <h2>Everything You Need</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>Problem Library</h3>
              <p>Access a wide range of coding problems categorized by difficulty and topics.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔥</div>
              <h3>Daily Challenges</h3>
              <p>Solve daily coding challenges to maintain your streak and improve consistently.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💻</div>
              <h3>Code Editor</h3>
              <p>Write, test, and submit your solutions in our integrated code editor.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Problems page placeholder
const Problems = () => (
  <div className="container" style={{ padding: '2rem', minHeight: '70vh' }}>
    <h1>Problems</h1>
    <p>This page is under construction. Please check back later.</p>
    <Link to="/" className="btn btn-primary">Back to Home</Link>
  </div>
);

// Profile page placeholder
const Profile = () => (
  <div className="container" style={{ padding: '2rem', minHeight: '70vh' }}>
    <h1>Profile</h1>
    <p>This page is under construction. Please check back later.</p>
    <Link to="/" className="btn btn-primary">Back to Home</Link>
  </div>
);

// Auth page placeholder
const Auth = () => {
  const location = useLocation();
  const isSignUp = new URLSearchParams(location.search).get('mode') === 'signup';
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isSignUp ? 'Create Account' : 'Sign In'}</h2>
        <form className="auth-form">
          {isSignUp && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" placeholder="Enter your name" />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Enter your email" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Enter your password" />
          </div>
          <button type="button" className="btn btn-primary btn-block">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>
        <div className="auth-footer">
          {isSignUp ? (
            <p>Already have an account? <Link to="/auth">Sign In</Link></p>
          ) : (
            <p>Don't have an account? <Link to="/auth?mode=signup">Sign Up</Link></p>
          )}
        </div>
      </div>
    </div>
  );
};

// Main App component
function App() {
  return (
    <Router>
      <div className="app">
        <ToastContainer />
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/problems" element={<Problems />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
