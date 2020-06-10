window.onload = function() {
    var productName = ko.observable(""),
        productPrice = ko.observable(""),
        productImage = ko.observable("");
    
    var viewModel = {
        treeViewOptions: {
            items: products,
            width: 300,
            onItemClick: function(e) {
                var item = e.itemData;
                if(item.price) {
                    productImage(item.image);
                    productName(item.text);
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