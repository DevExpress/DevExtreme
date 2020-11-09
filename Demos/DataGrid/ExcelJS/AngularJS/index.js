var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
  $scope.gridOptions = {
    dataSource: orders,
    showBorders: true,
    selection: {
      mode: "multiple"
    },
    export: {
      enabled: true,
      allowExportSelectedData: true
    },
    groupPanel: {
      visible: true,
    },
    grouping: {
      autoExpandAll: true,
    },
    sortByGroupSummaryInfo: [{
      summaryItem: "count"
    }],
    columns: [
      {
        dataField: "Employee",
        groupIndex: 0,
      },
      {
        dataField: "OrderNumber",
        caption: "Invoice Number",
        width: 130,
      },
      {
        dataField: "OrderDate",
        dataType: "date",
        width: 160
      },
      {
        caption: "City",
        dataField: "CustomerStoreCity",
        groupIndex: 1
      },
      {
        caption: "State",
        dataField: "CustomerStoreState",
        cellTemplate: function(container, options) {
          return $("<a>", { "href": "http://example.com", "target": "_blank" }).text(options.value);
        }
      },
      {
        dataField: "SaleAmount",
        alignment: "right",
        format: "currency",
        sortOrder: "desc"
      }
    ],
    summary: {
      groupItems: [{
        column: "OrderNumber",
        summaryType: "count",
        displayFormat: "{0} orders",
      }, {
        column: "SaleAmount",
        summaryType: "max",
        displayFormat: "Max: {0}",
        valueFormat: "currency",
        alignByColumn: true,
        showInGroupFooter: false
      }, {
        column: "SaleAmount",
        summaryType: "sum",
        displayFormat: "Sum: {0}",
        valueFormat: "currency",
        alignByColumn: true,
        showInGroupFooter: true
      }],
      totalItems: [{
        column: "SaleAmount",
        summaryType: "sum",
        displayFormat: "Total Sum: {0}",
        valueFormat: "currency"
      }]
    },
    onExporting: function(e) {
      var workbook = new ExcelJS.Workbook();    
      var worksheet = workbook.addWorksheet('Main sheet');

      /*
        The 'DevExpress.excelExporter.exportDataGrid' function uses the ExcelJS library.
        For more information about ExcelJS, see:
          - https://github.com/exceljs/exceljs#contents
          - https://github.com/exceljs/exceljs#browser
      */

      DevExpress.excelExporter.exportDataGrid({
        component: e.component,
        worksheet: worksheet,
        topLeftCell: { row: 4, column: 1 },
        customizeCell: function(options) {

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

          var gridCell = options.gridCell;
          var excelCell = options.excelCell;
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
            if(gridCell.column.dataField === "CustomerStoreState") {
              Object.assign(excelCell, {
                value: { text: gridCell.value, hyperlink: "http://example.com" },
                font: { color: { argb: 'FF0000FF'}, underline: true }
              });
            }
          }
          if(gridCell.rowType === 'group') {
            var nodeColors = [ 'BEDFE6', 'C9ECD7'];
            Object.assign(excelCell, {
              fill: { type: 'pattern', pattern:'solid', fgColor: { argb: nodeColors[gridCell.groupIndex] }
              }
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
          value: "Sales amounts report",
          font: { bold: true, size: 16 },
          alignment: { horizontal: 'center' }
        });
        // footer
        var currentRowIndex = cellRange.to.row + 2;
        worksheet.mergeCells(currentRowIndex, 1, currentRowIndex, 4);
        worksheet.getRow(currentRowIndex).getCell(1).value = "For demonstration purposes only";
        Object.assign(worksheet.getRow(currentRowIndex).getCell(1), {
          font: { italic: true },
          alignment: { horizontal: 'right' }
        });
      }).then(function() {
        workbook.xlsx.writeBuffer().then(function(buffer) {
          saveAs(new Blob([buffer], { type: "application/octet-stream" }), "DataGrid.xlsx");
        });
      });
      e.cancel = true;
    },
    onCellPrepared: function(e) {
      if(e.rowType === 'data') {
        if(e.data.OrderDate < new Date(2014, 2, 3)) {
          e.cellElement.css({ color: '#AAAAAA' });
        }
        if(e.data.SaleAmount > 15000) {
          if(e.column.dataField === 'OrderNumber') {
            e.cellElement.css({ 'font-weight': 'bold' });
          }
          if(e.column.dataField === 'SaleAmount') {
            e.cellElement.css({ 'background-color': '#FFBB00', 'color': '#000' });
          }
        }
      }
      if(e.rowType === 'group') {
        var nodeColors = [ '#BEDFE6', '#C9ECD7'];
        e.cellElement.css({ 'background-color': nodeColors[e.row.groupIndex], 'color': '#000' });
        e.cellElement.children().css({ 'color': '#000' });
      }
      if(e.rowType === 'groupFooter') {
        e.cellElement.css({ 'font-style': 'italic' });
      }
    }
  };
});