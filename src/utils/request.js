// 自定义封装axios后的请求服务

import { ElMessage } from 'element-plus'
import axios from 'axios'
import RouteConst from '@/constants/route_const'
import Token from './token'
import Logger from './logger'
import router from '@/router'
import { useAppStore } from '@/stores/app'

/**
 * 自定义请求服务（axios自定义实例）
 * 配置项见：https://www.axios-http.cn/docs/req_config
 */
const service = axios.create({
  // 默认请求方法
  method: 'GET',
  // 基础url前缀
  baseURL: '/api',
  // 请求头信息
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  },
  // 返回数据类型
  responseType: 'json',
  // 超时时间，单位：ms
  timeout: 30000
})

/**
 * axios实例的请求拦截器
 */
service.interceptors.request.use(
  async config => {
    const appStore = useAppStore()
    if (Token.hasToken()) {
      // 登录已过期，清除缓存并重定向到登录页面
      if (Token.isExpired()) {
        await appStore.init()
        router.push(RouteConst.LOGIN)
        return Promise.reject(new Error('登录已过期，请重新登录'))
      }
      config.headers.token = `${Token.getToken()}` // Sa-Token框架要求在报文头中注入token
    }
    Logger.reqLog(config)
    return config // 必须返回config对象
  },
  error => {
    Logger.reqErr(error)
    ElMessage.error('请求发送失败')
  }
)

/**
 * axios实例的响应拦截器
 */
service.interceptors.response.use(
  // ----- 1.网络请求成功时 -----
  async response => {
    const appStore = useAppStore()
    const config = response.config
    const res = response.data
    Logger.resLog(config, res)
    if (!res.success && res.data && res.data.code) {
      // 错误码处理
      // 401-未登录错误，清除缓存，重定向到登录页面
      if (res.data.code === 401) {
        appStore.setLoggingOut(true)
        await appStore.init()
        await router.push(RouteConst.LOGIN)
        appStore.setLoggingOut(false)
        return Promise.reject(new Error('登录已过期，请重新登录'))
      }
      // 其他错误
      if (res.data.code === 400 || res.data.code === 500) {
        if (res.message) {
          return Promise.reject(new Error(res.message))
        } else {
          return Promise.reject(new Error(res.data.code))
        }
      }
      return res // 由于业务处理有差异，成功/失败都交给对应逻辑单独处理
    } else {
      console.log('向调用方返回响应数据')
      return res // 由于业务处理有差异，成功/失败都交给对应逻辑单独处理
    }
  },
  // ----- 2.网络请求失败时（如500） -----
  async error => {
    const appStore = useAppStore()
    let mesg = '未知错误'
    if (error && error.response && error.response.status) {
      const status = error.response.status
      switch (status) {
        case 400:
          mesg = '请求参数错误'
          break
        case 401:
          mesg = '登录已过期，请重新登录'
          await appStore.init()
          router.push(RouteConst.LOGIN)
          break
        case 404:
          mesg = '无法访问'
          router.push(RouteConst.NOT_FOUND)
          break
        case 500:
          mesg = '服务器连接失败'
          router.push(RouteConst.NOT_CONNECT)
          break
        case 503:
          mesg = '服务不可用'
          break
      }
      Logger.resErr(error, mesg)
    }
    ElMessage.error(mesg)
    return Promise.reject(new Error('网络请求失败'))
    // 这里返回给调用方的then里，但是res为null
  }
)

export default service
