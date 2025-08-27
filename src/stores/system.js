import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

export const useSystemStore = defineStore('system', () => {
  const gettingApis = ref(false)
  const apis = ref(null)
  const apisChecksum = ref(null)

  async function getApis() {
    if (!gettingApis.value) {
      gettingApis.value = true
      document.getElementById('loadingSubTitle').innerHTML = '[ 加载系统接口 ]'
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
            // TODO 封装系统接口对象
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

  const gettingOptions = ref(false)
  const options = ref(null)
  const optionsChecksum = ref(null)

  async function getOptions() {
    if (!gettingOptions.value) {
      gettingOptions.value = true
      document.getElementById('loadingSubTitle').innerHTML = '[ 加载系统参数 ]'
      await axios
        .get('/api/admax/system/option/getOptions', {
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          timeout: 60000
        })
        .then(reponse => {
          const result = reponse.data
          if (result.success) {
            options.value = result.data.options
            optionsChecksum.value = result.data.optionsChecksum
          } else {
            ElMessage.error('无法加载系统参数，请稍后再试')
          }
        })
        .catch(error => {
          ElMessage.error('无法加载系统参数，请稍后再试')
          console.error(error)
        })
        .finally(() => {
          gettingOptions.value = false
        })
    }
  }

  async function initialize() {
    await getApis()
    if (apis.value == null) {
      return
    }

    await getOptions()
    if (options.value == null) {
      return
    }
  }

  return {
    apis,
    apisChecksum,
    getApis,

    options,
    optionsChecksum,
    getOptions,

    initialize
  }
})
