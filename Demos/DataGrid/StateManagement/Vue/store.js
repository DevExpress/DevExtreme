
import { createStore } from 'vuex';
import 'whatwg-fetch';
import applyChanges from 'devextreme/data/apply_changes';
import { sendRequest } from './utils.js';

const URL = 'https://js.devexpress.com/Demos/Mvc/api/DataGridWebApi';

export default createStore({
  state: {
    orders: [],
    changes: [],
    editRowKey: null,
    isLoading: false
  },
  getters: {
    orders(state) {
      return state.orders;
    },
    isLoading(state) {
      return state.isLoading;
    }
  },
  mutations: {
    updateIsLoading(state, isLoading) {
      state.isLoading = isLoading;
    },

    updateEditRowKey(state, editRowKey) {
      state.editRowKey = editRowKey;
    },

    updateChanges(state, changes) {
      state.changes = changes;
    },

    updateOrders(state, { change, data }) {
      if (change) {
        change.data = data;
        state.orders = applyChanges(state.orders, [change], { keyExpr: 'OrderID' });
      } else {
        state.orders = data;
      }
    }
  },
  actions: {
    setEditRowKey(context, value) {
      context.commit('updateEditRowKey', value);
    },

    setChanges(context, value) {
      context.commit('updateChanges', value);
    },

    async loadOrders(context) {
      context.commit('updateIsLoading', true);
      try {
        const { data } = await sendRequest(`${URL}/Orders?skip=700`);
        context.commit('updateOrders', { data });
      } finally {
        context.commit('updateIsLoading', false);
      }
    },

    async insert(context, change) {
      const data = await sendRequest(`${URL}/InsertOrder`, 'POST', {
        values: JSON.stringify(change.data)
      });

      context.commit('updateOrders', { change, data });
    },

    async update(context, change) {
      const data = await sendRequest(`${URL}/UpdateOrder`, 'PUT', {
        key: change.key,
        values: JSON.stringify(change.data)
      });

      context.commit('updateOrders', { change, data });
    },

    async remove(context, change) {
      const data = await sendRequest(`${URL}/DeleteOrder`, 'DELETE', { key: change.key });

      context.commit('updateOrders', { change, data });
    },

    async saveChange({ commit, dispatch }, change) {
      if (change && change.type) {
        commit('updateIsLoading', true);

        try {
          switch (change.type) {
            case 'insert':
              await dispatch('insert', change);
              break;
            case 'update':
              await dispatch('update', change);
              break;
            case 'remove':
              await dispatch('remove', change);
              break;
          }
        } finally {
          commit('updateIsLoading', false);
        }
      }
      commit('updateEditRowKey', null);
      commit('updateChanges', []);
    }
  }
});
