window.onload = function() {
    var viewModel = {
    	gridOptions: {
            dataSource: orders,
            showBorders: true
    	}
    };
    
    ko.applyBindings(viewModel, document.getElementById("grid"));
};