import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      'upscaler': path.resolve(__dirname, './node_modules/upscaler/dist/browser/esm/upscalerjs/src/browser/esm/index.js'),
      '@upscalerjs/esrgan-slim': path.resolve(__dirname, './node_modules/@upscalerjs/esrgan-slim/dist/esm/models/esrgan-slim/src/index.js')
    }
  },
  build: {
    minify: 'terser',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'framer-motion': ['framer-motion'],
          'ai-engine': ['@imgly/background-removal', 'onnxruntime-web']
        }
      }
    }

  }
})