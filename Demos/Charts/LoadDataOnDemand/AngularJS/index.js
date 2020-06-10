var DemoApp = angular.module('DemoApp', ['dx']);
var HALFDAY = 43200000;
var packetsLock = 0;

DemoApp.controller('DemoController', function DemoController($scope) {
    var currentRange = {
        startValue: new Date(2017, 3, 1),
        length: {
            weeks: 2
        }
    };

    Object.defineProperty($scope, 'currentRange', {
        get: function() {
            return currentRange;
        },

        set: function(newRange) {
            currentRange = newRange;
            onVisualRangeChanged();
        }
    });

    $scope.chartOptions = {
        dataSource: new DevExpress.data.DataSource({
            store: [],
            sort: "date",
            paginate: false
        }),
        title: "Temperature in Toronto (2017)",
        zoomAndPan: {
            argumentAxis: "pan"
        },
        scrollBar: {
            visible: true
        },
        bindingOptions: {
            "argumentAxis.visualRange": "currentRange"
        },
        argumentAxis: {
            argumentType: "datetime",
            wholeRange: [new Date(2017, 0, 1), new Date(2017, 11, 31)],
            visualRangeUpdateMode: "keep"
        },
        valueAxis: {
            name: "temperature",
            allowDecimals: false,
            title: {
                text: "Temperature, &deg;C",
                font: {
                    color: "#ff950c"
                }
            },
            label: {
                font: {
                    color: "#ff950c"
                }
            }
        },
        series: [{
            color: "#ff950c",
            type: "rangeArea",
            argumentField: "date",
            rangeValue1Field: "minTemp",
            rangeValue2Field: "maxTemp",
            name: "Temperature range"
        }],
        animation: {
            enabled: false
        },
        loadingIndicator: {
            backgroundColor: "none",
            font: {
                size: 14
            }
        },
        legend: {
            visible: false
        }
    };

    function onVisualRangeChanged() {
        var component = $("#chart").dxChart("instance");
        var items = component.getDataSource().items();
        var visualRange = $scope.currentRange;
        if(!items.length ||
            items[0].date - visualRange.startValue >= HALFDAY ||
            visualRange.endValue - items[items.length - 1].date >= HALFDAY) {
            uploadDataByVisualRange(visualRange, component);
        }
    }

    function uploadDataByVisualRange(visualRange, component) {
        var dataSource = component.getDataSource();
        var storage = dataSource.items();
        var ajaxArgs = {
            startVisible: getDateString(visualRange.startValue),
            endVisible: getDateString(visualRange.endValue),
            startBound: getDateString(storage.length ? storage[0].date : null),
            endBound: getDateString(storage.length ?
                storage[storage.length - 1].date : null)
        };

        if(ajaxArgs.startVisible !== ajaxArgs.startBound &&
            ajaxArgs.endVisible !== ajaxArgs.endBound && !packetsLock) {
            packetsLock++;
            component.showLoadingIndicator();
            getDataFrame(ajaxArgs)
                .then(function(dataFrame) {
                    packetsLock--;

                    var componentStorage = dataSource.store();
                    dataFrame.forEach(function(item) {
                        componentStorage.insert(item);
                    });
                    dataSource.reload();

                    onVisualRangeChanged();
                },
                function(reason) {
                    packetsLock--;
                    dataSource.reload();
                });
        }
    }

    function getDataFrame(args) {
        var deferred = $.Deferred();
        $.ajax({
            url: "https://js.devexpress.com/Demos/WidgetsGallery/data/temperatureData",
            dataType: "json",
            data: args,
            success: function (result) {
                deferred.resolve(result.map(function(i) {
                    return {
                        date: new Date(i.Date),
                        minTemp: i.MinTemp,
                        maxTemp: i.MaxTemp
                    };
                }));
            },
            error: function () {
                deferred.reject("Data Loading Error");
            },
            timeout: 2000
        });

        return deferred.promise();
    }

    function getDateString(dateTime) {
        return dateTime ? dateTime.toLocaleDateString("en-US") : "";
    }
});