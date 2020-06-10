$(function(){
    $("#gallery").dxGallery({
        dataSource: gallery,
        height: 440,
        width: "100%",
        loop: true,
        showIndicator: false,
        itemTemplate: function (item, index) {
            var result = $("<div>");
            $("<img>").attr("src", item.Image).appendTo(result);
            $("<div>").addClass("item-price").text(Globalize.formatCurrency(item.Price, "USD", { maximumFractionDigits: 0 })).appendTo(result);
            $("<div>").addClass("item-address").text(item.Address + ", " + item.City + ", " + item.State).appendTo(result);
            return result;
        }
    });
});