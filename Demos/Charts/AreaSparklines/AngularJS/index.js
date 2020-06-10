var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    var copOptions = {
        dataSource: copperCosts,
        argumentField: "month",
        valueField: "2010",
        type: "area",
        showMinMax: true,
        tooltip: {
            format: "currency"
        }
    },
    nickOptions = {
        dataSource: nickelCosts,
        argumentField: "month",
        valueField: "2010",
        type: "splinearea",
        lineColor: "#8076bb",
        minColor: "#6babac",
        maxColor: "#8076bb",
        pointSize: 6,
        showMinMax: true,
        showFirstLast: false,
        tooltip: {
            format: "currency"
        }
    },
    palOptions = {
        dataSource: palladiumCosts,
        argumentField: "month",
        valueField: "2010",
        firstLastColor: "#e55253",
        lineColor: "#7e4452",
        lineWidth: 3,
        pointColor: "#e8c267",
        pointSymbol: "polygon",
        type: "steparea",
        tooltip: {
            format: "currency"
        }
    };
    
    $scope.area2010 = copOptions;
    $scope.splinearea2010 = nickOptions;
    $scope.steparea2010 = palOptions;
    $scope.area2011 = $.extend({}, copOptions, { valueField: "2011" });
    $scope.splinearea2011 = $.extend({}, nickOptions, { valueField: "2011" });
    $scope.steparea2011 = $.extend({}, palOptions, { valueField: "2011" });
    $scope.area2012 = $.extend({}, copOptions, { valueField: "2012" });
    $scope.splinearea2012 = $.extend({}, nickOptions, { valueField: "2012" });
    $scope.steparea2012 = $.extend({}, palOptions, { valueField: "2012" });
});