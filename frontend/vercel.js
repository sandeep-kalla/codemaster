// This file is used by Vercel to configure the build
module.exports = {
  // Use the Vite framework
  framework: 'vite',
  
  // Build command
  buildCommand: 'npm run vercel-build',
  
  // Install command
  installCommand: 'npm install',
  
  // Output directory
  outputDirectory: 'dist',
  
  // Environment variables
  env: {
    VITE_API_BASE_URL: 'https://codemaster-api.vercel.app/api/leetcode'
  }
};
