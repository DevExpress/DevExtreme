const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  const source = new DevExpress.data.DataSource({
    load() {
      const d = $.Deferred();
      const xhr = new XMLHttpRequest();
      xhr.open('GET', '../../../../data/monthWeather.json', true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.responseText) {
          d.resolve(JSON.parse(xhr.responseText));
        }
      };
      xhr.send();
      return d.promise();
    },
    loadMode: 'raw',
    filter: ['t', '>', '2'],
    paginate: false,
  });

  const palette = ['#c3a2cc', '#b7b5e0', '#e48cba'];
  let paletteIndex = 0;

  $scope.chartOptions = {
    dataSource: source,
    title: 'Temperature in Seattle: October 2017',
    size: {
      height: 420,
    },
    series: {
      argumentField: 'day',
      valueField: 't',
      type: 'bar',
    },
    customizePoint() {
      const color = palette[paletteIndex];
      paletteIndex = paletteIndex === 2 ? 0 : paletteIndex + 1;

      return {
        color,
      };
    },
    legend: {
      visible: false,
    },
    export: {
      enabled: true,
    },
    valueAxis: {
      label: {
        customizeText() {
          return `${this.valueText}&#176C`;
        },
      },
    },
    loadingIndicator: {
      enabled: true,
    },
  };

  $scope.temperatureOptions = {
    dataSource: [2, 4, 6, 8, 9, 10, 11],
    value: 2,
    onValueChanged(data) {
      source.filter(['t', '>', data.value]);
      source.load();
    },
  };
});
