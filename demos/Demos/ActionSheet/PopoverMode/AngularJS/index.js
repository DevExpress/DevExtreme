const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  let initData;
  $scope.actionSheetVisible = false;

  $scope.actionSheetOptions = {
    dataSource: actionSheetItems,
    title: 'Choose action',
    usePopover: true,
    onInitialized(e) {
      initData = e.component;
    },
    onItemClick(value) {
      DevExpress.ui.notify(`The "${value.itemData.text}" button is clicked.`);
    },
    bindingOptions: {
      visible: 'actionSheetVisible',
    },
  };

  $scope.listOptions = {
    dataSource: contacts,
    onItemClick(e) {
      initData.option('target', e.itemElement);
      $scope.actionSheetTarget = e.itemElement;
      $scope.actionSheetVisible = true;
    },
  };
});
