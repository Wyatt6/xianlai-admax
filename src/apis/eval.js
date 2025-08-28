//axios 配置详见：https://www.axios-http.cn/docs/req_config
import axios from 'axios'
import { useOptionStore } from '@/options'
import { useApiStore } from '.'
import { notEmpty, hasText } from '@/utils/common'
import RequestLogger from './request_logger'
import Logger from '@/utils/logger'

function createAxiosInstance() {
  const Options = useOptionStore()
  const Apis = useApiStore()

  const instance = axios.create({
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    timeout: Options.data.request.timeout
    // ...其他配置使用axios的默认值
  })

  // 添加请求拦截器
  instance.interceptors.request.use(
    /**
     * 在发送请求之前做些什么
     */
    function (config) {
      // TODO 请求附加数据处理
      RequestLogger.send.info(config)
      return config
    },
    /**
     * 对请求错误做些什么
     */
    function (error) {
      RequestLogger.send.error(error, '网络错误')
      ElMessage.error('网络错误')
      return Promise.reject(error)
    }
  )

  // 添加响应拦截器
  instance.interceptors.response.use(
    /**
     * 2xx 范围内的状态码都会触发该函数
     * 仅代表了技术上成功返回（状态码2xx），但响应报文可能是业务成功处理，也可能是系统错误或者业务处理异常
     */
    function (response) {
      const config = response.config
      const result = response.data
      RequestLogger.receive.info(config, result)

      if (result.data && result.data.optionsChecksum) {
        if (Options.checksum == null || Options.checksum != result.data.optionsChecksum) {
          Logger.log('系统参数有变更，获取新数据')
          Options.getOptions()
        }
      }
      if (result.data && result.data.apisChecksum) {
        if (Apis.checksum == null || Apis.checksum != result.data.apisChecksum) {
          Logger.log('系统接口有变更，获取新数据')
          Apis.getApis()
        }
      }

      if (!result.success && result.data && result.data.code) {
        // 分支1: 后端返回有错误码时统一处理
        // TODO 处理后端通过错误码返回的401、403等错误
        // 对于以上集中错误处理以外未列出的情况，返回给调用方处理
        return result
      } else {
        // 分支2: 后端返回没有错误码时，不论业务成功与否（success=true/false）都返回给调用方处理
        Logger.log('向调用方返回响应结果')
        return result
      }
    },
    /**
     * 超出 2xx 范围的状态码都会触发该函数
     * 技术上返回失败，即并不是由后端应用系统返回的错误，而是没能发到服务器或服务器层次返回的标准网络错误，如：500-服务器连接失败
     * 对于这些标准化错误，在这里统一打印日志、显示提示信息，不需要调用方在catch块处理
     */
    function (error) {
      // TODO 显示错误信息
      // 这里一定要向调用方reject，调用方可以不写catch子句或catch子句为空去忽略，因为上面已经统一处理过了
      // 但是如果不写return语句或返回普通值，则是作为调用方的then()函数的输入参数值，可能会干扰then()里正常的业务逻辑
      return Promise.reject(error)
    }
  )

  return instance
}

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
