$(function() {   
    var treeList = $("#employees").dxTreeList({
        dataSource: employees,
        keyExpr: "ID",
        parentIdExpr: "Head_ID",
        showRowLines: true,
        showBorders: true,
        columnAutoWidth: true,
        selection: {
            mode: "multiple",
            recursive: false
        },
        columns: [{ 
                dataField: "Full_Name"
            }, {
                dataField: "Title",
                caption: "Position"
            }, "City", "State",
            {
                dataField: "Hire_Date",
                dataType: "date",
                width: 120
            }
        ],
        expandedRowKeys: [1, 2, 10]
    }).dxTreeList("instance");

    $("#recursive").dxCheckBox({
        value: false,
        text: "Recursive Selection",
        onValueChanged: function(e) {
            treeList.clearSelection();
            treeList.option("selection.recursive", e.value);
        }
    });
});