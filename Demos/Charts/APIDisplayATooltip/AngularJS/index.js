var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.selectedRegion = "";
    
    $scope.pieChartOptions = {
        type: "doughnut",
        palette: "Soft Pastel",
        dataSource: dataSource,
        title: "The Population of Continents and Regions",
        tooltip: {
            enabled: false,
            format: "millions",
            customizeTooltip: function (arg) {
                return {
                    text: arg.argumentText + "<br/>" + arg.valueText
                };
            }
        },
        size: {
            height:350
        },
        onPointClick: function(e) {
            var point = e.target;
            point.showTooltip();
            $scope.selectedRegion = point.argument;
        },
        legend: {
            visible: false
        },  
        series: [{
            argumentField: "region"
        }]
    };
    
    $scope.selectBoxOptions = {
        width: 250,
        dataSource: dataSource,
        displayExpr: "region",
        valueExpr: "region",
        placeholder: "Choose region",
        onValueChanged: function(data) {
            $("#chart").dxPieChart("instance").getAllSeries()[0].getPointsByArg(data.value)[0].showTooltip();
        },
        bindingOptions: {
            value: "selectedRegion"
        }
    };
});