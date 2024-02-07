const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.isContextMenuEnabled = true;
  $scope.isResizingAllowed = true;

  $scope.htmlEditorOptions = {
    value: markup,
    height: 750,
    toolbar: {
      items: [
        'bold', 'color', 'separator',
        'alignLeft', 'alignCenter', 'alignRight', 'separator',
        'insertTable', 'insertHeaderRow', 'insertRowAbove', 'insertRowBelow',
        'separator', 'insertColumnLeft', 'insertColumnRight',
        'separator', 'deleteColumn', 'deleteRow', 'deleteTable',
        'separator', 'cellProperties', 'tableProperties',
      ],
    },
    bindingOptions: {
      'tableContextMenu.enabled': 'isContextMenuEnabled',
      'tableResizing.enabled': 'isResizingAllowed',
    },
  };

  $scope.tableResizingSwitcher = {
    text: 'Allow Table Resizing',
    bindingOptions: {
      value: 'isResizingAllowed',
    },
  };

  $scope.tableContextMenuSwitcher = {
    text: 'Enable Table Context Menu',
    bindingOptions: {
      value: 'isContextMenuEnabled',
    },
  };
});
