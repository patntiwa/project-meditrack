// vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // ▼▼▼ LA SECTION À AJOUTER / MODIFIER ▼▼▼
  server: {
    // Rend le serveur accessible depuis le réseau, pas seulement en localhost.
    // C'est souvent nécessaire avec Docker, WSL, ou si tu veux tester sur ton téléphone.
    host: true, 
    
    hmr: {
      // Force le client HMR à se connecter à 'localhost' sur le port du serveur Vite.
      host: 'localhost',
      // Tu peux aussi forcer le protocole, pour être certain.
      protocol: 'ws',
    },
  },
  // ▲▲▲ FIN DE LA SECTION ▲▲▲

  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});