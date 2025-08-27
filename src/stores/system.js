import { defineStore } from 'pinia'
import { useOptionStore } from '@/options'
import { useApiStore } from '@/apis'

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

    const Apis = useApiStore()
    await Apis.getApis()
    if (Apis.checksum == null) {
      initFail()
      return
    }

    app.mount('#app')
  }

  return {
    initialize
  }
})
