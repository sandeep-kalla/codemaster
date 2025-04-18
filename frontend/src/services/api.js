import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true, // Include cookies in requests
});

// API functions for problems
export const problemsApi = {
  // Get all problems with pagination and filtering
  getProblems: async (params = {}) => {
    try {
      const {
        page = 1,
        pageSize = 50,
        difficulty = null,
        search = null,
        category = 'all-code-essentials'
      } = params;

      // Build query parameters
      const queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('page_size', pageSize);
      queryParams.append('category', category);

      if (difficulty) {
        queryParams.append('difficulty', difficulty);
      }

      if (search) {
        queryParams.append('search', search);
      }

      const response = await api.get(`/questions?${queryParams.toString()}`);

      // Ensure we have a valid response structure
      if (!response.data || !Array.isArray(response.data.questions)) {
        console.error('Invalid response structure:', response.data);
        return {
          questions: [],
          total: 0,
          page: page,
          pageSize: pageSize
        };
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching problems:', error);
      throw error;
    }
  },

  // Get problem details by title slug
  getProblemBySlug: async (titleSlug) => {
    try {
      const response = await api.get(`/problems/${titleSlug}`);

      // Ensure we have a valid response structure
      if (!response.data || !response.data.questionTitle) {
        console.error('Invalid problem response structure:', response.data);
        throw new Error('Invalid problem data structure');
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching problem ${titleSlug}:`, error);
      throw error;
    }
  },

  // Get daily challenge
  getDailyChallenge: async () => {
    try {
      const response = await api.get('/daily');
      return response.data;
    } catch (error) {
      console.error('Error fetching daily challenge:', error);
      throw error;
    }
  },

  // Run code for a problem
  runCode: async (titleSlug, codeData) => {
    try {
      const response = await api.post(`/run-code/${titleSlug}`, codeData, {
        withCredentials: true // Include cookies
      });
      return response.data;
    } catch (error) {
      console.error(`Error running code for problem ${titleSlug}:`, error);
      throw error;
    }
  },

  // Check run code result
  checkRunResult: async (interpretId) => {
    try {
      const response = await api.get(`/run-code/check/${interpretId}`, {
        withCredentials: true // Include cookies
      });
      return response.data;
    } catch (error) {
      console.error(`Error checking run result for ${interpretId}:`, error);
      throw error;
    }
  },

  // Submit code for a problem
  submitCode: async (titleSlug, codeData) => {
    try {
      const response = await api.post(`/submit/${titleSlug}`, codeData, {
        withCredentials: true // Include cookies
      });
      return response.data;
    } catch (error) {
      console.error(`Error submitting code for problem ${titleSlug}:`, error);
      throw error;
    }
  },

  // Check submission result
  checkSubmission: async (submissionId) => {
    try {
      const response = await api.get(`/submissions/${submissionId}/check`, {
        withCredentials: true // Include cookies
      });
      return response.data;
    } catch (error) {
      console.error(`Error checking submission result for ${submissionId}:`, error);
      throw error;
    }
  }
};

export default api;
