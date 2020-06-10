window.onload = function() {
    var viewModel = {
        listOptions: {
            dataSource: products,
    	    height: "100%"
        } 
    };
    
    ko.applyBindings(viewModel, document.getElementById("list"));
};