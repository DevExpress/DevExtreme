window.onload = function() {
    var viewModel = {
        treeListOptions: {
            dataSource: tasks,
            keyExpr: "Task_ID",
            parentIdExpr: "Task_Parent_ID",
            columnAutoWidth: true,
            wordWrapEnabled: true,
            showBorders: true,
            editing: {
                mode: "batch",
                allowAdding: true,
                allowUpdating: true,
                allowDeleting: true
            },
            columns: [{
                    dataField: "Task_Subject",
                    minWidth: 250,
                    validationRules: [{ type: "required" }]
                }, { 
                    dataField: "Task_Assigned_Employee_ID",
                    caption: "Assigned",
                    minWidth: 120,
                    lookup: {
                        dataSource: employees,
                        valueExpr: "ID",
                        displayExpr: "Name"
                    },
                    validationRules: [{ type: "required" }]
                }, { 
                    dataField: "Task_Status",
                    caption: "Status",
                    minWidth: 120,
                    lookup: {
                        dataSource: [
                            "Not Started",
                            "Need Assistance",
                            "In Progress",
                            "Deferred",
                            "Completed"
                        ]
                    } 
                }, {
                    dataField: "Task_Start_Date",
                    caption: "Start Date",
                    dataType: "date"
                }, {
                    dataField: "Task_Due_Date",
                    caption: "Due Date",
                    dataType: "date"
                }
            ],
            onInitNewRow: function(e) {
                e.data.Task_Status = "Not Started";
                e.data.Task_Start_Date = new Date();
                e.data.Task_Due_Date = new Date();
            }
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("tree-list-demo"));
};