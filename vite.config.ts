import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['lucide-react']
  },
  server: {
    port: 5000,
    host: true,
    strictPort: false,
    proxy: {
      '/api/analytics': {
        bypass(req, res, options) {
           if (req.method === 'POST') {
             res.statusCode = 200;
             res.setHeader('Content-Type', 'application/json');
             res.setHeader('Access-Control-Allow-Origin', '*');
             res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
             res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
             res.end(JSON.stringify({ success: true, message: 'Analytics data received' }));
             return false;
           }
           if (req.method === 'OPTIONS') {
             res.statusCode = 200;
             res.setHeader('Access-Control-Allow-Origin', '*');
             res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
             res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
             res.end();
             return false;
           }
         }
      }
    }
  }
});
