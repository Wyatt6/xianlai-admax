// 路由白名单（用户未登录时也能有权限进入的页面，即不需要token）
import RouteConst from '@/constants/route_const'

export const noLoginRequired = [
  RouteConst.PORTAL,
  RouteConst.LOGIN,
  RouteConst.REGISTER,
  '/portal/reset-password',
  RouteConst.NOT_AUTHORIZED,
  RouteConst.NOT_AUTHORIZED_EMBEDDED,
  RouteConst.NOT_FOUND,
  RouteConst.NOT_CONNECTED
]

export const noPermissionRequired = [
  RouteConst.PORTAL,
  RouteConst.LOGIN,
  RouteConst.REGISTER,
  RouteConst.INDEX,
  RouteConst.INDEX_REDIRECT,
  RouteConst.HOMEPAGE,
  RouteConst.USER_SETTING,
  RouteConst.NOT_AUTHORIZED,
  RouteConst.NOT_AUTHORIZED_EMBEDDED,
  RouteConst.NOT_FOUND,
  RouteConst.NOT_CONNECTED
]
