import { hasText, isEmpty } from '@/utils/common'

export const defaultOptions = {
  console: {
    openLog: false
  },
  request: {
    timeout: 10000
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
  }
}

export function evalOptions(data, optionData) {
  data.value = defaultOptions
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
