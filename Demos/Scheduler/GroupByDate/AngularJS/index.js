const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.groupByDate = true;
  $scope.options = {
    timeZone: 'America/Los_Angeles',
    dataSource: data,
    views: [{
      type: 'week',
      name: 'Week',
    }, {
      type: 'month',
      name: 'Month',
    }],
    currentView: 'Week',
    crossScrollingEnabled: true,
    currentDate: new Date(2021, 3, 21),
    startDayHour: 9,
    endDayHour: 16,
    groups: ['priorityId'],
    resources: [
      {
        fieldExpr: 'priorityId',
        allowMultiple: false,
        dataSource: priorityData,
        label: 'Priority',
      },
    ],
    height: 730,
    bindingOptions: {
      groupByDate: 'groupByDate',
    },
  };

  $scope.switchOptions = {
    bindingOptions: {
      value: 'groupByDate',
    },
  };
});
