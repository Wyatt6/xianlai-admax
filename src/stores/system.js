import { defineStore } from 'pinia'
import { useOptionStore } from '@/options'
import { useApiStore } from '@/apis'
import { useRouteStore } from '@/router'

export const useSystemStore = defineStore('system', () => {
  function initFail() {
    document.getElementById('init').style.display = 'none'
    document.getElementById('initFail').style.display = 'flex'
  }

  async function initialize(app) {
    const Options = useOptionStore()
    await Options.getOptions()
    if (Options.checksum == null) {
      initFail()
      return
    }

    // 异步获取路由数据
    const Routes = useRouteStore()
    Routes.getRoutes()

    // 异步获取接口数据
    const Apis = useApiStore()
    Apis.getApis()

    app.mount('#app')
  }

  return {
    initialize
  }
})
