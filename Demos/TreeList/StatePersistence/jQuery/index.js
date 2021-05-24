$(function(){
    const treeList = $("#employees").dxTreeList({
        dataSource: employees,
        keyExpr: "ID",
        parentIdExpr: "Head_ID",
        allowColumnReordering: true,
        allowColumnResizing: true,
        showBorders: true,
        selection: {
            mode: "multiple",
            recursive: true
        },
        filterRow: {
            visible: true
        },
        stateStoring: {
            enabled: true,
            type: "localStorage",
            storageKey: "treeListStorage"
        },
        expandedRowKeys: [1, 2, 10],
        columns: [{ 
                dataField: "Full_Name"
            }, {
                dataField: "Title",
                caption: "Position"
            }, "City", {
                dataField: "Hire_Date",
                dataType: "date",
                width: 160
            }
        ]
    }).dxTreeList("instance");

    $("#state-reset-link").on("click", function() {
        treeList.state(null);
    });
});