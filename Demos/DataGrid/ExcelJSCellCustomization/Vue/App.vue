<template>
  <div>
    <DxDataGrid
      id="gridContainer"
      :data-source="companies"
      :key-expr="'ID'"
      :width="'100%'"
      :show-borders="true"
      @exporting="onExporting"
    >
      <DxGroupPanel :visible="true"/>
      <DxGrouping :auto-expand-all="true"/>
      <DxSortByGroupSummaryInfo summary-item="count"/>

      <DxColumn
        data-field="Name"
        :width="190"
      />
      <DxColumn
        data-field="Address"
        :width="200"
      />
      <DxColumn data-field="City"/>
      <DxColumn
        data-field="State"
        :group-index="0"
      />
      <DxColumn
        data-field="Phone"
        :format="phoneNumberFormat"
      />
      <DxColumn
        data-field="Website"
        caption=""
        alignment="center"
        :width="100"
        cell-template="grid-cell"
      />
      <template #grid-cell="{ data }">
        <a
          :href="data.text"
          target="_blank"
        >
          Website
        </a>
      </template>

      <DxExport
        :enabled="true"
      />

      <DxSummary>
        <DxTotalItem
          column="Name"
          summary-type="count"
          display-format="Total count: {0} companies"
        />
      </DxSummary>
    </DxDataGrid>
  </div>
</template>
<script setup lang="ts">
import {
  DxDataGrid,
  DxColumn,
  DxExport,
  DxSummary,
  DxGroupPanel,
  DxGrouping,
  DxSortByGroupSummaryInfo,
  DxTotalItem,
  DxDataGridTypes,
} from 'devextreme-vue/data-grid';
import { Workbook } from 'exceljs';
// Our demo infrastructure requires us to use 'file-saver-es'.
// We recommend that you use the official 'file-saver' package in your applications.
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { companies } from './data.ts';

const onExporting = (e: DxDataGridTypes.ExportingEvent) => {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet('Companies');

  worksheet.columns = [
    { width: 5 }, { width: 30 }, { width: 25 }, { width: 15 }, { width: 25 }, { width: 40 },
  ];

  exportDataGrid({
    component: e.component,
    worksheet,
    keepColumnWidths: false,
    topLeftCell: { row: 2, column: 2 },
    customizeCell: ({ gridCell, excelCell }) => {
      if (gridCell.rowType === 'data') {
        if (gridCell.column.dataField === 'Phone') {
          excelCell.value = parseInt(gridCell.value, 10);
          excelCell.numFmt = '[<=9999999]###-####;(###) ###-####';
        }
        if (gridCell.column.dataField === 'Website') {
          excelCell.value = { text: gridCell.value, hyperlink: gridCell.value };
          excelCell.font = { color: { argb: 'FF0000FF' }, underline: true };
          excelCell.alignment = { horizontal: 'left' };
        }
      }
      if (gridCell.rowType === 'group') {
        excelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'BEDFE6' } };
      }
      if (gridCell.rowType === 'totalFooter' && excelCell.value) {
        excelCell.font.italic = true;
      }
    },
  }).then(() => {
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Companies.xlsx');
    });
  });
  e.cancel = true;
};

const phoneNumberFormat = (value: string) => {
  const USNumber = value.match(/(\d{3})(\d{3})(\d{4})/)!;

  return `(${USNumber[1]}) ${USNumber[2]}-${USNumber[3]}`;
};
</script>

<style scoped>
#gridContainer {
  height: 436px;
}
</style>
