import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'
import RouteConst from '@/constants/route_const'
import { noLoginRequired, noPermissionRequired } from './route_white_list'
import Token from '@/utils/token'
import Route from '@/utils/route'
import { useAppStore } from '@/stores/app'

import Portal from '@/views/portal/index.vue'
import Login from '@/views/portal/login/index.vue'
import Register from '@/views/portal/register/index.vue'

import Layout from '@/views/layout/index.vue'
import Placeholder from '@/views/layout/Placeholder/index.vue'
import Homepage from '@/views/homepage/index.vue'
import UserManage from '@/views/iam/user_manage/index.vue'
import RoleManage from '@/views/iam/role_manage/index.vue'
import PermissionManage from '@/views/iam/permission_manage/index.vue'

import LedgerDetail from '@/views/ledger/detail/index.vue'
import LedgerSetting from '@/views/ledger/setting/index.vue'

import UserSetting from '@/views/user_setting/index.vue'

import Err401 from '@/views/errors/401.vue'
import Err404 from '@/views/errors/404.vue'
import Err500 from '@/views/errors/500.vue'

const routes = [
  {
    path: RouteConst.PORTAL,
    redirect: RouteConst.LOGIN,
    name: 'portal',
    component: Portal,
    children: [
      {
        path: RouteConst.LOGIN,
        name: 'login',
        component: Login
      },
      {
        path: RouteConst.REGISTER,
        name: 'register',
        component: Register
      }
    ]
  },
  {
    path: RouteConst.INDEX,
    redirect: RouteConst.INDEX_REDIRECT,
    name: 'index',
    component: Layout,
    children: [
      // ----- 侧边栏菜单 -----
      {
        path: RouteConst.HOMEPAGE,
        name: 'homepage',
        component: Homepage,
        meta: {
          isMenu: true,
          isBreadcrumb: true,
          breadcrumbRedirect: true,
          title: '首页',
          icon: 'ri-home-4-fill'
        }
      },
      {
        path: RouteConst.LEDGER,
        redirect: RouteConst.LEDGER_REDIRECT,
        name: 'menu_ledger',
        component: Placeholder,
        meta: {
          isMenu: true,
          isBreadcrumb: true,
          breadcrumbRedirect: true,
          title: '记账本 Ledger',
          icon: 'ri-money-cny-circle-fill'
        },
        children: [
          {
            path: RouteConst.LEDGER_DASHBOARD,
            name: 'menu_ledger_dashboard',
            component: Placeholder,
            meta: {
              isMenu: true,
              isBreadcrumb: true,
              breadcrumbRedirect: true,
              title: '数据看板',
              icon: 'ri-bar-chart-2-fill'
            }
          },
          {
            path: RouteConst.LEDGER_DETAIL,
            name: 'menu_ledger_detail',
            component: LedgerDetail,
            meta: {
              isMenu: true,
              isBreadcrumb: true,
              breadcrumbRedirect: true,
              title: '记账明细',
              icon: 'ri-file-text-fill'
            }
          },
          {
            path: RouteConst.LEDGER_BUDGET,
            name: 'menu_ledger_budget',
            component: Placeholder,
            meta: {
              isMenu: true,
              isBreadcrumb: true,
              breadcrumbRedirect: true,
              title: '预算管理',
              icon: 'ri-shopping-cart-fill'
            }
          },
          {
            path: RouteConst.LEDGER_ASSETS,
            name: 'menu_ledger_assets',
            component: Placeholder,
            meta: {
              isMenu: true,
              isBreadcrumb: true,
              breadcrumbRedirect: true,
              title: '资产盘点',
              icon: 'ri-hand-coin-fill'
            }
          },
          {
            path: RouteConst.LEDGER_SETTING,
            name: 'menu_ledger_setting',
            component: LedgerSetting,
            meta: {
              isMenu: true,
              isBreadcrumb: true,
              breadcrumbRedirect: true,
              title: '参数设置',
              icon: 'ri-settings-3-fill'
            }
          }
        ]
      },
      {
        path: RouteConst.IAM,
        redirect: RouteConst.IAM_REDIRECT,
        name: 'menu_iam',
        component: Placeholder,
        meta: {
          isMenu: true,
          isBreadcrumb: true,
          breadcrumbRedirect: true,
          title: '身份认证管理 IAM',
          icon: 'ri-group-fill'
        },
        children: [
          {
            path: RouteConst.USER_MANAGE,
            name: 'menu_user_manage',
            component: UserManage,
            meta: {
              isMenu: true,
              isBreadcrumb: true,
              breadcrumbRedirect: true,
              title: '用户管理',
              icon: 'ri-user-settings-fill'
            }
          },
          {
            path: RouteConst.ROLE_MANAGE,
            name: 'menu_role_manage',
            component: RoleManage,
            meta: {
              isMenu: true,
              isBreadcrumb: true,
              breadcrumbRedirect: true,
              title: '角色管理',
              icon: 'ri-account-box-fill'
            }
          },
          {
            path: RouteConst.PERMISSION_MANAGE,
            name: 'menu_permission_manage',
            component: PermissionManage,
            meta: {
              isMenu: true,
              isBreadcrumb: true,
              breadcrumbRedirect: true,
              title: '权限管理',
              icon: 'ri-shield-keyhole-fill'
            }
          }
        ]
      },
      // ----- 非侧边栏菜单页面 -----
      {
        path: RouteConst.USER_SETTING,
        name: 'userSetting',
        component: UserSetting,
        meta: {
          isBreadcrumb: true,
          breadcrumbRedirect: true,
          title: '用户设置'
        }
      },
      // ----- 错误提示 -----
      {
        path: RouteConst.NOT_AUTHORIZED_EMBEDDED,
        name: 'notAuthorizedEmbedded',
        component: Err401,
        meta: {
          isBreadcrumb: true,
          breadcrumbRedirect: true,
          title: '访问权限不足'
        }
      }
    ]
  },
  {
    path: RouteConst.NOT_AUTHORIZED,
    name: 'notAuthorized',
    component: Err401
  },
  {
    path: RouteConst.NOT_FOUND,
    name: 'notFound',
    component: Err404
  },
  {
    path: RouteConst.NOT_CONNECTED,
    name: 'notConnect',
    component: Err500
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

/**
 * 路由前置守卫
 * @param {*} to 要到哪里去
 * @param {*} from 从哪里来
 * @param {*} next 是否要去？
 */
router.beforeEach(async (to, from, next) => {
  const appStore = useAppStore()
  console.groupCollapsed('路由前置守卫程序', from.path, '--->', to.path)

  // ----- 1、访问白名单路径，无须登录也可访问 -----
  if (noLoginRequired.indexOf(to.path) > -1) {
    console.log('访问白名单页面')

    if (
      (to.path === RouteConst.PORTAL || to.path === RouteConst.LOGIN || to.path === RouteConst.REGISTER) &&
      Token.hasToken() &&
      !Token.isExpired()
    ) {
      console.log('用户已登录，不允许访问登录和注册页面，重定向到主页')
      console.groupEnd()
      next(RouteConst.INDEX)
    } else {
      // 其他的白名单页面不论登录与否均可访问
      console.groupEnd()
      next()
    }
  } else {
    // ----- 2、访问非白名单路径，须先登录，否则重定向到登录页面 -----
    console.log('访问非白名单页面')
    if (Token.hasToken() && !Token.isExpired()) {
      console.log('用户已登录，token未过期，允许访问页面')

      if (noPermissionRequired.indexOf(to.path) < 0) {
        console.log('访问的页面需要检查用户权限')
        if (!Route.checkRoutePermission(appStore.authorizations.permissions, to.name)) {
          console.log('用户无权限访问页面，跳转到401')
          console.groupEnd()
          next(RouteConst.NOT_AUTHORIZED_EMBEDDED)
          return
        }
      }
      console.groupEnd()
      next()
    } else {
      console.log('用户token不存在或已过期，重定向到登录页面')
      if (!Token.hasToken()) {
        // 因为token不存在
        ElMessage.error('用户未登录')
      } else {
        // 因为token过期
        ElMessage.error('登录已过期，请重新登录')
      }
      await appStore.init()
      console.groupEnd()
      next(RouteConst.LOGIN)
    }
  }

  console.groupEnd()
})

export default router
