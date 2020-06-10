var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.seriesType = {
        type: "scatter"
    };
    
    $scope.polarChartOptions = {
        margin: {
            top: 50,
            bottom: 50,
            left: 100
        },
        dataSource: dataSource,
        series: [{valueField: "day", name: "Day", color: "#ba4d51" }, 
                 { valueField: "night", name: "Night", color: "#5f8b95" }],
        bindingOptions: {
            commonSeriesSettings: "seriesType"
        }
    };
    
    $scope.selectBoxOptions = {
        width: 200,
        dataSource: types,
        bindingOptions: {
            value: "seriesType.type"
        }
    };
});