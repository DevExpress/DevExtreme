$(function() {
    var chart = $("#chart").dxChart({
        title: "Life Expectancy vs. Birth Rates",
        zoomAndPan: {
            valueAxis: "both",
            argumentAxis: "both",
            dragToZoom: true,
            allowMouseWheel: true,
            panKey: "shift"
        },
        dataSource: birthLife,
        commonSeriesSettings: {
            type: "scatter",
            argumentField: "life_exp",
            valueField: "birth_rate",
            point: {
                size: 8
            }
        },
        seriesTemplate: {
            nameField: "year"
        },
        valueAxis: {
            title: "Birth Rate"
        },
        argumentAxis: {
            title: "Life Expectancy"
        },
        crosshair: {
            enabled: true,
            label: {
                visible: true
            }
        },
        legend: {
            position: "inside",
            border: {
                visible: true
            }
        },
        tooltip: {
            enabled: true,
            customizeTooltip: function(arg) {
                var data = arg.point.data;
                return {
                    text: data.country + " " + data.year
                };
            }
        }
    }).dxChart("instance");

    $("#reset-zoom").dxButton({
        text: "Reset",
        onClick: function() {
            chart.resetVisualRange();
        }
    });
});