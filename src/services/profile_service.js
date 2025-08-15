import { ElMessage } from 'element-plus'
import AppConst from '@/constants/app_const'
import { useAppStore } from '@/stores/app'
import Storage from '@/utils/storage'
import Apis from '@/apis'

/**
 * 获取用户个人信息
 */
const getProfile = async userId => {
  const appStore = useAppStore()
  console.groupCollapsed('getProfile: 获取用户个人信息')

  appStore.setGettingProfile(true)
  await Apis.content.profile
    .getProfile(userId)
    .then(res => {
      if (res && res.success) {
        console.log('成功获取用户个人信息')
        const { profile } = res.data
        Storage.set(AppConst.PROFILE, profile)
        appStore.setProfile(profile)
        appStore.setHasProfile(true)
      } else {
        if (res && res.message != null) {
          console.log('获取用户个人信息失败：', res.message)
          ElMessage.error(res.message)
        } else {
          console.log('获取用户个人信息失败')
          ElMessage.error('获取用户个人信息失败')
        }
      }
    })
    .catch(error => {
      console.log(error)
      ElMessage.error(error.message)
    })
  appStore.setGettingProfile(false)

  console.groupEnd()
}

export default {
  getProfile
}
