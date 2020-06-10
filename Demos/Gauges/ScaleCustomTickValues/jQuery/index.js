$(function(){
    $("#gauge").dxLinearGauge({
        geometry: { orientation: "vertical" },
        scale: {
            startValue: 0,
            endValue: 50,
    		customTicks: [0, 10, 25, 50]
        },
        title: {
            text: "Fuel Volume (in Liters)",
            font: { size: 28 }
        },
        "export": {
            enabled: true
        },
        value: 35
    });
});