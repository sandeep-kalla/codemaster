import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <h3>
              <span className="logo-icon">{'</>'}</span>
              CodeMaster
            </h3>
            <p>Enhance your coding skills with our interactive platform for algorithm practice and daily challenges.</p>
          </div>
          <div className="footer-links">
            <div className="footer-links-column">
              <h4>Features</h4>
              <ul>
                <li><Link to="/problems">Problems</Link></li>
                <li><Link to="/problems">Daily Challenge</Link></li>
                <li><Link to="/problems">Code Editor</Link></li>
              </ul>
            </div>
            <div className="footer-links-column">
              <h4>Account</h4>
              <ul>
                <li><Link to="/auth/login">Sign In</Link></li>
                <li><Link to="/auth/register">Register</Link></li>
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

export default Footer;
