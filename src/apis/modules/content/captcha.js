import request from '@/apis/request'

const CAPTCHA = '/content/captcha'

export default {
  getCaptcha: (params, data) => {
    return request({
      desc: '获取验证码',
      url: `${CAPTCHA}/getCaptcha`
    })
  }
}
