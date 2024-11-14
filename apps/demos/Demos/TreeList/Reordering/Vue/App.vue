<template>
  <div>
    <DxTreeList
      id="employees"
      :data-source="employees"
      key-expr="ID"
      parent-id-expr="Head_ID"
      :allow-column-reordering="true"
      :column-auto-width="true"
      :show-borders="true"
      :show-row-lines="true"
      :auto-expand-all="true"
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
        fixed-position="sticky"
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
        fixed-position="right"
      />
      <DxColumn
        data-field="State"
        :fixed="true"
        fixed-position="right"
      />
      <DxColumn data-field="Department"/>
      <DxColumn data-field="HomePhone"/>
      <DxColumn data-field="MobilePhone"/>
      <DxColumn data-field="Skype"/>
      <DxColumn data-field="Email"/>
    </DxTreeList>
  </div>
</template>
<script setup lang="ts">
import { DxTreeList, DxColumn, DxColumnFixing } from 'devextreme-vue/tree-list';
import { Employee, employees } from './data.ts';

function calculateCellValue(data: Employee) {
  return [data.Title, data.FirstName, data.LastName].join(' ');
}
</script>
<style scoped>
#employees {
  max-height: 440px;
}
</style>
