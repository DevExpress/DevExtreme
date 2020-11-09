var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    var dataSource = new DevExpress.data.DataSource({
        store: data
    });

    $scope.schedulerOptions = {
        timeZone: "America/Los_Angeles",
        dataSource: dataSource,
        views: ["month"],
        currentView: "month",
        currentDate: new Date(2021, 7, 2, 11, 30),
        firstDayOfWeek: 1,
        startDayHour: 8,
        endDayHour: 18,
        showAllDayPanel: false,
        height: 600,
        groups: ['employeeID'],
        resources: [
            {
                fieldExpr: 'employeeID',
                allowMultiple: false,
                dataSource: employees,
                label: 'Employee'
            }
        ],
        resourceCellTemplate: 'resourceCellTemplate',
        dataCellTemplate: 'dataCellTemplate'
    };

    $scope.markWeekEnd = function (cellData) {
        function isWeekEnd(date) {
            const day = date.getDay();
            return day === 0 || day === 6;
        }
        const classObject = {};
        classObject["employee-" + cellData.groups.employeeID] = true;
        classObject['employee-weekend-' + cellData.groups.employeeID] = isWeekEnd(cellData.startDate);
        return classObject;
    };

    $scope.markTraining = function (cellData) {
        const classObject = {
            "day-cell": true
        };

        classObject[getCurrentTraining(cellData.startDate.getDate(), cellData.groups.employeeID)] = true;
        return classObject;
    };

    function getCurrentTraining(date, employeeID) {
        var result = (date + employeeID) % 3,
            currentTraining = "training-background-" + result;

        return currentTraining;
    }
});