$(function(){
    var dataSource = [],
        max = 100;
    
    for (var i = 0; i < max; i++) {
        dataSource.push({ arg: Math.pow(10, i * 0.1), val: Math.log(i + 1) / Math.log(0.5) + (Math.random() - 0.5) * (100 / (i + 1)) + 10 });
    }
    
    $("#zoomed-chart").dxChart({
        dataSource: dataSource,
        resizePanesOnZoom: true,
        argumentAxis: {
            valueMarginsEnabled: false,
            type: "logarithmic",
            label: { format: "exponential" },
            grid: {
                visible: true 
            },
            minorGrid: {
                visible: true 
            },
            minorTickCount: 10
        },
        legend: {
            visible: false
        },
    
        series: {}
    });
    $("#range-selector").dxRangeSelector({
        dataSource: dataSource,
        chart: {
            series: {}
        },
        scale: {
            type: "logarithmic",
            label: { format: "exponential" },
            minRange: 1,
            minorTickCount: 10
        },
        sliderMarker: {
            format: 'exponential'
        },
        behavior: {
            callValueChanged: "onMoving",
            snapToTicks: false
        },
        onValueChanged: function (e) {
            var zoomedChart = $("#zoomed-chart").dxChart("instance");
            zoomedChart.getArgumentAxis().visualRange(e.value);
        }
    });
});