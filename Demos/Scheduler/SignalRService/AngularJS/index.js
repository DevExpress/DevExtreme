const DemoApp = angular.module('DemoApp', ['dx']);

const BASE_PATH = 'https://js.devexpress.com/Demos/NetCore/';
DemoApp.controller('DemoController', ($scope) => {
  const store1 = createStore();
  const store2 = createStore();

  $scope.scheduler1Options = createOptions(store1);
  $scope.scheduler2Options = createOptions(store2);

  const connection = new signalR.HubConnectionBuilder()
    .withUrl(`${BASE_PATH}schedulerSignalRHub`, {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets,
    })
    .configureLogging(signalR.LogLevel.Information)
    .build();

  connection.start()
    .then(() => {
      connection.on('update', (key, data) => {
        store1.push([{ type: 'update', key, data }]);
        store2.push([{ type: 'update', key, data }]);
      });

      connection.on('insert', (data) => {
        store1.push([{ type: 'insert', data }]);
        store2.push([{ type: 'insert', data }]);
      });

      connection.on('remove', (key) => {
        store1.push([{ type: 'remove', key }]);
        store2.push([{ type: 'remove', key }]);
      });
    });
});

var createStore = function () {
  const url = `${BASE_PATH}api/SchedulerSignalR`;
  return DevExpress.data.AspNet.createStore({
    key: 'AppointmentId',
    loadUrl: url,
    insertUrl: url,
    updateUrl: url,
    deleteUrl: url,
    onBeforeSend(method, ajaxOptions) {
      ajaxOptions.xhrFields = { withCredentials: true };
    },
  });
};

var createOptions = function (store) {
  return {
    dataSource: store,
    timeZone: 'America/Los_Angeles',
    remoteFiltering: true,
    views: ['day', 'workWeek'],
    currentView: 'day',
    currentDate: new Date(2021, 3, 27),
    startDayHour: 9,
    endDayHour: 19,
    height: 600,
    dateSerializationFormat: 'yyyy-MM-ddTHH:mm:ssZ',
    textExpr: 'Text',
    descriptionExpr: 'Description',
    startDateExpr: 'StartDate',
    endDateExpr: 'EndDate',
    allDayExpr: 'AllDay',
  };
};
