window.onload = function() {
    var options = {
        startScaleValue: 0,
        endScaleValue: 35,
        tooltip: {
            customizeTooltip: function (arg) {
                return {
                    text: 'Current t&#176: ' + arg.value + '&#176C<br>' + 'Average t&#176: ' + arg.target + '&#176C'
                };
            }
        }
    };
    
    var viewModel = {
        june1: $.extend({ value: 23, target: 20, color: '#ebdd8f' }, options),
        july1: $.extend({ value: 27, target: 24, color: '#e8c267' }, options),
        august1: $.extend({ value: 20, target: 26, color: '#e55253' }, options),
        june2: $.extend({ value: 24, target: 22, color: '#ebdd8f' }, options),
        july2: $.extend({ value: 28, target: 24, color: '#e8c267' }, options),
        august2: $.extend({ value: 30, target: 24, color: '#e55253' }, options),
        june3: $.extend({ value: 35, target: 24, color: '#ebdd8f' }, options),
        july3: $.extend({ value: 24, target: 26, color: '#e8c267' }, options),
        august3: $.extend({ value: 28, target: 22, color: '#e55253' }, options),
        june4: $.extend({ value: 29, target: 25, color: '#ebdd8f' }, options),
        july4: $.extend({ value: 24, target: 27, color: '#e8c267' }, options),
        august4: $.extend({ value: 21, target: 21, color: '#e55253' }, options)
    };
    
    ko.applyBindings(viewModel, document.getElementById("chart-demo"));
};