var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.chartOptions = {
        palette: "ocean",
        dataSource: dataSource,
        type: "doughnut",
        title: { 
            text: "Imports/Exports of Goods and Services",
            subtitle: {
                text: "(billion US$, 2012)"
            }
        },
        legend: {
            visible: true
        },
        innerRadius: 0.2,
        commonSeriesSettings: {
            label: {
                visible: false
            }
        },
        tooltip: {
            enabled: true,
            format: "currency",
            customizeTooltip: function() {
                return { text: this.argumentText + "<br>" + this.seriesName + ": " + this.valueText + "B" };
            }
        },
        "export": {
            enabled: true
        },
        series: [{
            name: "Export",
            argumentField: "Country",
            valueField: "Export",
        }, {
            name: "Import",
            argumentField: "Country",
            valueField: "Import"
        }]
    };
});