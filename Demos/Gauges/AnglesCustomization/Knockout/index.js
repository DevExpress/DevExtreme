window.onload = function() {
    var viewModel = {
        gaugeOptions1: {
            scale: {
                startValue: 0, 
                endValue: 100,
                tickInterval: 10
            },
            geometry: {
                startAngle: 180,
                endAngle: 90
            },
            value: 80
        },
        gaugeOptions2: {
            scale: {
                startValue: 100, 
                endValue: 0,
                tickInterval: 10
            },
            geometry: {
                startAngle: 90,
                endAngle: 0
            },
            value: 75
        },
        gaugeOptions3: {
            scale: {
                startValue: 100,
                endValue: 0,
                tickInterval: 10
            },
            geometry: {
                startAngle: -90,
                endAngle: -180
            },
            value: 70
        },
        gaugeOptions4: {
            scale: {
                startValue: 0, 
                endValue: 100,
                tickInterval: 10
            },
            geometry: {
                startAngle: 0,
                endAngle: -90
            },
            value: 68
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("gauge-demo"));
};