var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    var alumOptions = {
            dataSource: aluminumCosts,
            argumentField: "month",
            valueField: "2010",
            type: "winloss",
            showMinMax: true,
            winlossThreshold: 2100,
            tooltip: {
                format: "currency"
            }
        },
        nickOptions = {
            dataSource: nickelCosts,
            argumentField: "month",
            valueField: "2010",
            type: "winloss",
            showMinMax: true,
            showFirstLast: false,
            winColor: "#6babac",
            lossColor: "#8076bb",
            winlossThreshold: 19000,
            tooltip: {
                format: "currency"
            }
        },
        copOptions = {
            dataSource: copperCosts,
            argumentField: "month",
            valueField: "2010",
            type: "winloss",
            winlossThreshold: 8000,
            winColor: "#7e4452",
            lossColor: "#ebdd8f",
            firstLastColor: "#e55253",
            tooltip: {
                format: "currency"
            }
        };
    
    $scope.alum2010 = alumOptions;
    $scope.nick2010 = nickOptions;
    $scope.cop2010 = copOptions;
    $scope.alum2011 = $.extend({}, alumOptions, { valueField: "2011" });
    $scope.nick2011 = $.extend({}, nickOptions, { valueField: "2011" });
    $scope.cop2011 = $.extend({}, copOptions, { valueField: "2011" });
    $scope.alum2012 = $.extend({}, alumOptions, { valueField: "2012" });
    $scope.nick2012 = $.extend({}, nickOptions, { valueField: "2012" });
    $scope.cop2012 = $.extend({}, copOptions, { valueField: "2012" });
});