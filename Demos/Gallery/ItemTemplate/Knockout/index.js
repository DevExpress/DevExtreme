window.onload = function() {
    var viewModel = {
        galleryOptions: {
            dataSource: gallery,
            height: 440,
            width: "100%",
            loop: true,
            showIndicator: false
        },
        formatCurrency: new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format 
    };
    
    ko.applyBindings(viewModel, document.getElementById("simple-gallery"));
};