var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope, $element) {
    $scope.dataSource = filterData("");
    $scope.isFirstLevel = true;

    $scope.chartOptions = {
        bindingOptions: {
            dataSource: "dataSource",
        },
        title: "The Most Populated Countries by Continents",
        series: {
            type: "bar"
        },
        legend: {
            visible: false
        },
        valueAxis: {
            showZero: false
        },
        onPointClick: function (e) {
            if ($scope.isFirstLevel) {
                $scope.isFirstLevel = false;
                removePointerCursor($element);
                $scope.dataSource = filterData(e.target.originalArgument);
            }
        },
        customizePoint: function () {
            var pointSettings = {
                color: colors[Number($scope.isFirstLevel)]
            };

            if (!$scope.isFirstLevel) {
                pointSettings.hoverStyle = {
                    hatching: "none"
                };
            }

            return pointSettings;
        }
    };
    $scope.buttonOptions = {
        text: "Back",
        icon: "chevronleft",
        bindingOptions: {
            visible: "!isFirstLevel"
        },
        onClick: function () {
            if (!$scope.isFirstLevel) {
                $scope.isFirstLevel = true;
                addPointerCursor($element);
                $scope.dataSource = filterData("");
            }
        }
    };

    addPointerCursor($element);
});

function filterData(name) {
    return data.filter(function (item) {
        return item.parentID === name;
    });
}

function addPointerCursor(element) {
    element.find("#chart").addClass("pointer-on-bars");
}

function removePointerCursor(element) {
    element.find("#chart").removeClass("pointer-on-bars");
}