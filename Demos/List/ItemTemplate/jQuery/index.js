$(function(){
    $("#listWidget").dxList({
        dataSource: products,
        height: "100%",
        itemTemplate: function(data, index) {
            var result = $("<div>").addClass("product");
    
            $("<img>").attr("src", data.ImageSrc).appendTo(result);
            $("<div>").text(data.Name).appendTo(result);
            $("<div>").addClass("price")
                .html(Globalize.formatCurrency(data.Price, "USD", { maximumFractionDigits: 0 })).appendTo(result);
    
            return result;
    
        }
    }).dxList("instance");
    
});