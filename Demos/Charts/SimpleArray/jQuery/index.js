$(function(){
    $("#chart").dxChart({
        dataSource: populationData,
        legend: {
            visible: false
        },
        series: {
            type: "bar"
        },
        argumentAxis: {
            tickInterval: 10,
            label: {
                format: {
                    type: "decimal"
                }
            }
        },
        title: "World Population by Decade"
    });
});