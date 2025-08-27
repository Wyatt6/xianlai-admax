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
  if (result['console.openLog']) {
    data.console.openLog = result['console.openLog'] == 'true'
  }
  if (result['captcha.length']) {
    data.captcha.length = Number(result['captcha.length'])
  }
  if (result['captcha.expireSeconds']) {
    data.captcha.expireSeconds = Number(result['captcha.expireSeconds'])
  }
}
