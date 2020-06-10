window.onload = function() {
    DevExpress.setTemplateEngine("underscore");
    
    var viewModel = {
        tileViewOptions: {
            items: homes,
            height: 390,
            baseItemHeight: 120,
            baseItemWidth: 185,
            itemMargin: 10
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("demo"));
};