window.onload = function() {
    var searchMode = ko.observable("contains");
    
    var viewModel = {
        treeViewOptions: {
            items: products,
            width: 500,
            searchEnabled: true,
            searchMode: searchMode
        },
        searchModeOptions: {
            dataSource: ["contains", "startsWith"],
            value: searchMode
        }
    };
    
    ko.applyBindings(viewModel);
};