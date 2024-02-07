const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.selectedItemsText = 'Nobody has been selected';
  $scope.selectedPrefix = null;
  $scope.clearButtonDisabled = true;

  $scope.selectPrefixOptions = {
    dataSource: ['All', 'Dr.', 'Mr.', 'Mrs.', 'Ms.'],
    placeholder: 'Select title',
    width: 150,
    bindingOptions: {
      value: 'selectedPrefix',
    },
    onValueChanged(data) {
      const dataGrid = $('#grid-container').dxDataGrid('instance');

      if (!data.value) { return; }

      if (data.value === 'All') {
        dataGrid.selectAll();
      } else {
        const employeesToSelect = $.map($.grep(dataGrid.option('dataSource'), (item) => item.Prefix === data.value), (item) => item.ID);
        dataGrid.selectRows(employeesToSelect);
      }

      $scope.selectedPrefix = data.value;
    },
  };

  $scope.clearButtonOptions = {
    text: 'Clear Selection',
    bindingOptions: {
      disabled: 'clearButtonDisabled',
    },
    onClick() {
      $('#grid-container').dxDataGrid('instance').clearSelection();
    },
  };

  $scope.gridOptions = {
    dataSource: employees,
    keyExpr: 'ID',
    showBorders: true,
    selection: {
      mode: 'multiple',
    },
    columns: [{
      dataField: 'Prefix',
      caption: 'Title',
      width: 70,
    },
    'FirstName',
    'LastName', {
      dataField: 'Position',
      width: 180,
    }, {
      dataField: 'BirthDate',
      dataType: 'date',
      width: 125,
    }, {
      dataField: 'HireDate',
      dataType: 'date',
      width: 125,
    },
    ],
    onSelectionChanged(selectedItems) {
      const data = selectedItems.selectedRowsData;

      if (data.length > 0) {
        $scope.selectedItemsText = $.map(data, (value) => `${value.FirstName} ${value.LastName}`).join(', ');
      } else { $scope.selectedItemsText = 'Nobody has been selected'; }

      $scope.selectedPrefix = null;
      $scope.clearButtonDisabled = !data.length;
    },
    toolbar: {
      items: [
        {
          widget: 'dxSelectBox',
          location: 'before',
          options: $scope.selectPrefixOptions,
        },
        {
          widget: 'dxButton',
          location: 'before',
          options: $scope.clearButtonOptions,
        },
      ],
    },
  };
});
