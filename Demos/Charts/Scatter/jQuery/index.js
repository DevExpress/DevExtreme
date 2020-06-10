$(function(){
    var dataSource = generateDataSource();
    
    $("#chart").dxChart({
        dataSource: dataSource,
        commonSeriesSettings: {
            type: "scatter"
        },
        series: [{ 
            argumentField: "x1",
            valueField: "y1"
        }, { 
            argumentField: "x2",
            valueField: "y2",
            point: {
                symbol: "triangleDown"
            }
        }],
        argumentAxis:{
            grid:{
                visible: true
            },
            tickInterval: 5,
            minorGrid: {
                visible: true 
            }
        },
        valueAxis: {
            tickInterval: 50
        },
        legend: {
            visible: false
        },
        commonPaneSettings: {
            border:{
                visible: true
            }
        }
    });
    
    function generateDataSource() {
        var b1 = random(-100, 100) / 10,
            b2 = random(-100, 100) / 10,
            k1 = random(-100, 100) / 10,
            k2 = random(-100, 100) / 10,
            deviation1,
            deviation2,
            ds = [],
            i,
            x1,
            x2,
            y1,
            y2,
            isNegativeDelta,
            delta1,
            delta2;
    
        if (k1 < 0.1 && k1 >= 0) { k1 = 0.1; }
        if (k1 > -0.1 && k1 < 0) { k1 = -0.1; }
        if (k2 < 0.1 && k2 >= 0) { k2 = 0.1; }
        if (k2 > -0.1 && k2 < 0) { k2 = -0.1; }
    
        deviation1 = Math.abs(k1 * 8);
        deviation2 = Math.abs(k2 * 8);
        for (i = 0; i < 30; i++) {
            x1 = random(1, 20);
            x2 = random(1, 20);
    
            isNegativeDelta = random(0, 1) === 0;
            delta1 = deviation1 * Math.random();
            delta2 = deviation2 * Math.random();
            if (isNegativeDelta) {
                delta1 = -delta1;
                delta2 = -delta2;
            }
            y1 = k1 * x1 + b1 + delta1;
            y2 = k2 * x2 + b2 + delta2;
    
            ds.push({x1: x1, y1: y1, x2: x2, y2: y2});
        }
        return ds;
    }
    
    function random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
});