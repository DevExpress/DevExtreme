$(function(){
    DevExpress.setTemplateEngine("underscore");
    
    $("#listWidget").dxList({
        dataSource: products,
        height: "100%",
        itemTemplate: $("#item-template")
    });
    
});