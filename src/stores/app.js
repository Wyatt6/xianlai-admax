import { defineStore } from 'pinia'
import { ref } from 'vue'
import AppConst from '@/constants/app_const'
import Storage from '@/utils/storage'
import { useLayoutStore } from './layout'

export const useAppStore = defineStore('app', () => {
  const user = ref(Storage.get(AppConst.USER) == null ? {} : Storage.get(AppConst.USER))
  const loggingOut = ref(false)
  // 用户授权相关
  const hasAuthorizations = ref(!(Storage.get(AppConst.AUTHORIZATIONS) == null))
  const gettingAuthorizations = ref(false)
  const authorizations = ref(Storage.get(AppConst.AUTHORIZATIONS) == null ? {} : Storage.get(AppConst.AUTHORIZATIONS))
  // 用户信息相关
  const hasProfile = ref(Storage.get(AppConst.PROFILE) == null)
  const gettingProfile = ref(false)
  const profile = ref(Storage.get(AppConst.PROFILE) == null ? {} : Storage.get(AppConst.PROFILE))

  // 设置user值
  function setUser(value) {
    user.value = value
  }
  // 设置loggingOut值
  function setLoggingOut(value) {
    loggingOut.value = value
  }
  function setLogoutLock() {
    loggingOut.value = true
  }
  function releaseLogoutLock() {
    loggingOut.value = false
  }
  // 设置hasAuthorizations值
  function setHasAuthorizations(value) {
    hasAuthorizations.value = value
  }
  // 设置gettingAuthorizations值
  function setGettingAuthorizations(value) {
    gettingAuthorizations.value = value
  }
  // 存储授权数据
  function setAuthorizations(authorizations) {
    authorizations.value = authorizations
  }
  // 设置hasProfile值
  function setHasProfile(value) {
    hasProfile.value = value
  }
  // 设置gettingProfile值
  function setGettingProfile(value) {
    gettingProfile.value = value
  }
  // 存储个人信息
  function setProfile(value) {
    profile.value = value
  }
  // 初始化state状态
  function initState() {
    user.value = {}

    hasAuthorizations.value = false
    gettingAuthorizations.value = false
    authorizations.value = {}

    hasProfile.value = false
    gettingProfile.value = false
    profile.value = {}
  }

  /**
   * 初始化前端系统状态
   */
  async function initApp() {
    console.groupCollapsed('initApp: 初始化前端系统状态')

    console.log('清理state状态')
    initState()
    useLayoutStore().initState()

    console.log('清理浏览器缓存')
    const username = Storage.get(AppConst.USERNAME)
    const phone = Storage.get(AppConst.PHONE)
    const email = Storage.get(AppConst.EMAIL)
    Storage.clear()
    if (username != null) Storage.set(AppConst.USERNAME, username)
    if (phone != null) Storage.set(AppConst.PHONE, phone)
    if (email != null) Storage.set(AppConst.EMAIL, email)

    console.groupEnd()
  }

  return {
    user,
    loggingOut,
    hasAuthorizations,
    gettingAuthorizations,
    authorizations,
    hasProfile,
    gettingProfile,
    profile,
    setUser,
    setLoggingOut,
    setLogoutLock,
    releaseLogoutLock,
    setHasAuthorizations,
    setGettingAuthorizations,
    setAuthorizations,
    setHasProfile,
    setGettingProfile,
    setProfile,
    initApp
  }
})
