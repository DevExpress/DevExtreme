window.onload = function() {
    var viewModel = {
        products: products,
        checkAvailable: function(data) {
            var type = data.value ? "success" : "error",
                productName = data.element.parent().find("#name").text(),
                text = productName + 
                    (data.value ? " is available" : " is not available");
    
            DevExpress.ui.notify(text, type, 600);
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("toast"));
};