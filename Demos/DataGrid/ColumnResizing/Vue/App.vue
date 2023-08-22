<template>
  <div>
    <DxDataGrid
      id="orders"
      :data-source="orders"
      key-expr="ID"
      :allow-column-resizing="true"
      :show-borders="true"
      :column-resizing-mode="currentMode"
      :column-min-width="50"
      :column-auto-width="true"
      :columns="columns"
    />
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <span>Column resizing mode: </span>
        <DxSelectBox
          :items="resizingModes"
          v-model:value="currentMode"
          :input-attr="{ 'aria-label': 'Column Resizing Mode' }"
          :width="250"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import {
  DxDataGrid,
} from 'devextreme-vue/data-grid';
import DxSelectBox from 'devextreme-vue/select-box';
import { orders } from './data.js';

const columns = ['CompanyName', 'City', 'State', 'Phone', 'Fax'];
const resizingModes = ['nextColumn', 'widget'];
const currentMode = ref('nextColumn');

</script>
<style scoped>
#orders {
  max-height: 310px;
}

.options {
  padding: 20px;
  margin-top: 20px;
  background-color: rgba(191, 191, 191, 0.15);
}

.caption {
  font-weight: 500;
  font-size: 18px;
}

.option {
  margin-top: 10px;
}

.option > span {
  position: relative;
  top: 2px;
  margin-right: 10px;
}

.option > .dx-widget {
  display: inline-block;
  vertical-align: middle;
}
</style>
