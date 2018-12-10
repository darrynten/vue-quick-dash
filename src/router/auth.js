import Vue from 'vue'
import { logout } from '@/api/user'

function redirectIfAuthenticated(to, from, next) {
  if (Vue.auth && Vue.auth.check()) {
    next(false)
  } else {
    next()
  }
}

export default [
  {
    name: 'Login',
    path: '/login',
    component: require('@/pages/Login.vue').default,
    beforeEnter(to, from, next) {
      redirectIfAuthenticated(to, from, next)
    }
  },
  {
    name: 'Confirmed',
    path: '/confirmed',
    async beforeEnter(to, from, next) {
      await logout()
      next(false)
    }
  },
  {
    name: 'Logout',
    path: '/logout',
    async beforeEnter(to, from, next) {
      await logout()
      next(false)
    }
  },
  {
    name: 'ResetPassword',
    path: '/password/reset',
    component: require('@/pages/PasswordReset.vue').default
  }
]