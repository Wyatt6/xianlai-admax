import axios from '@/apis/axios'

const CAPTCHA = '/content/captcha'

export default {
  getCaptcha: () => {
    return axios({
      desc: '获取验证码',
      url: `${CAPTCHA}/getCaptcha`
    })
  }
}
