$(function(){
    var options = {
        geometry: {
            startAngle: 180, 
    		endAngle: 0
        },
        scale: {
            startValue: 0,
    		endValue: 100,
    		tickInterval: 50,
            label: {
                customizeText: function (arg) {
                    return arg.valueText + " %";
                }
            }
        }
    };
    
    $("#rectangleNeedle").dxCircularGauge($.extend(true, {}, options, {
        value: 75,
        valueIndicator: {
            type: "rectangleNeedle",
            color: "#9B870C"
        }
    }));
    $("#twoColorNeedle").dxCircularGauge($.extend(true, {}, options, {
        value: 80,
        valueIndicator: {
            type: "twoColorNeedle",
            color: "#779ECB",
            secondColor: "#734F96"
        }
    }));
    $("#triangleNeedle").dxCircularGauge($.extend(true, {}, options, {
        value: 65,
        valueIndicator: {
            type: "triangleNeedle",
            color: "#8FBC8F"
        }
    }));
    $("#rangebar").dxCircularGauge($.extend(true, {}, options, {
        value: 90,
        valueIndicator: {
            type: "rangebar",
            color: "#f05b41"
        }
    }));
    $("#textCloud").dxCircularGauge($.extend(true, {}, options, {
        value: 70,
        valueIndicator: {
            type: "textCloud",
            color: "#483D8B"
        }
    }));
    $("#triangleMarker").dxCircularGauge($.extend(true, {}, options, {
        value: 85,
        valueIndicator: {
            type: "triangleMarker",
            color: "#e0e33b"
        }
    }));
});