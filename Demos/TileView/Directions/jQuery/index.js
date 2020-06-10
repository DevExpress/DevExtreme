$(function(){
    var direction = "horizontal";
    var homeTiles = $("#tileview").dxTileView({
        items: homes,
        height: 390,
        baseItemHeight: 120,
        baseItemWidth: 185,
        itemMargin: 10,
        direction: direction,
        itemTemplate: function (itemData, itemIndex, itemElement) {
            itemElement.append("<div class=\"image\" style=\"background-image: url("+ itemData.ImageSrc + ")\"></div>");
        }
    }).dxTileView("instance");
    
    $("#use-vertical-direction").dxSelectBox({
        items: ["horizontal", "vertical"],
        value: direction,
        onValueChanged: function(data) {
            homeTiles.option("direction", data.value);
        }
    });
});