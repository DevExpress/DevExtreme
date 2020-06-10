window.onload = function() {
    var mainGenerator = ko.observable(34),
        subvalueOne = ko.observable(12),
        subvalueTwo = ko.observable(23),
        value = ko.observable(34),
        subvalues = ko.observable([12, 23]);
    
    var viewModel = {
        gaugeOptions: {
            scale: {
                startValue: 10, 
                endValue: 40,
                tickInterval: 5,
                label: {
                    customizeText: function (arg) {
                        return arg.valueText + " kV";
                    }
                }
            },
            tooltip: { enabled: true },
            title: {
                text: "Generators Voltage (kV)",
                font: { size: 28 }
            },
            subvalues: subvalues,
            value: value
        },
        mainGeneratorOptions: {
            value: mainGenerator,
            min: 10,
            max: 40,
            width: 100,
            showSpinButtons: true
        },
        additionalGeneratorOne: {
            value: subvalueOne,
            min: 10,
            max: 40,
            width: 100,
            showSpinButtons: true
        },
        additionalGeneratorTwo: {
            value: subvalueTwo,
            min: 10,
            max: 40,
            width: 100,
            showSpinButtons: true
        },
        editButton: {
            text: "Apply",
            width: 100,
            onClick: function() {
                value(mainGenerator());
                subvalues([subvalueOne(), subvalueTwo()]);
            }
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("gauge-demo"));
};