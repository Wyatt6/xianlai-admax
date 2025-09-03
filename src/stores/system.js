import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { notEmpty, hasText } from '@/utils/common'
import { useOptionStore } from './option'

export const useSystemStore = defineStore('system', () => {
  const initing = ref(false)
  const data = ref({})
  const checksum = ref({})

  function initFail() {
    document.getElementById('init').style.display = 'none'
    document.getElementById('initFail').style.display = 'flex'
  }

  async function initialize(app) {
    if (!initing.value) {
      initing.value = true
      await axios
        .get('/api/admax/system/init/getInitData', {
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          timeout: 60000
        })
        .then(async response => {
          const result = response.data
          if (result.success) {
            data.value = result.data
            checksum.value = result.checksum
            if (notEmpty(checksum.value) && notEmpty(data.value)) {
              if (hasText(checksum.value.options) && notEmpty(data.value.options)) {
                await useOptionStore().evalData(checksum.value.options, data.value.options)
              }
            }
          } else {
            initFail()
            console.log('获取初始数据失败')
          }
        })
        .catch(error => {
          initFail()
          console.error(error)
        })
        .finally(() => {
          initing.value = false
        })
    }

    app.mount('#app')
  }

  async function resetStoreAndStorage() {}

  return {
    data,
    checksum,
    initialize,
    resetStoreAndStorage
  }
})
