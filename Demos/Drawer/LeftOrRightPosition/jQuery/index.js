$(function() {
    $("#content").html(text);
 
    var drawer = $("#drawer").dxDrawer({
        opened: true,
        height: 400,
        closeOnOutsideClick: true,
        template: function() {
            var $list = $("<div>").width(200).addClass("panel-list");
 
            return $list.dxList({
                dataSource: navigation,
                hoverStateEnabled: false,
                focusStateEnabled: false,
                activeStateEnabled: false,
                elementAttr: { class: "dx-theme-accent-as-background-color" }
            });
        }
    }).dxDrawer("instance");
 
    $("#toolbar").dxToolbar({
        items: [{
            widget: "dxButton",
            location: "before",
            options: {
                icon: "menu",
                onClick: function() {
                    drawer.toggle(); 
                }
            }
        }]
    });
    
    $("#reveal-mode").dxRadioGroup({
        items: ["slide", "expand"],
        layout: "horizontal",
        value: "slide",
        onValueChanged: function(e) { 
            drawer.option("revealMode", e.value); 
        }
    });
 
    $("#opened-state-mode").dxRadioGroup({
        items: ["push", "shrink", "overlap"],
        layout: "horizontal",
        value: "shrink",
        onValueChanged: function(e) {
            drawer.option("openedStateMode", e.value);
            $("#reveal-mode-option").css("visibility", e.value !== "push" ? "visible" : "hidden");
        }
    });
 
    $("#position-mode").dxRadioGroup({
        items: ["left", "right"],
        layout: "horizontal",
        value: "left",
        onValueChanged: function(e) { 
            drawer.option("position", e.value); 
        }
    });
});
