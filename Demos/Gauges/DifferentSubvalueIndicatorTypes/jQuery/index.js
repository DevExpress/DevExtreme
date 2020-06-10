$(function(){
    var options = {
        geometry: {
            startAngle: 180, 
    		endAngle: 0
        },
        scale: {
            startValue: 0, 
    		endValue: 10,
    		tickInterval: 1
        }
    };
    
    $("#triangleMarker").dxCircularGauge($.extend(true, {}, options, {
        value: 8,
        subvalues: [2, 8],
        subvalueIndicator: {
            type: "triangleMarker",
            color: "#8FBC8F"
        }
    }));
    $("#rectangleNeedle").dxCircularGauge($.extend(true, {}, options, {
        value: 9,
        subvalues: [2, 8],
        subvalueIndicator: {
            type: "rectangleNeedle",
            color: "#9B870C"
        }
    }));
    $("#triangleNeedle").dxCircularGauge($.extend(true, {}, options, {
        value: 5,
        subvalues: [2, 8],
        subvalueIndicator: {
            type: "triangleNeedle",
            color: "#779ECB"
        }
    }));
    $("#textCloud").dxCircularGauge($.extend(true, {}, options, {
        value: 6,
        subvalues: [2, 8],
        subvalueIndicator: {
            type: "textCloud",
            color: "#f05b41"
        }
    }));
    $("#twoColorNeedle").dxCircularGauge($.extend(true, {}, options, {
        value: 4,
        subvalues: [2, 8],
        subvalueIndicator: {
            type: "twoColorNeedle",
            color: "#779ECB",
            secondColor: "#734F96"
        }
    }));
});