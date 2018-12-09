// http://chaijs.com/api/bdd/
import Router from 'vue-router'
import Vue from 'vue'
import { createLocalVue } from '@vue/test-utils'
import router from '@/router'

let localVue = createLocalVue()
localVue.use(Router)
localVue.router = router
if (Vue.auth) {
  Vue.auth.check = () => {
    return true
  }
} else {
  Vue.auth = {
    check() {
      return true
    }
  }
}

localVue.router.addRoutes([{name: 'Home', path: ''}])

describe('Authentication Redirects', () => {
  it('Does not load login page if already logged in', () => {
    localVue.router.push({name: 'Home'})
    expect(localVue.router.currentRoute).to.be.an('Object')
    expect(localVue.router.currentRoute.name).to.equal('Home')

    localVue.router.push({name: 'Login'})
    expect(localVue.router.currentRoute.name).to.equal('Home')
  })

  it('Loads password reset page if already logged in', () => {
    localVue.router.push({name: 'Home'})
    expect(localVue.router.currentRoute).to.be.an('Object')
    expect(localVue.router.currentRoute.name).to.equal('Home')

    localVue.router.push({name: 'ResetPassword'})
    expect(localVue.router.currentRoute.name).to.equal('ResetPassword')
  })
})