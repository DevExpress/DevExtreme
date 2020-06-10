$(function() {
    $("#gridContainer").dxDataGrid({
        keyExpr: "ID",
        dataSource:  employees,
        showBorders: true,
        editing: {
            allowUpdating: true,
            allowAdding: true,
            mode: "row"
        },
        onEditorPreparing: function(e) {
            if(e.parentType === "dataRow" && e.dataField === "CityID") {
                e.editorOptions.disabled = (typeof e.row.data.StateID !== "number");
            }
        },
        columns: ["FirstName", "LastName", "Position",
            {
                dataField: "StateID",
                caption: "State",
                setCellValue: function(rowData, value) {
                    rowData.StateID = value;
                    rowData.CityID = null;
                },
                lookup: {
                    dataSource: states,
                    valueExpr: "ID",
                    displayExpr: "Name"
                }
            },
            {
                dataField: "CityID",
                caption: "City",
                lookup: {
                    dataSource: function(options) {
                        return {
                            store: cities,
                            filter: options.data ? ["StateID", "=", options.data.StateID] : null
                        };
                    },
                    valueExpr: "ID",
                    displayExpr: "Name"
                }
            }
        ]
    });
});