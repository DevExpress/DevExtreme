var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.groupByDate = true;
    $scope.options = {
        dataSource: data,
        views: [{
            type: "week",
            name: "Week"
        }, {
            type: "month",
            name: "Month"
        }],
        currentView: "Week",
        crossScrollingEnabled: true,
        currentDate: new Date(2021, 4, 21),
        startDayHour: 9,
        endDayHour: 16,
        groups: ["priorityId"],
        resources: [
            { 
                fieldExpr: "priorityId", 
                allowMultiple: false, 
                dataSource: priorityData,
                label: "Priority"
            }
        ],
        height: 700,
        bindingOptions: {
            groupByDate: "groupByDate"
        }
    };

    $scope.switchOptions = {
        bindingOptions: {
            value: "groupByDate"
        }
    };
});