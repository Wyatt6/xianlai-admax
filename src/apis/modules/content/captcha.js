import axios from '@/apis/axios'

const CAPTCHA = '/content/captcha'

export default {
  getCaptcha: (params, data) => {
    return axios({
      desc: '获取验证码',
      url: `${CAPTCHA}/getCaptcha`
    })
  }
}
