<template>
  <div>
    <DxLoadPanel
      :position="loadPanelPosition"
      :visible="isLoading"
    />
    <DxDataGrid
      id="gridContainer"
      key-expr="OrderID"
      :data-source="orders"
      :show-borders="true"
      :repaint-changes-only="true"
      @saving="onSaving"
    >
      <DxEditing
        mode="row"
        :allow-adding="true"
        :allow-deleting="true"
        :allow-updating="true"
        v-model:changes="changes"
        v-model:edit-row-key="editRowKey"
      />
      <DxColumn
        data-field="OrderID"
        :allow-editing="false"
      />
      <DxColumn data-field="ShipName"/>
      <DxColumn data-field="ShipCountry"/>
      <DxColumn data-field="ShipCity"/>
      <DxColumn data-field="ShipAddress"/>
      <DxColumn
        data-field="OrderDate"
        data-type="date"
      />
      <DxColumn data-field="Freight"/>
    </DxDataGrid>
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <span>Edit Row Key:</span>
        <div id="editRowKey">{{ editRowKey === null ? "null" : editRowKey.toString() }}</div>
      </div>
      <div class="option">
        <span>Changes:</span>
        <div id="changes">{{ changesText }}</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';

import { DxDataGrid, DxColumn, DxEditing } from 'devextreme-vue/data-grid';
import { DxLoadPanel } from 'devextreme-vue/load-panel';

import { SavingEvent, DataChange } from 'devextreme/ui/data_grid';

import { State } from './store.ts';

const loadPanelPosition = { of: '#gridContainer' };

// eslint-disable-next-line react-hooks/rules-of-hooks
const store = useStore<State>();

const loadOrders = () => store.dispatch('loadOrders');
const setEditRowKey = (value: number | null) => store.dispatch('setEditRowKey', value);
const setChanges = (value: DataChange[]) => store.dispatch('setChanges', value);
const saveChange = (change: DataChange) => store.dispatch('saveChange', change);
const orders = computed(() => store.state.orders);
const isLoading = computed(() => store.state.isLoading);

const changes = computed({
  get: () => (store.state.changes),
  set: (value) => { setChanges(value); },
});

const editRowKey = computed({
  get: () => store.state.editRowKey,
  set: (value) => { setEditRowKey(value); },
});

const changesText = computed(() => JSON.stringify(changes.value.map((change) => ({
  type: change.type,
  key: change.type !== 'insert' ? change.key : undefined,
  data: change.data,
})), null, ' '));

const onSaving = (e: SavingEvent) => {
  e.cancel = true;
  e.promise = saveChange(e.changes[0]);
};

loadOrders();
</script>
<style scoped>
#gridContainer {
  height: 440px;
}

.options {
  padding: 20px;
  margin-top: 20px;
  background-color: rgba(191, 191, 191, 0.15);
}

.caption {
  margin-bottom: 10px;
  font-weight: 500;
  font-size: 18px;
}

.option {
  margin-bottom: 10px;
}

.option > span {
  position: relative;
  margin-right: 14px;
}

.option > div {
  display: inline-block;
  font-weight: bold;
}
</style>

