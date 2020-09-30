var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
  $scope.gridOptions = {
    dataSource: companies,
    showBorders: true,
    groupPanel: {
      visible: true
    },
    grouping: {
      autoExpandAll: true,
    },
    sortByGroupSummaryInfo: [{
      summaryItem: "count"
    }],
    columns: [{
      dataField: "Name",
      width: 190
    }, {
      dataField: "Address",
      width: 200
    },
    "City",
    {
      dataField: "State",
      groupIndex: 0
    }, {
      dataField: "Phone",
      format: function(value) {
        var USNumber = value.match(/(\d{3})(\d{3})(\d{4})/);
        return "(" + USNumber[1] + ") " + USNumber[2] + "-" + USNumber[3];
      }
    }, {
      dataField: "Website",
      caption: "",
      alignment: "center",
      width: 100,
      cellTemplate: function(container, options) {
        return $("<a>", { "href": options.value, "target": "_blank" }).text('Website');
      }
    }],
    summary: {
      totalItems: [{
        column: "Name",
        summaryType: "count",
        displayFormat: "Total count: {0} companies" }
      ]
    },
    export: {
      enabled: true
    },
    onExporting: function(e) {
      var workbook = new ExcelJS.Workbook();
      var worksheet = workbook.addWorksheet('Companies');
      
      // https://github.com/exceljs/exceljs#columns
      worksheet.columns = [
        { width: 5 }, { width: 30 }, { width: 25 }, { width: 15 }, { width: 25 }, { width: 40 }
      ];
      
      DevExpress.excelExporter.exportDataGrid({
        component: e.component,
        worksheet: worksheet,
        keepColumnWidths: false,
        topLeftCell: { row: 2, column: 2 },
        customizeCell: function(options) {
          var gridCell = options.gridCell;
          var excelCell = options.excelCell;
          
          if(gridCell.rowType === "data") {
            if(gridCell.column.dataField === 'Phone') {
              excelCell.value = parseInt(gridCell.value);
              // https://github.com/exceljs/exceljs#number-formats
              excelCell.numFmt = '[<=9999999]###-####;(###) ###-####';
            }
            if(gridCell.column.dataField === 'Website') {
              // https://github.com/exceljs/exceljs#hyperlink-value
              excelCell.value = { text: gridCell.value, hyperlink: gridCell.value };
              // https://github.com/exceljs/exceljs#fonts
              excelCell.font = { color: { argb: 'FF0000FF' }, underline: true };
              // https://github.com/exceljs/exceljs#alignment
              excelCell.alignment = { horizontal: 'left' };
            }
          }
          if(gridCell.rowType === "group") {
            // https://github.com/exceljs/exceljs#fills
            excelCell.fill = { type: 'pattern', pattern:'solid', fgColor: { argb: "BEDFE6" } };
          }
          if(gridCell.rowType === "totalFooter" && excelCell.value) {
            excelCell.font.italic = true;
          }
        }
      }).then(function() {
        workbook.xlsx.writeBuffer().then(function(buffer) {
          saveAs(new Blob([buffer], { type: "application/octet-stream" }), "Companies.xlsx");
        });
      });
      e.cancel = true;
    }
  };
});