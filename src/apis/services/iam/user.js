import axios from '../../axios'

const USER = '/admax/iam/user'

export default {
  register: (params, data) => {
    return axios({
      desc: '注册',
      method: 'post',
      url: `${USER}/register`,
      data
    })
  },
  login: (params, data) => {
    return axios({
      desc: '登录',
      method: 'post',
      url: `${USER}/login`,
      data
    })
  },
  resetPassword: (params, data) => {
    return axios({
      desc: '重置密码',
      method: 'post',
      url: `${USER}/resetPassword`,
      data
    })
  }
}
