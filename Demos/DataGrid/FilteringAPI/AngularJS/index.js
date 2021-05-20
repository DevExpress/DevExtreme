var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.gridOptions = {
        dataSource: {
            store: {
                type: "odata",
                url: "https://js.devexpress.com/Demos/DevAV/odata/Tasks",
                key: "Task_ID"
            },
            expand: "ResponsibleEmployee",
            select: [
                "Task_ID",
                "Task_Subject",
                "Task_Start_Date",
                "Task_Due_Date",
                "Task_Status",
                "Task_Priority",
                "ResponsibleEmployee/Employee_Full_Name"
            ]
        },
        columnAutoWidth: true,
        showBorders: true,
        columns: [
            {
                dataField: "Task_ID",
                width: 80
            }, {   
                caption: "Start Date",
                dataField: "Task_Start_Date",
                dataType: "date"
            }, {
                caption: "Assigned To",
                dataField: "ResponsibleEmployee.Employee_Full_Name",
                cssClass: "employee",
                allowSorting: false
            }, {
                caption: "Subject",
                dataField: "Task_Subject",
                width: 350
            },  {
                caption: "Status",
                dataField: "Task_Status"
            }
        ]
    };
    
    $scope.selectStatusOptions = {
        dataSource: statuses,
        value: statuses[0],
        onValueChanged: function(data) {
            if (data.value == "All")
                $("#gridContainer")
                    .dxDataGrid("instance")
                    .clearFilter();
            else
                $("#gridContainer")
                    .dxDataGrid("instance")
                    .filter(["Task_Status", "=", data.value]);
        }
    };
    
});