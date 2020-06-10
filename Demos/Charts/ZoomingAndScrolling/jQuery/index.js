$(function(){
    
    var zoomedChart = $("#chart").dxChart({
        palette: "Harmony Light",
        dataSource: zoomingData,
        series: [{
            argumentField: "arg",
            valueField: "y1"
        }, {
            argumentField: "arg",
            valueField: "y2"
        }],
        argumentAxis: {
            visualRange: {
                startValue: 300,
                endValue: 500
            }
        },
        scrollBar: {
            visible: true
        },
        zoomAndPan: {
            argumentAxis: "both"
        },
        legend:{
            visible: false
        }
    }).dxChart("instance");
    
});