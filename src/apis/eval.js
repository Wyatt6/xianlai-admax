//axios 配置详见：https://www.axios-http.cn/docs/req_config
import axios from 'axios'
import { useOptionStore } from '@/options'
import { notEmpty, hasText } from '@/utils/common'

function createAxiosInstance() {
  const Options = useOptionStore()

  /**
   * 创建axios对象实例
   *
   * baseURL: 自动添加的请求url前缀
   * headers: 请求头信息
   * timeout: 请求超时时间，单位毫秒
   */
  const instance = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    timeout: Options.data.request.timeout
    // ...其他配置使用axios的默认值
  })

  return instance
}

// TODO 请求/响应拦截器

export function evalApis(request, result) {
  request.value = {}
  const axiosInstance = createAxiosInstance()

  for (var i = 0; i < result.length; i++) {
    const { callPath, requestMethod, url, description } = result[i]
    const paths = callPath.split('.')
    var now = request.value
    for (var j = 0; j < paths.length; j++) {
      now[paths[j]] = {}
      if (j == paths.length - 1) {
        now[paths[j]] = (requestParams, requestData) => {
          const config = { method: requestMethod, url: url }
          if (hasText(description)) config.desc = description
          if (notEmpty(requestParams)) config.params = requestParams
          if (notEmpty(requestData)) config.data = requestData
          return axiosInstance(config)
        }
      }
      now = now[paths[j]]
    }
  }
}
