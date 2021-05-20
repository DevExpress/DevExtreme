$(function(){
    var dataGrid = $("#gridContainer").dxDataGrid({
        dataSource: employees,
        keyExpr: "ID",
        showBorders: true,
        sorting: {
            mode: "multiple"
        },
        columns: [ 
            { 
                dataField: "Prefix",
                caption: "Title",
                width: 70
            }, {
                dataField: "FirstName",
                sortOrder: "asc"
            }, {
                dataField: "LastName",
                sortOrder: "asc"
            }, "City",
            "State", {
                dataField: "Position",
                width: 130
            }, {
                dataField: "HireDate",
                dataType: "date"
            }
        ]
    }).dxDataGrid("instance");
    
    
    $("#positionSorting").dxCheckBox({
        value: false,
        text: "Disable Sorting for the Position Column",
        onValueChanged: function(data) {
            dataGrid.columnOption(5, "sortOrder", undefined);
            dataGrid.columnOption(5, "allowSorting", !data.value);
        }
    });
});