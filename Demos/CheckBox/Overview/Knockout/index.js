window.onload = function() {
    var checkBoxValue = ko.observable(undefined);
    
    var viewModel = {
        checked: {
            value: true
        },
        unchecked: {
            value: false
        },
        indeterminate: {
            value: undefined
        },
        handler: {
            value: checkBoxValue       
        },
        disabled: {
            value: checkBoxValue,
            disabled: true
        },
        withText: {
            value: true,
            width: 80,
            text: "Check"
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("check-box-demo"));
};