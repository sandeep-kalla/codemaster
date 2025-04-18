// This is a Vercel configuration file using CommonJS syntax
module.exports = {
  // Use the Vite framework
  framework: 'vite',
  
  // Build command
  buildCommand: 'npm run vercel-build:cjs',
  
  // Install command
  installCommand: 'npm install',
  
  // Output directory
  outputDirectory: 'dist',
  
  // Rewrites
  rewrites: [
    { source: '/api/:path*', destination: 'https://codemaster-api.vercel.app/api/:path*' },
    { source: '/(.*)', destination: '/index.html' }
  ],
  
  // Headers
  headers: [
    {
      source: '/assets/(.*)',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
      ]
    },
    {
      source: '/(.*)',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' }
      ]
    }
  ],
  
  // Environment variables
  env: {
    VITE_API_BASE_URL: 'https://codemaster-api.vercel.app/api/leetcode'
  },
  
  // Clean URLs
  cleanUrls: true,
  
  // Trailing slash
  trailingSlash: false
};
