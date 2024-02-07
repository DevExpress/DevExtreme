import { createStore } from 'vuex';
import 'whatwg-fetch';

import applyChanges from 'devextreme/data/apply_changes';
import { DataChange } from 'devextreme/ui/data_grid';

// @ts-expect-error due to specific build options need to add .ts extension
import { sendRequest } from './utils.ts';
// @ts-expect-error due to specific build options need to add .ts extension
import { Order } from './data.ts';

const URL = 'https://js.devexpress.com/Demos/Mvc/api/DataGridWebApi';

export type State = {
  orders: Order[],
  changes: DataChange[],
  editRowKey: number | null,
  isLoading: boolean,
};

export default createStore<State>({
  state: {
    orders: [],
    changes: [],
    editRowKey: null,
    isLoading: false,
  },
  mutations: {
    updateIsLoading(state, isLoading: boolean) {
      state.isLoading = isLoading;
    },

    updateEditRowKey(state, editRowKey: number | null) {
      state.editRowKey = editRowKey;
    },

    updateChanges(state, changes: DataChange[]) {
      state.changes = changes;
    },

    updateOrders(state, orders: Order[]) {
      state.orders = orders;
    },

    applyChangeToOrders(state, payload: { change: DataChange, data: Order }) {
      const { change, data } = payload;

      change.data = data;

      state.orders = applyChanges(state.orders, [change], { keyExpr: 'OrderID' });
    },
  },
  actions: {
    setEditRowKey(context, value: number | null) {
      context.commit('updateEditRowKey', value);
    },

    setChanges(context, value: DataChange[]) {
      context.commit('updateChanges', value);
    },

    async loadOrders(context) {
      context.commit('updateIsLoading', true);

      try {
        const { data: orders } = await sendRequest(`${URL}/Orders?skip=700`);
        context.commit('updateOrders', orders);
      } finally {
        context.commit('updateIsLoading', false);
      }
    },

    async insert(context, change: DataChange) {
      const newOrder = await sendRequest(`${URL}/InsertOrder`, 'POST', {
        values: JSON.stringify(change.data),
      });

      context.commit('applyChangeToOrders', { change, data: newOrder });
    },

    async update(context, change: DataChange) {
      const updatedOrder = await sendRequest(`${URL}/UpdateOrder`, 'PUT', {
        key: change.key,
        values: JSON.stringify(change.data),
      });

      context.commit('applyChangeToOrders', { change, data: updatedOrder });
    },

    async remove(context, change: DataChange) {
      const data = await sendRequest(`${URL}/DeleteOrder`, 'DELETE', { key: change.key });

      context.commit('applyChangeToOrders', { change, data });
    },

    async saveChange({ commit, dispatch }, change: DataChange) {
      if (change && change.type) {
        commit('updateIsLoading', true);

        try {
          await dispatch(change.type, change);
        } finally {
          commit('updateIsLoading', false);
        }
      }

      commit('updateEditRowKey', null);
      commit('updateChanges', []);
    },
  },
});
