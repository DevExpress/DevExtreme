<template>
  <div>
    <DxDataGrid
      id="gridContainer"
      :data-source="employees"
      key-expr="ID"
      :allow-column-reordering="true"
      :allow-column-resizing="true"
      :column-auto-width="true"
      :show-borders="true"
    >
      <DxColumnChooser :enabled="true"/>
      <DxColumnFixing :enabled="true"/>
      <DxColumn
        :width="230"
        :fixed="true"
        :calculate-cell-value="calculateCellValue"
        caption="Employee"
      />
      <DxColumn
        data-field="BirthDate"
        data-type="date"
      />
      <DxColumn
        data-field="HireDate"
        data-type="date"
      />
      <DxColumn
        data-field="Position"
        alignment="right"
      />
      <DxColumn
        :width="230"
        data-field="Address"
      />
      <DxColumn data-field="City"/>
      <DxColumn data-field="State"/>
      <DxColumn
        :visible="false"
        data-field="Zipcode"
      />
      <DxColumn data-field="HomePhone"/>
      <DxColumn data-field="MobilePhone"/>
      <DxColumn data-field="Skype"/>
      <DxColumn data-field="Email"/>
    </DxDataGrid>
  </div>
</template>
<script>
import {
  DxDataGrid,
  DxColumn,
  DxColumnChooser,
  DxColumnFixing
} from 'devextreme-vue/data-grid';

import service from './data.js';

export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxColumnChooser,
    DxColumnFixing
  },
  data() {
    return {
      employees: service.getEmployees()
    };
  },
  methods: {
    calculateCellValue(data) {
      return [data.Title, data.FirstName, data.LastName].join(' ');
    }
  }
};
</script>
<style scoped>
#gridContainer {
  height: 440px;
}
</style>
