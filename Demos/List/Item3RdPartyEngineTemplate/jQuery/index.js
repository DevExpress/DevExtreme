$(function(){
    DevExpress.setTemplateEngine("underscore");
    
    window.formatCurrency = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format;

    $("#listWidget").dxList({
        dataSource: products,
        height: "100%",
        itemTemplate: $("#item-template")
    });
    
});