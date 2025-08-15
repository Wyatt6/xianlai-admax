import axios from '@/apis/axios'

const PROFILE = '/content/profile'

export default {
  editProfile: input => {
    return axios({
      desc: '修改个人信息',
      method: 'post',
      url: `${PROFILE}/editProfile`,
      data: input
    })
  },
  getProfile: userId => {
    return axios({
      desc: '获取用户个人信息',
      url: `${PROFILE}/getProfile?userId=${userId}`
    })
  }
}
