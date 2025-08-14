import { defineStore } from 'pinia'
import Storage from '@/utils/storage'
import Logger from '@/utils/logger'

export const useAppStore = defineStore('app', () => {
  const logoutLock = ref(false)

  /**
   * 退出登陆锁处理
   */
  function setLogoutLock() {
    logoutLock.value = true
  }
  function releaseLogoutLock() {
    logoutLock.value = false
  }

  function $reset() {
    Logger.log('appStore.$reset()')
  }

  /**
   * 前端应用初始化
   */
  async function init() {
    Logger.log('初始化前端应用状态值')
    $reset()
    Logger.log('清理浏览器无用的缓存值')
    const username = Storage.get('remember_username')
    Storage.clear()
    if (username != null) {
      Storage.set('remember_username', username)
    }
  }

  return {
    logoutLock,
    setLogoutLock,
    releaseLogoutLock,
    init
  }
})
