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
            ElMessage.error('无法获取系统接口，请稍后再试')
            // TODO 跳转到错误页面
          }
        })
        .catch(error => {
          ElMessage.error('无法获取系统接口，请稍后再试')
          // TODO 跳转到错误页面
          console.error(error)
        })
        .finally(() => {
          gettingApis.value = false
        })
    }
  }

  const gettingSystemOptions = ref(false)
  const systemOptions = ref(null)
  const systemOptionsChecksum = ref(null)

  async function initialize() {
    await getApis()

    if (!gettingSystemOptions.value) {
      gettingSystemOptions.value = true
      await axios
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          timeout: 60000
        })
        .then(reponse => {
          const result = reponse.data
          if (result.success) {
            systemOptions.value = result.data.systemOptions
            systemOptionsChecksum.value = result.data.systemOptionsChecksum
          } else {
            ElMessage.error('初始化失败，请稍后再试')
          }
        })
        .catch(error => {
          ElMessage.error('初始化失败')
          console.error(error)
        })
        .finally(() => {
          gettingSystemOptions.value = false
        })
    }
  }

  return {
    systemOptions,
    systemOptionsChecksum,
    initialize
  }
})
