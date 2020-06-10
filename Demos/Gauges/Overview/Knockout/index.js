window.onload = function() {
    var speedValue = ko.observable(40),
        gaugeValue = ko.computed(function() {
            return (speedValue() / 2);
        });

    var viewModel = {
        speedValue: speedValue,
        speedOptions: {
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
            value: speedValue,
            size: {
                width: 260 
            }
        },
        coolantOptions: {
            geometry: { 
                startAngle: 180,
                endAngle: 90 
            },
            scale: {
                startValue: 0, 
                endValue: 100,
                tickInterval: 10
            },
            valueIndicator: {
                color: "#f05b41"
            },
            value: gaugeValue,
            size: {
                width: 90,
                height: 90 
            }
        },
        psiOptions: {
            scale: { 
                startValue: 100,
                endValue: 0,
                tickInterval: 10 
             },
            geometry: { 
                startAngle: 90,
                endAngle: 0 
            },
            valueIndicator: {
                color: "#f05b41"
            },
            value: gaugeValue,
            size: {
                width: 90,
                height: 90 
            }
        },
        rpmOptions: {
            scale: { 
                startValue: 100,
                endValue: 0,
                tickInterval: 10 
            },
            geometry: { 
                startAngle: -90,
                endAngle: -180 
            },
            valueIndicator: {
                color: "#f05b41"
            },
            value: gaugeValue,
            size: {
                width: 90,
                height: 90 
            }
        },
        instantFuelOptions: {
            scale: {
                startValue: 0, 
                endValue: 100,
                tickInterval: 10
            },
            geometry: { 
                startAngle: 0, 
                endAngle: -90 
            },
            valueIndicator: {
                color: "#f05b41"
            },
            value: gaugeValue,
            size: {
                width: 90,
                height: 90 
            }
        },
        fuelOptions: {
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
            value: ko.computed(function() {
                return (50 - speedValue() * 0.24);
            }),
            size: {
                width: 90,
                height: 20
            }
        },
        sliderOptions: {
            min: 0,
            max: 200,
            value: speedValue,
            width: 155
        }
    };

    ko.applyBindings(viewModel, document.getElementById("gauge-demo"));
};