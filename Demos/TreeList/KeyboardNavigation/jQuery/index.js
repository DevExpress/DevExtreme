$(function() {
    $("#treeListContainer").dxTreeList({
        dataSource: employees,
        keyExpr: "ID",
        parentIdExpr: "Head_ID",
        showBorders: true,
        editing: {
            allowUpdating: true,
            allowDeleting: true,
            selectTextOnEditStart: true,
            useIcons: true
        },
        headerFilter: {
            visible: true
        },
        filterPanel: {
            visible: true
        },
        filterRow: {
            visible: true
        },
        scrolling: {
            mode: "standard"
        },
        pager: {
            allowedPageSizes: [5, 10],
            showPageSizeSelector: true,
            showNavigationButtons: true
        },
        paging: {
            enabled: true,
            pageSize: 10,
        },
        focusedRowEnabled: true,
        columns: [
            "Full_Name",
            {
                dataField: "Title",
                caption: "Position"
            },
            "City",
            "State"
        ],
        expandedRowKeys: [1, 2, 3, 5]
    });
});
