const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  const store = new DevExpress.data.CustomStore({
    load() {
      return connection.invoke('getAllData');
    },
    key: 'date',
  });

  $scope.chartOptions = {
    dataSource: {
      store,
    },
    margin: {
      right: 30,
    },
    loadingIndicator: {
      enabled: true,
    },
    title: 'Stock Price',
    series: [{
      pane: 'Price',
      argumentField: 'date',
      type: 'candlestick',
      aggregation: {
        enabled: true,
        method: 'custom',
        calculate(e) {
          const prices = e.data.map((i) => i.price);
          if (prices.length) {
            return {
              date: new Date((e.intervalStart.valueOf() + e.intervalEnd.valueOf()) / 2),
              open: prices[0],
              high: Math.max.apply(null, prices),
              low: Math.min.apply(null, prices),
              close: prices[prices.length - 1],
            };
          }
        },
      },
    }, {
      pane: 'Volume',
      name: 'Volume',
      type: 'bar',
      argumentField: 'date',
      valueField: 'volume',
      color: 'red',
      aggregation: {
        enabled: true,
        method: 'sum',
      },
    }],
    panes: [{
      name: 'Price',
    }, {
      name: 'Volume',
      height: 80,
    }],
    customizePoint(arg) {
      if (arg.seriesName === 'Volume') {
        const point = $('#chart').dxChart('getAllSeries')[0].getPointsByArg(arg.argument)[0].data;
        if (point.close >= point.open) {
          return { color: '#1db2f5' };
        }
      }
    },
    tooltip: {
      enabled: true,
      shared: true,
      argumentFormat: 'shortDateShortTime',
      contentTemplate(pointInfo) {
        const volume = pointInfo.points.filter((point) => point.seriesName === 'Volume')[0];
        const prices = pointInfo.points.filter((point) => point.seriesName !== 'Volume')[0];

        return `<div class='tooltip-template'><div>${pointInfo.argumentText}</div>`
                    + `<div><span>Open: </span>${formatCurrency(prices.openValue)}</div>`
                    + `<div><span>High: </span>${formatCurrency(prices.highValue)}</div>`
                    + `<div><span>Low: </span>${formatCurrency(prices.lowValue)}</div>`
                    + `<div><span>Close: </span>${formatCurrency(prices.closeValue)}</div>`
                    + `<div><span>Volume: </span>${formatNumber(volume.value)}</div>`;
      },
    },
    crosshair: {
      enabled: true,
      horizontalLine: { visible: false },
    },
    zoomAndPan: {
      argumentAxis: 'both',
    },
    scrollBar: {
      visible: true,
    },
    legend: {
      visible: false,
    },
    argumentAxis: {
      argumentType: 'datetime',
      minVisualRangeLength: { minutes: 10 },
      visualRange: {
        length: 'hour',
      },
    },
    valueAxis: {
      placeholderSize: 50,
    },
  };

  $scope.connectionStarted = false;

  const connection = new signalR.HubConnectionBuilder()
    .withUrl('https://js.devexpress.com/Demos/NetCore/stockTickDataHub')
    .configureLogging(signalR.LogLevel.Information)
    .build();

  connection.start()
    .then(() => {
      connection.on('updateStockPrice', (data) => {
        store.push([{ type: 'insert', key: data.date, data }]);
      });
      $scope.connectionStarted = true;
      $scope.$apply();
    });

  const formatCurrency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format;
  const formatNumber = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format;
});
