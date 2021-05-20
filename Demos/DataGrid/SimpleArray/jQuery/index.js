$(function(){
    $("#gridContainer").dxDataGrid({
        dataSource: customers,
        keyExpr: 'ID',
        columns: ["CompanyName", "City", "State", "Phone", "Fax"],
        showBorders: true
    });
});