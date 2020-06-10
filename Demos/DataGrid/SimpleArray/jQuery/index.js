$(function(){
    $("#gridContainer").dxDataGrid({
        dataSource: customers,
        columns: ["CompanyName", "City", "State", "Phone", "Fax"],
        showBorders: true
    });
});