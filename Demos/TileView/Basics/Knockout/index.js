window.onload = function() {
    var viewModel = {
        tileViewOptions: {
            items: homes,
            itemTemplate: function (itemData, itemIndex, itemElement) {
                itemElement.append("<div class=\"image\" style=\"background-image: url("+ itemData.ImageSrc + ")\"></div>");
            }
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("demo"));
};