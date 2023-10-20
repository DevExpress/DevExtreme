<template>
  <div>
    <DxPivotGrid
      :allow-sorting-by-summary="true"
      :allow-sorting="true"
      :allow-filtering="true"
      :allow-expand-all="true"
      :height="490"
      :show-borders="true"
      :data-source="dataSource"
      @exporting="onExporting"
      @cell-prepared="onCellPrepared"
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
} from 'devextreme-vue/pivot-grid';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import { Workbook } from 'exceljs';
// Our demo infrastructure requires us to use 'file-saver-es'.
// We recommend that you use the official 'file-saver' package in your applications.
import { saveAs } from 'file-saver-es';
import { exportPivotGrid } from 'devextreme/excel_exporter';
import { sales } from './data.js';

const dataSource = new PivotGridDataSource({
  fields: [{
    caption: 'Region',
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
  }, {
    caption: 'Sales',
    dataField: 'amount',
    dataType: 'number',
    summaryType: 'sum',
    format: 'currency',
    area: 'data',
  }],
  store: sales,
});

function onExporting(e) {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet('Sales');

  exportPivotGrid({
    component: e.component,
    worksheet,
    customizeCell: ({ pivotCell, excelCell }) => {
      if (isDataCell(pivotCell) || isTotalCell(pivotCell)) {
        const appearance = getConditionalAppearance(pivotCell);
        Object.assign(excelCell, getExcelCellFormat(appearance));
      }

      const borderStyle = { style: 'thin', color: { argb: 'FF7E7E7E' } };
      excelCell.border = {
        bottom: borderStyle,
        left: borderStyle,
        right: borderStyle,
        top: borderStyle,
      };
    },
  }).then(() => {
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Sales.xlsx');
    });
  });
}
function onCellPrepared({ cell, area, cellElement }) {
  cell.area = area;
  if (isDataCell(cell) || isTotalCell(cell)) {
    const appearance = getConditionalAppearance(cell);
    Object.assign(cellElement.style, getCssStyles(appearance));
  }
}
function isDataCell(cell) {
  return (cell.area === 'data' && cell.rowType === 'D' && cell.columnType === 'D');
}
function isTotalCell(cell) {
  return (cell.type === 'T' || cell.type === 'GT' || cell.rowType === 'T' || cell.rowType === 'GT' || cell.columnType === 'T' || cell.columnType === 'GT');
}
function getExcelCellFormat({ fill, font, bold = false }) {
  return {
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: fill } },
    font: { color: { argb: font }, bold },
  };
}
function getCssStyles({ fill, font, bold = false }) {
  return {
    'background-color': `#${fill}`,
    color: `#${font}`,
    'font-weight': bold ? 'bold' : undefined,
  };
}
function getConditionalAppearance(cell) {
  if (isTotalCell(cell)) {
    return { fill: 'F2F2F2', font: '3F3F3F', bold: true };
  }
  const { value } = cell;
  if (value < 20000) {
    return { font: '9C0006', fill: 'FFC7CE' };
  }
  if (value > 50000) {
    return { font: '006100', fill: 'C6EFCE' };
  }
  return { font: '9C6500', fill: 'FFEB9C' };
}

</script>
