<template>
  <div>
    <DxRangeSelector
      id="range-selector"
      :data-source="employees"
      v-model:value="range"
      title="Filter Employee List by Birth Year"
      data-source-field="BirthYear"
    >
      <DxMargin :top="20"/>
      <DxScale
        :tick-interval="1"
        :minor-tick-interval="1"
      >
        <DxLabel>
          <DxFormat type="decimal"/>
        </DxLabel>
      </DxScale>
      <DxBehavior value-change-mode="onHandleMove"/>
    </DxRangeSelector>
    <h2 class="grid-header">Selected Employees</h2>
    <DxDataGrid
      :data-source="selectedEmployees"
      :columns="columns"
      :show-borders="true"
      :column-auto-width="true"
    />
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  DxRangeSelector,
  DxMargin,
  DxScale,
  DxLabel,
  DxFormat,
  DxBehavior,
} from 'devextreme-vue/range-selector';
import { DxDataGrid } from 'devextreme-vue/data-grid';
import { employees } from './data.js';

const range = ref([]);
const columns = ref(['FirstName', 'LastName', 'BirthYear', 'City', 'Title']);

const selectedEmployees = computed(() => employees
  .filter((employee) => (employee.BirthYear >= range.value[0]
      && employee.BirthYear <= range.value[1]) || !range.value.length));
</script>
<style scoped>
#range-selector {
  height: 140px;
}

h2.grid-header {
  font-size: 20px;
  margin: 38px 0 10px;
  text-align: center;
}
</style>
