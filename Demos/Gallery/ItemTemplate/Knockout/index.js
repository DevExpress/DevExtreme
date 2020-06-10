window.onload = function() {
    var viewModel = {
        galleryOptions: {
            dataSource: gallery,
            height: 440,
            width: "100%",
            loop: true,
            showIndicator: false
        }    
    };
    
    ko.applyBindings(viewModel, document.getElementById("simple-gallery"));
};