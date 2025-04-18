import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import UserProfileDropdown from './UserProfileDropdown';
import { problemsApi } from '../services/api';
import './UserProfileDropdown.css';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, userStreak, refreshUserStreak } = useAuth();
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch daily challenge and refresh streak when user is authenticated
  useEffect(() => {
    let isMounted = true;

    const initializeData = async () => {
      if (isAuthenticated && isMounted) {
        // Set loading once at the beginning
        setLoading(true);

        try {
          // Fetch daily challenge
          await fetchDailyChallenge();

          // Only refresh streak if component is still mounted
          if (isMounted) {
            await refreshUserStreak();
          }
        } catch (error) {
          // Error handled silently
        } finally {
          // Only update loading state if component is still mounted
          if (isMounted) {
            setLoading(false);
          }
        }
      }
    };

    initializeData();

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]); // Remove refreshUserStreak from dependencies

  const fetchDailyChallenge = async () => {
    try {
      // Loading state is now managed by the parent function
      const data = await problemsApi.getDailyChallenge();

      // Mark this problem as the daily challenge
      if (data) {
        data.isDailyChallenge = true;
      }

      setDailyChallenge(data);
      return data;
    } catch (error) {
      // Error will be propagated to parent function
      throw error;
    }
  };

  const handleDailyChallengeClick = () => {
    if (dailyChallenge && dailyChallenge.titleSlug) {
      // Add a query parameter to indicate this is the daily challenge
      navigate(`/problems/${dailyChallenge.titleSlug}?daily=true`);
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <span className="logo-icon">{'</>'}</span>
          CodeMaster
        </div>
        <nav className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/problems" className="nav-link">Problems</Link>
          <Link to="#" className="nav-link">Learn</Link>
          <Link to="#" className="nav-link">Compete</Link>
          <Link to="#" className="nav-link">Discuss</Link>
        </nav>
        <div className="header-buttons">
          {isAuthenticated ? (
            <>
              {/* Daily Challenge Flame Icon */}
              <button
                className={`daily-challenge-btn ${userStreak?.isDailyProblemCompleted ? 'daily-challenge-completed' : ''} ${loading ? 'loading' : ''}`}
                onClick={handleDailyChallengeClick}
                title={userStreak?.isDailyProblemCompleted ? 'Daily Challenge Completed!' : 'Daily Challenge'}
                disabled={loading || !dailyChallenge}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flame-icon">
                  <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 012.5 2.5z"></path>
                </svg>
                {userStreak && userStreak.currentStreak > 0 && (
                  <span className="streak-counter">{userStreak.currentStreak}</span>
                )}
              </button>
              <UserProfileDropdown />
            </>
          ) : (
            <>
              <Link to="/auth" className="btn btn-outline-purple btn-sm">Sign In</Link>
              <Link to="/auth" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
