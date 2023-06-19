const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  const languages = [
    'Arabic: Right-to-Left direction',
    'English: Left-to-Right direction',
  ];
  $scope.displayExpr = 'nameEn';
  $scope.rtlEnabled = false;
  $scope.textBoxValue = 'text';
  $scope.textAreaValue = 'text';
  $scope.checkBoxValue = 'text';

  $scope.europeanUnion = europeanUnion;

  $scope.checkBoxOptions = {
    value: true,
    bindingOptions: {
      text: 'checkBoxValue',
      rtlEnabled: 'rtlEnabled',
    },
  };
  $scope.switchBoxOptions = {
    bindingOptions: {
      rtlEnabled: 'rtlEnabled',
    },
  };
  $scope.textBoxOptions = {
    showClearButton: true,
    bindingOptions: {
      text: 'textBoxValue',
      rtlEnabled: 'rtlEnabled',
    },
  };
  $scope.numberBoxOptions = {
    showSpinButtons: true,
    value: '123',
    bindingOptions: {
      rtlEnabled: 'rtlEnabled',
    },
  };
  $scope.selectBoxOptions = {
    items: europeanUnion,
    value: europeanUnion[0],
    bindingOptions: {
      displayExpr: 'displayExpr',
      rtlEnabled: 'rtlEnabled',
    },
  };
  $scope.tagBoxOptions = {
    items: europeanUnion,
    value: [europeanUnion[0].id],
    placeholder: '...',
    valueExpr: 'id',
    bindingOptions: {
      displayExpr: 'displayExpr',
      rtlEnabled: 'rtlEnabled',
    },
  };
  $scope.textAreaOptions = {
    bindingOptions: {
      text: 'textAreaValue',
      rtlEnabled: 'rtlEnabled',
    },
  };
  $scope.autocompleteOptions = {
    items: europeanUnion,
    bindingOptions: {
      valueExpr: 'displayExpr',
      rtlEnabled: 'rtlEnabled',
    },
  };
  $scope.selectLanguageOptions = {
    items: languages,
    value: languages[1],
    bindingOptions: {
      rtlEnabled: 'rtlEnabled',
    },
    onValueChanged(data) {
      const rtl = data.value === languages[0];
      const text = rtl ? 'نص' : 'text';

      $scope.displayExpr = rtl ? 'nameAr' : 'nameEn';
      $scope.rtlEnabled = rtl;
      $scope.textBoxValue = text;
      $scope.textAreaValue = text;
      $scope.checkBoxValue = text;
    },
  };
});
