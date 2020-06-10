window.onload = function() {
    var searchMode = ko.observable("contains");

    var viewModel = {
        listOptions: {
            dataSource: products,
            height: 400,
            searchEnabled: true,
            searchExpr: "Name",
            searchMode: searchMode,
    	    itemTemplate: function(data) {
    	        return $("<div>").text(data.Name);
    	    }
        },
        searchModeOptions: {
            dataSource: ["contains", "startsWith"],
            value: searchMode
        }
    };
    
    ko.applyBindings(viewModel);
};