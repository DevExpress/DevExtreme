var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.treeMapOptions = {
        dataSource: citiesPopulation,
        title: "The Most Populated Cities by Continents",
        tooltip: {
            enabled: true,
            format: "thousands",
            customizeTooltip: function (arg) {
                var data = arg.node.data,
                    result = null;
    
                if (arg.node.isLeaf()) {
                    result = "<span class='city'>" + data.name + "</span> (" +
                        data.country + ")<br/>Population: " + arg.valueText;
                }
    
                return {
                    text: result
                };
            }
        }
    };
});