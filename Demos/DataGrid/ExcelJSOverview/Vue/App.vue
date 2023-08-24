<template>
  <div>
    <DxDataGrid
      id="gridContainer"
      :data-source="employees"
      :key-expr="'ID'"
      :width="'100%'"
      :show-borders="true"
      @exporting="onExporting"
    >
      <DxGroupPanel :visible="true"/>
      <DxGrouping :auto-expand-all="true"/>
      <DxExport
        :enabled="true"
        :allow-export-selected-data="true"
      />
      <DxSelection mode="multiple"/>
      <DxColumn data-field="FirstName"/>
      <DxColumn data-field="LastName"/>
      <DxColumn data-field="City"/>
      <DxColumn
        data-field="State"
        :group-index="0"
      />
      <DxColumn
        data-field="Position"
        :width="130"
      />
      <DxColumn
        data-field="BirthDate"
        data-type="date"
        :width="100"
      />
      <DxColumn
        data-field="HireDate"
        data-type="date"
        :width="100"
      />
    </DxDataGrid>
  </div>
</template>
<script setup lang="ts">
import {
  DxDataGrid, DxColumn, DxExport, DxSelection, DxGroupPanel, DxGrouping,
} from 'devextreme-vue/data-grid';

import { Workbook } from 'exceljs';
// Our demo infrastructure requires us to use 'file-saver-es'.
// We recommend that you use the official 'file-saver' package in your applications.
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { ExportingEvent } from 'devextreme/ui/data_grid';

import { employees } from './data.ts';

const onExporting = (e: ExportingEvent) => {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet('Employees');

  exportDataGrid({
    component: e.component,
    worksheet,
    autoFilterEnabled: true,
  }).then(() => {
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'DataGrid.xlsx');
    });
  });

  e.cancel = true;
};
</script>

<style scoped>
#gridContainer {
  height: 423px;
}
</style>
