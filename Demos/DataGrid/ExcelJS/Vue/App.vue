<template>
  <div>
    <DxDataGrid
      id="gridContainer"
      :data-source="orders"
      :show-borders="true"
      @exporting="exporting"
      @cell-prepared="cellPrepared"
    >
      <DxGroupPanel :visible="true"/>
      <DxGrouping :auto-expand-all="true"/>
      <DxSortByGroupSummaryInfo summary-item="count"/>

      <DxColumn
        :group-index="0"
        data-field="Employee"
      />
      <DxColumn
        :width="130"
        data-field="OrderNumber"
        caption="Invoice Number"
      />
      <DxColumn
        :width="160"
        data-field="OrderDate"
        data-type="date"
      />
      <DxColumn
        :group-index="1"
        data-field="CustomerStoreCity"
        caption="City"
      />
      <DxColumn
        data-field="CustomerStoreState"
        caption="State"
        cell-template="grid-cell"
      />
      <template #grid-cell="{ data }">
        <a
          href="http://example.com"
          target="_blank"
        >
          {{ data.text }}
        </a>
      </template>
      <DxColumn
        data-field="SaleAmount"
        alignment="right"
        format="currency"
        sort-order="desc"
      />
      <DxExport
        :enabled="true"
        :allow-export-selected-data="true"
      />
      <DxSelection mode="multiple"/>

      <DxSummary>
        <DxGroupItem
          :align-by-column="false"
          column="OrderNumber"
          summary-type="count"
          display-format="{0} orders"
        />
        <DxGroupItem
          :align-by-column="true"
          :show-in-group-footer="false"
          column="SaleAmount"
          summary-type="max"
          display-format="Max: {0}"
          value-format="currency"
        />
        <DxGroupItem
          :align-by-column="true"
          :show-in-group-footer="true"
          column="SaleAmount"
          summary-type="sum"
          display-format="Sum: {0}"
          value-format="currency"
        />

        <DxTotalItem
          column="SaleAmount"
          summary-type="sum"
          display-format="Total Sum: {0}"
          value-format="currency"
        />
      </DxSummary>
    </DxDataGrid>
  </div>
</template>
<script>
import { DxDataGrid, DxColumn, DxExport, DxSelection, DxSummary, DxGroupPanel, DxGrouping, DxGroupItem, DxSortByGroupSummaryInfo, DxTotalItem } from 'devextreme-vue/data-grid';
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
    DxDataGrid, DxColumn, DxExport, DxSelection, DxSummary, DxGroupPanel, DxGrouping, DxGroupItem, DxSortByGroupSummaryInfo, DxTotalItem
  },
  data() {
    return {
      orders: service.getOrders()
    };
  },
  methods: {
    exporting(e) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Main sheet');

      /*
        The 'DevExpress.excelExporter.exportDataGrid' function uses the ExcelJS library.
        For more information about ExcelJS, see:
          - https://github.com/exceljs/exceljs#contents
          - https://github.com/exceljs/exceljs#browser
      */

      exportDataGrid({
        component: e.component,
        worksheet: worksheet,
        topLeftCell: { row: 4, column: 1 },
        customizeCell: options => {

          /*
            The 'options.excelCell' field contains an ExcelJS object that describes an Excel cell.
            Refer to the following topics for more details about its members:
              - value and type - https://github.com/exceljs/exceljs#value-types
              - alignment - https://github.com/exceljs/exceljs#alignment
              - border - https://github.com/exceljs/exceljs#borders
              - fill - https://github.com/exceljs/exceljs#fills
              - font - https://github.com/exceljs/exceljs#fonts
              - numFmt - https://github.com/exceljs/exceljs#number-formats
            The 'options.gridCell' object fields are described in https://js.devexpress.com/Documentation/ApiReference/Common/Object_Structures/ExcelDataGridCell/
          */

          const gridCell = options.gridCell;
          const excelCell = options.excelCell;
          if(gridCell.rowType === 'data') {
            if(gridCell.data.OrderDate < new Date(2014, 2, 3)) {
              excelCell.font = { color: { argb: 'AAAAAA' } };
            }
            if(gridCell.data.SaleAmount > 15000) {
              if(gridCell.column.dataField === 'SaleAmount') {
                Object.assign(excelCell, {
                  font: { color: { argb: '000000' } },
                  fill: { type: 'pattern', pattern:'solid', fgColor: { argb:'FFBB00' } }
                });
              }
            }
            if(gridCell.column.dataField === 'CustomerStoreState') {
              Object.assign(excelCell, {
                value: { text: gridCell.value, hyperlink: 'http://example.com' },
                font: { color: { argb: 'FF0000FF' }, underline: true }
              });
            }
          }
          if(gridCell.rowType === 'group') {
            const nodeColors = [ 'BEDFE6', 'C9ECD7'];
            Object.assign(excelCell, {
              fill: { type: 'pattern', pattern:'solid', fgColor: { argb: nodeColors[gridCell.groupIndex] } }
            });
          }
          if(gridCell.rowType === 'groupFooter' && excelCell.value) {
            Object.assign(excelCell.font, { italic: true });
          }
        }
      }).then(function(cellRange) {
        // header
        worksheet.getRow(2).height = 20;
        worksheet.mergeCells(2, 1, 2, 4);
        Object.assign(worksheet.getRow(2).getCell(1), {
          value: 'Sales amounts report',
          font: { bold: true, size: 16 },
          alignment: { horizontal: 'center' }
        });
        // footer
        const currentRowIndex = cellRange.to.row + 2;
        worksheet.mergeCells(currentRowIndex, 1, currentRowIndex, 4);
        worksheet.getRow(currentRowIndex).getCell(1).value = 'For demonstration purposes only';
        Object.assign(worksheet.getRow(currentRowIndex).getCell(1), {
          font: { italic: true },
          alignment: { horizontal: 'right' }
        });
      }).then(function() {
        workbook.xlsx.writeBuffer().then(function(buffer) {
          saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'DataGrid.xlsx');
        });
      });
      e.cancel = true;
    },
    cellPrepared(e) {
      if(e.rowType === 'data') {
        if(e.data.OrderDate < new Date(2014, 2, 3)) {
          e.cellElement.style.color = '#AAAAAA';
        }
        if(e.data.SaleAmount > 15000) {
          if(e.column.dataField === 'OrderNumber') {
            e.cellElement.style.fontWeight = 'bold';
          }
          if(e.column.dataField === 'SaleAmount') {
            e.cellElement.style.backgroundColor = '#FFBB00';
            e.cellElement.style.color = '#000000';
          }
        }
      }
      if(e.rowType === 'group') {
        const nodeColors = [ '#BEDFE6', '#C9ECD7'];
        e.cellElement.style.backgroundColor = nodeColors[e.row.groupIndex];
        e.cellElement.style.color = '#000';
        if(e.cellElement.firstChild && e.cellElement.firstChild.style) e.cellElement.firstChild.style.color = '#000';
      }
      if(e.rowType === 'groupFooter') {
        e.cellElement.style.fontStyle = 'italic';
      }
    }
  }
};
</script>

<style scoped>
#gridContainer {
    height: 425px;
}

#header {
    font-weight: bold;
    font-size: 1.5em;
    text-align: center;
}

#footer {
    text-align: right;
    color: #bfbfbf;
}
</style>
