window.onload = function() {
    var loop = ko.observable(true),
        slideShow = ko.observable(true),    
        showNavButtons = ko.observable(true),
        showIndicator = ko.observable(true),
        slideshowDelay = ko.computed(
            function(){
                return slideShow() ?  2000 : 0;
            }
        );  
    
    var viewModel = {
        loop: loop,
        slideShow: slideShow,
        showNavButtons: showNavButtons,
        showIndicator: showIndicator,
        galleryOptions: {
            dataSource: gallery,
            height: 300,
            slideshowDelay: slideshowDelay,
            loop: loop,
            showNavButtons: showNavButtons,
            showIndicator: showIndicator
        }    
    };
    
    ko.applyBindings(viewModel, document.getElementById("simple-gallery"));
};