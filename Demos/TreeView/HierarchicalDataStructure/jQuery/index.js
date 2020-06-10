$(function(){
    $("#simple-treeview").dxTreeView({ 
        items: products,
        width: 300,
        onItemClick: function(e) {
            var item = e.itemData;
            if(item.price) {
                $("#product-details").removeClass("hidden");
                $("#product-details > img").attr("src", item.image);
                $("#product-details > .price").text("$" + item.price);
                $("#product-details > .name").text(item.text);
            } else {
                $("#product-details").addClass("hidden");
            }
        }
    }).dxTreeView("instance");
});