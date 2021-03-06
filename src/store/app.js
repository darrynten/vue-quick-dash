import routes from '@/store/routes'
import sidebar from '@/store/sidebar'
import configuration from '@/config'

export default {
  namespaced: true,
  modules: {
    sidebar
  },
  state: {
    ...routes.state,
    loading: true,
    config: configuration
  },
  mutations: {
    ...routes.mutations,
    loading(state, loading) {
      state.loading = loading
    },
    config(state, config) {
      state.config = config
    }
  },
  getters: {
    ...routes.getters,
    loading(state) {
      return state.loading
    },
    config(state, _getters) {
      return state.config
    }
  }
}
