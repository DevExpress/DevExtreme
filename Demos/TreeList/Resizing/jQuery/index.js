$(function(){
    var treeList = $("#employees").dxTreeList({
        dataSource: employees,
        keyExpr: "ID",
        parentIdExpr: "Head_ID",
        allowColumnResizing: true,
        columnResizingMode: "nextColumn",
        columnMinWidth: 50,
        columnAutoWidth: true,
        columns: [{
            dataField: "Title",
            caption: "Position"
        }, "Full_Name", "City", "State", {
            dataField: "Hire_Date",
            dataType: "date"
        }],
        showRowLines: true,
        showBorders: true,
        expandedRowKeys: [1, 3, 6],
    }).dxTreeList("instance");

    var resizingModes = ["nextColumn", "widget"];

    $("#select-resizing").dxSelectBox({
        items: resizingModes,
        value: resizingModes[0],
        width: 250,
        onValueChanged: function(data) {
            treeList.option("columnResizingMode", data.value);  
        }
    });
});