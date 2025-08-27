import { hasText } from '@/utils/common'

export const defaultOptions = {
  console: {
    openLog: false
  },
  request: {
    timeout: 10000
  },
  captcha: {
    length: 5,
    expireSeconds: 60
  }
}

export function evalOptions(data, result) {
  data.value = defaultOptions

  if (hasText(result['console.openLog'])) {
    data.value.console.openLog = result['console.openLog'] == 'true'
  }
  if (hasText(result['request.timeout'])) {
    data.value.request.timeout = Number(result['request.timeout'])
  }
  if (hasText(result['captcha.length'])) {
    data.value.captcha.length = Number(result['captcha.length'])
  }
  if (hasText(result['captcha.expireSeconds'])) {
    data.value.captcha.expireSeconds = Number(result['captcha.expireSeconds'])
  }
}
