window.onload = function() {
    var totalProductQuantity = 30,
        salesValue = ko.observable(16),
        stockValue = ko.pureComputed(function() {
            return totalProductQuantity - salesValue();
        });
    
    var viewModel = {
        withButtons: {
            value: 20.5,
            showSpinButtons: true,
            showClearButton: true,
        },
        disabled: {
            value: 20.5,
            showSpinButtons: true,
            showClearButton: true,
            disabled: true
        }, 
        minAndMaxOptions: {
            value: 15,
            min: 10,
            max: 20,
            showSpinButtons: true
        },
        salesOptions: {
            max: totalProductQuantity,
            min: 0,
            value: salesValue,
            showSpinButtons: true,
            onKeyPress: function(e) {
                var event = e.event,
                    str = event.key || String.fromCharCode(event.which);
                if(/^[\.\,e]$/.test(str))
                    event.preventDefault();
            }
        },
        stockOptions: {
            value: stockValue,
            min: 0,
            showSpinButtons: false,
            readOnly: true
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("number-box-demo"));
};