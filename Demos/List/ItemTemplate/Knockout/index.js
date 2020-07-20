window.onload = function() {
    var viewModel = {
        listOptions: {
            dataSource: products,
    	    height: "100%"
        },
        formatCurrency: new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format
    };

    ko.applyBindings(viewModel, document.getElementById("list"));
};