$(function(){
    var currentHouse;
    
    window.formatCurrency = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format;

    var popupOptions = {
        width: 660,
        height: 540,
        contentTemplate: function() {
            var result = $(_.template($("#property-details").html(), currentHouse));
            var button = result.find("#favorites")
                .dxButton(buttonOptions)
                .dxButton("instance");
            setButtonText(button, currentHouse.Favorite);
            return result;
        },
        showTitle: true,
        visible: false,
        dragEnabled: false,
        closeOnOutsideClick: true
    };
  
    var buttonOptions = {
        icon: "favorites",
        width: 260,
        height: 44,
        onClick: function(e) {
            currentHouse.Favorite = !currentHouse.Favorite;
            setButtonText(e.component, currentHouse.Favorite);
            showToast(currentHouse.Favorite);
        }
    };
  
    var popoverOptions = {
        showEvent: "mouseenter",
        hideEvent: "mouseleave",
        width: 260,
        position: {
            offset: "0, 2",
            at: "bottom",
            my: "top",
            collision: "fit flip"
        }
    };
    
    function showToast(favoriteState) {
        var message = "This item has been "
          + (favoriteState ? "added to" : "removed from")
          + " the Favorites list!";
        DevExpress.ui.notify({
            message: message,
            width: 450
        }, favoriteState ? "success" : "error", 2000);
    }
  
    function setButtonText(button, isFav) {
        button.option("text", isFav
            ? "Remove from Favorites"
            : "Add to Favorites");
    }
  
    $.each(houses, function(index, house) {
        var template = $(_.template($("#property-item").html(), house));
        
        template.find("#popover" + house.ID)
            .dxPopover($.extend(popoverOptions, {
                "target": "#house" + house.ID,
            }));

        template.find(".item-content").on("dxclick", function() {
            currentHouse = house;
            $(".popup-property-details").remove();
            var container = $("<div />")
                .addClass("popup-property-details")
                .appendTo($("#popup"));
            var popup = container.dxPopup(popupOptions).dxPopup("instance");
            popup.option("title", currentHouse.Address);
            popup.show();
        });

        $(".images").append(template);
    });
});
