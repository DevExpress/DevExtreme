<template>
  <div>
    <div class="filter-container">
      <DxFilterBuilder
        :fields="fields"
        v-model:value="filterValue"
      />
      <DxButton
        text="Apply Filter"
        type="default"
        @click="buttonClick()"
      />
      <div class="dx-clearfix"/>
    </div>
    <DxDataGrid
      :data-source="dataSource"
      :filter-value="gridFilterValue"
      :show-borders="true"
      :columns="fields"
      :height="300"
    />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import DxFilterBuilder from 'devextreme-vue/filter-builder';
import DxButton from 'devextreme-vue/button';
import DxDataGrid from 'devextreme-vue/data-grid';
import DataSource from 'devextreme/data/data_source';
import ODataStore from 'devextreme/data/odata/store';
import { filter, fields } from './data.ts';

const filterValue = ref(filter);
const gridFilterValue = ref(filter);
const dataSource = new DataSource({
  store: new ODataStore({
    version: 2,
    fieldTypes: {
      Product_Cost: 'Decimal',
      Product_Sale_Price: 'Decimal',
      Product_Retail_Price: 'Decimal',
    },
    url: 'https://js.devexpress.com/Demos/DevAV/odata/Products',
  }),
  select: [
    'Product_ID',
    'Product_Name',
    'Product_Cost',
    'Product_Sale_Price',
    'Product_Retail_Price',
    'Product_Current_Inventory',
  ],
});

function buttonClick() {
  gridFilterValue.value = filterValue.value;
}
</script>
<style scoped>
.filter-container {
  background-color: transparent;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.14), 0 0 2px 0 rgba(0, 0, 0, 0.12);
  border-radius: 6px;
  padding: 5px;
  width: 500px;
  margin: 24px;
}

.dx-filterbuilder {
  background-color: transparent;
  padding: 10px;
}

.dx-button {
  margin: 10px;
  float: right;
}

.dx-filterbuilder .dx-numberbox {
  width: 80px;
}
</style>
