$(function(){
    $("#chart").dxChart({
        palette: "violet",
        title: "Crude Oil Prices in 2005",
        dataSource: dataSource,
        commonSeriesSettings: {
            argumentField: "date",
            type: "rangeBar"
        },
        series: [
            { 
                rangeValue1Field: "aVal1", 
                rangeValue2Field: "aVal2", 
                name: "ANS West Coast" 
            }, { 
                rangeValue1Field: "tVal1", 
                rangeValue2Field: "tVal2", 
                name: "West Texas Intermediate" 
            }
        ],    
        valueAxis: {
            title: { 
                text: "$ per barrel"
            }
        },
        argumentAxis: {
            label: {
                format: "month"
            }
        },
        "export": {
            enabled: true
        },
        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center"
        }
    });
});