<template>
  <div>
    <DxDataGrid
      id="gridContainer"
      :data-source="employees"
      key-expr="ID"
      :show-borders="true"
      :show-row-lines="true"
      :show-column-lines="false"
      @exporting="onExporting"
    >
      <DxColumn
        data-field="Picture"
        :width="90"
        cell-template="grid-cell-template"
      />
      <DxColumn data-field="FirstName"/>
      <DxColumn data-field="LastName"/>
      <DxColumn data-field="Position"/>
      <DxColumn
        data-field="BirthDate"
        data-type="date"
      />
      <DxColumn
        data-field="HireDate"
        data-type="date"
      />

      <template #grid-cell-template="{ data }">
        <div>
          <img
            :src="data.value"
          >
        </div>
      </template>

      <DxExport :enabled="true"/>
    </DxDataGrid>
  </div>
</template>
<script setup lang="ts">
import {
  DxDataGrid, DxColumn, DxExport, DxDataGridTypes,
} from 'devextreme-vue/data-grid';
import { Anchor, Workbook } from 'exceljs';
// Our demo infrastructure requires us to use 'file-saver-es'.
// We recommend that you use the official 'file-saver' package in your applications.
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { employees } from './data.ts';

const onExporting = (e: DxDataGridTypes.ExportingEvent) => {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet('Main sheet');

  exportDataGrid({
    component: e.component,
    worksheet,
    autoFilterEnabled: true,
    topLeftCell: { row: 2, column: 2 },
    customizeCell: ({ gridCell, excelCell }) => {
      if (gridCell.rowType === 'data') {
        if (gridCell.column.dataField === 'Picture') {
          excelCell.value = undefined;

          const image = workbook.addImage({
            base64: gridCell.value,
            extension: 'png',
          });

          worksheet.getRow(excelCell.row).height = 90;
          worksheet.addImage(image, {
            // NOTE: casting these objects to the Anchor type manually because of this issue:
            // https://github.com/exceljs/exceljs/issues/1747
            tl: { col: excelCell.col - 1, row: excelCell.row - 1 } as Anchor,
            br: { col: excelCell.col, row: excelCell.row } as Anchor,
          });
        }
      }
    },
  }).then(() => {
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'DataGrid.xlsx');
    });
  });
  e.cancel = true;
};
</script>

<style scoped>
img {
  height: 100px;
}
</style>
