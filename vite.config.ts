import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { defineConfig, type UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Helper to resolve package entry points resiliently
async function resolvePackage(packageName: string, relativeEntryPath: string): Promise<string> {
  try {
    // Try standard resolution first
    const resolved = await import.meta.resolve(packageName)
    return fileURLToPath(resolved)
  } catch (e) {
    // Fallback: manually construct path from cwd
    const cwd = process.cwd()
    const fallbackPath = path.resolve(cwd, 'node_modules', packageName, relativeEntryPath)
    if (fs.existsSync(fallbackPath)) {
      return fallbackPath
    }
    // Try looking in parent directory (workspace root)
    const workspacePath = path.resolve(cwd, '..', 'node_modules', packageName, relativeEntryPath)
    if (fs.existsSync(workspacePath)) {
      return workspacePath
    }
    console.warn(`Could not resolve ${packageName}, build might fail.`)
    return packageName // Return package name to let Vite try its own resolution
  }
}

export default defineConfig(async (): Promise<UserConfig> => {
  const upscalerPath = await resolvePackage('upscaler', 'dist/browser/esm/upscalerjs/src/browser/esm/index.js')
  const esrganPath = await resolvePackage('@upscalerjs/esrgan-slim', 'dist/esm/models/esrgan-slim/src/index.js')

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        'upscaler': upscalerPath,
        '@upscalerjs/esrgan-slim': esrganPath
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