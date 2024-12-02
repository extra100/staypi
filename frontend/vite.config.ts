// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   base: '/',
//   plugins: [react()],
// })
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/', // Sesuaikan base path jika deploy ke subfolder
  plugins: [react()],
  build: {
    outDir: 'dist', // Output directory
    chunkSizeWarningLimit: 1000, // Sesuaikan jika ada peringatan ukuran file
  },
})
