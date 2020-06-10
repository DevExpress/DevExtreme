var DemoApp = angular.module("DemoApp", ["dx"]);

DemoApp.controller("DemoController", function DemoController($scope) {
    $scope.sankeyOptions = {
        dataSource: data,
        sourceField: "source",
        targetField: "target",
        weightField: "weight",
        title: "Commodity Turnover in 2017",
        node: {
            width: 8,
            padding: 30
        },
        link: {
            colorMode: "gradient"
        },
        tooltip: {
            enabled: true,
            customizeLinkTooltip: function(info) {
                return {
                    html:
                        "<b>From:</b> " +
                        info.source +
                        "<br/><b>To:</b> " +
                        info.target +
                        "<br/>" +
                        "<b>Weight:</b> " +
                        info.weight
                };
            }
        }
    };
});