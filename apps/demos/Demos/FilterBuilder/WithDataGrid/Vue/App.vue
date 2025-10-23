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
      :data-source="products"
      :filter-value="gridFilterValue"
      :show-borders="true"
      :columns="fields as DxDataGridTypes.Column[]"
      :height="300"
    />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import DxFilterBuilder from 'devextreme-vue/filter-builder';
import DxButton from 'devextreme-vue/button';
import DxDataGrid, { type DxDataGridTypes } from 'devextreme-vue/data-grid';
import { filter, fields, products } from './data.ts';

const filterValue = ref(filter);
const gridFilterValue = ref(filter);

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
