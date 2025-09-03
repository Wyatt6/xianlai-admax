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
import axios from 'axios'
import { evalApis } from './eval'

const builtInApis = [
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
  const getting = ref(false)
  const request = ref({})
  const checksum = ref(null)

  function initBuiltInApis() {
    evalApis(request, builtInApis)
  }

  async function getApis() {
    if (!getting.value) {
      getting.value = true
      await axios
        .get('/api/admax/system/api/getApis', {
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          timeout: 60000
        })
        .then(response => {
          const result = response.data
          if (result.success) {
            evalApis(request, result.data.apis)
            checksum.value = result.data.apisChecksum
          }
        })
        .catch(error => {
          console.error(error)
        })
        .finally(() => {
          getting.value = false
        })
    }
  }

  return {
    request,
    checksum,
    initBuiltInApis,
    getApis
  }
})
