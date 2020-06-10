window.onload = function() {
    var dataSource = [],
        max = 5000,
        i;
    
    for (i = 0; i < max; i++) {
        dataSource.push({ arg: i, val: i + i * (Math.random() - 0.5) });
    }
    
    var model = {};
    model.chartOptions = {
        dataSource: dataSource,
        argumentAxis: {
            valueMarginsEnabled: false
        },
        valueAxis: {
            label:{
                format:{
                    type: "fixedPoint"
                }
            }
        },
        legend: {
            visible: false
        },
        series: {
            point: {
                size: 7
            },
            aggregation: {
                enabled: true
            }
        }
    };
    
    model.rangeOptions = {
        size: {
            height: 120
        },
        dataSource: dataSource,
        chart: {
            series: {
                aggregation: {
                    enabled: true
                }
            }
        },
        scale: {
            minRange: 1
        },
        sliderMarker: {
            format: {
                type: "decimal",
                precision: 0
            }
        },
        behavior: {
            callValueChanged: "onMoving",
            snapToTicks: false
        },
        onValueChanged: function (e) {
            var zoomedChart = $("#chart-demo #zoomedChart").dxChart("instance");
            zoomedChart.zoomArgument(e.value[0], e.value[1]);
        }
    };
    
    ko.applyBindings(model, $("#chart-demo")[0]);
};