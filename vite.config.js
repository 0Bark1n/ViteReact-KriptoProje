import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// cssInjectedByJsPlugin'i sildik çünkü performansı düşürüyor.

export default defineConfig({
  plugins: [
    react()
  ],
  build: {
    minify: 'terser', // Daha önce yüklediğimiz terser ile en iyi sıkıştırmayı yapıyoruz
    rollupOptions: {
      output: {
        // Kütüphaneleri (React, FontAwesome vb.) ayrı bir dosyaya (vendor) bölüyoruz
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
    // CSS dosyalarını JS'den ayırıp paralel indirilmesini sağlar
    cssCodeSplit: true,
    // 2KB'den büyük görselleri JS içine gömme, ayrı dosya yap (JS boyutu şişmesin)
    assetsInlineLimit: 2048, 
  },
})