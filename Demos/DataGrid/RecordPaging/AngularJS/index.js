var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.dataGridOptions = {
        dataSource: generateData(100000),
        showBorders: true,
        scrolling: { 
            rowRenderingMode: 'virtual'
        },
        paging: {
            pageSize: 10
        },
        pager: {
            visible: true,
            allowedPageSizes: [5, 10, 'all'],
            showPageSizeSelector: true,
            showInfo: true,
            showNavigationButtons: true
        },
        onInitialized: function(e) {
            $scope.dataGrid = e.component;
        }
    };
    $scope.displayModeOptions = {
        items: ["full", "compact"],
        value: "full",
        onValueChanged: function(data) {
            $scope.dataGrid.option("pager.displayMode", data.value);
            $scope.pageInfo.option("disabled", data.value === "compact");
            $scope.navButtons.option("disabled", data.value === "compact");
        }
    };
    $scope.showPageSizesOptions = {
        text: "Show Page Size Selector",
        value: true,
        onValueChanged: function(data) {
            $scope.dataGrid.option("pager.showPageSizeSelector", data.value);
        }
    };
    $scope.showInfoOptions = {
        text: "Show Info Text",
        value: true,
        onValueChanged: function(data) {
            $scope.dataGrid.option("pager.showInfo", data.value);
        },
        onInitialized: function(e) {
            $scope.pageInfo = e.component;
        }
    };
    $scope.showNavButtonsOptions =  {
        text: "Show Navigation Buttons",
        value: true,
        onValueChanged: function(data) {
            $scope.dataGrid.option("pager.showNavigationButtons", data.value);
        },
        onInitialized: function(e) {
            $scope.navButtons = e.component;
        }
    };
});