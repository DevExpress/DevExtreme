$(function(){
    var formatCurrency = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format;

    $("#tileview").dxTileView({
        items: homes,
        height: 390,
        baseItemHeight: 120,
        baseItemWidth: 185,
        itemMargin: 10,
        itemTemplate: function (itemData, itemIndex, itemElement) {
            itemElement.append("<div class=\"price\">" + formatCurrency(itemData.Price) + 
                "</div><div class=\"image\" style=\"background-image: url('" + itemData.ImageSrc + "')\"></div>");
        }
    });
    
    
});