import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

export const useSystemStore = defineStore('system', () => {
  const gettingSystemOptions = ref(false)
  const systemOptions = ref(null)
  const systemOptionsChecksum = ref(null)

  async function initialize() {
    if (!gettingSystemOptions.value) {
      gettingSystemOptions.value = true
      await axios
        .get('/api/admax/system/system-option/getSystemOptions', {
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
