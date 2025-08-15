import axios from '@/apis/axios'

const USER = '/iam/user'

export default {
  register: (params, data) => {
    return axios({
      desc: '注册新用户',
      method: 'post',
      url: `${USER}/register`,
      data: params
    })
  },
  login: (params, data) => {
    return axios({
      desc: '用户登录（用户名+密码）',
      method: 'post',
      url: `${USER}/login`,
      data
    })
  },
  logout: (params, data) => {
    return axios({
      desc: '退出登录',
      url: `${USER}/logout`
    })
  },
  getAuthorizations: (params, data) => {
    return axios({
      desc: '获取用户的授权数据（角色+权限）',
      url: `${USER}/getAuthorizations`
    })
  },
  updateAuthorizations: (params, data) => {
    return axios({
      desc: '刷新用户的授权数据（角色+权限）',
      url: `${USER}/updateAuthorizations`
    })
  },
  updateBinds: (params, data) => {
    return axios({
      desc: '更新用户绑定的角色',
      method: 'post',
      url: `${USER}/updateBinds`,
      data: params
    })
  },
  freeze: (params, data) => {
    return axios({
      desc: '冻结用户',
      url: `${USER}/freeze`,
      params: { userId: params }
    })
  },
  unfreeze: (params, data) => {
    return axios({
      desc: '解冻用户',
      url: `${USER}/unfreeze`,
      params: { userId: params }
    })
  },
  getUsersByPage: (params, data) => {
    return axios({
      desc: '查询用户分页',
      url: `${USER}/getUsersByPage`,
      params: {
        pageNum: params,
        pageSize: data
      }
    })
  },
  getUsersByPageConditionally: (params, data) => {
    return axios({
      desc: '条件查询用户分页',
      method: 'post',
      url: `${USER}/getUsersByPageConditionally`,
      data: params
    })
  },
  changePassword: (params, data) => {
    return axios({
      desc: '修改密码',
      method: 'post',
      url: `${USER}/changePassword`,
      data: params
    })
  }
}
