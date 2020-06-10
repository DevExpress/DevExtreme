$(function(){
    $("#tasks").dxTreeList({
        dataSource: tasks,
        keyExpr: "Task_ID",
        parentIdExpr: "Task_Parent_ID",
        columnAutoWidth: true,
        wordWrapEnabled: true,
        showBorders: true,
        searchPanel: {
            visible: true
        },
        columns: [{
                dataField: "Task_Subject",
                minWidth: 300
            }, { 
                dataField: "Task_Assigned_Employee_ID",
                caption: "Assigned",
                minWidth: 120,
                lookup: {
                    dataSource: employees,
                    valueExpr: "ID",
                    displayExpr: "Name"
                }
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
        ]
    });
});