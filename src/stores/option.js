/**
 * 参数使用方法：
 * const Option = useOptionStore()
 * Option.data.xxx.xxx
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { hasText, isEmpty } from '@/utils/common'

export const useOptionStore = defineStore('option', () => {
  const data = ref({
    console: {
      openLog: false
    },
    request: {
      timeout: 10000
    },
    system: {
      name: '闲来 Admax'
    },
    portal: {
      coverImageType: 'local',
      coverImagePath: '/src/assets/images/portal/default-cover.jpg',
      coverTitle: '封面标题',
      coverTitleSize: 5,
      coverTitleColor: '#ffffff',
      coverSubTitle: '这里是封面副标题，可以写点简单的介绍',
      coverSubTitleSize: 2,
      coverSubTitleColor: '#ffffff',
      footerCopyright: null,
      footerBeianIcp: null,
      footerBeianGongan: null
    },
    captcha: {
      length: 5
    },
    user: {
      username: {
        minLen: 5,
        maxLen: 20,
        regexp: '^[a-zA-Z][a-zA-Z_0-9]{4,19}$',
        tips: '仅限大写、小写字母，数字，下划线(_)，必须以字母开头'
      },
      password: {
        minLen: 6,
        maxLen: 30,
        regexp: '^[a-zA-Z_0-9.~!@#$%^&*?]{6,30}$',
        tips: '仅限大写、小写字母，数字，下划线(_)，特殊字符(.~!@#$%^&*?)'
      }
    },
    content: {
      termsOfUse: '使用条款未发布',
      privacyPolicy: '隐私保护政策未发布'
    }
  })
  const checksum = ref(null)

  async function evalData(checksumData, optionData) {
    checksum.value = checksumData

    Object.entries(optionData).forEach(([key, valueObj]) => {
      if (hasText(valueObj.type) && hasText(valueObj.value)) {
        const keys = key.split('.')
        let now = data.value
        for (let i = 0; i < keys.length; i++) {
          if (i == keys.length - 1) {
            if (valueObj.type === 'Boolean') {
              now[keys[i]] = valueObj.value == 'true'
            }
            if (valueObj.type === 'Number') {
              now[keys[i]] = Number(valueObj.value)
            }
            if (valueObj.type === 'String') {
              now[keys[i]] = valueObj.value
            }
          } else {
            if (isEmpty(now[keys[i]])) now[keys[i]] = {}
            now = now[keys[i]]
          }
        }
      }
    })
  }

  return {
    data,
    checksum,
    evalData
  }
})
