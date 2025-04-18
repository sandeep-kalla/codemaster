// CommonJS version of the Vite configuration
const { resolve } = require('path');

module.exports = {
  plugins: [
    require('@vitejs/plugin-react')()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: false,
    minify: true,
    rollupOptions: {
      external: [],
      output: {
        manualChunks: function(id) {
          // Create a vendors chunk for node_modules
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('firebase')) {
              return 'vendor-firebase';
            }
            if (id.includes('recharts') || id.includes('d3')) {
              return 'vendor-charts';
            }
            return 'vendor';
          }
        },
      },
    },
  },
  css: {
    postcss: './postcss.config.cjs',
    preprocessorOptions: {
      scss: {
        additionalData: '',
      },
    },
  },
  optimizeDeps: {
    include: ['react-hot-toast', 'firebase', 'axios', 'prismjs', 'react-router-dom', 'react-split-pane', 'recharts'],
    exclude: ['tailwindcss'],
  },
  server: {
    port: 5173,
    strictPort: false,
    open: true
  }
};
