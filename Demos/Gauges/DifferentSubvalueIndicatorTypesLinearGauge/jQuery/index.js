$(function(){
    var options = {
        scale: {
            startValue: 10, endValue: 50,
            tickInterval: 10,
            label: {
                customizeText: function (arg) {
                    return "$" + arg.valueText;
                }
            }
        }
    };
    
    $("#c1").dxLinearGauge($.extend(true, {}, options, {
        value: 24,
        subvalues: [18, 43],
        subvalueIndicator: {
            type: "rectangle",
            color: "#9B870C"
        }
    }));
    $("#c2").dxLinearGauge($.extend(true, {}, options, {
        value: 38,
        subvalues: [18, 43],
        subvalueIndicator: {
            type: "rhombus",
            color: "#779ECB"
        }
    }));
    $("#c3").dxLinearGauge($.extend(true, {}, options, {
        value: 21,
        subvalues: [18, 43],
        subvalueIndicator: {
            type: "circle",
            color: "#8FBC8F"
        }
    }));
    $("#c4").dxLinearGauge($.extend(true, {}, options, {
        value: 42,
        subvalues: [18, 43],
        subvalueIndicator: {
            type: "textCloud",
            color: "#734F96"
        }
    }));
    $("#c5").dxLinearGauge($.extend(true, {}, options, {
        value: 28,
        subvalues: [18, 43],
        subvalueIndicator: {
            type: "triangleMarker",
            color: "#f05b41"
        }
    }));
});