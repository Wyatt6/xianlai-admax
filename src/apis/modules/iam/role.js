import axios from '@/apis/axios'

const ROLE = '/iam/role'

export default {
  addRole: (params, data) => {
    return axios({
      desc: '新增角色',
      method: 'post',
      url: `${ROLE}/addRole`,
      data: params
    })
  },
  deleteRole: (params, data) => {
    return axios({
      desc: '删除角色',
      url: `${ROLE}/deleteRole`,
      params: { roleId: params }
    })
  },
  updateGrants: (params, data) => {
    return axios({
      desc: '更新角色的授权',
      method: 'post',
      url: `${ROLE}/updateGrants`,
      data: params
    })
  },
  editRole: (params, data) => {
    return axios({
      desc: '修改角色',
      method: 'post',
      url: `${ROLE}/editRole`,
      data: params
    })
  },
  swapPosition: (params, data) => {
    return axios({
      desc: '交换位置',
      url: `${ROLE}/swapPosition`,
      params: {
        id1: params,
        id2: data
      }
    })
  },
  getRolesByPage: (params, data) => {
    return axios({
      desc: '查询角色分页',
      url: `${ROLE}/getRolesByPage`,
      params: {
        pageNum: params,
        pageSize: size
      }
    })
  },
  getRolesByPageConditionally: (params, data) => {
    return axios({
      desc: '条件查询角色分页',
      method: 'post',
      url: `${ROLE}/getRolesByPageConditionally`,
      data: params
    })
  },
  getRoles: (params, data) => {
    return axios({
      desc: '查询全量角色列表',
      url: `${ROLE}/getRoles`
    })
  },
  getRoleIdsOfUser: (params, data) => {
    return axios({
      desc: '查询某用户所具有的角色ID列表',
      url: `${ROLE}/getRoleIdsOfUser`,
      params: {
        userId: params
      }
    })
  },
  getRowNumStartFrom1: (params, data) => {
    return axios({
      desc: '查询角色的排名（从1开始）',
      url: `${ROLE}/getRowNumStartFrom1`,
      params: {
        roleId: params
      }
    })
  }
}
