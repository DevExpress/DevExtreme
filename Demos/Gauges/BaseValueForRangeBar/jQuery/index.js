$(function(){
    $("#c1").dxCircularGauge({
        geometry: {
            startAngle: 135,
            endAngle: 45
        },
        scale: {
            startValue: 45, 
            endValue: -45,
            tickInterval: 45,
            label: {
                customizeText: function (arg) {
                    return arg.valueText + "°";
                }
            }
        },
        valueIndicator: {
            type: "rangebar",
            baseValue: 0
        },
        value: 20
    });
    
    $("#c2").dxLinearGauge({
        geometry: { orientation: "vertical" },
        scale: {
            startValue: -45, 
            endValue: 45,
            tickInterval: 45,
            label: {
                customizeText: function (arg) {
                    return arg.valueText + "°";
                }
            }
        },
        valueIndicator: { 
            baseValue: 0
        },
        value: -10
    });
});