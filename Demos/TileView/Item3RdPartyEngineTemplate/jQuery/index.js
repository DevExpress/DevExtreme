$(function(){
    DevExpress.setTemplateEngine("underscore");
    
    $("#tileview").dxTileView({
        items: homes,
        height: 390,
        baseItemHeight: 120,
        baseItemWidth: 185,
        itemMargin: 10,
        itemTemplate: $("#home-template")
    });
    
    
});