import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { evalOptions } from './eval'

export const useOptionStore = defineStore('option', () => {
  const getting = ref(false)
  const data = ref({})
  const checksum = ref(null)

  async function getOptions() {
    if (!getting.value) {
      getting.value = true
      // const initSubTitle = document.getElementById('initSubTitle')
      // if (initSubTitle != null) initSubTitle.innerHTML = '[ 加载系统参数 ]'
      await axios
        .get('/api/admax/system/option/getOptions', {
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          timeout: 60000
        })
        .then(response => {
          const result = response.data
          if (result.success) {
            evalOptions(data, result.data.options)
            checksum.value = result.data.optionsChecksum
          }
        })
        .catch(error => {
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
