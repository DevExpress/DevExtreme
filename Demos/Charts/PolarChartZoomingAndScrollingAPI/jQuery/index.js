$(function(){
    $("#zoomedChart").dxPolarChart({
        dataSource: dataSource,
        commonSeriesSettings: {
            argumentField: "argument",
            closed: false
        },
        series: [{
                type: "scatter",
                name: "Test results",
                valueField: "value",
                point: { size: 8 }
            }, {
                type: "line",
                name: "Expected average",
                valueField: "originalValue",
                point: { visible: false }
            }
        ],
        argumentAxis: {
            startAngle: 90,
            tickInterval: 30
        },
        valueAxis: {
            visualRange: {
                startValue: 0,
                endValue: 8
            }
        },
        "export": {
            enabled: true
        },
        legend: {
            hoverMode: "excludePoints",
            verticalAlignment: "top",
            horizontalAlignment: "center"
        },
        title: "Stochastic Process"
    });

    $("#rangeSelector").dxRangeSelector({
        size: {
            height: 100
        },
        margin: {
            top: 10,
            left: 60,
            bottom: 10,
            right: 50
        },
        scale: {
            startValue: 0,
            endValue: 8,
            minorTickInterval: 0.1,
            tickInterval: 1,
            minorTick: {
                visible: false
            }
        },
        behavior: {
            callValueChanged: "onMoving"
        },
        onValueChanged: function (e) {
            var zoomedChart = $("#zoomedChart").dxPolarChart("instance");
            zoomedChart.getValueAxis().visualRange(e.value);
        }
    });
});