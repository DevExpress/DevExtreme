var DemoApp = angular.module('DemoApp', ['dx', 'ngSanitize']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.dataGrid;
    $scope.focusedRowKey = 117;
    $scope.taskSubject = "";
    $scope.taskDetailsHtml ="";
    $scope.taskStatus = "";
    $scope.taskProgress = "";
    $scope.autoNavigateToFocusedRow = true;

    $scope.dataGridOptions = {
        dataSource: {
            store: {
                type: "odata",
                key: "Task_ID",
                url: "https://js.devexpress.com/Demos/DevAV/odata/Tasks"
            },
            expand: "ResponsibleEmployee",
            select: [
                'Task_ID',
                'Task_Subject',
                'Task_Start_Date',
                'Task_Status',
                'Task_Description',
                'Task_Completion',
                'ResponsibleEmployee/Employee_Full_Name'
              ]
        },
        bindingOptions: {
            focusedRowKey: 'focusedRowKey',
            autoNavigateToFocusedRow: 'autoNavigateToFocusedRow'
        },
        focusedRowEnabled: true,
        showBorders: true,
        paging: {
            pageSize: 10
        },
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
        ],
        onInitialized: function(e) {
            $scope.dataGrid = e.component;
        },
        onFocusedRowChanging: function(e) {
            var rowsCount = e.component.getVisibleRows().length,
                pageCount = e.component.pageCount(),
                pageIndex = e.component.pageIndex(),
                key = e.event && e.event.key;

            if(key && e.prevRowIndex === e.newRowIndex) {
                if(e.newRowIndex === rowsCount - 1 && pageIndex < pageCount - 1) {
                    e.component.pageIndex(pageIndex + 1).done(function() {
                        e.component.option("focusedRowIndex", 0);
                    });
                } else if(e.newRowIndex === 0 && pageIndex > 0) {
                    e.component.pageIndex(pageIndex - 1).done(function() {
                        e.component.option("focusedRowIndex", rowsCount - 1);
                    });
                }
            }
        },
        onFocusedRowChanged: function(e) {
            var rowData = e.row && e.row.data;
            if(rowData) {
                $scope.taskSubject = rowData.Task_Subject;
                $scope.taskDetailsHtml = rowData.Task_Description;
                $scope.taskStatus = rowData.Task_Status;
                $scope.taskProgress = rowData.Task_Completion ? rowData.Task_Completion + "%" : "";
            }
        }
    };

    $scope.focusedRowKeyOptions = {
        min: 1,
        max: 183,
        step: 0,
        bindingOptions: {
            value: 'focusedRowKey'
        }
    };

    $scope.autoNavigateToFocusedRowOptions = {
        text: "Auto Navigate To Focused Row",
        bindingOptions: {
            value: 'autoNavigateToFocusedRow'
        }
    };
});
