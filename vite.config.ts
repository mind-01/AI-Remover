import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(async () => {
  const upscalerPath = await import.meta.resolve('upscaler')
  const esrganPath = await import.meta.resolve('@upscalerjs/esrgan-slim')

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        'upscaler': fileURLToPath(upscalerPath),
        '@upscalerjs/esrgan-slim': fileURLToPath(esrganPath)
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
  }
})