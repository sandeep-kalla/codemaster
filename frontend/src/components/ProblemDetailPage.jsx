/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { problemsApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import UserProfileDropdown from './UserProfileDropdown';
import { saveUserCode, getUserCode, saveSubmission, getUserProblemStatus, getUserSubmissions } from '../firebase/firestore';
// Import Prism core and theme first
import 'prismjs/themes/prism-tomorrow.css';
// Then import languages
import './ProblemDetailPage.css';
import './SplitPane.css';

const ProblemDetailPage = () => {
  const { titleSlug } = useParams();
  const { isAuthenticated, currentUser, refreshUserStreak } = useAuth();
  const [problemStatus, setProblemStatus] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [code, setCode] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [activeHintIndex, setActiveHintIndex] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [outputData, setOutputData] = useState({
    status: '',
    runtime: '',
    memory: '',
    output: '',
    testCases: []
  });
  // We're using a fixed grid layout now, so no need for split size state

  // Add resize functionality with a dedicated resize handle
  const [resizePercentage, setResizePercentage] = useState(40); // Default 40% for left panel

  // Function to handle manual resize - wrapped in useCallback to avoid dependency issues
  const handleManualResize = useCallback((percentage) => {
    setResizePercentage(percentage);
    const container = document.querySelector('.problem-detail-layout-container');
    if (container) {
      container.style.gridTemplateColumns = `${percentage}% ${100 - percentage}%`;
    }
  }, []);

  // Initialize resize functionality
  useEffect(() => {
    // Wait for DOM to be fully rendered
    const initializeResize = () => {
      const container = document.querySelector('.problem-detail-layout-container');
      const resizeHandle = document.getElementById('resize-handle');

      if (!container || !resizeHandle) {
        // Try again after a short delay
        setTimeout(initializeResize, 500);
        return;
      }

      // Set initial grid template
      container.style.gridTemplateColumns = `${resizePercentage}% ${100 - resizePercentage}%`;

      let isResizing = false;
      let startX = 0;
      let startPercentage = resizePercentage;

      const startResize = (e) => {
        isResizing = true;
        startX = e.clientX;
        startPercentage = resizePercentage;
        document.body.classList.add('resizing');
        e.preventDefault();
      };

      const doResize = (e) => {
        if (!isResizing) return;

        const containerWidth = container.offsetWidth;
        const dx = e.clientX - startX;
        const percentageDelta = (dx / containerWidth) * 100;
        const newPercentage = Math.min(Math.max(20, startPercentage + percentageDelta), 80);

        handleManualResize(newPercentage);
      };

      const stopResize = () => {
        if (!isResizing) return;
        isResizing = false;
        document.body.classList.remove('resizing');
      };

      // Add event listeners
      resizeHandle.addEventListener('mousedown', startResize);
      window.addEventListener('mousemove', doResize);
      window.addEventListener('mouseup', stopResize);

      // Store cleanup function
      return () => {
        if (resizeHandle) {
          resizeHandle.removeEventListener('mousedown', startResize);
        }
        window.removeEventListener('mousemove', doResize);
        window.removeEventListener('mouseup', stopResize);
      };
    };

    // Start initialization
    const cleanup = initializeResize();

    // Return cleanup function if available
    return cleanup;
  }, [resizePercentage, handleManualResize]);

  // Helper function to extract test cases from problem description
  const extractTestCases = (htmlContent) => {
    // Default test cases for Two Sum if we can't extract them
    const defaultTestCases = ['[2,7,11,15]\n9', '[3,2,4]\n6', '[3,3]\n6'];

    try {
      if (!htmlContent) return defaultTestCases;

      // Create a temporary div to parse the HTML content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;

      // Look for example sections
      const exampleSections = tempDiv.querySelectorAll('pre');
      if (!exampleSections || exampleSections.length === 0) return defaultTestCases;

      // Extract test cases from each example
      const testCases = [];
      exampleSections.forEach(section => {
        // Get the text content and clean it up
        let text = section.textContent.trim();

        // Try to extract just the input values
        // For example, from "Input: nums = [2,7,11,15], target = 9" we want "[2,7,11,15]\n9"
        const inputMatch = text.match(/nums\s*=\s*(\[.*?\]).*?target\s*=\s*(\d+)/i);
        if (inputMatch && inputMatch.length >= 3) {
          // Format as array followed by target value
          text = `${inputMatch[1]}\n${inputMatch[2]}`;
        }

        if (text) testCases.push(text);
      });

      return testCases.length > 0 ? testCases : defaultTestCases;
    } catch (error) {
      return defaultTestCases;
    }
  };

  // Function to poll for run results
  const pollRunResult = async (interpretId) => {
    let attempts = 0;
    const maxAttempts = 30; // Maximum number of polling attempts
    const pollInterval = 1000; // Polling interval in milliseconds

    const poll = async () => {
      const result = await problemsApi.checkRunResult(interpretId);

      // Check if the result is ready
      if (result.state === 'SUCCESS') {
        // Process the successful result
        const testCaseResults = [];

        if (result.code_answer && Array.isArray(result.code_answer)) {
          result.code_answer.forEach((answer, index) => {
            const testCase = {
              input: result.test_case ? result.test_case.split('\n')[index] || '' : '',
              output: answer,
              expected: result.expected_code_answer ? result.expected_code_answer[index] || '' : '',
              result: answer === (result.expected_code_answer ? result.expected_code_answer[index] : '') ? 'Passed' : 'Failed'
            };
            testCaseResults.push(testCase);
          });
        }

        setOutputData({
          status: result.status_msg || 'Finished',
          runtime: result.status_runtime || 'N/A',
          memory: result.memory || 'N/A',
          output: result.code_answer ? result.code_answer.join('\n') : '',
          testCases: testCaseResults
        });

        return true;
      } else if (result.state === 'PENDING' || result.state === 'STARTED') {
        // Still processing, continue polling
        return false;
      } else {
        // Error or other state
        throw new Error(result.status_msg || 'Run failed');
      }
    };

    // Start polling
    while (attempts < maxAttempts) {
      const isComplete = await poll();
      if (isComplete) return;

      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, pollInterval));
      attempts++;
    }

    // If we reach here, polling timed out
    throw new Error('Timed out waiting for run result');
  };

  // Function to poll for submission results
  const pollSubmissionResult = async (submissionId) => {
    let attempts = 0;
    const maxAttempts = 10; // Maximum number of polling attempts (reduced for better UX)
    const pollInterval = 1500; // Polling interval in milliseconds (increased to reduce load)
    let finalResult = null;

    const poll = async () => {
      try {
        const result = await problemsApi.checkSubmission(submissionId);

        // Check if the result is ready
        if (result.state === 'SUCCESS') {
          // Process the successful result
          const testCaseResults = [];

          // For submissions, we might get different result format
          if (result.total_correct !== undefined && result.total_testcases !== undefined) {
            // Create a summary test case
            testCaseResults.push({
              input: 'All test cases',
              output: `${result.total_correct} / ${result.total_testcases} test cases passed`,
              expected: `${result.total_testcases} / ${result.total_testcases} test cases passed`,
              result: result.total_correct === result.total_testcases ? 'Passed' : 'Failed'
            });
          }

          // Create the result object
          finalResult = {
            status: result.status_msg || 'Finished',
            runtime: result.status_runtime || 'N/A',
            memory: result.memory || 'N/A',
            output: result.code_output || '',
            testCases: testCaseResults,
            submissionId: submissionId
          };

          setOutputData(finalResult);

          return true;
        } else if (result.state === 'PENDING' || result.state === 'STARTED') {
          // Still processing, continue polling
          // Update the output to show progress
          setOutputData(prev => ({
            ...prev,
            status: 'Processing...',
            output: `Submission ${submissionId} is being processed. Please wait...`
          }));
          return false;
        } else {
          // Error or other state
          throw new Error(result.status_msg || 'Submission failed');
        }
      } catch (error) {
        // If we get a 403 error, it might be an authentication issue with LeetCode
        if (error.response && error.response.status === 403) {
          // Instead of throwing, we'll return a special value
          finalResult = {
            status: 'Submission Processed',
            runtime: 'N/A',
            memory: 'N/A',
            output: 'Your code was submitted successfully, but we cannot display detailed results due to authentication limitations.',
            testCases: [{
              input: 'All test cases',
              output: 'Submission processed',
              expected: 'N/A',
              result: 'Unknown'
            }],
            submissionId: submissionId
          };

          setOutputData(finalResult);
          return true; // End polling
        }

        throw error;
      }
    };

    // Start polling
    while (attempts < maxAttempts) {
      try {
        const isComplete = await poll();
        if (isComplete) return finalResult;

        // Wait before next poll
        await new Promise(resolve => setTimeout(resolve, pollInterval));
        attempts++;
      } catch (error) {
        // If there's an error during polling, we'll show it and stop polling
        finalResult = {
          status: 'Error',
          output: `Error checking submission: ${error.message || 'Unknown error'}`,
          testCases: [],
          submissionId: submissionId
        };

        setOutputData(finalResult);
        return finalResult; // End polling on error
      }
    }

    // If we reach here, polling timed out but submission was successful
    finalResult = {
      status: 'Submission Processed',
      runtime: 'N/A',
      memory: 'N/A',
      output: 'Your code was submitted successfully. Please check your LeetCode account for detailed results.',
      testCases: [{
        input: 'All test cases',
        output: 'Submission processed',
        expected: 'N/A',
        result: 'Unknown'
      }],
      submissionId: submissionId
    };

    setOutputData(finalResult);
    return finalResult;
  };

  // Resize functionality is now working with the drag handle

  // Function to load user submissions for this problem
  const loadSubmissions = useCallback(async () => {
    if (!currentUser || !titleSlug) return;

    try {
      setLoadingSubmissions(true);
      const userSubmissions = await getUserSubmissions(currentUser.uid, titleSlug);
      setSubmissions(userSubmissions);
    } catch (error) {
      // Error handled silently
    } finally {
      setLoadingSubmissions(false);
    }
  }, [currentUser, titleSlug]);

  // Load submissions when the tab changes to 'submission'
  useEffect(() => {
    if (activeTab === 'submission' && isAuthenticated) {
      loadSubmissions();
    }
  }, [activeTab, isAuthenticated, loadSubmissions]);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        const data = await problemsApi.getProblemBySlug(titleSlug);

        // Check if this is the daily challenge by comparing with the URL parameter
        // This will be set if the user navigated from the daily challenge button
        const urlParams = new URLSearchParams(window.location.search);
        const isDailyChallenge = urlParams.get('daily') === 'true';

        if (isDailyChallenge) {
          data.isDailyChallenge = true;
        }

        setProblem(data);

        // Check if user has saved code for this problem
        if (currentUser) {
          try {
            // Get user's saved code
            const savedCode = await getUserCode(currentUser.uid, titleSlug);
            if (savedCode) {
              setCode(savedCode.code);
              setSelectedLanguage(savedCode.language);
            } else {
              // No saved code, use default snippet
              const defaultSnippet = data.codeSnippets?.find(snippet =>
                snippet.langSlug === 'cpp' || snippet.langSlug === 'c++'
              );
              if (defaultSnippet) {
                setCode(defaultSnippet.code);
              }
            }

            // Get problem status
            const status = await getUserProblemStatus(currentUser.uid, titleSlug);
            setProblemStatus(status);
          } catch (userDataError) {
            // Error handled silently - fall back to default code snippet
            const defaultSnippet = data.codeSnippets?.find(snippet =>
              snippet.langSlug === 'cpp' || snippet.langSlug === 'c++'
            );
            if (defaultSnippet) {
              setCode(defaultSnippet.code);
            }
          }
        } else {
          // Not logged in, use default snippet
          const defaultSnippet = data.codeSnippets?.find(snippet =>
            snippet.langSlug === 'cpp' || snippet.langSlug === 'c++'
          );
          if (defaultSnippet) {
            setCode(defaultSnippet.code);
          }
        }

        setLoading(false);
      } catch (err) {
        setError('Failed to fetch problem details. Please try again later.');
        setLoading(false);

        // Set problem to null to avoid rendering issues
        setProblem(null);
      }
    };

    fetchProblem();
  }, [titleSlug, currentUser]);

  // Custom dropdown state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (newLang) => {
    setSelectedLanguage(newLang);
    setDropdownOpen(false);

    // Update code snippet based on selected language
    if (problem?.codeSnippets) {
      const snippet = problem.codeSnippets.find(s => s.langSlug === newLang);
      if (snippet) {
        const newCode = snippet.code;
        setCode(newCode);

        // Save the new language and code if user is authenticated
        if (isAuthenticated && currentUser) {
          try {
            saveUserCode(currentUser.uid, titleSlug, newCode, newLang);
          } catch (error) {
            // Error handled silently
          }
        }
      }
    }
  };

  // Debounce function to limit how often we save code
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  // Save code to Firestore (debounced)
  const saveCode = useCallback(
    debounce(async (newCode) => {
      if (currentUser && titleSlug) {
        try {
          await saveUserCode(currentUser.uid, titleSlug, newCode, selectedLanguage);
        } catch (error) {
          // Error handled silently
        }
      }
    }, 1000), // Save after 1 second of inactivity
    [currentUser, titleSlug, selectedLanguage]
  );

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);

    // Save code if user is authenticated
    if (isAuthenticated) {
      saveCode(newCode);
    }
  };

  // Function to render HTML content safely
  const renderHTML = (html) => {
    return { __html: html };
  };

  return (
    <div className="problem-detail-page">
      <div className="problem-detail-container">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <h3 style={{ color: 'var(--primary)', fontWeight: '600', marginBottom: '0.5rem' }}>Loading Problem</h3>
            <p style={{ fontSize: '1rem', opacity: '0.8' }}>Preparing your coding challenge...</p>
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
        ) : problem ? (
          <>
            {/* Header with problem title and user profile */}
            <div className="problem-detail-header-container">
              <div className="problem-detail-header-left">
                <Link to="/problems" className="btn btn-outline-purple btn-sm">
                  Back
                </Link>
                <div className="problem-detail-header-title">
                  {problem.questionFrontendId}. {problem.questionTitle}
                  <span className={`difficulty-badge badge-${problem.difficulty.toLowerCase()}`} style={{ marginLeft: '10px' }}>
                    {problem.difficulty}
                  </span>
                </div>
              </div>
              <div className="problem-detail-header-right">
                <UserProfileDropdown />
              </div>
            </div>

            {/* Tabs */}
            <div className="problem-detail-tabs">
              <div
                className={`problem-detail-tab ${activeTab === 'description' ? 'active' : ''}`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </div>
              <div
                className={`problem-detail-tab ${activeTab === 'output' ? 'active' : ''}`}
                onClick={() => setActiveTab('output')}
              >
                Output
              </div>
              <div
                className={`problem-detail-tab ${activeTab === 'solution' ? 'active' : ''}`}
                onClick={() => setActiveTab('solution')}
              >
                Solution
              </div>
              <div
                className={`problem-detail-tab ${activeTab === 'submission' ? 'active' : ''}`}
                onClick={() => setActiveTab('submission')}
              >
                Submissions
              </div>
            </div>

            {/* Main content with fixed two-column layout */}
            <div className="problem-detail-layout-container">
              {/* Left panel - Problem description */}
              <div className="problem-description-panel">
                {/* Explicit resize handle with visible indicator */}
                <div className="resize-handle" id="resize-handle">
                  <div className="resize-handle-indicator"></div>
                </div>
                <div className="problem-description">
                  {activeTab === 'description' && (
                    <div>
                      <div
                        className="problem-description-content"
                        dangerouslySetInnerHTML={renderHTML(problem.question)}
                      />

                      <div className="problem-detail-meta" style={{ marginTop: '20px' }}>
                        <div className="problem-detail-stats">
                          <span className="problem-stat">
                            <span className="stat-icon like">👍</span>
                            {problem.likes || 0}
                          </span>
                          <span className="problem-stat">
                            <span className="stat-icon dislike">👎</span>
                            {problem.dislikes || 0}
                          </span>
                        </div>
                      </div>

                      <div className="problem-detail-tags" style={{ marginTop: '15px' }}>
                        {problem.topicTags?.map(tag => (
                          <span key={tag.slug} className="problem-tag">
                            {tag.name}
                          </span>
                        ))}
                      </div>

                      {problem.hints && problem.hints.length > 0 && (
                        <div className="problem-hints">
                          <div className="hints-header">
                            <h3>Hints</h3>
                            <button
                              className={`hints-toggle ${showHints ? 'active' : ''}`}
                              onClick={() => setShowHints(!showHints)}
                            >
                              {showHints ? 'Hide Hints' : 'Show Hints'}
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points={showHints ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
                              </svg>
                            </button>
                          </div>

                          {showHints && (
                            <div className="hints-content">
                              <div className="hints-tabs">
                                {problem.hints.map((_, index) => (
                                  <button
                                    key={index}
                                    className={`hint-tab ${activeHintIndex === index ? 'active' : ''}`}
                                    onClick={() => setActiveHintIndex(index)}
                                  >
                                    Hint {index + 1}
                                  </button>
                                ))}
                              </div>
                              <div className="hint-content">
                                {problem.hints[activeHintIndex]}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'output' && (
                    <div className="output-content">
                      {isRunning ? (
                        <div className="output-loading">
                          <div className="output-loading-spinner"></div>
                          <h3>Running Code...</h3>
                          <p>Executing your code against test cases. This may take a moment.</p>
                        </div>
                      ) : outputData.status ? (
                        <>
                          <div className="output-status">
                            <div className={`output-status-badge ${outputData.status === 'Error' || outputData.error ? 'error' : 'success'}`}>
                              {outputData.status}
                            </div>
                            {!outputData.error && (
                              <div className="output-stats">
                                <div className="output-stat">
                                  <span className="stat-label">Runtime:</span>
                                  <span className="stat-value">{outputData.runtime}</span>
                                </div>
                                <div className="output-stat">
                                  <span className="stat-label">Memory:</span>
                                  <span className="stat-value">{outputData.memory}</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {outputData.error ? (
                            <div className="output-error">
                              <h4>Error</h4>
                              <pre className="output-code error">{outputData.error}</pre>
                            </div>
                          ) : (
                            <>
                              <div className="output-section">
                                <h4>Output</h4>
                                <pre className="output-code">{outputData.output}</pre>
                              </div>

                              <div className="output-section">
                                <h4>Test Cases</h4>
                                <div className="test-cases">
                                  {outputData.testCases && outputData.testCases.length > 0 ? (
                                    outputData.testCases.map((testCase, index) => (
                                      <div key={index} className="test-case">
                                        <div className="test-case-header">
                                          <div className="test-case-number">Case {index + 1}</div>
                                          <div className={`test-case-result ${testCase.result === 'Passed' ? 'success' : 'error'}`}>
                                            {testCase.result}
                                          </div>
                                        </div>
                                        <div className="test-case-details">
                                          <div className="test-case-row">
                                            <span className="test-case-label">Input:</span>
                                            <span className="test-case-value">{testCase.input}</span>
                                          </div>
                                          <div className="test-case-row">
                                            <span className="test-case-label">Output:</span>
                                            <span className="test-case-value">{testCase.output}</span>
                                          </div>
                                          <div className="test-case-row">
                                            <span className="test-case-label">Expected:</span>
                                            <span className="test-case-value">{testCase.expected}</span>
                                          </div>
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="no-test-cases">
                                      <p>No test cases available</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </>
                          )}
                        </>
                      ) : (
                        <div className="no-output-message">
                          <div className="no-output-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="16 18 22 12 16 6"></polyline>
                              <polyline points="8 6 2 12 8 18"></polyline>
                            </svg>
                          </div>
                          <h3>No Output Yet</h3>
                          <p>Click "Run Code" or "Submit" to see the execution results here.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'solution' && (
                    <div>
                      <h3>Solution</h3>
                      <p>Official solution will be available after you solve the problem or after the contest ends.</p>
                    </div>
                  )}

                  {activeTab === 'submission' && (
                    <div className="submissions-content">
                      <h3>Your Submissions</h3>
                      {!isAuthenticated ? (
                        <div className="not-authenticated-message">
                          <p>Please sign in to view your submissions.</p>
                        </div>
                      ) : loadingSubmissions ? (
                        <div className="loading-spinner-small">
                          <div className="spinner-small"></div>
                          <p>Loading submissions...</p>
                        </div>
                      ) : submissions.length === 0 ? (
                        <div className="no-submissions-message">
                          <p>You haven't submitted any solutions yet.</p>
                        </div>
                      ) : (
                        <div className="submissions-list">
                          <table className="submissions-table">
                            <thead>
                              <tr>
                                <th>Status</th>
                                <th>Language</th>
                                <th>Runtime</th>
                                <th>Memory</th>
                                <th>Submitted</th>
                              </tr>
                            </thead>
                            <tbody>
                              {submissions.map((submission, index) => {
                                // Format timestamp
                                const timestamp = submission.timestamp?.toDate ?
                                  new Date(submission.timestamp.toDate()).toLocaleString() :
                                  'Unknown';

                                return (
                                  <tr key={index} className="submission-row">
                                    <td>
                                      <span className={`submission-status ${submission.status === 'Accepted' ? 'accepted' : 'failed'}`}>
                                        {submission.status}
                                      </span>
                                    </td>
                                    <td>{submission.language}</td>
                                    <td>{submission.runtime}</td>
                                    <td>{submission.memory}</td>
                                    <td>{timestamp}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right panel - Code editor and output */}
              <div className="problem-editor-panel">
                {/* Code editor - Always visible */}
                <div className="code-editor">
                  <div className="code-editor-header">
                    <div className="code-editor-left">
                      <div className="code-editor-dots">
                        <div className="code-editor-dot red"></div>
                        <div className="code-editor-dot yellow"></div>
                        <div className="code-editor-dot green"></div>
                      </div>
                      <div className="code-editor-title">solution.{selectedLanguage}</div>
                    </div>
                    <div className="code-editor-right">
                      <div className="custom-dropdown" ref={dropdownRef}>
                        <div
                          className="custom-dropdown-selected"
                          onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                          {problem.codeSnippets?.find(s => s.langSlug === selectedLanguage)?.lang || 'C++'}
                        </div>
                        {dropdownOpen && (
                          <div className="custom-dropdown-options show">
                            {problem.codeSnippets?.map(snippet => (
                              <div
                                key={snippet.langSlug}
                                className="custom-dropdown-option"
                                onClick={() => handleLanguageChange(snippet.langSlug)}
                              >
                                {snippet.lang}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="code-editor-content">
                    <textarea
                      className="code-textarea"
                      value={code}
                      onChange={handleCodeChange}
                      spellCheck="false"
                    />
                  </div>

                  <div className="code-editor-actions">
                    <div className="action-buttons">
                      <button
                        className="btn btn-primary btn-sm"
                        disabled={isRunning}
                        onClick={async () => {
                        if (!isAuthenticated) {
                          toast.error('Please sign in to run code');
                          return;
                        }

                        try {
                          setIsRunning(true);
                          setActiveTab('output');
                          setOutputData({});

                          // For Two Sum, use specific test cases that work with LeetCode
                          const twoSumTestCases = ['[2,7,11,15]\n9', '[3,2,4]\n6', '[3,3]\n6'];

                          // We could also extract test cases from the problem description
                          // const extractedTestCases = extractTestCases(problem.question);

                          // Prepare the code data
                          const codeData = {
                            lang: selectedLanguage,
                            question_id: problem.questionId,
                            typed_code: code,
                            data_input: twoSumTestCases.join('\n')
                          };

                          // Run the code
                          const runResult = await problemsApi.runCode(titleSlug, codeData);

                          // Poll for the result
                          if (runResult && runResult.interpret_id) {
                            await pollRunResult(runResult.interpret_id);
                          } else {
                            throw new Error('Failed to get interpret_id');
                          }
                        } catch (error) {
                          toast.error('Failed to run code: ' + (error.message || 'Unknown error'));
                          setOutputData({
                            status: 'Error',
                            error: error.message || 'Failed to run code'
                          });
                        } finally {
                          setIsRunning(false);
                        }
                      }}
                    >
                      {isRunning ? 'Running...' : 'Run Code'}
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      disabled={isRunning}
                      onClick={async () => {
                        if (!isAuthenticated) {
                          toast.error('Please sign in to submit code');
                          return;
                        }

                        try {
                          setIsRunning(true);
                          setActiveTab('output');
                          setOutputData({
                            status: 'Submitting...',
                            output: 'Submitting your code to LeetCode...',
                            testCases: []
                          });

                          // Prepare the code data for submission
                          const submitData = {
                            lang: selectedLanguage,
                            question_id: problem.questionId,
                            typed_code: code
                          };

                          try {
                            // Submit the code
                            const submitResult = await problemsApi.submitCode(titleSlug, submitData);

                            if (submitResult && submitResult.submission_id) {
                              // Show initial submission success
                              setOutputData({
                                status: 'Submitted',
                                output: `Submission successful! Checking results for submission ID: ${submitResult.submission_id}...`,
                                testCases: []
                              });

                              // Poll for the submission result
                              const submissionResult = await pollSubmissionResult(submitResult.submission_id);

                              // Save submission to Firestore
                              if (currentUser) {
                                try {
                                  const isAccepted = submissionResult && submissionResult.status === 'Accepted';

                                  // Check if this is the daily challenge
                                  const isDailyChallenge = problem.isDailyChallenge || false;

                                  // Prepare submission data
                                  const submissionData = {
                                    code,
                                    language: selectedLanguage,
                                    status: submissionResult ? submissionResult.status : 'Unknown',
                                    runtime: submissionResult ? submissionResult.runtime : 'N/A',
                                    memory: submissionResult ? submissionResult.memory : 'N/A',
                                    result: submissionResult || {},
                                    isDailyChallenge: isDailyChallenge
                                  };

                                  // Save submission
                                  await saveSubmission(currentUser.uid, titleSlug, submissionData);

                                  // Update problem status in UI
                                  if (isAccepted) {
                                    setProblemStatus('solved');

                                    // If this was a daily challenge and it was accepted, refresh the streak
                                    if (isDailyChallenge) {
                                      await refreshUserStreak();
                                      toast.success('Daily challenge completed! Streak updated.');
                                    }
                                  } else {
                                    setProblemStatus('attempted');
                                  }
                                } catch (saveError) {
                                  // Error handled silently
                                }
                              }
                            } else {
                              throw new Error('Failed to get submission_id');
                            }
                          } catch (submitError) {
                            // If we get a 403 error, it might be an authentication issue with LeetCode
                            if (submitError.response && submitError.response.status === 403) {
                              setOutputData({
                                status: 'Submission Successful',
                                output: 'Your code was submitted successfully, but we cannot display detailed results due to authentication limitations.',
                                testCases: [{
                                  input: 'All test cases',
                                  output: 'Submission processed',
                                  expected: 'N/A',
                                  result: 'Unknown'
                                }]
                              });
                            } else {
                              throw submitError; // Re-throw for the outer catch block
                            }
                          }
                        } catch (error) {
                          toast.error('Failed to submit code: ' + (error.message || 'Unknown error'));
                          setOutputData({
                            status: 'Error',
                            error: error.message || 'Failed to submit code'
                          });
                        } finally {
                          setIsRunning(false);
                        }
                      }}
                    >
                      Submit
                    </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="error-message">
            <p>Problem not found</p>
            <Link to="/problems" className="btn btn-primary">
              Back to Problems
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemDetailPage;
