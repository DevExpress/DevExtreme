<template>
  <div>
    <DxPivotGrid
      :height="440"
      :show-borders="true"
      row-header-layout="tree"
      :data-source="dataSource"
      @exporting="onExporting"
    >
      <DxFieldChooser :enabled="false"/>
      <DxExport :enabled="true"/>
    </DxPivotGrid>
  </div>
</template>
<script setup lang="ts">
import DxPivotGrid, {
  DxExport,
  DxFieldChooser,
  DxPivotGridTypes,
} from 'devextreme-vue/pivot-grid';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import { Workbook } from 'exceljs';
// Our demo infrastructure requires us to use 'file-saver-es'.
// We recommend that you use the official 'file-saver' package in your applications.
import { saveAs } from 'file-saver-es';
import { exportPivotGrid } from 'devextreme/excel_exporter';
import { sales } from './data.ts';

const dataSource = new PivotGridDataSource({
  fields: [{
    caption: 'Region',
    dataField: 'region',
    area: 'row',
    expanded: true,
  }, {
    caption: 'City',
    dataField: 'city',
    area: 'row',
    width: 150,
  }, {
    dataField: 'date',
    dataType: 'date',
    area: 'column',
    expanded: true,
  }, {
    caption: 'Sales',
    dataField: 'amount',
    dataType: 'number',
    area: 'data',
    summaryType: 'sum',
    format: 'currency',
  }],
  store: sales,
});

function onExporting(e: DxPivotGridTypes.ExportingEvent) {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet('Sales');

  exportPivotGrid({
    component: e.component,
    worksheet,
  }).then(() => {
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Sales.xlsx');
    });
  });
}
</script>
