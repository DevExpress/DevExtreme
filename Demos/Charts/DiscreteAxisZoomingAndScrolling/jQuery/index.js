$(function(){
    var chart = $("#zoomedChart").dxChart({
        palette: "soft",
        title:"The Chemical Composition of the Earth Layers",
        valueAxis: {
            label:{
                customizeText: function() {
                    return this.valueText + "%"; 
                }
            }
        },
        dataSource: dataSource,
        series: series,
        commonSeriesSettings: {
            type: "bar",
            ignoreEmptyPoints: true
        },
        legend: {
            border: {
                visible: true
            },
            visible: true,
            verticalAlignment: "top",
            horizontalAlignment: "right",
            orientation:"horizontal"
        }
    }).dxChart("instance");
    
    $("#range-selector").dxRangeSelector({
        size: {
            height: 120
        },
        margin: {
            left: 10
        },
        scale: {
            minorTickCount: 1
        },
        dataSource: dataSource,
        chart: {
            palette: "soft",
            commonSeriesSettings: {
                type: "bar",
                ignoreEmptyPoints: true
            },
            series: series
        },
        behavior: {
            callValueChanged: "onMoving"
        },
        onValueChanged: function (e) {
            chart.getArgumentAxis().visualRange(e.value);
        }
    });
});