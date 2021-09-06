const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  const store = new DevExpress.data.CustomStore({
    load() {
      return connection.invoke('getAllStocks');
    },
    key: 'symbol',
  });

  $scope.dataGridOptions = {
    twoWayBindingEnabled: false,
    showBorders: true,
    repaintChangesOnly: true,
    highlightChanges: true,
    dataSource: {
      store,
    },
    columns: [{
      dataField: 'lastUpdate',
      dataType: 'date',
      width: 115,
      format: 'longTime',
    }, {
      dataField: 'symbol',
    }, {
      dataField: 'price',
      dataType: 'number',
      format: '#0.####',
      cellTemplate: 'priceCellTemplate',
    }, {
      dataField: 'change',
      dataType: 'number',
      width: 140,
      format: '#0.####',
      cellTemplate: 'changeCellTemplate',
    }, {
      dataField: 'dayOpen',
      dataType: 'number',
      format: '#0.####',
    }, {
      dataField: 'dayMin',
      dataType: 'number',
      format: '#0.####',
    }, {
      dataField: 'dayMax',
      dataType: 'number',
      format: '#0.####',
    }],
    loadPanel: {
      enabled: false,
    },
  };

  $scope.connectionStarted = false;

  var connection = new signalR.HubConnectionBuilder()
    .withUrl('https://js.devexpress.com/Demos/NetCore/liveUpdateSignalRHub')
    .configureLogging(signalR.LogLevel.Information)
    .build();

  connection.start()
    .then(() => {
      connection.on('updateStockPrice', (data) => {
        store.push([{ type: 'update', key: data.symbol, data }]);
      });
      $scope.connectionStarted = true;
      $scope.$apply();
    });
});
