window.onload = function() {
    var direction = ko.observable("horizontal");
    
    var viewModel = {
        tileViewOptions: {
            items: homes,
            height: 390,
            baseItemHeight: 120,
            baseItemWidth: 185,
            width: "100%",
            itemMargin: 10,
            direction: direction,
            itemTemplate: function (itemData, itemIndex, itemElement) {
                itemElement.append("<div class=\"image\" style=\"background-image: url("+ itemData.ImageSrc + ")\"></div>");
            }
        },
    
        directionOptions: {
            items: ["horizontal", "vertical"],
            value: direction,
            onValueChanged: function (e) {
                direction(e.value);
            }
        },
    
    };
    
    ko.applyBindings(viewModel, document.getElementById("demo"));
};