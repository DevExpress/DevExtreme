const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.drillDownDataSource = {};
  $scope.salesPopupVisible = false;
  $scope.salesPopupTitle = '';
  $scope.drillDownDataGrid = {};

  $scope.pivotGridOptions = {
    allowSortingBySummary: true,
    allowSorting: true,
    allowFiltering: true,
    allowExpandAll: true,
    showBorders: true,
    fieldChooser: {
      enabled: false,
    },
    onCellClick(e) {
      if (e.area == 'data') {
        const pivotGridDataSource = e.component.getDataSource();
        const rowPathLength = e.cell.rowPath.length;
        const rowPathName = e.cell.rowPath[rowPathLength - 1];
        const popupTitle = `${rowPathName || 'Total'} Drill Down Data`;

        $scope.drillDownDataSource = pivotGridDataSource.createDrillDownDataSource(e.cell);
        $scope.salesPopupTitle = popupTitle;
        $scope.salesPopupVisible = true;
      }
    },
    dataSource: {
      fields: [{
        caption: 'Region',
        width: 120,
        dataField: 'region',
        area: 'row',
      }, {
        caption: 'City',
        dataField: 'city',
        width: 150,
        area: 'row',
      }, {
        dataField: 'date',
        dataType: 'date',
        area: 'column',
      }, {
        caption: 'Total',
        dataField: 'amount',
        dataType: 'number',
        summaryType: 'sum',
        format: 'currency',
        area: 'data',
      }],
      store: sales,
    },
  };

  $scope.dataGridOptions = {
    bindingOptions: {
      dataSource: {
        dataPath: 'drillDownDataSource',
        deep: false,
      },
    },
    onInitialized(e) {
      $scope.drillDownDataGrid = e.component;
    },
    width: 560,
    height: 300,
    columns: ['region', 'city', 'amount', 'date'],
  };

  $scope.popupOptions = {
    width: 600,
    height: 400,
    onShown() {
      $scope.drillDownDataGrid.updateDimensions();
    },
    bindingOptions: {
      title: 'salesPopupTitle',
      visible: 'salesPopupVisible',
    },
  };
});
