var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    var legendSettings = {
        verticalAlignment: 'bottom',
        horizontalAlignment: 'center',
        itemTextPosition: 'right',
        rowCount: 2
    },
        seriesOptions = [{
            argumentField: "name",
            valueField: "area",
            label: {
                visible: true,
                format: "percent"
            }
        }],
        sizeGroupName = "piesGroup";

    $scope.countriesAreaChartOptions = {
        dataSource: countries,
        sizeGroup: sizeGroupName,
        title: "Area of Countries",
        palette: "Soft",
        legend: legendSettings,
        series: seriesOptions
    };

    $scope.landWaterRationChartOptions = {
        sizeGroup: sizeGroupName,
        title: "Water/Land Ratio",
        legend: legendSettings,
        palette: "Soft Pastel",
        dataSource: waterLandRatio,
        series: seriesOptions
    };
});