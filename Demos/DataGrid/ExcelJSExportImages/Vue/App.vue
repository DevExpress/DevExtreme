<template>
  <div>
    <DxDataGrid
      id="gridContainer"
      :data-source="employees"
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
<script>
import { DxDataGrid, DxColumn, DxExport } from 'devextreme-vue/data-grid';
import { exportDataGrid } from 'devextreme/excel_exporter';
import ExcelJS from 'exceljs';
import saveAs from 'file-saver';
/*
  // Use this import for codeSandBox
  import FileSaver from 'file-saver';
*/
import service from './data.js';

export default {
  components: {
    DxDataGrid, DxColumn, DxExport
  },
  data() {
    return {
      employees: service.getEmployees()
    };
  },
  methods: {
    onExporting(e) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Main sheet');

      exportDataGrid({
        component: e.component,
        worksheet: worksheet,
        autoFilterEnabled: true,
        topLeftCell: { row: 2, column: 2 },
        customizeCell: ({ gridCell, excelCell }) => {
          if(gridCell.rowType === 'data') {
            if(gridCell.column.dataField === 'Picture') {
              excelCell.value = undefined;

              const image = workbook.addImage({
                base64: gridCell.value,
                extension: 'png',
              });

              worksheet.getRow(excelCell.row).height = 90;
              worksheet.addImage(image, {
                tl: { col: excelCell.col - 1, row: excelCell.row - 1 },
                br: { col: excelCell.col, row: excelCell.row }
              });
            }
          }
        }
      }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
          saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'DataGrid.xlsx');
        });
      });
      e.cancel = true;
    }
  }
};

</script>

<style scoped>
img {
    height: 100px;
}
</style>
