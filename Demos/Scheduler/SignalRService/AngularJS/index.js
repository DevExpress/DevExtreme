var DemoApp = angular.module('DemoApp', ['dx']);

var BASE_PATH = "https://js.devexpress.com/Demos/NetCore/";
DemoApp.controller('DemoController', function DemoController($scope) {
    var store1 = createStore(),
        store2 = createStore();

    $scope.scheduler1Options = createOptions(store1);
    $scope.scheduler2Options = createOptions(store2);

    var connection = new signalR.HubConnectionBuilder()
        .withUrl(BASE_PATH + "schedulerSignalRHub", {
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets
        })
        .configureLogging(signalR.LogLevel.Information)
        .build();

    connection.start()
        .then(function () {
            connection.on("update", function (key, data) {
                store1.push([{ type: "update", key: key, data: data }]);
                store2.push([{ type: "update", key: key, data: data }]);
            });

            connection.on("insert", function (data) {
                store1.push([{ type: "insert", data: data }]);
                store2.push([{ type: "insert", data: data }]);
            });

            connection.on("remove", function (key) {
                store1.push([{ type: "remove", key: key }]);
                store2.push([{ type: "remove", key: key }]);
            });
        });
});

var createStore = function() {
    var url = BASE_PATH + "api/SchedulerSignalR";
    return DevExpress.data.AspNet.createStore({
        key: "AppointmentId",
        loadUrl: url,
        insertUrl: url,
        updateUrl: url,
        deleteUrl: url,
        onBeforeSend: function(method, ajaxOptions) {
            ajaxOptions.xhrFields = { withCredentials: true };
        }
    })
};

var createOptions = function(store) {
    return {
        dataSource: store,
        timeZone: "America/Los_Angeles",
        remoteFiltering: true,
        views: ["day", "workWeek"],
        currentView: "day",
        currentDate: new Date(2021, 3, 27),
        startDayHour: 9,
        endDayHour: 19,
        height: 600,
        dateSerializationFormat: "yyyy-MM-ddTHH:mm:ssZ",
        textExpr: "Text",
        descriptionExpr: "Description",
        startDateExpr: "StartDate",
        endDateExpr: "EndDate",
        allDayExpr: "AllDay"
    };
};
