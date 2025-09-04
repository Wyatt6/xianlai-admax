/**
 * 系统参数使用方法：
 * const Apis = useApiStore()
 * Apis.request.xxx.xxx(params, data)
 *    .then(result => {
 *    })
 *    .catch(error => {
 *    })
 *    .finally(() => {
 *    })
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { createAxiosInstance } from './instance'
import { isEmpty } from '@/utils/common'

const apiList = [
  {
    description: '获取允许前端访问的系统参数',
    callPath: 'admax.system.option.getOptions',
    requestMethod: 'get',
    url: '/api/admax/system/option/getOptions'
  },
  {
    description: '获取接口',
    callPath: 'admax.system.api.getApis',
    requestMethod: 'get',
    url: '/api/admax/system/api/getApis'
  }
]

export const useApiStore = defineStore('api', () => {
  const request = ref({})

  function evalData() {
    const axiosInstance = createAxiosInstance()
    for (let i = 0; i < apiList.length; i++) {
      const { callPath, requestMethod, url, description } = apiList[i]
      const paths = callPath.split('.')
      let now = request.value
      for (let j = 0; j < paths.length; j++) {
        if (j == paths.length - 1) {
          now[paths[j]] = (requestParams, requestData) => {
            const config = { method: requestMethod, url: url }
            if (hasText(description)) config.desc = description
            if (notEmpty(requestParams)) config.params = requestParams
            if (notEmpty(requestData)) config.data = requestData
            return axiosInstance(config)
          }
        } else {
          if (isEmpty(now[paths[j]])) now[paths[j]] = {}
          now = now[paths[j]]
        }
      }
    }
  }

  return {
    request,
    evalData
  }
})
