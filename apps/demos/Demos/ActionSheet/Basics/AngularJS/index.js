const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  const showNotify = function (value) {
    DevExpress.ui.notify(`The "${value}" button is clicked.`);
  };
  $scope.actionSheetVisible = false;
  $scope.showTitleValue = true;
  $scope.showCancelButtonValue = true;

  $scope.actionSheetOptions = {
    dataSource: actionSheetItems,
    title: 'Choose action',
    onCancelClick() {
      showNotify('Cancel');
    },
    onItemClick(value) {
      showNotify(value.itemData.text);
    },
    bindingOptions: {
      visible: 'actionSheetVisible',
      showTitle: 'showTitleValue',
      showCancelButton: 'showCancelButtonValue',

    },
  };

  $scope.buttonOptions = {
    text: 'Click to show Action Sheet',
    onClick() {
      $scope.actionSheetVisible = true;
    },
  };
});
