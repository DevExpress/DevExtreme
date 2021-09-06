const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.chartOptions = {
    dataSource,
    series: {
      argumentField: 'name',
      valueField: 'height',
      type: 'bar',
      color: '#E55253',
    },
    tooltip: {
      enabled: true,
      customizeTooltip(arg) {
        return {
          text: `<span class='title'>${arg.argumentText}</span><br />&nbsp;<br />`
                        + `System: ${arg.point.data.system}<br />` + `Height: ${
            arg.valueText} m`,
        };
      },
    },
    title: 'The Highest Mountains',
    legend: {
      visible: false,
    },
    argumentAxis: {
      visible: true,
    },
    valueAxis: {
      visualRange: {
        startValue: 8000,
      },
      label: {
        customizeText() {
          return `${this.value} m`;
        },
      },
    },
  };

  $scope.printButton = {
    icon: 'print',
    text: 'Print',
    onClick() {
      $('#chart').dxChart('instance').print();
    },
  };

  $scope.exportButton = {
    icon: 'export',
    text: 'Export',
    onClick() {
      $('#chart').dxChart('instance').exportTo('Example', 'png');
    },
  };
});
