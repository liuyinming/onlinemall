import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // list: [],
    // index: 0
    statuscode: 0,
    cartCount: 0
  },
  mutations: {
    // handleNews (state, value) {
    //   state.list.push(value)
    // },
    // transferIndex (state, key) {
    //   state.index = key
    // }
    isLogin (state, value) {
      state.statuscode = value
    },
    cartNum (state, number) {
      state.cartCount = state.cartCount + number
    },
    init (state, number) {
      state.cartCount = number
    }
  },
  actions: {
    // addNews (ctx, value) {
    //   ctx.commit('handleNews', value)
    // }
  }
})
