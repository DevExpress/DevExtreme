const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  const valueChangeEvents = [{
    title: 'On Blur',
    name: 'change',
  }, {
    title: 'On Key Up',
    name: 'keyup',
  }];

  $scope.maxLength = null;
  $scope.value = longText;
  $scope.eventValue = valueChangeEvents[0].name;
  $scope.valueForEditableTextArea = longText;
  $scope.height = 90;
  $scope.autoResizeEnabled = false;

  $scope.textAreaWithMaxLength = {
    height: 90,
    bindingOptions: {
      maxLength: 'maxLength',
      value: 'value',
      autoResizeEnabled: 'autoResizeEnabled',
    },
  };

  $scope.checkBoxOptions = {
    value: false,
    onValueChanged(data) {
      $scope.value = data.value ? longText.substring(0, 100) : longText;
      $scope.maxLength = data.value ? 100 : null;
    },
    text: 'Limit text length',
  };

  $scope.autoResizeCheckBoxOptions = {
    text: 'Enable auto resize',
    onValueChanged(e) {
      $scope.autoResizeEnabled = e.value;
      $scope.height = e.value ? undefined : 90;
    },
    bindingOptions: {
      value: 'autoResizeEnabled',
    },
  };

  $scope.selectBoxOptions = {
    items: valueChangeEvents,
    valueExpr: 'name',
    displayExpr: 'title',
    bindingOptions: {
      value: 'eventValue',
    },
  };

  $scope.editableTextArea = {
    height: 90,
    bindingOptions: {
      value: 'valueForEditableTextArea',
      valueChangeEvent: 'eventValue',
    },
  };

  $scope.disabledTextArea = {
    height: 90,
    readOnly: true,
    bindingOptions: {
      value: 'valueForEditableTextArea',
    },
  };
});
