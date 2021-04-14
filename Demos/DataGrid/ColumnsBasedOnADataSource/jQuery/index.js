$(function(){
    $("#gridContainer").dxDataGrid({
        dataSource: orders,
        keyExpr: "OrderNumber",
        showBorders: true
    });
    
});