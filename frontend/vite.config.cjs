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
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['react-split-pane', 'recharts'],
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
    include: ['react-hot-toast', 'firebase', 'axios', 'prismjs', 'react-split-pane', 'recharts'],
  },
  server: {
    port: 5173,
    strictPort: false,
    open: true
  }
};
