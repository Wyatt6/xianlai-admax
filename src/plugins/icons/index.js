import * as ElementPlusIconsVue from '@element-plus/icons-vue'

export default async app => {
  // 1. 全局注册ElementPlus提供的图标组件

  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

  // 2. 导入本地图标目录下所有svg文件的路径信息，并以KV类型保存svg代码
  // 详见: https://vitejs.dev/guide/features#glob-import
  app.config.globalProperties.$localIcons = []
  const icons = import.meta.glob('@/assets/icons/*.svg')
  for (const path in icons) {
    const name = path.slice(path.lastIndexOf('/') + 1, path.length - 4)
    const svgCode = (await icons[path]()).default
    app.config.globalProperties.$localIcons[name] = svgCode
  }
}
