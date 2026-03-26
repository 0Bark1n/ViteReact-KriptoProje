import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Grafik kütüphanesini ana koddan ayırıyoruz. 
          // Sadece grafik sayfasına girilince yüklenecek.
          vendor_charts: ['react-apexcharts', 'apexcharts'],
          
          // React'in çekirdek dosyalarını ayrı paketliyoruz
          vendor_react: ['react', 'react-dom']
        }
      }
    }
  }
})