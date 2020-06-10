var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.gridOptions = {
        dataSource: employees,
        keyExpr: "ID",
        showBorders: true,
        columns: [{
            dataField: "Prefix",
            caption: "Title",
            width: 70
        },
            "FirstName",
            "LastName", {
            dataField: "Position",
            width: 170
        }, {
            dataField: "State",
            width: 125
        }, {
            dataField: "BirthDate",
            dataType: "date"
        }
        ],
        masterDetail: {
            enabled: true,
            template: "detail"
        }
    };
    $scope.getDetailGridSettings = function (key) {     
        return {          
            dataSource: new DevExpress.data.DataSource({
                store: new DevExpress.data.ArrayStore({
                    key: "ID",
                    data: tasks
                }),
                filter: ["EmployeeID", "=", key]
            }),
            columnAutoWidth: true,
            showBorders: true,
            columns: ['Subject', {
                dataField: 'StartDate',
                dataType: 'date'
            }, {
                    dataField: 'DueDate',
                    dataType: 'date'
                }, 'Priority', {
                    caption: 'Completed',
                    dataType: 'boolean',
                    calculateCellValue: function (rowData) {
                        return rowData.Status == "Completed";
                    }
                }]
        };
    }
});