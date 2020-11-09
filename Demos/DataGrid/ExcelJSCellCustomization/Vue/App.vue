<template>
  <div>
    <DxDataGrid
      id="gridContainer"
      :data-source="companies"
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
<script>
import { DxDataGrid, DxColumn, DxExport, DxSelection, DxSummary, DxGroupPanel, DxGrouping, DxSortByGroupSummaryInfo, DxTotalItem } from 'devextreme-vue/data-grid';
import { exportDataGrid } from 'devextreme/excel_exporter';
import ExcelJS from 'exceljs';
import saveAs from 'file-saver';
/*
  // Use this import for codeSandBox
  import FileSaver from "file-saver";
*/
import service from './data.js';

export default {
  components: {
    DxDataGrid, DxColumn, DxExport, DxSelection, DxSummary, DxGroupPanel, DxGrouping, DxSortByGroupSummaryInfo, DxTotalItem
  },
  data() {
    return {
      companies: service.getCompanies()
    };
  },
  methods: {
    onExporting(e) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Companies');

      worksheet.columns = [
        { width: 5 }, { width: 30 }, { width: 25 }, { width: 15 }, { width: 25 }, { width: 40 }
      ];

      exportDataGrid({
        component: e.component,
        worksheet: worksheet,
        keepColumnWidths: false,
        topLeftCell: { row: 2, column: 2 },
        customizeCell: ({ gridCell, excelCell }) => {
          if(gridCell.rowType === 'data') {
            if(gridCell.column.dataField === 'Phone') {
              excelCell.value = parseInt(gridCell.value);
              excelCell.numFmt = '[<=9999999]###-####;(###) ###-####';
            }
            if(gridCell.column.dataField === 'Website') {
              excelCell.value = { text: gridCell.value, hyperlink: gridCell.value };
              excelCell.font = { color: { argb: 'FF0000FF' }, underline: true };
              excelCell.alignment = { horizontal: 'left' };
            }
          }
          if(gridCell.rowType === 'group') {
            excelCell.fill = { type: 'pattern', pattern:'solid', fgColor: { argb: 'BEDFE6' } };
          }
          if(gridCell.rowType === 'totalFooter' && excelCell.value) {
            excelCell.font.italic = true;
          }
        }
      }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
          saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Companies.xlsx');
        });
      });
      e.cancel = true;
    },
    phoneNumberFormat(value) {
      const USNumber = value.match(/(\d{3})(\d{3})(\d{4})/);

      return `(${ USNumber[1] }) ${ USNumber[2] }-${ USNumber[3] }`;
    }
  }
};
</script>

<style scoped>
#gridContainer {
  height: 436px;
}
</style>
