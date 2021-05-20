$(function(){
    var dataGrid = $("#gridContainer").dxDataGrid({
        dataSource: customers,
        keyExpr: "ID",
        allowColumnReordering: true,
        showBorders: true,
        grouping: {
            autoExpandAll: true,
        },
        searchPanel: {
            visible: true
        },
        paging: {
            pageSize: 10
        },  
        groupPanel: {
            visible: true
        },
        columns: [
            "CompanyName",
            "Phone",
            "Fax",
            "City",
            {
                dataField: "State",
                groupIndex: 0
            }
        ]
    }).dxDataGrid("instance");
    
    $("#autoExpand").dxCheckBox({
        value: true,
        text: "Expand All Groups",
        onValueChanged: function(data) {
            dataGrid.option("grouping.autoExpandAll", data.value);
        }
    });
});