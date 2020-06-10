var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    var oilOptions = {
        dataSource: oilCosts,
        argumentField: "month",
        valueField: "2010",
        type: "line",
        showMinMax: true,
        tooltip: {
            format: "currency"
        }
    },
    goldOptions = {
        dataSource: goldCosts,
        argumentField: "month",
        valueField: "2010",
        type: "spline",
        lineWidth: 3,
        lineColor: "#9ab57e",
        minColor: "#6babac",
        maxColor: "#ebdd8f",
        showMinMax: true,
        showFirstLast: false,
        tooltip: {
            format: "currency"
        }
    },
    silverOptions = {
        dataSource: silverCosts,
        argumentField: "month",
        valueField: "2010",
        lineColor: "#e8c267",
        firstLastColor: "#e55253",
        pointSize: 6,
        pointSymbol: "square",
        pointColor: "#ebdd8f",
        type: "stepline",
        tooltip: {
            format: "currency"
        }
    };
    
    $scope.line2010 = oilOptions;
    $scope.spline2010 = goldOptions;
    $scope.stepline2010 = silverOptions;
    $scope.line2011 = $.extend({}, oilOptions, { valueField: "2011" });
    $scope.spline2011 = $.extend({}, goldOptions, { valueField: "2011" });
    $scope.stepline2011 = $.extend({}, silverOptions, { valueField: "2011" });
    $scope.line2012 = $.extend({}, oilOptions, { valueField: "2012" });
    $scope.spline2012 = $.extend({}, goldOptions, { valueField: "2012" });
    $scope.stepline2012 = $.extend({}, silverOptions, { valueField: "2012" });
});