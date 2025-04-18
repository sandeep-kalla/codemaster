import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@vite/tailwindcss'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

// Get the current directory
const __dirname = fileURLToPath(new URL('.', import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
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
          ui: ['react-hot-toast', 'react-split-pane', 'recharts'],
        },
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
})
