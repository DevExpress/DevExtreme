<template>
  <div>
    <DxDataGrid
      id="gridContainer"
      :data-source="dataSource"
      key-expr="ID"
      :show-borders="true"
    >
      <DxExport
        :enabled="true"
        :allow-export-selected-data="true"
        file-name="Employees"
      />
      <DxSelection mode="multiple"/>
      <DxGroupPanel :visible="true"/>
      <DxColumn
        :width="60"
        data-field="Prefix"
        caption="Title"
      />
      <DxColumn data-field="FirstName"/>
      <DxColumn data-field="LastName"/>
      <DxColumn data-field="City"/>
      <DxColumn data-field="State"/>
      <DxColumn
        :width="130"
        data-field="Position"
      />
      <DxColumn
        :width="100"
        data-field="BirthDate"
        data-type="date"
      />
      <DxColumn
        :width="100"
        data-field="HireDate"
        data-type="date"
      />
    </DxDataGrid>
  </div>
</template>
<script>
import { DxDataGrid, DxColumn, DxExport, DxSelection, DxGroupPanel } from 'devextreme-vue/data-grid';
import service from './data.js';

export default {
  components: {
    DxDataGrid, DxColumn, DxExport, DxSelection, DxGroupPanel
  },
  data() {
    return {
      dataSource: service.getEmployees()
    };
  }
};
</script>
