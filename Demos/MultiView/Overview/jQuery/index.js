$(function(){
    DevExpress.setTemplateEngine("underscore");
    
    var multiView = $("#multiview-container").dxMultiView({
        height: 300,
        dataSource: multiViewItems,
        selectedIndex: 0,
        loop: false,
        animationEnabled: true,
        itemTemplate: $("#customer"),
        onSelectionChanged: function(e) {
            $(".selected-index")
                .text(e.component.option("selectedIndex") + 1);
        }
    }).dxMultiView("instance");
    
    
    $("#loop-enabled").dxCheckBox({
        value: false, 
        text: "Loop enabled",
        onValueChanged: function(e) {
            multiView.option("loop", e.value);
        }
    });
    
    $("#animation-enabled").dxCheckBox({
        value: true, 
        text: "Animation enabled",
        onValueChanged: function(e) {
            multiView.option("animationEnabled", e.value);
        }
    });
    
    $(".item-count").text(multiViewItems.length);
    
});