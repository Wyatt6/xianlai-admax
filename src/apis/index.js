import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { evalApis } from './eval'

export const useApiStore = defineStore('api', () => {
  const getting = ref(false)
  const request = ref({})
  const checksum = ref(null)

  async function getApis() {
    if (!getting.value) {
      getting.value = true
      const initSubTitle = document.getElementById('initSubTitle')
      if (initSubTitle != null) initSubTitle.innerHTML = '[ 加载系统接口 ]'
      await axios
        .get('/api/admax/system/api/getApis', {
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          timeout: 60000
        })
        .then(response => {
          const result = response.data
          if (result.success) {
            evalApis(request, result.data.apis)
            checksum.value = result.data.apisChecksum
          } else {
            ElMessage.error('无法加载系统接口，请稍后再试')
          }
        })
        .catch(error => {
          ElMessage.error('无法加载系统接口，请稍后再试')
          console.error(error)
        })
        .finally(() => {
          getting.value = false
        })
    }
  }

  return {
    request,
    checksum,
    getApis
  }
})
