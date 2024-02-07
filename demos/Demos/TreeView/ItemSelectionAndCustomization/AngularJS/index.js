const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.treeView = undefined;

  $scope.employees = employees;
  $scope.selectedEmployees = [];

  $scope.showCheckBoxesModes = ['normal', 'selectAll', 'none'];
  $scope.showCheckBoxesMode = $scope.showCheckBoxesModes[0];
  $scope.selectionModes = ['multiple', 'single'];
  $scope.selectionMode = $scope.selectionModes[0];

  $scope.isRecursiveDisabled = false;
  $scope.isSelectionModeDisabled = false;

  $scope.selectNodesRecursive = true;
  $scope.selectByClick = false;

  function syncSelection(treeView) {
    const selectedEmployees = treeView.getSelectedNodes()
      .map((node) => node.itemData);

    $scope.selectedEmployees = selectedEmployees;
  }

  $scope.treeViewOptions = {
    items: employees,
    width: 340,
    height: 320,
    onContentReady(e) {
      syncSelection(e.component);
    },
    onSelectionChanged(e) {
      syncSelection(e.component);
    },
    onInitialized(e) {
      $scope.treeView = e.component;
    },
    bindingOptions: {
      selectionMode: 'selectionMode',
      showCheckBoxesMode: 'showCheckBoxesMode',
      selectNodesRecursive: 'selectNodesRecursive',
      selectByClick: 'selectByClick',
    },
  };

  $scope.selectedEmployeesOptions = {
    width: 400,
    height: 200,
    showScrollbar: 'always',
    bindingOptions: {
      items: 'selectedEmployees',
    },
  };

  $scope.showCheckBoxesModesOptions = {
    onValueChanged(e) {
      if (e.value === 'selectAll') {
        $scope.selectionMode = 'multiple';
        $scope.isRecursiveDisabled = false;
      }
      $scope.isSelectionModeDisabled = e.value === 'selectAll';
    },
    bindingOptions: {
      items: 'showCheckBoxesModes',
      value: 'showCheckBoxesMode',
    },
  };

  $scope.selectionModesOptions = {
    onValueChanged(e) {
      if (e.value === 'single') {
        $scope.selectNodesRecursive = false;
        $scope.treeView.unselectAll();
      }
      $scope.isRecursiveDisabled = e.value === 'single';
    },
    bindingOptions: {
      items: 'selectionModes',
      value: 'selectionMode',
      disabled: 'isSelectionModeDisabled',
    },
  };

  $scope.selectNodesRecursiveOptions = {
    text: 'Select Nodes Recursive',
    bindingOptions: {
      value: 'selectNodesRecursive',
      disabled: 'isRecursiveDisabled',
    },
  };

  $scope.selectByClickOptions = {
    text: 'Select By Click',
    bindingOptions: {
      value: 'selectByClick',
    },
  };
});
