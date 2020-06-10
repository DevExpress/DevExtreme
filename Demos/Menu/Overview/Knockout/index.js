window.onload = function() {
    var showSubmenuModes = [{
            name: "onHover",
            delay: { show: 0, hide: 500 }
        }, {
            name: "onClick",
            delay: { show: 0, hide: 300 }
        }],
        showFirstSubmenuMode = ko.observable(showSubmenuModes[1]),
        orientation = ko.observable("horizontal"),
        submenuDirection = ko.observable("auto"),
        closeOnMouseLeave = ko.observable(false),
        productName = ko.observable(""),
        productPrice = ko.observable(""),
        productImage = ko.observable("");
    
    var viewModel = {
        menuOptions: {
            dataSource: menuData,
            displayExpr: "name",
            onItemClick: function (data) {
                var item = data.itemData;
                if(item.price) {
                    productImage(item.icon);
                    productName(item.name);
                    productPrice("$" + item.price);
                }
            },
            hideSubmenuOnMouseLeave: closeOnMouseLeave,
            showFirstSubmenuMode: showFirstSubmenuMode,
            orientation: orientation,
            submenuDirection: submenuDirection,
        },
        submenuModeOptions: {
            items: showSubmenuModes,
            value: showFirstSubmenuMode,
            displayExpr: "name",
        },
        orientationOptions: {
            items: ["horizontal", "vertical"],
            value: orientation
        },
        submenuDirectionOptions: {
            items: ["auto", "rightOrBottom", "leftOrTop"],
            value: submenuDirection
        },
        mouseLeaveOptions: {
            value: closeOnMouseLeave,
            text: "Hide Submenu on Mouse Leave",
        },
        productName: productName,
        productPrice: productPrice,
        productImage: productImage
    };
    
    ko.applyBindings(viewModel, document.getElementById("menu"));
};