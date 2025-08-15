import axios from '@/apis/axios'

const USER = '/iam/user'

export default {
  register: input => {
    return axios({
      desc: '注册新用户',
      method: 'post',
      url: `${USER}/register`,
      data: input
    })
  },
  login: input => {
    return axios({
      desc: '用户登录（用户名+密码）',
      method: 'post',
      url: `${USER}/login`,
      data: input
    })
  },
  logout: () => {
    return axios({
      desc: '退出登录',
      url: `${USER}/logout`
    })
  },
  getAuthorizations: () => {
    return axios({
      desc: '获取用户的授权数据（角色+权限）',
      url: `${USER}/getAuthorizations`
    })
  },
  updateAuthorizations: () => {
    return axios({
      desc: '刷新用户的授权数据（角色+权限）',
      url: `${USER}/updateAuthorizations`
    })
  },
  updateBinds: input => {
    return axios({
      desc: '更新用户绑定的角色',
      method: 'post',
      url: `${USER}/updateBinds`,
      data: input
    })
  },
  freeze: id => {
    return axios({
      desc: '冻结用户',
      url: `${USER}/freeze?userId=${id}`
    })
  },
  unfreeze: id => {
    return axios({
      desc: '解冻用户',
      url: `${USER}/unfreeze?userId=${id}`
    })
  },
  getUsersByPage: (num, size) => {
    return axios({
      desc: '查询用户分页',
      url: `${USER}/getUsersByPage?pageNum=${num}&pageSize=${size}`
    })
  },
  getUsersByPageConditionally: input => {
    return axios({
      desc: '条件查询用户分页',
      method: 'post',
      url: `${USER}/getUsersByPageConditionally`,
      data: input
    })
  },
  changePassword: input => {
    return axios({
      desc: '修改密码',
      method: 'post',
      url: `${USER}/changePassword`,
      data: input
    })
  }
}
