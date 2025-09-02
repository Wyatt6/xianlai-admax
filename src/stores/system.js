import { defineStore } from 'pinia'
import { useOptionStore } from '@/options'

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

    // TODO 异步获取额外路由数据
    // TODO 异步获取额外接口数据

    app.mount('#app')
  }

  return {
    initialize
  }
})
