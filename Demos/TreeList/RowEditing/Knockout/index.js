window.onload = function() {
    var viewModel = {
        treeListOptions: {
            dataSource: employees,
            keyExpr: "ID",
            parentIdExpr: "Head_ID",
            showRowLines: true,
            showBorders: true,
            columnAutoWidth: true,
            editing: {
                mode: "row",
                allowUpdating: true,
                allowDeleting: true,
                allowAdding: true
            },
            columns: [{ 
                    dataField: "Full_Name",
                    validationRules: [{ type: "required" }]
                }, {
                    dataField: "Head_ID",
                    caption: "Head",
                    lookup: {
                        dataSource: {
                            store: employees,
                            sort: "Full_Name"
                        },
                        valueExpr: "ID",
                        displayExpr: "Full_Name"
                    },
                    validationRules: [{ type: "required" }]
                }, {
                    dataField: "Title",
                    caption: "Position",
                    validationRules: [{ type: "required" }]
                }, {
                    dataField: "Hire_Date",
                    dataType: "date",
                    width: 120,
                    validationRules: [{ type: "required" }]
                }, {
                    type: "buttons",
                    buttons: ["edit", "delete"]
                }
            ],
            onEditorPreparing: function(e) {
                if(e.dataField === "Head_ID" && e.row.data.ID === 1) {
                    e.cancel = true;
                }
            },
            onInitNewRow: function(e) {
                e.data.Head_ID = 1;
            },
            expandedRowKeys: [1, 2, 3, 4, 5]
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("tree-list-demo"));
};