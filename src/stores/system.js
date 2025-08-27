import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useOptionStore } from '@/options'
import axios from 'axios'
import { ElMessage } from 'element-plus'

export const useSystemStore = defineStore('system', () => {
  const gettingApis = ref(false)
  const apis = ref(null)
  const apisChecksum = ref(null)

  async function getApis() {
    if (!gettingApis.value) {
      gettingApis.value = true
      document.getElementById('initSubTitle').innerHTML = '[ 加载系统接口 ]'
      await axios
        .get('/api/admax/system/api/getApis', {
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          timeout: 60000
        })
        .then(response => {
          const result = response.data
          if (result.success) {
            apis.value = result.data.apis
            apisChecksum.value = result.data.apisChecksum
          } else {
            ElMessage.error('无法加载系统接口，请稍后再试')
          }
        })
        .catch(error => {
          ElMessage.error('无法记载系统接口，请稍后再试')
          console.error(error)
        })
        .finally(() => {
          gettingApis.value = false
        })
    }
  }

  function initFail() {
    document.getElementById('init').style.display = 'none'
    document.getElementById('initFail').style.display = 'flex'
  }

  async function initialize(app) {
    const Options = useOptionStore()
    await Options.getOptions()
    if (Options.data == null) {
      initFail()
      return
    }

    await getApis()
    if (apis.value == null) {
      initFail()
      return
    }

    app.mount('#app')
  }

  return {
    apis,
    apisChecksum,
    getApis,

    initialize
  }
})
