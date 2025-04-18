import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { getUserProfile, getUserSubmissions } from '../firebase/firestore';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line } from 'recharts';
import './ProfilePage.css';

const ProfilePage = () => {
  const { currentUser, userProfile, refreshUserProfile } = useAuth();
  const [stats, setStats] = useState({ problemsSolved: 0, submissions: 0, acceptanceRate: 0 });
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);
  const [activityData, setActivityData] = useState([]);
  const [difficultyData, setDifficultyData] = useState([]);

  // Colors for charts
  const COLORS = ['#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];
  const DIFFICULTY_COLORS = {
    Easy: '#10b981',
    Medium: '#f59e0b',
    Hard: '#ef4444'
  };

  useEffect(() => {
    const loadUserProfile = async () => {
      if (currentUser) {
        try {
          setLoading(true);
          // If userProfile is not available in context, fetch it
          if (!userProfile) {
            const profile = await getUserProfile(currentUser.uid);
            if (profile && profile.stats) {
              setStats(profile.stats);
            }
          } else if (userProfile.stats) {
            setStats(userProfile.stats);
          }

          // Load user submissions
          setLoadingSubmissions(true);
          const userSubmissions = await getUserSubmissions(currentUser.uid);
          setSubmissions(userSubmissions);

          // Generate chart data
          generateChartData(userSubmissions);

        } catch (error) {
          console.error('Error loading user profile:', error);
        } finally {
          setLoading(false);
          setLoadingSubmissions(false);
        }
      }
    };

    loadUserProfile();
  }, [currentUser, userProfile]);

  // Generate chart data from submissions
  const generateChartData = (submissions) => {
    // Set default activity data for empty state
    if (!submissions || submissions.length === 0) {
      // Generate sample activity data for demonstration
      const today = new Date();
      const sampleActivityData = [];

      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

        // Generate some sample data - more activity for recent days
        const sampleSubmissions = i < 3 ? Math.floor(Math.random() * 3) + 1 : Math.floor(Math.random() * 2);
        const sampleSolved = Math.floor(Math.random() * (sampleSubmissions + 1));

        sampleActivityData.push({
          date: dayName,
          submissions: sampleSubmissions,
          solved: sampleSolved
        });
      }

      setActivityData(sampleActivityData);

      // Generate sample difficulty data for demonstration
      // This will show a chart with sample data when the user has no submissions
      const sampleDifficultyData = [
        { name: 'Easy', value: 2 },
        { name: 'Medium', value: 1 },
        { name: 'Hard', value: 0 }
      ];
      setDifficultyData(sampleDifficultyData);
      return;
    }

    // Process submissions for activity data (last 7 days)
    const last7Days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      last7Days.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        submissions: 0,
        solved: 0
      });
    }

    // Count submissions by difficulty
    const difficultyCount = {
      Easy: 0,
      Medium: 0,
      Hard: 0
    };

    // Process submissions
    submissions.forEach(submission => {
      if (submission.timestamp) {
        const submissionDate = submission.timestamp.toDate ?
          new Date(submission.timestamp.toDate()) : new Date(submission.timestamp);

        // Check if submission is within last 7 days
        const daysDiff = Math.floor((today - submissionDate) / (1000 * 60 * 60 * 24));

        if (daysDiff >= 0 && daysDiff < 7) {
          const dayIndex = 6 - daysDiff;
          last7Days[dayIndex].submissions += 1;

          if (submission.status === 'Accepted') {
            last7Days[dayIndex].solved += 1;
          }
        }

        // Count by difficulty if available
        if (submission.difficulty) {
          difficultyCount[submission.difficulty] =
            (difficultyCount[submission.difficulty] || 0) + 1;
        }
      }
    });

    // Convert difficulty data to array format for chart
    const difficultyChartData = Object.keys(difficultyCount).map(key => ({
      name: key,
      value: difficultyCount[key]
    }));

    setActivityData(last7Days);
    setDifficultyData(difficultyChartData);
  };

  // Get user initials or first letter of email
  const getUserInitials = () => {
    if (currentUser?.displayName) {
      const nameParts = currentUser.displayName.split(' ');
      if (nameParts.length > 1) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
      }
      return currentUser.displayName[0].toUpperCase();
    }

    if (currentUser?.email) {
      return currentUser.email[0].toUpperCase();
    }

    return '?';
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1 className="text-gradient">My Profile</h1>
          <Link to="/" className="back-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Home
          </Link>
        </div>

        {/* Profile Overview Card */}
        <div className="profile-overview-card">
          <div className="profile-info">
            <div className="profile-avatar-container">
              <div className="profile-avatar-large">
                {currentUser?.photoURL ? (
                  <>
                    <img
                      src={currentUser.photoURL}
                      alt="User avatar"
                      onError={(e) => {
                        console.log('Profile image failed to load:', e);
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <span style={{ display: 'none' }}>{getUserInitials()}</span>
                  </>
                ) : (
                  <span>{getUserInitials()}</span>
                )}
              </div>
              <div className="avatar-glow"></div>
            </div>
            <div className="profile-details">
              <h2>{currentUser?.displayName || 'User'}</h2>
              <p className="profile-email">{currentUser?.email}</p>
              <p className="profile-joined">
                Joined: {currentUser?.metadata?.creationTime
                  ? new Date(currentUser.metadata.creationTime).toLocaleDateString()
                  : 'Unknown'}
              </p>
              <div className="profile-actions">
                <Link to="/settings" className="profile-action-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                  Account Settings
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          {loading ? (
            <div className="loading-spinner-small">
              <div className="spinner-small"></div>
              <p>Loading stats...</p>
            </div>
          ) : (
            <div className="profile-stats-row">
              <div className="stat-card">
                <div className="stat-icon problems-solved-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 11 12 14 22 4"></polyline>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                  </svg>
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stats.problemsSolved}</div>
                  <div className="stat-label">Problems Solved</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon submissions-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stats.submissions}</div>
                  <div className="stat-label">Submissions</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon acceptance-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stats.acceptanceRate}%</div>
                  <div className="stat-label">Acceptance Rate</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Charts Section */}
        <div className="profile-charts-section">
          <h3 className="section-title">Your Coding Activity</h3>

          <div className="charts-grid">
            {/* Activity Chart */}
            <div className="chart-card">
              <h4>Last 7 Days Activity</h4>
              {loadingSubmissions ? (
                <div className="loading-spinner-small">
                  <div className="spinner-small"></div>
                  <p>Loading activity...</p>
                </div>
              ) : (
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={activityData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="submissions" name="Submissions" fill="#8b5cf6" />
                      <Bar dataKey="solved" name="Solved" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                  {submissions.length === 0 && (
                    <div className="chart-overlay-message">
                      <p>This is a sample visualization.</p>
                      <p>Solve problems to see your actual activity!</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Difficulty Distribution Chart */}
            <div className="chart-card">
              <h4>Problem Difficulty Distribution</h4>
              {loadingSubmissions ? (
                <div className="loading-spinner-small">
                  <div className="spinner-small"></div>
                  <p>Loading data...</p>
                </div>
              ) : (
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={difficultyData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => {
                          // If all values are 0, show custom label
                          const allZeros = difficultyData.every(item => item.value === 0);
                          if (allZeros) {
                            return `${name}: 0%`;
                          }
                          return `${name}: ${(percent * 100).toFixed(0)}%`;
                        }}
                      >
                        {difficultyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={DIFFICULTY_COLORS[entry.name] || COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  {submissions.length === 0 && (
                    <div className="chart-overlay-message">
                      <p>This is a sample visualization.</p>
                      <p>Solve problems to see your actual difficulty distribution!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="recent-submissions-section">
          <h3 className="section-title">Recent Submissions</h3>
          {loadingSubmissions ? (
            <div className="loading-spinner-small">
              <div className="spinner-small"></div>
              <p>Loading submissions...</p>
            </div>
          ) : submissions.length > 0 ? (
            <div className="submissions-table-container">
              <table className="submissions-table">
                <thead>
                  <tr>
                    <th>Problem</th>
                    <th>Status</th>
                    <th>Language</th>
                    <th>Runtime</th>
                    <th>Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.slice(0, 5).map((submission, index) => {
                    // Format timestamp
                    const timestamp = submission.timestamp?.toDate ?
                      new Date(submission.timestamp.toDate()).toLocaleString() :
                      'Unknown';

                    return (
                      <tr key={index}>
                        <td>{submission.problemId || 'Unknown Problem'}</td>
                        <td>
                          <span className={`submission-status ${submission.status === 'Accepted' ? 'accepted' : 'failed'}`}>
                            {submission.status}
                          </span>
                        </td>
                        <td>{submission.language}</td>
                        <td>{submission.runtime}</td>
                        <td>{timestamp}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {submissions.length > 5 && (
                <div className="view-all-link">
                  <Link to="/submissions">View all submissions</Link>
                </div>
              )}
            </div>
          ) : (
            <div className="no-data-message">
              <p>No submissions yet.</p>
              <p>Start solving problems to see your submissions here!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
