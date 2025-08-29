import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
})

export default router
