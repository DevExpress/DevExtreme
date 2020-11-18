var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    var store = new DevExpress.data.CustomStore({
        load: function() {
            return connection.invoke("getAllData");
        },
        key: "date"
    });

    $scope.chartOptions = {
        dataSource: {
            store: store
        },
        margin: {
            right: 30
        },
        loadingIndicator: {
            enabled: true
        },
        title: "Stock Price",
        series: [{
            pane: "Price",
            argumentField: "date",
            type: "candlestick",
            aggregation: {
                enabled: true,
                method: "custom",
                calculate: function(e) {
                    var prices = e.data.map(function(i) {
                        return i.price;
                    });
                    if (prices.length) {
                        return {
                            date: new Date((e.intervalStart.valueOf() + e.intervalEnd.valueOf()) / 2),
                            open: prices[0],
                            high: Math.max.apply(null, prices),
                            low: Math.min.apply(null, prices),
                            close: prices[prices.length - 1]
                        };
                    }
                }
            }
        }, {
            pane: "Volume",
            name: "Volume",
            type: "bar",
            argumentField: "date",
            valueField: "volume",
            color: "red",
            aggregation: {
                enabled: true,
                method: "sum"
            }
        }],
        panes: [{
            name: "Price"
        }, {
            name: "Volume",
            height: 80
        }],
        customizePoint: function(arg) {
            if(arg.seriesName === "Volume") {
                var point = $("#chart").dxChart("getAllSeries")[0].getPointsByArg(arg.argument)[0].data;
                if(point.close >= point.open) {
                    return { color: "#1db2f5" };
                } 
            }
        },
        tooltip: {
            enabled: true,
            shared: true,
            argumentFormat: "shortDateShortTime",
            contentTemplate: function (pointInfo, element) {
                var volume = pointInfo.points.filter(function(point) {
                    return point.seriesName === "Volume";
                })[0];
                var prices = pointInfo.points.filter(function(point) {
                    return point.seriesName !== "Volume";
                })[0];
                
                return "<div class='tooltip-template'><div>" + pointInfo.argumentText + "</div>" +
                    "<div><span>Open: </span>" + formatCurrency(prices.openValue) + "</div>" +
                    "<div><span>High: </span>" + formatCurrency(prices.highValue) + "</div>" +
                    "<div><span>Low: </span>" + formatCurrency(prices.lowValue) + "</div>" +
                    "<div><span>Close: </span>" + formatCurrency(prices.closeValue) + "</div>" +
                    "<div><span>Volume: </span>" + formatNumber(volume.value) + "</div>";
            }
        },
        crosshair: {
            enabled: true,
            horizontalLine: { visible: false }
        },
        zoomAndPan: {
            argumentAxis: "both"
        },
        scrollBar: {
            visible: true
        },
        legend: {
            visible: false
        },
        argumentAxis: {
            argumentType: "datetime",
            minVisualRangeLength: { minutes: 10 },
            visualRange: {
                length: "hour"
            }
        },
        valueAxis: {
            placeholderSize: 50
        }
    };

    $scope.connectionStarted = false;

    var connection = new signalR.HubConnectionBuilder()
        .withUrl("https://js.devexpress.com/Demos/NetCore/stockTickDataHub")
        .configureLogging(signalR.LogLevel.Information)
        .build();

    connection.start()
        .then(function () {
            connection.on("updateStockPrice", function (data) {
                store.push([{ type: "insert", key: data.date, data: data }]);
            });
            $scope.connectionStarted = true;
            $scope.$apply();
        });
    
    var formatCurrency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format;
    var formatNumber = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format;
});
