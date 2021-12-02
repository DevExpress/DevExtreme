const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.showColon = true;
  $scope.data = companies[0];
  $scope.readOnly = false;
  $scope.labelMode = 'outside';
  $scope.labelLocation = 'left';
  $scope.minColWidth = 300;
  $scope.colCount = 2;
  $scope.widthValue = undefined;
  $scope.getCompanySelectorLabelMode = () => {
    if ($scope.labelMode === 'outside') {
      return 'hidden';
    }
    return $scope.labelMode;
  };

  $scope.formOptions = {
    bindingOptions: {
      formData: 'data',
      readOnly: 'readOnly',
      showColonAfterLabel: 'showColon',
      labelMode: 'labelMode',
      labelLocation: 'labelLocation',
      minColWidth: 'minColWidth',
      colCount: 'colCount',
      width: 'widthValue',
    },
  };
  $scope.selectCompanyOptions = {
    displayExpr: 'Name',
    label: 'Select company',
    dataSource: companies,
    bindingOptions: {
      labelMode: 'getCompanySelectorLabelMode()',
      value: 'data',
    },
  };
  $scope.readOnlyOptions = {
    text: 'readOnly',
    bindingOptions: {
      value: 'readOnly',
    },
  };
  $scope.showColonOptions = {
    text: 'showColonAfterLabel',
    bindingOptions: {
      value: 'showColon',
    },
  };
  $scope.labelModeOptions = {
    items: ['outside', 'static', 'floating', 'hidden'],
    bindingOptions: {
      value: 'labelMode',
    },
  };
  $scope.labelLocationOptions = {
    items: ['left', 'top'],
    bindingOptions: {
      value: 'labelLocation',
    },
  };
  $scope.minColWidthOptions = {
    items: [150, 200, 300],
    bindingOptions: {
      value: 'minColWidth',
    },
  };
  $scope.colCountOptions = {
    items: ['auto', 1, 2, 3],
    bindingOptions: {
      value: 'colCount',
    },
  };
  $scope.widthOptions = {
    max: 550,
    bindingOptions: {
      value: 'widthValue',
    },
  };
});
