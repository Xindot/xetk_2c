// import vue from 'vue';
import vuex from 'vuex';
// vue.use(vuex);
// import createLogger from 'vuex/dist/logger'; // 修改日志

import order from './modules/order';
const debug = process.env.NODE_ENV !== 'production'; // 开发环境中为true，否则为false

export default new vuex.Store({
  state: {
    token: ''
  },
  getters:{
    token: state => state.token,
  },
  mutations: {
    ['SET_TOKEN'](state, token) { state.token = token; },
  },
  actions: {
    nameSync({ commit }, { 
      token, 
    }) {
      commit('SET_TOKEN', token);
    },
  },
  modules: { order, },
  plugins: debug ? [/*createLogger*/] : [], // 开发环境下显示vuex的状态修改
});

// 参考 https: //segmentfault.com/a/1190000012015742
