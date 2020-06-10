$(function(){
    $("#chart").dxPolarChart({
        dataSource: dataSource,
        series: [{ type: "line", name: "Function", closed: false }],
        argumentAxis: {
            inverted: true,
            startAngle: 90,
            tickInterval: 45,
            period: 360
        },
        "export": {
            enabled: true
        },
        legend: {
            visible: false
        },
        title: "Archimedean Spiral"
    });
    
    
});