window.onload = function() {
    var checkedItems = ko.observableArray([]);
    
    var viewModel = {
        treeViewOptions: {
            items: products,
            width: 320,
            showCheckBoxesMode: "normal",
            onItemSelectionChanged: function(e) {
                var item = e.node;
    
                if(isProduct(item)) {
                    processProduct($.extend({
                        category: item.parent.text
                    }, item));
                } else {
                    $.each(item.items, function(index, product) {
                        processProduct($.extend({
                            category: item.text
                        }, product));
                    });
                }
            }
        },
        listOptions: {
            width: 400,
            items: checkedItems
        }
    };
    
    function isProduct(data) {
        return !data.items.length;
    }
    
    function processProduct(product) {
        var itemIndex = -1;
    
        $.each(checkedItems(), function (index, item) {
            if (item.key === product.key) {
                itemIndex = index;
                return false;
            }
        });
    
        if(product.selected && itemIndex === -1) {
            checkedItems.push(product);
        } else if (!product.selected){
            checkedItems.splice(itemIndex, 1);
        }
    }
    
    ko.applyBindings(viewModel, document.getElementById("treeview"));
};