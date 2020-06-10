var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    var store = new DevExpress.data.CustomStore({
        load: function () {
            return connection.invoke("getAllStocks");
        },
        key: "symbol"
    });

    $scope.dataGridOptions = {
        twoWayBindingEnabled: false,
        showBorders: true,
        repaintChangesOnly: true,
        highlightChanges: true,
        dataSource: {
            store: store
        },
        columns: [{
            dataField: "lastUpdate",
            dataType: "date",
            width: 115,
            format: "longTime"
        },  {
            dataField: "symbol"
        }, {
            dataField: "price",
            dataType: "number",
            format: "#0.####",
            cellTemplate: "priceCellTemplate"
        }, {
            dataField: "change",
            dataType: "number",
            width: 140,
            format: "#0.####",
            cellTemplate: "changeCellTemplate"
        }, {
            dataField: "dayOpen",
            dataType: "number",
            format: "#0.####"
        }, {
            dataField: "dayMin",
            dataType: "number",
            format: "#0.####"
        }, {
            dataField: "dayMax",
            dataType: "number",
            format: "#0.####"
        }],
        loadPanel: {
            enabled: false
        }
    };

    $scope.connectionStarted = false;

    var connection = new signalR.HubConnectionBuilder()
        .withUrl("https://js.devexpress.com/Demos/NetCore/liveUpdateSignalRHub")
        .configureLogging(signalR.LogLevel.Information)
        .build();

    connection.start()
        .then(function () {
            connection.on("updateStockPrice", function (data) {
                store.push([{ type: "update", key: data.symbol, data: data }]);
            });
            $scope.connectionStarted = true;
            $scope.$apply();
        });
});
