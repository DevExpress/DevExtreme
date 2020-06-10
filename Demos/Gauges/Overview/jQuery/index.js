$(function() {
    var gaugeOptions = {
        scale: {
            startValue: 0, 
            endValue: 100,
            tickInterval: 50
        },
        valueIndicator: {
            color: "#f05b41"
        },
        value: 20,
        size: {
            width: 90,
            height: 90 
        }
    };

    var speedGauge = $("#speed-gauge").dxCircularGauge({
        geometry: {
            startAngle: 225,
            endAngle: 315
        },
        scale: {
            startValue: 20,
            endValue: 200,
            tickInterval: 20,
            minorTickInterval: 10
        },
        valueIndicator: {
            type: "twoColorNeedle",
            color: "none",
            secondFraction: 0.24,
            secondColor: "#f05b41",
        },
        value: 40,
        size: {
            width: 260 
        }
    }).dxCircularGauge("instance");

    $("#coolant-gauge").dxCircularGauge($.extend(true, {}, gaugeOptions, {
        geometry: { startAngle: 180, endAngle: 90 }
    }));

    $("#psi-gauge").dxCircularGauge($.extend(true, {}, gaugeOptions, {
        scale: { startValue: 100, endValue: 0 },
        geometry: { startAngle: 90, endAngle: 0 }
    }));

    $("#rpm-gauge").dxCircularGauge($.extend(true, {}, gaugeOptions, {
        scale: { startValue: 100, endValue: 0 },
        geometry: { startAngle: -90, endAngle: -180 }
    }));

    $("#instant-fuel-gauge").dxCircularGauge($.extend(true, {}, gaugeOptions, {
        geometry: { startAngle: 0, endAngle: -90 }
    }));

    var fuelGauge = $("#fuel-gauge").dxLinearGauge({
        scale: {
            startValue: 0,
            endValue: 50,
            tickInterval: 25,
            minorTickInterval: 12.5,
            minorTick: {
                visible: true
            },
            label: {
                visible: false
            }
        },
        valueIndicator: {
            color: "#f05b41",
            size: 8,
            offset: 7 
        },
        value: 40.4,
        size: {
            width: 90,
            height: 20
        }
    }).dxLinearGauge("instance");


    $("#slider").dxSlider({
        min: 0,
        max: 200,
        value: 40,
        width: 155,
        onValueChanged: function(e) {
            var gauges = ["coolant", "psi", "rpm", "instant-fuel"];

            $(".speed-value > span").text(e.value);
            speedGauge.value(e.value);

            gauges.forEach(function(gaugeName) {
                $("#" + gaugeName + "-gauge").dxCircularGauge("instance").value(e.value / 2);
            });

            fuelGauge.value(50 - e.value * 0.24);
        }
    });
});