import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// vite配置: https://vite.dev/config/
// vite-plugin-svg-icons插件配置: https://github.com/vbenjs/vite-plugin-svg-icons/blob/main/README.zh_CN.md
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
  }
})
