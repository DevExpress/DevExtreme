const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  let treeView;

  const syncTreeViewSelection = function (treeViewInstance) {
    if (!treeViewInstance) return;

    if (!$scope.treeBoxValue) {
      treeViewInstance.unselectAll();
      return;
    }

    $scope.treeBoxValue.forEach((key) => {
      treeViewInstance.selectItem(key);
    });
  };

  const makeAsyncDataSource = function (jsonFile) {
    return new DevExpress.data.CustomStore({
      loadMode: 'raw',
      key: 'ID',
      load() {
        return $.getJSON(`../../../../data/${jsonFile}`);
      },
    });
  };

  const treeDataSource = makeAsyncDataSource('treeProducts.json');
  const gridDataSource = makeAsyncDataSource('customers.json');

  $scope.treeBoxValue = ['1_1'];

  $scope.treeBoxOptions = {
    bindingOptions: {
      value: 'treeBoxValue',
    },
    valueExpr: 'ID',
    displayExpr: 'name',
    placeholder: 'Select a value...',
    showClearButton: true,
    dataSource: treeDataSource,
    onValueChanged() {
      syncTreeViewSelection(treeView);
    },
    treeView: {
      dataSource: treeDataSource,
      dataStructure: 'plain',
      keyExpr: 'ID',
      parentIdExpr: 'categoryId',
      displayExpr: 'name',
      selectByClick: true,
      selectNodesRecursive: false,
      showCheckBoxesMode: 'normal',
      bindingOptions: {
        selectionMode: 'selectionMode',
      },
      onContentReady(e) {
        treeView = e.component;

        syncTreeViewSelection(treeView);
      },
      onItemSelectionChanged(args) {
        $scope.treeBoxValue = args.component.getSelectedNodeKeys();
      },
    },
  };

  $scope.gridBoxValue = [3];

  $scope.gridBoxOptions = {
    bindingOptions: {
      value: 'gridBoxValue',
    },
    valueExpr: 'ID',
    placeholder: 'Select a value...',
    displayExpr: 'CompanyName',
    onValueChanged(e) {
      $scope.gridBoxValue = e.value || [];
    },
    showClearButton: true,
    dataSource: gridDataSource,
    dataGrid: {
      dataSource: gridDataSource,
      columns: ['CompanyName', 'City', 'Phone'],
      hoverStateEnabled: true,
      paging: { enabled: true, pageSize: 10 },
      filterRow: { visible: true },
      scrolling: { mode: 'virtual' },
      height: 345,
      selection: { mode: 'multiple' },
      bindingOptions: {
        selectedRowKeys: 'gridBoxValue',
      },
      onSelectionChanged(selectedItems) {
        $scope.gridBoxValue = selectedItems.selectedRowKeys;
      },
    },
  };
});
