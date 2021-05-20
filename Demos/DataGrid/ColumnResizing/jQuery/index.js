$(function(){
    var dataGrid = $("#orders").dxDataGrid({
        dataSource: customers,
        keyExpr: "ID",
        allowColumnResizing: true,
        showBorders: true,
        columnResizingMode: "nextColumn",
        columnMinWidth: 50,
        columnAutoWidth: true,
        columns: ["CompanyName", "City", "State", "Phone", "Fax"]
    }).dxDataGrid("instance");

    var resizingModes = ["nextColumn", "widget"];

    $("#select-resizing").dxSelectBox({
        items: resizingModes,
        value: resizingModes[0],
        width: 250,
        onValueChanged: function(data) {
            dataGrid.option("columnResizingMode", data.value);  
        }
    });
});