import request from '@/utils/request'

const CAPTCHA = '/content/captcha'
const PROFILE = '/content/profile'

export default {
  captcha: {
    getCaptcha: () => {
      return request({
        desc: '获取验证码',
        url: `${CAPTCHA}/getCaptcha`
      })
    }
  },
  profile: {
    editProfile: (input) => {
      return request({
        desc: '修改个人信息',
        method: 'post',
        url: `${PROFILE}/editProfile`,
        data: input
      })
    },
    getProfile: (userId) => {
      return request({
        desc: '获取用户个人信息',
        url: `${PROFILE}/getProfile?userId=${userId}`
      })
    }
  }
}
