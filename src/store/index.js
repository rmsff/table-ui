import Vue from 'vue';
import Vuex from 'vuex';
import { getProducts, deleteProducts } from '../utils/api/request';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    products: [],
    loading: false,
    isLoadingError: false,
    isErrorRemoved: false,
  },
  mutations: {
    setProducts(state, payload) {
      state.products = payload;
    },
    setError(state, payload) {
      state.isLoadingError = payload;
    },
    setloading(state, payload) {
      state.loading = payload;
    },
    deleteProduct(state, payload) {
      state.products.splice(payload, 1);
    },
    setDeletingError(state, payload) {
      state.isErrorRemoved = payload;
    },
  },
  actions: {
    getData({ commit }) {
      getProducts()
        .then((success) => {
          commit('setProducts', success);
          commit('setloading', true);
          commit('setError', false);
        })
        .catch(() => {
          commit('setError', true);
          commit('setloading', true);
        });
    },
    deleteProduct({ commit, state }, data) {
      const { payload, callback } = data;
      deleteProducts()
        .then(() => {
          callback();
          if (toString.call(payload) === '[object Array]') {
            for (let i = 0; i < payload.length; i++) {
              for (let j = 0; j < state.products.length; j++) {
                if (state.products[j].id === payload[i].id) {
                  commit('deleteProduct', j);
                }
              }
            }
          }
          if (toString.call(payload) === '[object Object]') {
            for (let j = 0; j < state.products.length; j++) {
              if (state.products[j].id === payload.id) {
                commit('deleteProduct', j);
              }
            }
          }
        })
        .catch(() => {
          commit('setDeletingError', true);
        });
    },
  },
});
