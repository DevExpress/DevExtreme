$(function(){
    var checkAvailable = function(data) {
       var type = data.value ? "success" : "error",
            productName = data.element.parent().find(".name").text(),
            text = productName + 
                (data.value ? " is available" : " is not available");
    
        DevExpress.ui.notify(text, type, 600);
    };
    
    $.each(products, function(i, product) {
        $("<li />").append(
            $("<img />").attr("src", product.ImageSrc),
            $("<div />").attr("class", "name").text(product.Name),
            $("<div />")
                .dxCheckBox({
                    text: "Available", 
                    onValueChanged: checkAvailable
                })
        ).appendTo($(".products"));
    });
});