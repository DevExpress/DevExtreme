var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.chartOptions = {
        dataSource: dataSource,
        title: "Weather in Las Vegas, NV (2017)",
        commonSeriesSettings: {
            argumentField: "date"
        },
        argumentAxis: {
            argumentType: "datetime",
            aggregationInterval: "week",
            valueMarginsEnabled: false
        },
        valueAxis: [{
                name: "temperature",
                title: {
                    text: "Temperature, °C",
                    font: {
                        color: "#e91e63"
                    }
                },
                label: {
                    font: {
                        color: "#e91e63"
                    }
                }
            }, {
                name: "precipitation",
                position: "right",
                title: {
                    text: "Precipitation, mm",
                    font: {
                        color: "#03a9f4"
                    }
                },
                label: {
                    font: {
                        color: "#03a9f4"
                    }
                }
            }
        ],
        legend: {
            visible: false
        },
        series: [{
                axis: "precipitation",
                color: "#03a9f4",
                type: "bar",
                valueField: "precip",
                name: "Precipitation"
            }, {
                axis: "temperature",
                color: "#ffc0bb",
                type: "rangeArea",
                rangeValue1Field: "minTemp",
                rangeValue2Field: "maxTemp",
                aggregation: {
                    enabled: true,
                    method: "custom",
                    calculate: function(aggregationInfo, series) {
                        if(!aggregationInfo.data.length) {
                            return;
                        }
                        var temp = aggregationInfo.data.map(function(item) { return item.temp; }),
                            maxTemp = Math.max.apply(null, temp),
                            minTemp = Math.min.apply(null, temp);

                        return { 
                            date: new Date((aggregationInfo.intervalStart.valueOf() + aggregationInfo.intervalEnd.valueOf()) / 2),
                            maxTemp: maxTemp,
                            minTemp: minTemp
                        };
                    }
                },
                name: "Temperature range"
            }, {
                axis: "temperature",
                color: "#e91e63",
                valueField: "temp",
                point: {
                    size: 7
                },
                aggregation: {
                    enabled: true
                },
                name: "Average temperature"
        }],
        tooltip: {
            enabled: true,
            customizeTooltip: function (arg) {
                return customTooltipHandlers[arg.seriesName](arg, arg.point.aggregationInfo);
            }
        }
    };

    $scope.useAggregationOptions = {
        text: "Aggregation enabled",
        value: true,
        onValueChanged: function(data) {
            var chart = $("#chart").dxChart("instance");

            chart.option("series[1].aggregation.enabled", data.value);
            chart.option("series[2].aggregation.enabled", data.value);
        }
    };

    $scope.aggregateIntervalOptions = {
        items: intervals,
        value: "week",
        valueExpr: "interval",
        displayExpr: "displayName",
        onValueChanged: function(data) {
            $("#chart").dxChart("instance").option("argumentAxis.aggregationInterval", data.value);
        }
    };

    $scope.aggregateFunctionOptions = {
        items: functions,
        value: "avg",
        valueExpr: "func",
        displayExpr: "displayName",
        onValueChanged: function(data) {
            $("#chart").dxChart("instance").option("series[2].aggregation.method", data.value);
        }
    };
    
    var customTooltipHandlers = {
        "Average temperature": function(arg, aggregationInfo) {
            var start = aggregationInfo && aggregationInfo.intervalStart,
                end = aggregationInfo && aggregationInfo.intervalEnd;

            return {
                text: (!aggregationInfo ?
                    "Date: " + arg.argument.toDateString() :
                    "Interval: " + start.toDateString() +
                    " - " + end.toDateString()) +
                    "<br/>Temperature: " + arg.value.toFixed(2) + " °C"
            };
        },
        "Temperature range": function(arg, aggregationInfo) {
            var start = aggregationInfo.intervalStart,
                end = aggregationInfo.intervalEnd;

            return {
                text: "Interval: " + start.toDateString() +
                    " - " + end.toDateString() +
                    "<br/>Temperature range: " + arg.rangeValue1 +
                    " - " + arg.rangeValue2 + " °C"
            };
        },
        "Precipitation": function(arg) {
            return {
                text: "Date: " + arg.argument.toDateString() +
                    "<br/>Precipitation: " + arg.valueText + " mm"
            };
        }
    };
});