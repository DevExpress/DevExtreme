const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.gaugeValue = dataSource[0].primary;
  $scope.gaugeSubvalues = dataSource[0].secondary;

  $scope.linearGaugeOptions = {
    bindingOptions: {
      value: 'gaugeValue',
      subvalues: 'gaugeSubvalues',
    },
    scale: {
      startValue: 0,
      endValue: 10,
      tickInterval: 2,
      label: {
        customizeText(arg) {
          return `${arg.valueText} kW`;
        },
      },
    },
    tooltip: {
      enabled: true,
      customizeTooltip(arg) {
        let result = `${arg.valueText} kW`;
        if (arg.index >= 0) {
          result = `Secondary ${arg.index + 1}: ${result}`;
        } else {
          result = `Primary: ${result}`;
        }
        return {
          text: result,
        };
      },
    },
    export: {
      enabled: true,
    },
    title: {
      text: 'Power of Air Conditioners in Store Departments (kW)',
      font: { size: 28 },
    },
  };

  $scope.selectBoxOptions = {
    dataSource,
    displayExpr: 'name',
    onValueChanged(e) {
      const { value } = e;

      $scope.gaugeValue = value.primary;
      $scope.gaugeSubvalues = value.secondary;
    },
    value: dataSource[0],
    width: 200,
  };
});
