import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { notEmpty, hasText } from '@/utils/common'
import { useOptionStore } from './option'
import { useApiStore } from '@/apis'

export const useSystemStore = defineStore('system', () => {
  const initing = ref(false)
  const logoutLock = ref(false)

  function setLogoutLock() {
    logoutLock.value = true
  }

  function releaseLogoutLock() {
    logoutLock.value = false
  }

  function initFail() {
    document.getElementById('init').style.display = 'none'
    document.getElementById('initFail').style.display = 'flex'
  }

  async function initialize(app) {
    // 获取初始化数据
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
            if (notEmpty(result.checksum) && notEmpty(result.data)) {
              if (hasText(result.checksum.options) && notEmpty(result.data.options)) {
                await useOptionStore().evalData(result.checksum.options, result.data.options)
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

    // 加载接口对象
    useApiStore().evalData()

    app.mount('#app')
  }

  async function resetStoreAndStorage() {}

  return {
    setLogoutLock,
    releaseLogoutLock,
    initialize,
    resetStoreAndStorage
  }
})
