$(function(){
    $(".boxOptions1").dxBox({
        direction: "row", 
        width: "100%", 
        height: 75
    });
    
    $("#boxOptions2").dxBox({
        direction: "row", 
        width: "100%", 
        height: 75, 
        align: "center", 
        crossAlign: "center"
    });
    
    $("#boxOptions3").dxBox({
        direction: "col", 
        width: "100%", 
        height: 250 
    });
    
    $("#boxOptions4").dxBox({
        direction: "row", 
        width: "100%", 
        height: 125
    });
});