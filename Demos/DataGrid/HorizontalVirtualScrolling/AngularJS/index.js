var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {    
	var columnCount = 500,
        rowCount = 50;  

    $scope.gridOptions = {
        dataSource: generateData(rowCount, columnCount),
        keyExpr: "field1",
        columnWidth: 100,
        showBorders: true,
        scrolling: {
            columnRenderingMode: "virtual"
        },
        paging: {
            enabled: false
        }
    };
});