$(function(){
    var options = {
        scale: {
            startValue: 0, 
    		endValue: 100,
            tickInterval: 10
        }
    };
    
    $("#gaugeOptions1").dxCircularGauge($.extend(true, {}, options, {
        geometry: { startAngle: 180, endAngle: 90 },
        value: 80
    }));
    $("#gaugeOptions2").dxCircularGauge($.extend(true, {}, options, {
        scale: { startValue: 100, endValue: 0 },
        geometry: { startAngle: 90, endAngle: 0 },
        value: 75
    }));
    $("#gaugeOptions3").dxCircularGauge($.extend(true, {}, options, {
        scale: { startValue: 100, endValue: 0 },
        geometry: { startAngle: -90, endAngle: -180 },
        value: 70
    }));
    $("#gaugeOptions4").dxCircularGauge($.extend(true, {}, options, {
        geometry: { startAngle: 0, endAngle: -90 },
        value: 68
    }));
});