import request from '@/apis/axios'

const USER = '/iam/user'
const ROLE = '/iam/role'
const PERMISSION = '/iam/permission'

export default {
  user: {
    register: input => {
      return request({
        desc: '注册新用户',
        method: 'post',
        url: `${USER}/register`,
        data: input
      })
    },
    login: input => {
      return request({
        desc: '用户登录（用户名+密码）',
        method: 'post',
        url: `${USER}/login`,
        data: input
      })
    },
    logout: () => {
      return request({
        desc: '退出登录',
        url: `${USER}/logout`
      })
    },
    getAuthorizations: () => {
      return request({
        desc: '获取用户的授权数据（角色+权限）',
        url: `${USER}/getAuthorizations`
      })
    },
    updateAuthorizations: () => {
      return request({
        desc: '刷新用户的授权数据（角色+权限）',
        url: `${USER}/updateAuthorizations`
      })
    },
    updateBinds: input => {
      return request({
        desc: '更新用户绑定的角色',
        method: 'post',
        url: `${USER}/updateBinds`,
        data: input
      })
    },
    freeze: id => {
      return request({
        desc: '冻结用户',
        url: `${USER}/freeze?userId=${id}`
      })
    },
    unfreeze: id => {
      return request({
        desc: '解冻用户',
        url: `${USER}/unfreeze?userId=${id}`
      })
    },
    getUsersByPage: (num, size) => {
      return request({
        desc: '查询用户分页',
        url: `${USER}/getUsersByPage?pageNum=${num}&pageSize=${size}`
      })
    },
    getUsersByPageConditionally: input => {
      return request({
        desc: '条件查询用户分页',
        method: 'post',
        url: `${USER}/getUsersByPageConditionally`,
        data: input
      })
    },
    changePassword: input => {
      return request({
        desc: '修改密码',
        method: 'post',
        url: `${USER}/changePassword`,
        data: input
      })
    }
  },
  role: {
    addRole: input => {
      return request({
        desc: '新增角色',
        method: 'post',
        url: `${ROLE}/addRole`,
        data: input
      })
    },
    deleteRole: id => {
      return request({
        desc: '删除角色',
        url: `${ROLE}/deleteRole?roleId=${id}`
      })
    },
    updateGrants: input => {
      return request({
        desc: '更新角色的授权',
        method: 'post',
        url: `${ROLE}/updateGrants`,
        data: input
      })
    },
    editRole: input => {
      return request({
        desc: '修改角色',
        method: 'post',
        url: `${ROLE}/editRole`,
        data: input
      })
    },
    swapPosition: (id1, id2) => {
      return request({
        desc: '交换位置',
        url: `${ROLE}/swapPosition?id1=${id1}&id2=${id2}`
      })
    },
    getRolesByPage: (num, size) => {
      return request({
        desc: '查询角色分页',
        url: `${ROLE}/getRolesByPage?pageNum=${num}&pageSize=${size}`
      })
    },
    getRolesByPageConditionally: input => {
      return request({
        desc: '条件查询角色分页',
        method: 'post',
        url: `${ROLE}/getRolesByPageConditionally`,
        data: input
      })
    },
    getRoles: () => {
      return request({
        desc: '查询全量角色列表',
        url: `${ROLE}/getRoles`
      })
    },
    getRoleIdsOfUser: id => {
      return request({
        desc: '查询某用户所具有的角色ID列表',
        url: `${ROLE}/getRoleIdsOfUser?userId=${id}`
      })
    },
    getRowNumStartFrom1: id => {
      return request({
        desc: '查询角色的排名（从1开始）',
        url: `${ROLE}/getRowNumStartFrom1?roleId=${id}`
      })
    }
  },
  permission: {
    addPermission: input => {
      return request({
        desc: '新增权限',
        method: 'post',
        url: `${PERMISSION}/addPermission`,
        data: input
      })
    },
    deletePermission: id => {
      return request({
        desc: '删除权限',
        url: `${PERMISSION}/deletePermission?permissionId=${id}`
      })
    },
    editPermission: input => {
      return request({
        desc: '修改权限',
        method: 'post',
        url: `${PERMISSION}/editPermission`,
        data: input
      })
    },
    getPermissionsByPage: (num, size) => {
      return request({
        desc: '查询权限分页',
        url: `${PERMISSION}/getPermissionsByPage?pageNum=${num}&pageSize=${size}`
      })
    },
    getPermissionsByPageConditionally: input => {
      return request({
        desc: '条件查询权限分页',
        method: 'post',
        url: `${PERMISSION}/getPermissionsByPageConditionally`,
        data: input
      })
    },
    getPermissions: () => {
      return request({
        desc: '查询全量权限列表',
        url: `${PERMISSION}/getPermissions`
      })
    },
    getPermissionIdsOfRole: id => {
      return request({
        desc: '查询某角色所具有的权限ID列表',
        url: `${PERMISSION}/getPermissionIdsOfRole?roleId=${id}`
      })
    },
    getRowNumStartFrom1: id => {
      return request({
        desc: '查询权限的排名（从1开始）',
        url: `${PERMISSION}/getRowNumStartFrom1?permissionId=${id}`
      })
    }
  }
}
