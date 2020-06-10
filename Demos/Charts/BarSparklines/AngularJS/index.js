var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    var source = new DevExpress.data.DataSource({
        load: function() {
            return $.getJSON("../../../../data/resourceData.json");
        },
        loadMode: "raw",
        filter: ["month", "<=", "12"],
        paginate: false
    });
    
    var alumOptions = {
        dataSource: source,
        argumentField: "month",
        valueField: "alum2010",
        type: "bar",
        showMinMax: true,
        tooltip: {
            format: "currency"
        }
    },
    nickOptions = {
        dataSource: source,
        argumentField: "month",
        valueField: "nickel2010",
        type: "bar",
        showMinMax: true,
        showFirstLast: false,
        barPositiveColor: "#6babac",
        minColor: "#9ab57e",
        maxColor: "#8076bb",
        tooltip: {
            format: "currency"
        }
    },
    copOptions = {
        dataSource: source,
        argumentField: "month",
        valueField: "copper2010",
        type: "bar",
        barPositiveColor: "#e55253",
        firstLastColor: "#ebdd8f",
        tooltip: {
            format: "currency"
        }
    };
    
    $scope.alum2010 = alumOptions;
    $scope.nick2010 = nickOptions;
    $scope.cop2010 = copOptions;
    $scope.alum2011 = $.extend({}, alumOptions, { valueField: "alum2011" });
    $scope.nick2011 = $.extend({}, nickOptions, { valueField: "nickel2011" });
    $scope.cop2011 = $.extend({}, copOptions, { valueField: "copper2011" });
    $scope.alum2012 = $.extend({}, alumOptions, { valueField: "alum2012" });
    $scope.nick2012 = $.extend({}, nickOptions, { valueField: "nickel2012" });
    $scope.cop2012 = $.extend({}, copOptions, { valueField: "copper2012" });
    $scope.monthOptions = {
        dataSource: [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
        width: 70,
        value: 12,
        onValueChanged: function (data) {
            var count = data.value;
            source.filter(["month", "<=", count]);
            source.load();
        }
    };
});