$(function() {
    $("#chart").dxChart({
        dataSource: dataSource,
        title: "Damped Sine Wave",
        dataSource: dataSource,
        panes: [
            { name: "top" },
            { name: "bottom" }
        ],
        series: [{
            pane: "top"
        }, {
            pane: "bottom"
        }],
        commonAxisSettings: {
            endOnTick: false,
        },
        valueAxis: [{
            title: "Logarithmic Axis",
            type: "logarithmic",
            pane: "top",
            linearThreshold: -3
        },
        {
            title: "Linear Axis",
            pane: "bottom"
        }],
        tooltip: {
            enabled: true,
            format: "exponential"
        },
        crosshair: {
            enabled: true,
            horizontalLine: {
                visible: false
            },
            label: {
                visible: true,
                format: {
                    type: "fixedPoint",
                    precision: 2
                }
            }
        },
        legend: {
            visible: false
        }
    });
});