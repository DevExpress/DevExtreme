window.onload = function() {
    var startValue = ko.observable(10),
        endValue = ko.observable(90);
    
    var viewModel = {
        rangeSliderSimple: {
            min: 0,
            max: 100,
            start: 20,
            end: 60
        },
        rangeSliderWithLabel: {
            min: 0,
            max: 100,
            start: 35,
            end: 65,
            label: {
                visible: true,
                format: function(value) {
                    return value + "%";
                },
                position: "top"
            }
        },  
        rangeSliderWithTooltip: {
            min: 0,
            max: 100,
            start: 15,
            end: 65,
            tooltip: {
                enabled: true,
                format: function (value) {
                    return value + "%";
                },
                showMode: "always", 
                position: "bottom"
            }
        },
        rangeSliderWithHideRange: {
            min: 0,
            max: 100,
            start: 20,
            end: 80,
            showRange: false
        },
        rangeSliderWithStep: {
            min: 0,
            max: 100,
            start: 20,
            end: 70,
            step: 10,
            tooltip: {
                enabled: true
            }
        },
        rangeSliderDisabled: {
            min: 0,
            max: 100,
            start: 25,
            end: 75,
            disabled: true
        },
        handlerRangeSlider: {
            min: 0,
            max: 100,
            start: startValue,
            end: endValue
        },
        numberBoxStartValue: {
            value: startValue,
            min: 0,
            max: 100,
            showSpinButtons: true
        },
        numberBoxEndValue: {
            value: endValue,
            min: 0,
            max: 100,
            showSpinButtons: true
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("range-slider-demo"));
};