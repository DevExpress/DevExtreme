window.onload = function() {
    var viewModel = {
        customIconOptions: {
            items: simpleProducts
        },
        
        isLoaded: ko.observable(true),
        
        loadIndicatorOptions: {
            items: simpleProducts,
            dataSource: {
                loadMode: 'raw',
                load: function() {
                    var d = $.Deferred();
                    viewModel.isLoaded(false);
                    
                    setTimeout(function() {
                        d.resolve(simpleProducts);
                        viewModel.isLoaded(true);
                    }, 3000);
                    return d.promise();
                }
            }
        },
        
        dynamicDropDownButtonOptions: {
            items: products,
            showClearButton: true,
            value: 1,
            displayExpr: "Name",
            valueExpr: "ID",
            selectedItem: ko.observable(null)
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("select-box-demo"));
};