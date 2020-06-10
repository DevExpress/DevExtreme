var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    var treeListData = $.map(tasks, function(task, _) {
        task.Task_Assigned_Employee = null;
        $.each(employees, function(_, employee) {
            if(employee.ID == task.Task_Assigned_Employee_ID)
                task.Task_Assigned_Employee = employee;
        });
        return task;
    });

    $scope.treeListOptions = {
        dataSource: treeListData,
        keyExpr: "Task_ID",
        parentIdExpr: "Task_Parent_ID",
        columnAutoWidth: true,
        wordWrapEnabled: true,
        showBorders: true,
        expandedRowKeys: [1, 2],
        selectedRowKeys: [1, 29, 42],
        searchPanel: {
            visible: true,
            width: 250
        },
        headerFilter: {
            visible: true
        },
        selection: {
            mode: "multiple"
        },
        columnChooser: {
            enabled: true
        },
        columns: [{
            dataField: "Task_Subject",
            width: 300
        }, {
            dataField: "Task_Assigned_Employee_ID",
            caption: "Assigned",
            allowSorting: false,
            minWidth: 200,
            cellTemplate: function(container, options) {
                var currentEmployee = options.data.Task_Assigned_Employee;
                if(currentEmployee) {
                    container
                        .append($("<div>", { "class": "img", style: "background-image:url(" + currentEmployee.Picture + ");" }))
                        .append("\n")
                        .append($("<span>", { "class": "name", text: currentEmployee.Name }));
                }
            },
            lookup: {
                dataSource: employees,
                valueExpr: "ID",
                displayExpr: "Name"
            }
        }, {
            dataField: "Task_Status",
            caption: "Status",
            minWidth: 100,
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
            dataField: "Task_Priority",
            caption: "Priority",
            lookup: {
                dataSource: priorities,
                valueExpr: "id",
                displayExpr: "value"
            },
            visible: false
        }, {
            dataField: "Task_Completion",
            caption: "% Completed",
            customizeText: function(cellInfo) {
                return cellInfo.valueText + "%";
            },
            visible: false
        }, {
            dataField: "Task_Start_Date",
            caption: "Start Date",
            dataType: "date"
        }, {
            dataField: "Task_Due_Date",
            caption: "Due Date",
            dataType: "date"
        }]
    };
});