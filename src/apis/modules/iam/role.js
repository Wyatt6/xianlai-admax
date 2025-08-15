import axios from '@/apis/axios'

const ROLE = '/iam/role'

export default {
  addRole: input => {
    return axios({
      desc: '新增角色',
      method: 'post',
      url: `${ROLE}/addRole`,
      data: input
    })
  },
  deleteRole: id => {
    return axios({
      desc: '删除角色',
      url: `${ROLE}/deleteRole?roleId=${id}`
    })
  },
  updateGrants: input => {
    return axios({
      desc: '更新角色的授权',
      method: 'post',
      url: `${ROLE}/updateGrants`,
      data: input
    })
  },
  editRole: input => {
    return axios({
      desc: '修改角色',
      method: 'post',
      url: `${ROLE}/editRole`,
      data: input
    })
  },
  swapPosition: (id1, id2) => {
    return axios({
      desc: '交换位置',
      url: `${ROLE}/swapPosition?id1=${id1}&id2=${id2}`
    })
  },
  getRolesByPage: (num, size) => {
    return axios({
      desc: '查询角色分页',
      url: `${ROLE}/getRolesByPage?pageNum=${num}&pageSize=${size}`
    })
  },
  getRolesByPageConditionally: input => {
    return axios({
      desc: '条件查询角色分页',
      method: 'post',
      url: `${ROLE}/getRolesByPageConditionally`,
      data: input
    })
  },
  getRoles: () => {
    return axios({
      desc: '查询全量角色列表',
      url: `${ROLE}/getRoles`
    })
  },
  getRoleIdsOfUser: id => {
    return axios({
      desc: '查询某用户所具有的角色ID列表',
      url: `${ROLE}/getRoleIdsOfUser?userId=${id}`
    })
  },
  getRowNumStartFrom1: id => {
    return axios({
      desc: '查询角色的排名（从1开始）',
      url: `${ROLE}/getRowNumStartFrom1?roleId=${id}`
    })
  }
}
