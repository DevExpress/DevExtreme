var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.treeListOptions = {
        dataSource: tasks,
        keyExpr: "Task_ID",
        parentIdExpr: "Task_Parent_ID",
        autoExpandAll: true,
        columnAutoWidth: true,
        showBorders: true,
        scrolling: {
            mode: "standard"
        },
        paging: {
            enabled: true,
            pageSize: 10
        },
        pager: {
            showPageSizeSelector: true,
            allowedPageSizes: [5, 10, 20],
            showInfo: true
        },
        columns: [{
                dataField: "Task_Subject",
                width: 390
            }, { 
                dataField: "Task_Assigned_Employee_ID",
                caption: "Assigned",
                lookup: {
                    dataSource: employees,
                    valueExpr: "ID",
                    displayExpr: "Name"
                }
            }, { 
                dataField: "Task_Status",
                caption: "Status",
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
                dataType: "date",
                width: 100
            }, {
                dataField: "Task_Due_Date",
                caption: "Due Date",
                dataType: "date",
                width: 100
            }
        ]
    };
});