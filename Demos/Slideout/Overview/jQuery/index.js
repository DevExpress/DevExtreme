$(function(){
    function showMenu() {
        slideOut.option("menuVisible", !slideOut.option("menuVisible"));
    }
    
    var slideOut = $("#slideout").dxSlideOut({ 
        dataSource: products,
        onItemClick: showMenu,
        menuVisible: true,
        swipeEnabled: true,
        menuGrouped: true,
        itemTemplate: function(itemData, itemIndex, itemElement) {
            $("<div/>")
                .appendTo(itemElement)
                .dxToolbar({
                    dataSource: [{ 
                    location: "before",
                    widget: "dxButton",
                    options: {
                            icon: "menu",
                            onClick: showMenu
                        }
                    }, { 
                        location: "center",
                        template: function(e) {
                            return "<p>" + itemData.text + "</p>";
                        }
                    }]
                });
    
            var $infoContainer = $("<div />").attr("id", "info");
            $infoContainer.append(
                $("<img />").attr("src", itemData.src),
                $("<h1 />").text(itemData.price)
            );
    
            var $fieldSetContainer = $("<div />").addClass("dx-fieldset");
            $fieldSetContainer.append(
                $("<div />").addClass("dx-fieldset-header").text("Options"),
                $("<div />").addClass("dx-field").append(
                    $("<div />").addClass("dx-field-label").text("Swipe to reveal the menu"),
                    $("<div />").addClass("dx-field-value switch")
                )
            );
    
            itemElement.append($infoContainer, $fieldSetContainer);
    
            $(".switch").dxSwitch({
                value: slideOut ? slideOut.option("swipeEnabled") : true,
                onValueChanged: function(e) {
                    slideOut.option("swipeEnabled", e.value);
                }
            });
        },
        menuGroupTemplate: function(e) {
            return "<b>" + e.key + "</b>";
        }
    }).dxSlideOut("instance");
    
    
});