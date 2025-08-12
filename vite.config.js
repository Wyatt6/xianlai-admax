import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// vite配置: https://vite.dev/config/
// vite-plugin-svg-icons插件配置: https://github.com/vbenjs/vite-plugin-svg-icons/blob/main/README.zh_CN.md
export default defineConfig({
  plugins: [
    vue()
    // createSvgIconsPlugin({
    //   // 指定需要缓存的图标文件夹
    //   iconDirs: [path.resolve(process.cwd(), 'src/icons')],
    //   // 指定symbolId格式
    //   symbolId: 'icon-[dir]-[name]',
    //   /**
    //    * 自定义插入位置
    //    * @default: body-last
    //    */
    //   inject: 'body-last' | 'body-first',
    //   /**
    //    * custom dom id
    //    * @default: __svg__icons__dom__
    //    */
    //   customDomId: '__svg__icons__dom__'
    // })
  ],
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
