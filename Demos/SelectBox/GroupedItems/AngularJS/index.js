var DemoApp = angular.module('DemoApp', ['dx']);

var fromUngroupedData = new DevExpress.data.DataSource({
    store: ungroupedData,
    key: "id",
    group: "Category"
});

var fromPregroupedData = new DevExpress.data.DataSource({
    store: pregroupedData,
    key: "id",
    map: function(item) {
        item.key = item.Category;
        item.items = item.Products;
        return item;
    }
});

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.fromUngroupedDataOptions = {
        dataSource: fromUngroupedData,
        valueExpr: "ID",
        grouped: true,
        displayExpr: "Name"
    };
        
    $scope.fromPregroupedDataOptions = {
        dataSource: fromPregroupedData,
        valueExpr: "ID",
        grouped: true,
        displayExpr: "Name"
    };
    
    $scope.customGroupTemplateOptions = {
        dataSource: fromUngroupedData,
        valueExpr: "ID",
        grouped: true,
        groupTemplate: "group",
        displayExpr: "Name"
    };
});