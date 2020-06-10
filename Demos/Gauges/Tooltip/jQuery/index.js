$(function(){
    $("#gauge").dxBarGauge({
        startValue: 0,
        endValue: 200,
        values: [121.4, 135.4, 115.9, 141.1, 127.5],
        label: { visible: false },
        tooltip: {
            enabled: true,
            customizeTooltip: function (arg) {
                return {
                    text: getText(arg, arg.valueText)
                };
            }
        },
        "export": {
            enabled: true
        },
        title: {
            text: "Average Speed by Racer",
            font: {
                size: 28
            }
        },
        legend: {
            visible: true,
            verticalAlignment: "bottom",
            horizontalAlignment: "center",
            customizeText: function(arg) {
                return getText(arg.item, arg.text);
            }
        }
    });

    function getText(item, text){
        return "Racer " + (item.index + 1) + " - " + text + " km/h";
    }
});