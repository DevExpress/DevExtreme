$(function(){
    var dxMenu = $("#menu").dxMenu({
        dataSource: menuData,
        hideSubmenuOnMouseLeave: false,
        displayExpr: "name",
        onItemClick: function (data) {
            var item = data.itemData;
            if(item.price) {
                $("#product-details").removeClass("hidden");
                $("#product-details > img").attr("src", item.icon);
                $("#product-details > .price").text("$" + item.price);
                $("#product-details > .name").text(item.name);
            }
        }
    }).dxMenu("instance");
    
    var showSubmenuModes = [{
        name: "onHover",
        delay: { show: 0, hide: 500 }
    }, {
        name: "onClick",
        delay: { show: 0, hide: 300 }
    }];
    
    $("#show-submenu-mode").dxSelectBox({
        items: showSubmenuModes,
        value: showSubmenuModes[1],
        displayExpr: "name",
        onValueChanged: function(data) {
            dxMenu.option("showFirstSubmenuMode", data.value);
        }
    });
    
    $("#orientation").dxSelectBox({
        items: ["horizontal", "vertical"],
        value: "horizontal",
        onValueChanged: function(data) {
            dxMenu.option("orientation", data.value);
        }
    });
    
    $("#submenu-direction").dxSelectBox({
        items: ["auto", "rightOrBottom", "leftOrTop"],
        value: "auto",
        onValueChanged: function(data) {
            dxMenu.option("submenuDirection", data.value);
        }
    });
    
    $("#mouse-leave").dxCheckBox({
        value: false,
        text: "Hide Submenu on Mouse Leave",
        onValueChanged: function(data) {
            dxMenu.option("hideSubmenuOnMouseLeave", data.value);
        }
    });
});