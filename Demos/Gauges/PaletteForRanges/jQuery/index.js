$(function(){
    $("#gauge").dxCircularGauge({
        scale: {
            startValue: 50,
            endValue: 150,
            tickInterval: 10,
            label: {
                useRangeColors: true
            }
        },
        rangeContainer: {
            palette: "pastel",
            ranges: [
                { startValue: 50, endValue: 90 },
                { startValue: 90, endValue: 130 },
                { startValue: 130, endValue: 150 }
            ]
        },
        title: {
            text: "Temperature of the Liquid in the Boiler",
            font: { size: 28 }
        },
        "export": {
            enabled: true
        },
        value: 105
    });
});