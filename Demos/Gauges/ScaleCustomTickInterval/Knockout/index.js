window.onload = function() {
    var viewModel = {
    	gaugeOptions: {
            scale: {
                startValue: 0,
                endValue: 5,
    		    tickInterval: 2.5,
    		    minorTickInterval: 0.625,
                minorTick: {
                    visible: true
                }
            },
            "export": {
                enabled: true
            },
            title: {
                text: "TV Show Rating",
                font: { size: 28 }
            },
            value: 4.3
        }
    };
    
    ko.applyBindings(viewModel, $("#gauge-demo").get(0));
};