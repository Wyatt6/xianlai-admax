/**
 * 检查用户是否有权权限访问某个页面路由
 * @param {*} permissions
 * @param {*} routeName
 * @returns
 */
const checkRoutePermission = (permissions, routeName) => {
  console.log('checkRoutePermission: 检查用户是否有权限访问该页面')
  let result = false
  permissions.forEach((item) => {
    if (routeName === item) {
      result = true
    }
  })
  return result
}

export default {
  checkRoutePermission
}
