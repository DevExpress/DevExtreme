const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.selectedItemsText = 'Nobody has been selected';
  $scope.recursiveSelectionEnabled = false;
  $scope.selectionMode = 'all';
  $scope.selectedRowKeys = [];

  function getEmployeeNames(employees) {
    if (employees.length > 0) {
      return employees.map((employee) => employee.Full_Name).join(', ');
    }
    return 'Nobody has been selected';
  }

  $scope.$watch('recursiveSelectionEnabled', () => {
    $scope.selectedRowKeys = [];
  });

  $scope.$watch('selectionMode', () => {
    $scope.selectedRowKeys = [];
  });

  $scope.treeListOptions = {
    dataSource: employees,
    keyExpr: 'ID',
    parentIdExpr: 'Head_ID',
    showRowLines: true,
    showBorders: true,
    columnAutoWidth: true,
    selection: {
      mode: 'multiple',
    },
    bindingOptions: {
      selectedRowKeys: 'selectedRowKeys',
      'selection.recursive': 'recursiveSelectionEnabled',
    },
    columns: [{
      dataField: 'Full_Name',
    }, {
      dataField: 'Title',
      caption: 'Position',
    }, 'City', 'State',
    {
      dataField: 'Hire_Date',
      dataType: 'date',
      width: 120,
    },
    ],
    expandedRowKeys: [1, 2, 10],
    onSelectionChanged(e) {
      const selectedData = e.component.getSelectedRowsData($scope.selectionMode);
      $scope.selectedItemsText = getEmployeeNames(selectedData);
    },
  };

  $scope.recursiveOptions = {
    text: 'Recursive Selection',
    bindingOptions: {
      value: 'recursiveSelectionEnabled',
    },
  };

  $scope.selectionModeOptions = {
    items: ['all', 'excludeRecursive', 'leavesOnly'],
    bindingOptions: {
      value: 'selectionMode',
    },
  };
});
