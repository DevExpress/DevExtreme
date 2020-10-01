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
      <DxBehavior call-value-changed="onMoving"/>
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
<script>
import { employees } from './data.js';
import {
  DxRangeSelector,
  DxMargin,
  DxScale,
  DxLabel,
  DxFormat,
  DxBehavior
} from 'devextreme-vue/range-selector';
import { DxDataGrid } from 'devextreme-vue/data-grid';

export default {
  components: {
    DxDataGrid,
    DxRangeSelector,
    DxMargin,
    DxScale,
    DxLabel,
    DxFormat,
    DxBehavior
  },
  data() {
    return {
      employees,
      range: [],
      columns: ['FirstName', 'LastName', 'BirthYear', 'City', 'Title'],
      format: {
        type: 'decimal'
      }
    };
  },
  computed: {
    selectedEmployees() {
      return employees.filter(employee => employee.BirthYear >= this.range[0] && employee.BirthYear <= this.range[1] || !this.range.length);
    }
  }
};
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
