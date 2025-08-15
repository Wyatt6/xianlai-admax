import axios from '@/apis/axios'

const PERMISSION = '/iam/permission'

export default {
  addPermission: input => {
    return axios({
      desc: '新增权限',
      method: 'post',
      url: `${PERMISSION}/addPermission`,
      data: input
    })
  },
  deletePermission: id => {
    return axios({
      desc: '删除权限',
      url: `${PERMISSION}/deletePermission?permissionId=${id}`
    })
  },
  editPermission: input => {
    return axios({
      desc: '修改权限',
      method: 'post',
      url: `${PERMISSION}/editPermission`,
      data: input
    })
  },
  getPermissionsByPage: (num, size) => {
    return axios({
      desc: '查询权限分页',
      url: `${PERMISSION}/getPermissionsByPage?pageNum=${num}&pageSize=${size}`
    })
  },
  getPermissionsByPageConditionally: input => {
    return axios({
      desc: '条件查询权限分页',
      method: 'post',
      url: `${PERMISSION}/getPermissionsByPageConditionally`,
      data: input
    })
  },
  getPermissions: () => {
    return axios({
      desc: '查询全量权限列表',
      url: `${PERMISSION}/getPermissions`
    })
  },
  getPermissionIdsOfRole: id => {
    return axios({
      desc: '查询某角色所具有的权限ID列表',
      url: `${PERMISSION}/getPermissionIdsOfRole?roleId=${id}`
    })
  },
  getRowNumStartFrom1: id => {
    return axios({
      desc: '查询权限的排名（从1开始）',
      url: `${PERMISSION}/getRowNumStartFrom1?permissionId=${id}`
    })
  }
}
