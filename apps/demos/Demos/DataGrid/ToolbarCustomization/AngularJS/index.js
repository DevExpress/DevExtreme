const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.totalCount = getGroupCount('CustomerStoreState');
  $scope.expanded = true;

  $scope.dataGridOptions = {
    dataSource: orders,
    keyExpr: 'ID',
    showBorders: true,
    bindingOptions: {
      'grouping.autoExpandAll': 'expanded',
    },
    columnChooser: {
      enabled: true,
    },
    loadPanel: {
      enabled: true,
    },
    columns: [{
      dataField: 'OrderNumber',
      caption: 'Invoice Number',
    }, 'OrderDate', 'Employee', {
      caption: 'City',
      dataField: 'CustomerStoreCity',
    }, {
      caption: 'State',
      groupIndex: 0,
      dataField: 'CustomerStoreState',
    }, {
      dataField: 'SaleAmount',
      alignment: 'right',
      format: 'currency',
    }],
    onInitialized(e) {
      $scope.dataGrid = e.component;
    },
    toolbar: {
      items: [
        {
          location: 'before',
          template: 'totalGroupCount',
        }, {
          location: 'before',
          widget: 'dxSelectBox',
          options: {
            width: 225,
            items: [{
              value: 'CustomerStoreState',
              text: 'Grouping by State',
            }, {
              value: 'Employee',
              text: 'Grouping by Employee',
            }],
            displayExpr: 'text',
            valueExpr: 'value',
            value: 'CustomerStoreState',
            onValueChanged(e) {
              $scope.dataGrid.clearGrouping();
              $scope.dataGrid.columnOption(e.value, 'groupIndex', 0);
              $scope.totalCount = getGroupCount(e.value);
            },
          },
        }, {
          location: 'before',
          widget: 'dxButton',
          options: {
            text: 'Collapse All',
            width: 136,
            onClick(e) {
              $scope.expanded = !$scope.expanded;
              e.component.option({
                text: $scope.expanded ? 'Collapse All' : 'Expand All',
              });
            },
          },
        }, {
          location: 'after',
          widget: 'dxButton',
          options: {
            icon: 'refresh',
            onClick() {
              $scope.dataGrid.refresh();
            },
          },
        },
        'columnChooserButton',
      ],
    },
  };

  function getGroupCount(groupField) {
    return DevExpress.data.query(orders)
      .groupBy(groupField)
      .toArray().length;
  }
});
