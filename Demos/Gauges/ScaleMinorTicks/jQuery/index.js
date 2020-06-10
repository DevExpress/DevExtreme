$(function(){
    $("#gauge").dxCircularGauge({
        scale: {
            startValue: 0,
            endValue: 1000,
            tick: {
                color: "#9c9c9c"
            },
            minorTick: {
                color: "#9c9c9c",
                visible: true
            },
    		tickInterval: 100,
    		minorTickInterval: 25
        },
        rangeContainer: {
            backgroundColor: "none"
        },
        title: {
            text: "Fan Speed (in rpm)",
            font: { size: 28 }
        },
        "export": {
            enabled: true
        },
        value: 750
    });
});