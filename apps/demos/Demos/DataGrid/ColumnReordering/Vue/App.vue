<template>
  <div>
    <DxDataGrid
      id="gridContainer"
      :data-source="employees"
      key-expr="ID"
      :allow-column-reordering="true"
      :column-auto-width="true"
      :show-borders="true"
    >
      <DxColumnFixing :enabled="true"/>
      <DxColumn
        :fixed="true"
        :calculate-cell-value="calculateCellValue"
        caption="Employee"
      />
      <DxColumn
        data-field="BirthDate"
        data-type="date"
      />
      <DxColumn
        :width="190"
        data-field="Address"
        :fixed="true"
        fixedPosition="sticky"
      />
      <DxColumn data-field="Zipcode"/>
      <DxColumn
        data-field="HireDate"
        data-type="date"
      />
      <DxColumn
        data-field="Position"
        alignment="right"
      />
      <DxColumn
        data-field="City"
        :fixed="true"
        fixedPosition="right"
      />
      <DxColumn
        data-field="State"
        :fixed="true"
        fixedPosition="right"
      />
      <DxColumn data-field="Department"/>
      <DxColumn data-field="HomePhone"/>
      <DxColumn data-field="MobilePhone"/>
      <DxColumn data-field="Skype"/>
      <DxColumn data-field="Email"/>
    </DxDataGrid>
  </div>
</template>
<script setup lang="ts">
import {
  DxDataGrid,
  DxColumn,
  DxColumnFixing,
} from 'devextreme-vue/data-grid';
import { employees, Employee } from './data.ts';

function calculateCellValue(data: Employee) {
  return [data.Title, data.FirstName, data.LastName].join(' ');
}
</script>
<style scoped>
#gridContainer {
  height: 440px;
}
</style>
