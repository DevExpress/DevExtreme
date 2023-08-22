<template>
  <div>
    <div id="descContainer">Sort and filter data, group, reorder and resize columns,
      change page numbers and page size. Once you are done, <a @click="onRefreshClick">refresh</a>
      the web page to see that the grid’s state is automatically persisted to continue working from
      where you stopped or you can <a @click="onStateResetClick">reset</a>
      the grid to its initial state.</div>
    <DxDataGrid
      id="gridContainer"
      ref="dataGrid"
      :data-source="orders"
      :key-expr="'ID'"
      :allow-column-resizing="true"
      :allow-column-reordering="true"
      :width="'100%'"
      :show-borders="true"
    >
      <DxSelection mode="single"/>
      <DxFilterRow :visible="true"/>
      <DxGroupPanel :visible="true"/>
      <DxStateStoring
        :enabled="true"
        type="localStorage"
        storage-key="storage"
      />
      <DxPager
        :show-page-size-selector="true"
        :allowed-page-sizes="[5, 10, 20]"
      />
      <DxColumn
        :width="130"
        data-field="OrderNumber"
        caption="Invoice Number"
      />
      <DxColumn
        data-field="OrderDate"
        sort-order="desc"
        data-type="date"
      />
      <DxColumn
        data-field="SaleAmount"
        alignment="right"
        format="currency"
      />
      <DxColumn data-field="Employee"/>
      <DxColumn
        data-field="CustomerStoreCity"
        caption="City"
      />
      <DxColumn
        :group-index="0"
        data-field="CustomerStoreState"
        caption="State"
      />
    </DxDataGrid>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import {
  DxDataGrid, DxSelection, DxFilterRow, DxGroupPanel, DxStateStoring, DxPager, DxColumn,
} from 'devextreme-vue/data-grid';
import { orders } from './data.js';

const dataGrid = ref<DxDataGrid | null>(null);

const onRefreshClick = () => {
  window.location.reload();
};

const onStateResetClick = () => {
  dataGrid.value!.instance?.state(null);
};
</script>
<style scoped>
#gridContainer {
  height: 440px;
  margin-top: 30px;
}

#descContainer a {
  color: #f05b41;
  text-decoration: underline;
  cursor: pointer;
}

#descContainer a:hover {
  text-decoration: none;
}
</style>
