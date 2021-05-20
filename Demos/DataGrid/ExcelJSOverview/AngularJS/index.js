var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
  $scope.gridOptions = {
    dataSource: employees,
    keyExpr: "ID",
      showBorders: true,
      selection: {
        mode: 'multiple'
      },
      groupPanel: {
        visible: true
      },
      export: {
        enabled: true,
        allowExportSelectedData: true
      },
      onExporting: function(e) {
        var workbook = new ExcelJS.Workbook();
        var worksheet = workbook.addWorksheet('Employees');
        
        DevExpress.excelExporter.exportDataGrid({
          component: e.component,
          worksheet: worksheet,
          autoFilterEnabled: true
        }).then(function() {
          workbook.xlsx.writeBuffer().then(function(buffer) {
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Employees.xlsx');
          });
        });
        e.cancel = true;
      },
      columns: [
        'FirstName',
        'LastName',
        'City',
        {
          dataField: 'State',
          groupIndex: 0 
        }, {
          dataField: 'Position',
          width: 130
        }, {
          dataField: 'BirthDate',
          dataType: 'date',
          width: 100
        }, {
          dataField: 'HireDate',
          dataType: 'date',
          width: 100
        }
      ]
  };
});