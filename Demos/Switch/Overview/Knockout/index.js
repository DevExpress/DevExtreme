window.onload = function() {
    var switchValue = ko.observable(false);
    
    var viewModel = {   
        switchOn: {
            value: true
        },
        switchOff: {
            value: false
        },
        handlerSwitch: {
            value: switchValue
        },
        disabled: {
            value: switchValue,
            disabled: true
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("switch-demo"));
};