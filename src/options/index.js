import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { evalOptions } from './eval'
import { ElMessage } from 'element-plus'

export const useOptionStore = defineStore('option', () => {
  const getting = ref(false)
  const data = ref({})
  const checksum = ref(null)

  async function getOptions() {
    if (!getting.value) {
      getting.value = true
      document.getElementById('initSubTitle').innerHTML = '[ 加载系统参数 ]'
      await axios
        .get('/api/admax/system/option/getOptions', {
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          timeout: 60000
        })
        .then(reponse => {
          const result = reponse.data
          if (result.success) {
            evalOptions(data, result.data.options)
            checksum.value = result.data.optionsChecksum
          } else {
            ElMessage.error('无法加载系统参数，请稍后再试')
          }
        })
        .catch(error => {
          ElMessage.error('无法加载系统参数，请稍后再试')
          console.error(error)
        })
        .finally(() => {
          getting.value = false
        })
    }
  }

  return {
    data,
    checksum,
    getOptions
  }
})
