import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import {
  registerWithEmailAndPassword,
  loginWithEmailAndPassword,
  signInWithGoogle
} from '../firebase/auth';
import './AuthPage.css';

// Social media icons
const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z" fill="#FFC107"/>
    <path d="M3.15295 7.3455L6.43845 9.755C7.32745 7.554 9.48045 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C8.15895 2 4.82795 4.1685 3.15295 7.3455Z" fill="#FF3D00"/>
    <path d="M12 22C14.583 22 16.93 21.0115 18.7045 19.404L15.6095 16.785C14.5718 17.5742 13.3038 18.001 12 18C9.39903 18 7.19053 16.3415 6.35853 14.027L3.09753 16.5395C4.75253 19.778 8.11353 22 12 22Z" fill="#4CAF50"/>
    <path d="M21.8055 10.0415H21V10H12V14H17.6515C17.2571 15.1082 16.5467 16.0766 15.608 16.7855L15.6095 16.7845L18.7045 19.4035C18.4855 19.6025 22 17 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z" fill="#1976D2"/>
  </svg>
);

const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

// Testimonial carousel data
const testimonials = [
  {
    quote: "CodeMaster helped me ace my technical interviews and land my dream job.",
    author: "John Doe",
    position: "Software Engineer at Google"
  },
  {
    quote: "Intuitive platform with challenging problems. Perfect for improving coding skills.",
    author: "Jane Smith",
    position: "Full Stack Developer"
  },
  {
    quote: "My problem-solving skills improved dramatically after using CodeMaster.",
    author: "Alex Johnson",
    position: "CS Student at MIT"
  }
];

const AuthPage = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const toggleAuthMode = () => {
    setIsSignIn(!isSignIn);
    setError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (isSignIn) {
        // Sign in with email and password
        await loginWithEmailAndPassword(email, password);
        toast.success('Successfully signed in!');
        setSuccessMessage('Successfully signed in!');
      } else {
        // Register with email and password
        await registerWithEmailAndPassword(email, password, username);
        toast.success('Account created successfully!');
        setSuccessMessage('Account created successfully! You can now sign in.');
        setIsSignIn(true);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      const errorMessage = error.message || 'An error occurred during authentication';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      await signInWithGoogle();
      toast.success('Successfully signed in with Google!');
      setSuccessMessage('Successfully signed in with Google!');
    } catch (error) {
      console.error('Google authentication error:', error);
      const errorMessage = error.message || 'An error occurred during Google authentication';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form-section">
          <div className="auth-logo">
            <span className="logo-icon">{'</>'}</span>
            <span className="logo-text">CodeMaster</span>
          </div>

          <h2 className="auth-title">
            {isSignIn ? 'Sign in to your account' : 'Create your account'}
          </h2>

          {error && <div className="auth-error">{error}</div>}
          {successMessage && <div className="auth-success">{successMessage}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            {!isSignIn && (
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="johndoe"
                  required
                  disabled={loading}
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <div className="password-label-group">
                <label htmlFor="password">Password</label>
                {isSignIn && (
                  <Link to="/forgot-password" className="forgot-password">
                    Forgot Password?
                  </Link>
                )}
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Processing...' : isSignIn ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <div className="social-auth-buttons">
            <button
              className="social-btn google"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <GoogleIcon />
              <span>Google</span>
            </button>
            {/* Removed GitHub and Facebook buttons as we're only implementing Google auth */}
          </div>

          <div className="auth-toggle">
            {isSignIn ? "Don't have an account?" : "Already have an account?"}
            <button className="toggle-btn" onClick={toggleAuthMode}>
              {isSignIn ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </div>

        <div className="auth-testimonial-section">
          <div className="testimonial-content">
            <h2 className="testimonial-title">What our users say</h2>
            <div className="testimonial-quote">
              <blockquote>"{testimonials[currentTestimonial].quote}"</blockquote>
              <div className="testimonial-author">
                <div className="author-avatar">
                  {testimonials[currentTestimonial].author.charAt(0)}
                </div>
                <div className="author-info">
                  <h4>{testimonials[currentTestimonial].author}</h4>
                  <p>{testimonials[currentTestimonial].position}</p>
                </div>
              </div>
            </div>

            <div className="testimonial-navigation">
              <div className="nav-indicators">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`nav-indicator ${index === currentTestimonial ? 'active' : ''}`}
                    onClick={() => setCurrentTestimonial(index)}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              <div className="nav-buttons">
                <button className="nav-btn prev" onClick={prevTestimonial} aria-label="Previous testimonial">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button className="nav-btn next" onClick={nextTestimonial} aria-label="Next testimonial">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="feature-card">
            <h3>Become a better programmer</h3>
            <p>Join thousands of developers who have improved their coding skills with our platform.</p>
            <div className="user-avatars">
              <div className="avatar">JD</div>
              <div className="avatar">AS</div>
              <div className="avatar">RJ</div>
              <div className="avatar">+</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
