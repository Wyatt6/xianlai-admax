export const defaultOptions = {
  console: {
    openLog: false
  },
  captcha: {
    length: 5,
    expireSeconds: 60
  }
}

export function evalOptions(data, result) {
  data.value = defaultOptions

  if (result['console.openLog']) {
    data.value.console.openLog = result['console.openLog'] == 'true'
  }
  if (result['captcha.length']) {
    data.value.captcha.length = Number(result['captcha.length'])
  }
  if (result['captcha.expireSeconds']) {
    data.value.captcha.expireSeconds = Number(result['captcha.expireSeconds'])
  }
}
