window.onload = function() {
    var productName = ko.observable(""),
        productPrice = ko.observable(""),
        productImage = ko.observable("");
    
    var viewModel = {
        treeViewOptions: {
            items: products,
            dataStructure: "plain",
            parentIdExpr: "categoryId",
            keyExpr: "ID",
            displayExpr: "name",
            width: 300,
            onItemClick: function(e) {
                var item = e.itemData;
                if(item.price) {
                    productImage(item.icon);
                    productName(item.name);
                    productPrice("$" + item.price);
                } else {
                    productPrice("");
                }
            }
        },
        productName: productName,
        productPrice: productPrice,
        productImage: productImage
    };
    
    ko.applyBindings(viewModel, document.getElementById("treeview"));
};