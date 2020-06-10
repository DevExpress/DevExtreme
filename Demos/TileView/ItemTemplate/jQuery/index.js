$(function(){
    $("#tileview").dxTileView({
        items: homes,
        height: 390,
        baseItemHeight: 120,
        baseItemWidth: 185,
        itemMargin: 10,
        itemTemplate: function (itemData, itemIndex, itemElement) {
            itemElement.append("<div class=\"price\">" + Globalize.formatCurrency(itemData.Price, "USD", { maximumFractionDigits: 0 }) + 
                "</div><div class=\"image\" style=\"background-image: url('" + itemData.ImageSrc + "')\"></div>");
        }
    });
    
    
});