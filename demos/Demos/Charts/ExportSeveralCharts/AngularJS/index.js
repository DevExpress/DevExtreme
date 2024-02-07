const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.chartOptions = {
    rotated: true,
    title: 'Olympic Gold Medals in 2008',
    dataSource: goldMedals,
    series: {
      color: '#f3c40b',
      argumentField: 'country',
      valueField: 'medals',
      type: 'bar',
      label: {
        visible: true,
      },
    },
    legend: {
      visible: false,
    },
  };
  $scope.pieOptions = {
    palette: 'Harmony Light',
    dataSource: allMedals,
    title: 'Total Olympic Medals\n in 2008',
    series: [{
      argumentField: 'country',
      valueField: 'medals',
      label: {
        visible: true,
        connector: {
          visible: true,
        },
      },
    }],
  };
  $scope.buttonOptions = {
    icon: 'export',
    text: 'Export',
    type: 'default',
    width: 145,
    onClick() {
      const chartInstance = $('#chart').dxChart('instance');
      const pieChartInstance = $('#pieChart').dxPieChart('instance');

      DevExpress.viz.exportWidgets([[chartInstance, pieChartInstance]], {
        fileName: 'chart',
        format: 'PNG',
      });
    },
  };
});
