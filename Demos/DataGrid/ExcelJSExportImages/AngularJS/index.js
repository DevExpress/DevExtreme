var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
  $scope.gridOptions = {
    dataSource: employees,
    showBorders: true,
    showRowLines: true,
    showColumnLines: false,
    export: {
      enabled: true
    },
    columns: [
      {
        dataField: "Picture",
        width: 90,
        cellTemplate: function (container, options) {
          $("<div>")
            .append($("<img>", { "src": options.value }))
            .appendTo(container);
        }
      },
      "FirstName",
      "LastName",
      "Position",
      {
        dataField: "BirthDate",
        dataType: "date"
      }, {
        dataField: "HireDate",
        dataType: "date"
      }
    ],
    onExporting: function(e) {
      var workbook = new ExcelJS.Workbook();
      var worksheet = workbook.addWorksheet('Main sheet');

      DevExpress.excelExporter.exportDataGrid({
        component: e.component,
        worksheet: worksheet,
        autoFilterEnabled: true,
        topLeftCell: { row: 2, column: 2 },
        customizeCell: function(options) {
          var gridCell = options.gridCell;
          var excelCell = options.excelCell;

          if(gridCell.rowType === "data") {
            if(gridCell.column.dataField === "Picture") {
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
      }).then(function() {
        workbook.xlsx.writeBuffer().then(function(buffer) {
          saveAs(new Blob([buffer], { type: "application/octet-stream" }), "DataGrid.xlsx");
        });
      });
      e.cancel = true;
    }
  }
});