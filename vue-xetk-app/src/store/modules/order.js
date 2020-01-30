export default {
  namespaced: true,
  state: {
    orderInfo: null,
  },
  getters: {
    orderInfo: state => state.orderInfo || JSON.parse(window.localStorage.getItem('orderInfo') || null),
  },
  mutations: {
    ['SET_ORDERINFO'](state, orderInfo) { 
      state.orderInfo = orderInfo; 
      window.localStorage.setItem('orderInfo', JSON.stringify(orderInfo)); 
    },
  },
  actions: {
    nameAsyn({ commit, }, {
      orderInfo,
    }) {
      commit('SET_ORDERINFO', orderInfo);
    },
  },
};
