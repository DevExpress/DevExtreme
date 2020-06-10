$(function(){
    $("#gauge").dxCircularGauge({
        scale: {
            startValue: 0, 
    		endValue: 3000,
            tickInterval: 500,
            label: {
                customizeText: function (arg) {
                    return arg.valueText + " °C";
                }
            }
        },
        subvalueIndicator: {
            type: "textcloud",
            text: {
                format: {
                    type: "thousands",
                    precision: 1
                },
                customizeText: function (arg) {
                    return arg.valueText + " °C";
                }
            }
        },
        "export": {
            enabled: true
        },
        title: {
            text: "Oven Temperature (includes Recommended)",
            font: { size: 28 }
        },
        value: 2200,
        subvalues: [2700]
    });
});