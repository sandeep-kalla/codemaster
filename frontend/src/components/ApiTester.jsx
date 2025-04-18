import React, { useState } from 'react';
import { testApiConnection, testEndpoint } from '../utils/testApi';

const ApiTester = () => {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [endpoint, setEndpoint] = useState('/api/leetcode/questions?page=1&page_size=10');

  const runTest = async () => {
    setLoading(true);
    try {
      const result = await testApiConnection();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Test failed with an exception',
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const testCustomEndpoint = async () => {
    setLoading(true);
    try {
      const result = await testEndpoint(endpoint);
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Test failed with an exception',
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="api-tester">
      <h2>API Connection Tester</h2>
      <div className="test-controls">
        <button 
          onClick={runTest} 
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? 'Testing...' : 'Test API Connection'}
        </button>
        
        <div className="custom-endpoint-test">
          <input
            type="text"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            placeholder="Enter endpoint to test"
            className="form-control"
          />
          <button 
            onClick={testCustomEndpoint} 
            disabled={loading}
            className="btn btn-secondary"
          >
            Test Endpoint
          </button>
        </div>
      </div>

      {testResult && (
        <div className={`test-result ${testResult.success ? 'success' : 'error'}`}>
          <h3>{testResult.success ? 'Success' : 'Error'}</h3>
          <p>{testResult.message}</p>
          
          <div className="result-details">
            <pre>{JSON.stringify(testResult, null, 2)}</pre>
          </div>
        </div>
      )}

      <div className="api-info">
        <h3>API Information</h3>
        <p>Base URL: <code>https://codemaster-api.vercel.app</code></p>
        <p>Health Endpoint: <code>/health</code></p>
        <p>API Endpoint: <code>/api/leetcode/questions</code></p>
      </div>
    </div>
  );
};

export default ApiTester;
