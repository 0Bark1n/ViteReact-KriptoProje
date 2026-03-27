import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  
  // SASS UYARILARINI SUSTURDUĞUMUZ YER
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['import'],
      },
    },
  },

  build: {
    chunkSizeWarningLimit: 800, 
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) return 'vendor-react';
          if (id.includes('node_modules/apexcharts') || id.includes('node_modules/react-apexcharts')) return 'vendor-charts';
          if (id.includes('node_modules')) return 'vendor';
        }
      }
    }
  }
});