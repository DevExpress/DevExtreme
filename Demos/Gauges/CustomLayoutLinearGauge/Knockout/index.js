window.onload = function() {
    var viewModel = {
        linearGaugeOptions: {
            scale: {
                startValue: 0, 
                endValue: 30,
                tickInterval: 5,
                tick: {
                    color: "#536878"
                },
                label: {
                    indentFromTick: -3
                }
            },
            rangeContainer: {
                offset: 10,
                ranges: [
                    { startValue: 0, endValue: 5, color: "#92000A" },
                    { startValue: 5, endValue: 20, color: "#E6E200" },
                    { startValue: 20, endValue: 30, color: "#77DD77" }
                ]
            },
            valueIndicator: {
                offset: 20
            },
            subvalueIndicator: {
                offset: -15
            },
            "export": {
                enabled: true
            },
            title: {
                text: "Issues Closed (with Min and Max Expected)",
                font: { size: 28 }
            },
            value: 17,
            subvalues: [5, 25]
        }
    };
    
    ko.applyBindings(viewModel, $("#gauge-demo").get(0));
};