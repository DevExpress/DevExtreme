window.onload = function() {
    var currentColor = ko.observable("#f05b41");
    
    var viewModel = {
        currentColor: currentColor,
        colorBoxSimple: {
            value: "#f05b41"
        },
        colorBoxEditAlphaChannel: {
            value: "#f05b41",
            editAlphaChannel: true
        },
        colorBoxEditButtonText: {
            value: "#f05b41",
            applyButtonText: "Apply",
            cancelButtonText: "Decline"
        },
        colorBoxReadOnly: {
            value: "#f05b41",
            readOnly: true
        },
        colorBoxDisabled: {
            value: "#f05b41",
            disabled: true
        },
        colorBoxWithChangeValue: {
            value: currentColor,
            applyValueMode: "instantly"
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("color-box-demo"));
};