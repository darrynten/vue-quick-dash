import store from '@/store'

describe('store/routes.js', () => {
  it('sets and gets all routes', () => {
    store.commit('setRoutes', [{ '_id': 3 }])
    expect(store.getters.routes).to.deep.equal([{ '_id': 3 }])
  })
})
