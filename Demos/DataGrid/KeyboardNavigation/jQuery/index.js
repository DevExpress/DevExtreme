$(function() {
    $("#gridContainer").dxDataGrid({
        dataSource: employees,
        keyExpr: "ID",
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
        pager: {
            allowedPageSizes: [5, 10],
            showPageSizeSelector: true,
            showNavigationButtons: true
        },
        paging: {
            pageSize: 10,
        },
        focusedRowEnabled: true,
        columns: [
            "FirstName",
            "LastName",
            "Position",
            {
                dataField: "StateID",
                caption: "State",
                dataType: "number",
                lookup: {
                    dataSource: states,
                    valueExpr: "ID",
                    displayExpr: "Name"
                }
            }
        ]
    });
});
