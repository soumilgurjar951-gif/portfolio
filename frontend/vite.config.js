import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dev: `npm run dev` proxies /api → Django on :8001
// (run `python manage.py runserver 127.0.0.1:8001` first —
// :8000 is taken by another project on this machine).
// Prod: point VITE_API_URL at your deployed Django (Render/Railway), e.g.
//   VITE_API_URL=https://soumil-portfolio.onrender.com npm run build
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://127.0.0.1:8001',
    },
  },
});
