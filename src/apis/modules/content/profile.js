import request from '@/apis/request'

const PROFILE = '/content/profile'

export default {
  editProfile: (params, data) => {
    return request({
      desc: '修改个人信息',
      method: 'post',
      url: `${PROFILE}/editProfile`,
      data: params
    })
  },
  getProfile: (params, data) => {
    return request({
      desc: '获取用户个人信息',
      url: `${PROFILE}/getProfile`,
      params: { userId: params }
    })
  }
}
