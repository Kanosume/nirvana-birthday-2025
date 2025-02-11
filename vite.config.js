import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// Load environment-specific configurations
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
      },
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: isProduction 
            ? 'https://nirvana-vtuber-birthday.pages.dev'  // Production Workers URL
            : 'http://127.0.0.1:8787',                     // Local development URL
          changeOrigin: true,
          secure: isProduction,
          rewrite: (path) => path,
          configure: (proxy, options) => {
            // Add any additional proxy configurations if needed
          }
        }
      }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['vue', 'vue-router', 'axios'],
          }
        }
      }
    },
    optimizeDeps: {
      include: ['date-fns', 'axios', 'vue-router']
    },
    // Environment variables
    define: {
      'process.env': {
        MODE: mode,
        API_URL: isProduction 
          ? JSON.stringify('https://nirvana-vtuber-birthday.pages.dev')
          : JSON.stringify('http://127.0.0.1:8787')
      }
    }
  };
});
