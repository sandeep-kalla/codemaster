import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { resetPassword } from '../firebase/auth';
import toast from 'react-hot-toast';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      await resetPassword(email);
      toast.success('Password reset email sent! Check your inbox.');
      setSuccessMessage('Password reset email sent! Check your inbox.');
      setEmail('');
    } catch (error) {
      console.error('Password reset error:', error);
      const errorMessage = error.message || 'Failed to send password reset email';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="forgot-password-logo">
          <span className="logo-icon">{'</>'}</span>
          <span className="logo-text">CodeMaster</span>
        </div>

        <h2 className="forgot-password-title">Reset Your Password</h2>
        <p className="forgot-password-subtitle">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {error && <div className="forgot-password-error">{error}</div>}
        {successMessage && <div className="forgot-password-success">{successMessage}</div>}

        <form className="forgot-password-form" onSubmit={handleSubmit}>
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

          <button type="submit" className="forgot-password-submit-btn" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="forgot-password-links">
          <Link to="/auth" className="back-to-login">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
