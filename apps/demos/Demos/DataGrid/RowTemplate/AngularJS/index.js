const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.dataGridOptions = {
    dataSource: employees,
    keyExpr: 'ID',
    dataRowTemplate: $('#gridRow'),
    rowAlternationEnabled: true,
    hoverStateEnabled: true,
    columnAutoWidth: true,
    showBorders: true,
    columns: [{
      caption: 'Photo',
      width: 100,
      allowFiltering: false,
      allowSorting: false,
    }, {
      dataField: 'Prefix',
      caption: 'Title',
      width: 70,
    },
    'FirstName',
    'LastName',
    'Position', {
      dataField: 'BirthDate',
      dataType: 'date',
    }, {
      dataField: 'HireDate',
      dataType: 'date',
    },
    ],
  };
});
