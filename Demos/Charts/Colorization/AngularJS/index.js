var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    var colorizationOptions = [{
        name: "Discrete",
        options: {
            type: "discrete",
            palette: "harmony light",
            colorizeGroups: false
        }
    }, {
        name: "Grouped",
        options: {
            type: "discrete",
            palette: "harmony light",
            colorizeGroups: true
        }
    }, {
        name: "Range",
        options: {
            type: "range",
            palette: ["#fbd600", "#78299a"],
            range: [0, 50000, 100000, 150000, 200000, 250000],
            colorCodeField: "salesAmount",
            colorizeGroups: false
        }
    }, {
        name: "Gradient",
        options: {
            type: "gradient",
            palette: ["#fbd600", "#78299a"],
            range: [10000, 250000],
            colorCodeField: "salesAmount",
            colorizeGroups: false
        }
    }];
    
    $scope.startColorization = colorizationOptions[2];
    
    $scope.treeMapOptions = {
        bindingOptions: {
            colorizer: "startColorization.options",
        },
        dataSource: salesAmount,
        title: "Sales Amount by Product",
        valueField: "salesAmount",
        tooltip: {
            enabled: true,
            format: "currency",
            customizeTooltip: function (arg) {
                var data = arg.node.data;
    
                return {
                    text: arg.node.isLeaf() ? ("<span class='product'>" + data.name +
                        "</span><br/>Sales Amount: " + arg.valueText) : null
                };
            }
        }
    };
    
    $scope.selectBoxOptions = {
        bindingOptions: {
            value: "startColorization"
        },
        items: colorizationOptions,
        width: 200,
        displayExpr: "name"
    };
});