import axios from '../../axios'

const CAPTCHA = '/admax/common/captcha'

export default {
  getCaptcha: (params, data) => {
    return axios({
      desc: '获取验证码',
      url: `${CAPTCHA}/getCaptcha`
    })
  }
}
