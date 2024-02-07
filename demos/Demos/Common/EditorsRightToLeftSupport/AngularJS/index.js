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
      inputAttr: { 'aria-label': 'Language' },
    },
  };
  $scope.switchBoxOptions = {
    bindingOptions: {
      rtlEnabled: 'rtlEnabled',
    },
  };
  $scope.textBoxOptions = {
    showClearButton: true,
    inputAttr: { 'aria-label': 'Text Box' },
    bindingOptions: {
      text: 'textBoxValue',
      rtlEnabled: 'rtlEnabled',
    },
  };
  $scope.numberBoxOptions = {
    showSpinButtons: true,
    value: '123',
    inputAttr: { 'aria-label': 'Number Box' },
    bindingOptions: {
      rtlEnabled: 'rtlEnabled',
    },
  };
  $scope.selectBoxOptions = {
    items: europeanUnion,
    value: europeanUnion[0],
    inputAttr: { 'aria-label': 'European Union' },
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
    inputAttr: { 'aria-label': 'Name' },
    bindingOptions: {
      displayExpr: 'displayExpr',
      rtlEnabled: 'rtlEnabled',
    },
  };
  $scope.textAreaOptions = {
    inputAttr: { 'aria-label': 'Notes' },
    bindingOptions: {
      text: 'textAreaValue',
      rtlEnabled: 'rtlEnabled',
    },
  };
  $scope.autocompleteOptions = {
    items: europeanUnion,
    inputAttr: { 'aria-label': 'Autocomplete' },
    bindingOptions: {
      valueExpr: 'displayExpr',
      rtlEnabled: 'rtlEnabled',
    },
  };
  $scope.selectLanguageOptions = {
    items: languages,
    value: languages[1],
    inputAttr: { 'aria-label': 'Language' },
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
