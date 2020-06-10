window.onload = function() {
    function moveEditColumnToLeft(dataGrid) {
        dataGrid.columnOption("command:edit", { 
            visibleIndex: -1
        });
    }
    
    var viewModel = {
        dataGridOptions: {
            dataSource: employees,
            showBorders: true,
            paging: {
                enabled: false
            },
            editing: {
                mode: "row",
                allowUpdating: true,
                allowDeleting: true
            }, 
            columns: [
                {
                    dataField: "Prefix",
                    caption: "Title"
                },
                "FirstName",
                "LastName",
                {
                    dataField: "Position",
                    width: 130
                }, {
                    dataField: "StateID",
                    caption: "State",
                    width: 125,
                    lookup: {
                        dataSource: states,
                        displayExpr: "Name",
                        valueExpr: "ID"
                    }
                }, {
                    dataField: "BirthDate",
                    dataType: "date",
                    width: 125
                }  
            ],
            onContentReady: function(e){
                moveEditColumnToLeft(e.component);
            },
            onCellPrepared: function(e) {
                if(e.rowType === "data" && e.column.command === "edit") {
                    var isEditing = e.row.isEditing,
                        $links = e.cellElement.find(".dx-link");
        
                    $links.text("");
        
                    if(isEditing){
                        $links.filter(".dx-link-save").addClass("dx-icon-save");
                        $links.filter(".dx-link-cancel").addClass("dx-icon-revert");
                    } else {
                        $links.filter(".dx-link-edit").addClass("dx-icon-edit");
                        $links.filter(".dx-link-delete").addClass("dx-icon-trash");
                    }
                }
            }
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("demo-container"));
};