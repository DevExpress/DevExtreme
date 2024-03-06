<template>
  <div class="dx-fieldset">
    <div class="dx-field">
      <div class="dx-field-label">DropDownBox with embedded TreeView</div>
      <div class="dx-field-value">
        <DxDropDownBox
          v-model:value="treeBoxValue"
          :show-clear-button="true"
          :input-attr="{ 'aria-label': 'Owner' }"
          :data-source="treeDataSource"
          value-expr="ID"
          display-expr="name"
          placeholder="Select a value..."
          @value-changed="syncTreeViewSelection()"
        >
          <template #content="{ data }">
            <DxTreeView
              :data-source="treeDataSource"
              :select-by-click="true"
              :select-nodes-recursive="false"
              data-structure="plain"
              key-expr="ID"
              parent-id-expr="categoryId"
              selection-mode="multiple"
              show-check-boxes-mode="normal"
              display-expr="name"
              @content-ready="treeViewContentReady($event)"
              @item-selection-changed="treeViewItemSelectionChanged($event)"
            />
          </template>
        </DxDropDownBox>
      </div>
    </div>
    <div class="dx-field">
      <div class="dx-field-label">DropDownBox with embedded DataGrid</div>
      <div class="dx-field-value">
        <DxDropDownBox
          v-model:value="gridBoxValue"
          :input-attr="{ 'aria-label': 'Owner' }"
          :defer-rendering="false"
          :show-clear-button="true"
          :data-source="gridDataSource"
          display-expr="CompanyName"
          value-expr="ID"
          placeholder="Select a value..."
        >
          <template #content="{ data }">
            <DxDataGrid
              :height="345"
              :data-source="gridDataSource"
              :columns="gridColumns"
              :hover-state-enabled="true"
              v-model:selected-row-keys="gridBoxValue"
            >
              <DxSelection mode="multiple"/>
              <DxPaging
                :enabled="true"
                :page-size="10"
              />
              <DxFilterRow :visible="true"/>
              <DxScrolling mode="virtual"/>
            </DxDataGrid>
          </template>
        </DxDropDownBox>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import DxDropDownBox from 'devextreme-vue/drop-down-box';
import DxTreeView from 'devextreme-vue/tree-view';
import {
  DxDataGrid, DxSelection, DxPaging, DxFilterRow, DxScrolling,
} from 'devextreme-vue/data-grid';
import CustomStore from 'devextreme/data/custom_store';
import 'whatwg-fetch';

const treeBoxValue = ref(['1_1']);
const gridBoxValue = ref([3]);
const treeDataSource = makeAsyncDataSource('treeProducts.json');
const gridDataSource = makeAsyncDataSource('customers.json');
const gridColumns = ref(['CompanyName', 'City', 'Phone']);
let treeView = null;

function treeViewContentReady({ component }) {
  treeView = component;
  syncTreeViewSelection();
}

function makeAsyncDataSource(jsonFile) {
  return new CustomStore({
    loadMode: 'raw',
    key: 'ID',
    load() {
      return fetch(`../../../../data/${jsonFile}`)
        .then((response) => response.json());
    },
  });
}

function syncTreeViewSelection() {
  const value = treeBoxValue.value;

  if (treeView) {
    if (value === null) {
      treeView.unselectAll();
    } else {
      value?.forEach((val) => {
        treeView.selectItem(val);
      });
    }
  }
}

function treeViewItemSelectionChanged(e) {
  treeBoxValue.value = e.component.getSelectedNodeKeys();
}
</script>
<style scoped>
.dx-fieldset {
  height: 500px;
}
</style>
