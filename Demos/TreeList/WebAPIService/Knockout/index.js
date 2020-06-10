window.onload = function() {
    var url = "https://js.devexpress.com/Demos/Mvc/api/TreeListTasks";
    var viewModel = {
        treeListOptions: {
            dataSource: DevExpress.data.AspNet.createStore({
                key: "Task_ID",
                loadUrl: url + "/Tasks",
                insertUrl: url + "/InsertTask",
                updateUrl: url + "/UpdateTask",
                deleteUrl: url + "/DeleteTask",
                onBeforeSend: function(method, ajaxOptions) {
                    ajaxOptions.xhrFields = { withCredentials: true };
                }
            }),
            remoteOperations: { 
                filtering: true,
                sorting: true,
                grouping: true
            },
            parentIdExpr: "Task_Parent_ID",
            hasItemsExpr: "Has_Items",
            expandedRowKeys: [1, 2],
            searchPanel: { 
                visible: true
            },
            headerFilter: {
                visible: true
            },
            editing: {
                mode: "row",
                allowAdding: true,
                allowUpdating: true,
                allowDeleting: true
            },
            showRowLines: true,
            showBorders: true,
            columnAutoWidth: true,
            wordWrapEnabled: true,
            columns: [{
                    dataField: "Task_Subject",
                    minWidth: 250,
                    validationRules: [{ type: "required" }]
                }, { 
                    dataField: "Task_Assigned_Employee_ID",
                    caption: "Assigned",
                    minWidth: 120,
                    lookup: {
                        dataSource: DevExpress.data.AspNet.createStore({
                            key: "ID",
                            loadUrl: url + "/TaskEmployees"
                        }),
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