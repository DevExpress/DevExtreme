window.onload = function() {
    var editableProducts = ko.observableArray(simpleProducts.slice());
    
    var viewModel = {
        simple: {
            items: simpleProducts
        },
        searchOptions: {
            items: simpleProducts,
            searchEnabled: true
        },
        selectionOptions: {
            items: simpleProducts,
            showSelectionControls: true,
            applyValueMode: "useButtons"
        },
        hideOptions: {
            items: simpleProducts,
            hideSelectedItems: true
        },
        lineOptions: {
            items: simpleProducts,
            multiline: false
        },
        fieldEditOptions: {
            items: editableProducts,
            acceptCustomValue: true,
            onCustomItemCreating: function(args) {
                var newValue = args.text;
                editableProducts.unshift(newValue);
                args.customItem = newValue;
            }
        },
        withCustomPlaceholder: {
            items: simpleProducts,
            placeholder: "Choose Product..."
        },
        disabled: {
            items: simpleProducts,
            value: [simpleProducts[0]],
            disabled: true
        },
        dataSourceUsage: {
            dataSource: new DevExpress.data.ArrayStore({ 
                data: products,
                key: "ID"
            }),
            displayExpr: "Name",
            valueExpr: "ID",
        },
        customTemplate: {
            dataSource: products,
            displayExpr: "Name",
            valueExpr: "ID",
            itemTemplate: "customItem"
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("tag-box-demo"));
};