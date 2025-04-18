import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { problemsApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { getAllUserProblemStatuses } from '../firebase/firestore';
import './ProblemsPage.css';

const DifficultyBadge = ({ difficulty }) => {
  const difficultyClass = {
    'EASY': 'badge-easy',
    'MEDIUM': 'badge-medium',
    'HARD': 'badge-hard'
  }[difficulty] || 'badge-default';

  return <span className={`difficulty-badge ${difficultyClass}`}>{difficulty}</span>;
};

const ProblemsPage = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalProblems, setTotalProblems] = useState(0);
  const [problemStatuses, setProblemStatuses] = useState({});

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // Filter state
  const [difficulty, setDifficulty] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all-code-essentials');

  // Load user problem statuses
  useEffect(() => {
    const loadProblemStatuses = async () => {
      if (!currentUser) {
        setProblemStatuses({});
        return;
      }

      try {
        const statuses = await getAllUserProblemStatuses(currentUser.uid);
        setProblemStatuses(statuses);
      } catch (error) {
        console.error('Error loading problem statuses:', error);
      }
    };

    loadProblemStatuses();
  }, [currentUser]);

  // Fetch problems when filters or pagination changes
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        const params = {
          page: currentPage,
          pageSize,
          category
        };

        if (difficulty) {
          params.difficulty = difficulty;
        }

        if (searchQuery) {
          params.search = searchQuery;
        }

        const data = await problemsApi.getProblems(params);
        setProblems(data.questions);
        setTotalProblems(data.total);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch problems. Please try again later.');
        setLoading(false);
        console.error('Error fetching problems:', err);

        // Set empty data to avoid rendering issues
        setProblems([]);
        setTotalProblems(0);
      }
    };

    fetchProblems();
  }, [currentPage, pageSize, difficulty, searchQuery, category]);

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle difficulty filter change
  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setCurrentPage(1); // Reset to first page when changing category
  };

  // Handle page size change
  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalProblems / pageSize);

  // Generate pagination buttons
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 7; // Maximum number of page buttons to show

    // Always show first page
    buttons.push(
      <button
        key="first"
        onClick={() => setCurrentPage(1)}
        className={`pagination-button ${currentPage === 1 ? 'active' : ''}`}
        disabled={currentPage === 1}
      >
        1
      </button>
    );

    // Calculate range of pages to show
    let startPage = Math.max(2, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxButtons - 3);

    // Adjust start if end is too close to total pages
    if (endPage >= totalPages - 1) {
      startPage = Math.max(2, totalPages - maxButtons + 2);
    }

    // Add ellipsis after first page if needed
    if (startPage > 2) {
      buttons.push(<span key="ellipsis1" className="pagination-ellipsis">...</span>);
    }

    // Add page buttons
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`pagination-button ${currentPage === i ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      buttons.push(<span key="ellipsis2" className="pagination-ellipsis">...</span>);
    }

    // Always show last page if there is more than one page
    if (totalPages > 1) {
      buttons.push(
        <button
          key="last"
          onClick={() => setCurrentPage(totalPages)}
          className={`pagination-button ${currentPage === totalPages ? 'active' : ''}`}
          disabled={currentPage === totalPages}
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="problems-page">

      <div className="problems-container">
        <div className="problems-content">
          <div className="problems-header">
            <div className="problems-header-left">
              <Link to="/" className="btn btn-outline-purple btn-sm">
                Back to Home
              </Link>
              <h1 className="problems-title">Coding Problems</h1>
            </div>
          </div>

          <div className="problems-filters">
            <form onSubmit={handleSearchSubmit} className="search-form">
              <input
                type="text"
                placeholder="Search problems..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-input"
              />
              <button type="submit" className="btn btn-primary">Search</button>
            </form>

            <div className="filter-controls">
              <div className="filter-group">
                <label htmlFor="difficulty">Difficulty:</label>
                <select
                  id="difficulty"
                  value={difficulty}
                  onChange={handleDifficultyChange}
                  className="filter-select"
                >
                  <option value="">All</option>
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="category">Category:</label>
                <select
                  id="category"
                  value={category}
                  onChange={handleCategoryChange}
                  className="filter-select"
                >
                  <option value="all-code-essentials">All</option>
                  <option value="algorithms">Algorithms</option>
                  <option value="database">Database</option>
                  <option value="shell">Shell</option>
                  <option value="concurrency">Concurrency</option>
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="pageSize">Show:</label>
                <select
                  id="pageSize"
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  className="filter-select"
                >
                  <option value="25">25 / page</option>
                  <option value="50">50 / page</option>
                  <option value="100">100 / page</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading problems...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="btn btn-primary"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              <div className="problems-count">
                Showing {problems.length} of {totalProblems} problems
              </div>

              <div className="problems-table-container">
                <table className="problems-table">
                  <thead>
                    <tr>
                      <th className="status-col">Status</th>
                      <th className="id-col">ID</th>
                      <th className="title-col">Title</th>
                      <th className="difficulty-col">Difficulty</th>
                      <th className="acceptance-col">Acceptance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {problems.map((problem) => (
                      <tr key={problem.questionId} className="problem-row">
                        <td className="status-col">
                          {isAuthenticated && problemStatuses[problem.titleSlug] ? (
                            <span className={`status-icon ${problemStatuses[problem.titleSlug] === 'solved' ? 'ac' : 'notac'}`}>
                              {problemStatuses[problem.titleSlug] === 'solved' ? '✓' : '✗'}
                            </span>
                          ) : problem.status ? (
                            <span className={`status-icon ${problem.status.toLowerCase()}`}>
                              {problem.status === 'ac' ? '✓' : '✗'}
                            </span>
                          ) : (
                            <span className="status-icon todo">•</span>
                          )}
                        </td>
                        <td className="id-col">{problem.questionFrontendId}</td>
                        <td className="title-col">
                          <Link to={`/problems/${problem.titleSlug}`} className="problem-link">
                            {problem.title}
                            {problem.isPaidOnly && <span className="premium-icon">🔒</span>}
                          </Link>
                          <div className="problem-tags">
                            {problem.topicTags.slice(0, 3).map((tag) => (
                              <span key={tag.slug} className="problem-tag">
                                {tag.name}
                              </span>
                            ))}
                            {problem.topicTags.length > 3 && (
                              <span className="problem-tag more-tag">
                                +{problem.topicTags.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="difficulty-col">
                          <DifficultyBadge difficulty={problem.difficulty} />
                        </td>
                        <td className="acceptance-col">
                          {problem.acRate ? `${(problem.acRate * 100).toFixed(1)}%` : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="pagination-button prev"
                >
                  &lt; Prev
                </button>

                <div className="pagination-pages">
                  {renderPaginationButtons()}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="pagination-button next"
                >
                  Next &gt;
                </button>
              </div>
            </>
          )}
        </div>
      </div>


    </div>
  );
};

export default ProblemsPage;
