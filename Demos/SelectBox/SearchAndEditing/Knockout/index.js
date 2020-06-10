window.onload = function() {
    var currentProduct = ko.observable(simpleProducts[0]),
        productsDataSource = new DevExpress.data.DataSource({
            store: {
                data: simpleProducts,
                type: "array",
                key: "ID"
            }
        }),
        searchModeOption = ko.observable("contains"),
        searchExprOption = ko.observable("Name"),
        searchTimeoutOption = ko.observable(200),
        minSearchLengthOption = ko.observable(0),
        showDataBeforeSearchOption = ko.observable(false),
        searchExprItems = [{
            name: "'Name'",
            value: "Name"
        }, {
            name: "['Name', 'Category']",
            value: ['Name', 'Category']
        }];

    var viewModel = {
        currentProductName: ko.computed(function() {
            var product = currentProduct();

            return product ? currentProduct().Name : product;
        }),
        currentProductId: ko.computed(function() {
            var product = currentProduct();

            return product ? currentProduct().ID : product;
        }),
        isProductDefined: ko.computed(function() {
            var product = currentProduct();

            return product !== null && product !== undefined;
        }),
        searchBoxOptions: {
            dataSource: products,
            displayExpr: "Name",
            searchEnabled: true,
            searchMode: searchModeOption,
            searchExpr: searchExprOption,
            searchTimeout: searchTimeoutOption,
            minSearchLength: minSearchLengthOption,
            showDataBeforeSearch: showDataBeforeSearchOption
        },
        editBoxOptions: {
            acceptCustomValue: true,
            dataSource: productsDataSource,
            displayExpr: "Name",
            value: currentProduct,
            onCustomItemCreating: function(data) {
                if(!data.text) {
                    data.customItem = null;
                    return;
                }

                var productIds = simpleProducts.map(function(item) {
                    return item.ID;
                });
                var incrementedId = Math.max.apply(null, productIds) + 1;
                var newItem = {
                    Name: data.text,
                    ID: incrementedId
                };

                productsDataSource.store().insert(newItem);
                productsDataSource.load();
                data.customItem = newItem;
            }
        },
        searchModeOptions: {
            items: ["contains", "startswith"],
            value: searchModeOption
        },
        searchExprOptions: {
            items: searchExprItems,
            displayExpr: "name",
            valueExpr: "value",
            value: searchExprOption
        },
        searchTimeoutOptions: {
            min: 0,
            max: 5000,
            value: 200,
            showSpinButtons: true,
            step: 100,
            value: searchTimeoutOption
        },
        minSearchLengthOptions: {
            min: 0,
            max: 5,
            value: 0,
            showSpinButtons: true,
            value: minSearchLengthOption
        },
        showDataBeforeSearchOptions: {
            value: false,
            text: "Show Data Before Search",
            value: showDataBeforeSearchOption
        }
    };

    ko.applyBindings(viewModel, document.getElementById("selectbox-demo"));
};