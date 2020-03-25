import Vue from 'vue';
import Vuex from 'vuex';
import { getProducts, deleteProducts } from '../utils/api/request';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    items: [],
    isLoading: false,
    isLoadingError: false,
    isErrorRemoved: false,
  },
  mutations: {
    setItems(state, payload) {
      state.items = payload;
    },
    setError(state, payload) {
      state.isLoadingError = payload;
    },
    setIsLoading(state, payload) {
      state.isLoading = payload;
    },
    deleteItem(state, payload) {
      state.items.splice(payload, 1);
    },
    setDeletingError(state, payload) {
      state.isErrorRemoved = payload;
    },
  },
  actions: {
    getData({ commit }) {
      getProducts()
        .then((success) => {
          commit('setItems', success);
          commit('setIsLoading', true);
          commit('setError', false);
        })
        .catch(() => {
          commit('setError', true);
          commit('setIsLoading', true);
        });
    },
    deleteItem({ commit, state }, data) {
      const { payload, callback } = data;
      deleteProducts()
        .then(() => {
          callback();
          if (toString.call(payload) === '[object Array]') {
            for (let i = 0; i < payload.length; i++) {
              for (let j = 0; j < state.items.length; j++) {
                if (state.items[j].id === payload[i].id) {
                  commit('deleteItem', j);
                }
              }
            }
          }
          if (toString.call(payload) === '[object Object]') {
            for (let j = 0; j < state.items.length; j++) {
              if (state.items[j].id === payload.id) {
                commit('deleteItem', j);
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
