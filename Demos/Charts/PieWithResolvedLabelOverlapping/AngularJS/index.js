var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.currentType = types[0];
    
    $scope.chartOptions = {
        palette: "bright",
        dataSource: dataSource,
        title: "Olympic Medals in 2008",
        margin: {
            bottom: 20
        },
        legend: {
            visible: false
        },
        animation: {
            enabled: false
        },
        "export": {
            enabled: true
        },
        series: [{
            argumentField: "country",
            valueField: "medals",
            label: {
                visible: true,
                customizeText: function(arg) {
                    return arg.argumentText + " (" + arg.percentText + ")";
                }
            }
        }],
        bindingOptions: { 
            "resolveLabelOverlapping": "currentType"
        }
    };
    
    $scope.typesOptions = {
        dataSource: types,
        bindingOptions: { 
            value: "currentType"
        }
    };
});