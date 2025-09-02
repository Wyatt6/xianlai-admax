import { createRouter, createWebHistory } from 'vue-router'

const builtInRoutes = [
  {
    path: '/portal',
    redirect: '/portal/login',
    name: 'portal',
    component: () => import('@/views/portal/index.vue'),
    children: [
      {
        path: '/portal/login',
        name: 'login',
        component: () => import('@/views/portal/login/index.vue')
      },
      {
        path: '/portal/register',
        name: 'register',
        component: () => import('@/views/portal/register/index.vue')
      },
      {
        path: '/portal/reset-password',
        name: 'reset_password',
        component: () => import('@/views/portal/reset_password/index.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: builtInRoutes
})

/**
 * 路由前置守卫：每次路由切换时先执行的操作
 * @param {*} to   要到哪里去
 * @param {*} from 从哪里来
 * @param {*} next 是否要去？
 */
router.beforeEach((to, from, next) => {})

export default router
