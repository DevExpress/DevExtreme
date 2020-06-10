window.onload = function() {
    var activeProducts = ko.observableArray(),
        allProducts = ko.observable(products);
    
    function productsToValues() {
        var data = [];
        allProducts().forEach(function (item){
            if(item.active)
                data.push(item.count);
        });
        activeProducts(data);
    }
    
    var viewModel = {
        allProducts: allProducts,
        productsToValues: productsToValues,
        barGaugeOptions: {
            startValue: 0,
            endValue: 50,
            label: {
                format: {
                    type: "fixedPoint",
                    precision: 0
                }
            },
            onInitialized: productsToValues(),
            values: activeProducts
        }
    };
    
    ko.applyBindings(viewModel, $("#gauge-demo").get(0));
};