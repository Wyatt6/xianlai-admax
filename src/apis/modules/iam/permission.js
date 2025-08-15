import axios from '@/apis/axios'

const PERMISSION = '/iam/permission'

export default {
  addPermission: (params, data) => {
    return axios({
      desc: '新增权限',
      method: 'post',
      url: `${PERMISSION}/addPermission`,
      data: params
    })
  },
  deletePermission: (params, data) => {
    return axios({
      desc: '删除权限',
      url: `${PERMISSION}/deletePermission`,
      params: { permissionId: params }
    })
  },
  editPermission: (params, data) => {
    return axios({
      desc: '修改权限',
      method: 'post',
      url: `${PERMISSION}/editPermission`,
      data: params
    })
  },
  getPermissionsByPage: (params, data) => {
    return axios({
      desc: '查询权限分页',
      url: `${PERMISSION}/getPermissionsByPage`,
      params: {
        pageNum: params,
        pageSize: data
      }
    })
  },
  getPermissionsByPageConditionally: (params, data) => {
    return axios({
      desc: '条件查询权限分页',
      method: 'post',
      url: `${PERMISSION}/getPermissionsByPageConditionally`,
      data: params
    })
  },
  getPermissions: (params, data) => {
    return axios({
      desc: '查询全量权限列表',
      url: `${PERMISSION}/getPermissions`
    })
  },
  getPermissionIdsOfRole: (params, data) => {
    return axios({
      desc: '查询某角色所具有的权限ID列表',
      url: `${PERMISSION}/getPermissionIdsOfRole`,
      params: { roleId: params }
    })
  },
  getRowNumStartFrom1: (params, data) => {
    return axios({
      desc: '查询权限的排名（从1开始）',
      url: `${PERMISSION}/getRowNumStartFrom1`,
      params: { permissionId: params }
    })
  }
}
