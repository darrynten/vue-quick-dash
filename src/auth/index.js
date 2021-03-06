import Vue from 'vue'
import Auth from '@websanova/vue-auth'
import store from '@/store'
import {loadRoutes} from '@/router'
import {getSelf} from '@/api/user'

export function userHasRole(user, role) {
  return user.roles.findIndex(userRole => userRole.name.toUpperCase() === role.toUpperCase()) > -1
}

export function reloadSelf() {
  getSelf().then(data => {
    store.commit('auth/user', data)
  })
}

export async function clearCookies() {
  await document.cookie.split(';').forEach(function(c) {
    const n = c.trim().split('=')[0]
    document.cookie = `${n}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;`
  })
}

export default {
  init: () => {
    Vue.use(Auth, {
      auth: require('@websanova/vue-auth/drivers/auth/bearer'),
      http: require('@websanova/vue-auth/drivers/http/axios.1.x'),
      router: require('@websanova/vue-auth/drivers/router/vue-router.2.x'),
      refreshData: {
        enabled: true,
        url: 'refresh',
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain'
        }
      },
      fetchData: {
        enabled: true,
        url: 'api/me',
        method: 'GET'
      },
      async parseUserData(user) {
        await store.commit('app/loading', true)

        // Add custom app routes (contained in sidebar)
        const appRoute = await loadRoutes(user)
        await Vue.router.addRoutes([appRoute])

        // 'refresh' current route
        await Vue.router.replace(window.location.pathname).catch(err => {
          if (err.name === 'NavigationDuplicated') {
            return true
          } else {
            throw err
          }
        })

        await store.commit('auth/user', user)
        await store.commit('app/loading', false)

        if (window.location.pathname === '/') {
          Vue.router.replace('/home')
        }
      }
    })

    const redirectToLogin = function () {
      if (Vue.router.currentRoute.name !== 'Login') {
        Vue.router.push('/login')
      }
    }
    // Add a response interceptor
    Vue.axios.interceptors.response.use((response) => {
      // Do something with response data
      return response
    }, (error) => {
      if (window.location.pathname.includes('/password-reset')) {
        return error
      }

      if (
        error.response &&
        error.response.status === 500 &&
        error.response.data.error ===
        'Token has expired and can no longer be refreshed'
      ) {
        clearCookies()
        localStorage.clear()
        redirectToLogin()
      }

      if (
        error.response &&
        error.response.status === 500 &&
        error.response.data.error === 'Token Signature could not be verified.'
      ) {
        clearCookies()
        localStorage.clear()
        redirectToLogin()
      }

      if (error.response && (error.response.status === 500) && (error.response.data.error === 'The token has been blacklisted')) {
        clearCookies()
        localStorage.clear()
        redirectToLogin()
      }

      if (
        error.response &&
        error.response.status === 500 &&
        error.response.data.error === 'The token has been blacklisted'
      ) {
        clearCookies()
        localStorage.clear()
        redirectToLogin()
      }

      if (
        error.response &&
        error.response.status === 500 &&
        error.response.data.error === 'Token could not be parsed from the request.'
      ) {
        clearCookies()
        localStorage.clear()
        redirectToLogin()
      }

      if (
        error.response &&
        error.response.status === 500 &&
        error.response.data.error === 'Wrong number of segments'
      ) {
        clearCookies()
        localStorage.clear()
        redirectToLogin()
      }

      if (Vue.auth.token() === null) {
        clearCookies()
        localStorage.clear()
        redirectToLogin()
      }

      return Promise.reject(error)
    })

    Vue.router.beforeEach(function (to, from, next) {
      const excluded = ['Login', 'ResetPassword', 'ResetPasswordForm', 'Signup', 'Confirmed']
      if (to.meta.static) {
        next()
      } else if (excluded.includes(to.name) || Vue.auth.check()) {
        next()
      } else {
        clearCookies()
        localStorage.clear()
        next({name: 'Login'})
      }
    })
  }
}
