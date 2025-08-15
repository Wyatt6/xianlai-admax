import { ElMessage } from 'element-plus'
import AppConst from '@/constants/app_const'
import { useAppStore } from '@/stores/app'
import Storage from '@/utils/storage'
import API from '@/api'

/**
 * 获取用户授权数据
 */
const getAuthorizations = async () => {
  const appStore = useAppStore()
  console.groupCollapsed('getAuthorizations: 获取用户授权数据')

  appStore.setGettingAuthorizations(true)
  await API.iam.user
    .getAuthorizations()
    .then(res => {
      if (res && res.success) {
        console.log('成功获取用户授权数据')
        const { authorizations } = res.data
        Storage.set(AppConst.AUTHORIZATIONS, authorizations)
        appStore.setAuthorizations(authorizations)
        appStore.setHasAuthorizations(true)
      } else {
        if (res && res.message != null) {
          console.log('获取用户授权数据失败：', res.message)
          ElMessage.error(res.message)
        } else {
          console.log('获取用户授权数据失败')
          ElMessage.error('获取用户授权数据失败')
        }
      }
    })
    .catch(error => {
      console.log(error)
      ElMessage.error(error.message)
    })
  appStore.setGettingAuthorizations(false)

  console.groupEnd()
}

/**
 * 刷新用户授权数据
 */
const updateAuthorizations = async () => {
  const appStore = useAppStore()
  console.groupCollapsed('updateAuthorizations: 刷新用户授权数据')
  let result = false

  appStore.setGettingAuthorizations(true)
  await API.iam.user
    .updateAuthorizations()
    .then(res => {
      if (res && res.success) {
        console.log('成功获取用户授权数据')
        const { authorizations } = res.data
        Storage.set(AppConst.AUTHORIZATIONS, authorizations)
        appStore.setAuthorizations(authorizations)
        appStore.setHasAuthorizations(true)
        result = true
      } else {
        if (res && res.message != null) {
          console.log('获取用户授权数据失败：', res.message)
        } else {
          console.log('获取用户授权数据失败')
        }
      }
    })
    .catch(error => {
      console.log(error)
      ElMessage.error(error.message)
    })
  appStore.setGettingAuthorizations(false)

  console.groupEnd()
  return result
}

export default {
  getAuthorizations,
  updateAuthorizations
}
