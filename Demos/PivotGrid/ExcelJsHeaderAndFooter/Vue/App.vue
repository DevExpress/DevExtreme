<template>
  <div>
    <div class="long-title">
      <h3>Sales Amount by Region</h3>
    </div>
    <DxPivotGrid
      :height="440"
      :show-borders="true"
      :allow-sorting="true"
      :allow-filtering="true"
      :data-source="dataSource"
      @exporting="onExporting"
    >
      <DxFieldPanel
        :show-data-fields="true"
        :show-row-fields="true"
        :show-column-fields="true"
        :show-filter-fields="true"
        :allow-field-dragging="true"
        :visible="true"
      />
      <DxFieldChooser :enabled="false"/>
      <DxExport :enabled="true"/>
    </DxPivotGrid>
    <div class="export-options">
      <div class="caption">Export Options</div>
      <div class="options">
        <DxCheckBox
          id="export-data-field-headers"
          :value="exportDataFieldHeaders"
          :on-value-changed="onExportDataFieldHeadersChanged"
          text="Export Data Field Headers"
        />
        <DxCheckBox
          id="export-row-field-headers"
          :value="exportRowFieldHeaders"
          :on-value-changed="onExportRowFieldHeadersChanged"
          text="Export Row Field Headers"
        />
        <DxCheckBox
          id="export-column-field-headers"
          :value="exportColumnFieldHeaders"
          :on-value-changed="onExportColumnFieldHeadersChanged"
          text="Export Column Field Headers"
        />
        <DxCheckBox
          id="export-filter-field-headers"
          :value="exportFilterFieldHeaders"
          :on-value-changed="onExportFilterFieldHeadersChanged"
          text="Export Filter Field Headers"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import DxPivotGrid, {
  DxExport,
  DxFieldChooser,
  DxFieldPanel,
} from 'devextreme-vue/pivot-grid';
import DxCheckBox from 'devextreme-vue/check-box';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import { exportPivotGrid } from 'devextreme/excel_exporter';
import { sales } from './data.js';

const exportDataFieldHeaders = ref(false);
const exportRowFieldHeaders = ref(false);
const exportColumnFieldHeaders = ref(false);
const exportFilterFieldHeaders = ref(false);
const dataSource = new PivotGridDataSource({
  fields: [{
    caption: 'Region',
    width: 120,
    dataField: 'region',
    area: 'row',
    expanded: true,
  }, {
    caption: 'City',
    dataField: 'city',
    width: 150,
    area: 'row',
  }, {
    dataField: 'date',
    dataType: 'date',
    area: 'column',
    filterValues: [[2013], [2014], [2015]],
    expanded: false,
  }, {
    caption: 'Sales',
    dataField: 'amount',
    dataType: 'number',
    summaryType: 'sum',
    format: 'currency',
    area: 'data',
  }, {
    caption: 'Country',
    dataField: 'country',
    area: 'filter',
  }],
  store: sales,
});

function onExportDataFieldHeadersChanged({ value }) {
  exportDataFieldHeaders.value = value;
}
function onExportRowFieldHeadersChanged({ value }) {
  exportRowFieldHeaders.value = value;
}
function onExportColumnFieldHeadersChanged({ value }) {
  exportColumnFieldHeaders.value = value;
}
function onExportFilterFieldHeadersChanged({ value }) {
  exportFilterFieldHeaders.value = value;
}
function onExporting(e) {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet('Sales');

  worksheet.columns = [
    { width: 30 }, { width: 20 }, { width: 30 }, { width: 30 }, { width: 30 }, { width: 30 },
  ];

  exportPivotGrid({
    component: e.component,
    worksheet,
    topLeftCell: { row: 4, column: 1 },
    keepColumnWidths: false,
    exportDataFieldHeaders: exportDataFieldHeaders.value,
    exportRowFieldHeaders: exportRowFieldHeaders.value,
    exportColumnFieldHeaders: exportColumnFieldHeaders.value,
    exportFilterFieldHeaders: exportFilterFieldHeaders.value,
  }).then((cellRange) => {
    // Header
    const headerRow = worksheet.getRow(2);
    const worksheetView: any = worksheet.views[0];

    headerRow.height = 30;

    const columnFromIndex = worksheetView.xSplit + 1;
    const columnToIndex = columnFromIndex + 3;
    worksheet.mergeCells(2, columnFromIndex, 2, columnToIndex);

    const headerCell = headerRow.getCell(columnFromIndex);
    headerCell.value = 'Sales Amount by Region';
    headerCell.font = { name: 'Segoe UI Light', size: 22, bold: true };
    headerCell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };

    // Footer
    const footerRowIndex = (cellRange?.to?.row ?? 0) + 2;
    const footerCell = worksheet.getRow(footerRowIndex).getCell(cellRange?.to?.column ?? 0);
    footerCell.value = 'www.wikipedia.org';
    footerCell.font = { color: { argb: 'BFBFBF' }, italic: true };
    footerCell.alignment = { horizontal: 'right' };
  }).then(() => {
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Sales.xlsx');
    });
  });
}
// Our demo infrastructure requires us to use 'file-saver-es'.
// We recommend that you use the official 'file-saver' package in your applications.
</script>
<style scoped>
.long-title h3 {
  font-family:
    "Segoe UI Light",
    "Helvetica Neue Light",
    "Segoe UI",
    "Helvetica Neue",
    "Trebuchet MS",
    Verdana;
  font-weight: 200;
  font-size: 28px;
  text-align: center;
  margin-bottom: 20px;
}

.export-options {
  padding: 20px;
  margin-top: 20px;
  background-color: rgba(191, 191, 191, 0.15);
}

.caption {
  font-size: 18px;
  font-weight: 500;
}

.options {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 12px;
  margin-top: 10px;
}

@media (min-width: 500px) {
  .options {
    grid-template-columns: 250px 1fr;
  }
}

@media (min-width: 1000px) {
  .options {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
