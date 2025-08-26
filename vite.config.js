import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// vite配置: https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // 解决抛出警告“Deprecation Warning: The legacy JS API is deprecated and will be removed in Dart Sass 2.0.0.”
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      }
    }
  },
  // 代理访问后端系统（开发测试用，build前需要删除或注释）
  server: {
    proxy: {
      '/api/admax': {
        target: 'http://localhost:8080/',
        changeOrigin: true
      }
    }
  }
})
