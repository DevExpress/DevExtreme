<template>
  <div class="dx-fieldset">
    <div class="dx-field">
      <div class="dx-field-label">DropDownBox with embedded TreeView</div>
      <div class="dx-field-value">
        <DxDropDownBox
          v-model:value="treeBoxValue"
          v-model:opened="isTreeBoxOpened"
          :input-attr="{ 'aria-label': 'Owner' }"
          :show-clear-button="true"
          :data-source="treeDataSource"
          value-expr="ID"
          display-expr="name"
          placeholder="Select a value..."
          @value-changed="syncTreeViewSelection()"
        >
          <template #content="{ data }">
            <DxTreeView
              ref="treeViewRef"
              :data-source="treeDataSource"
              :select-by-click="true"
              data-structure="plain"
              key-expr="ID"
              parent-id-expr="categoryId"
              selection-mode="single"
              display-expr="name"
              @content-ready="treeViewContentReady"
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
          v-model:opened="isGridBoxOpened"
          :input-attr="{ 'aria-label': 'Owner' }"
          :defer-rendering="false"
          :display-expr="gridBoxDisplayExpr"
          :show-clear-button="true"
          :data-source="gridDataSource"
          value-expr="ID"
          placeholder="Select a value..."
        >
          <template #content="{ data }">
            <DxDataGrid
              :data-source="gridDataSource"
              :columns="gridColumns"
              :hover-state-enabled="true"
              :show-borders="true"
              v-model:selected-row-keys="gridBoxValue"
              @selection-changed="onGridSelectionChanged()"
              height="100%"
            >
              <DxSelection mode="single"/>
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
import DxTreeView, { type DxTreeViewTypes } from 'devextreme-vue/tree-view';
import {
  DxDataGrid,
  DxSelection,
  DxPaging,
  DxFilterRow,
  DxScrolling,
} from 'devextreme-vue/data-grid';
import { CustomStore } from 'devextreme-vue/common/data';
import type dxTreeView from 'devextreme/ui/tree_view';
import 'whatwg-fetch';

const treeBoxValue = ref('1_1');
const isGridBoxOpened = ref(false);
const isTreeBoxOpened = ref(false);
const gridBoxValue = ref([3]);
const gridDataSource = makeAsyncDataSource('customers.json');
const treeDataSource = makeAsyncDataSource('treeProducts.json');
const gridColumns = ['CompanyName', 'City', 'Phone'];

const treeViewRef = ref<{ instance: dxTreeView } | null>(null);

function treeViewContentReady({
  component,
}: DxTreeViewTypes.ContentReadyEvent) {
  if (treeBoxValue.value) {
    component.selectItem(treeBoxValue.value);
  }
}

function makeAsyncDataSource(jsonFile: string) {
  return new CustomStore({
    loadMode: 'raw',
    key: 'ID',
    load() {
      return fetch(
        `../../../../data/${jsonFile}`,
      ).then((response) => response.json());
    },
  });
}

function syncTreeViewSelection() {
  if (!treeViewRef?.value?.instance) return;

  if (treeBoxValue.value) {
    treeViewRef.value.instance.selectItem(treeBoxValue.value);
  } else {
    treeViewRef.value.instance.unselectAll();
  }

  isTreeBoxOpened.value = false;
}

function treeViewItemSelectionChanged(
  e: DxTreeViewTypes.ItemSelectionChangedEvent,
) {
  const selectedKeys = e.component.getSelectedNodeKeys();
  treeBoxValue.value = selectedKeys.length > 0 ? selectedKeys[0] : null;
}

function gridBoxDisplayExpr(item: any) {
  return item && `${item.CompanyName} <${item.Phone}>`;
}

function onGridSelectionChanged() {
  isGridBoxOpened.value = false;
}
</script>
<style scoped>
.dx-fieldset {
  height: 500px;
}
</style>
