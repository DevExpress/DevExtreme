var DemoApp = angular.module('DemoApp', ['dx']);

var products = new DevExpress.data.DataSource({
    store: productsData,
    key: "id",
    group: "Category"
});

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.TagBoxOptions = {
        dataSource: products,
        valueExpr: "ID",
        value: [productsData[16].ID, productsData[18].ID],
        grouped: true,
        displayExpr: "Name"
    };
        
    $scope.searchTagBoxOptions = {
        dataSource: products,
        valueExpr: "ID",
        value: [productsData[16].ID, productsData[18].ID],
        searchEnabled: true,
        grouped: true,
        displayExpr: "Name"
    };
    
    $scope.templateTagBoxOptions = {
        dataSource: products,
        valueExpr: "ID",
        value: [productsData[17].ID],
        grouped: true,
        groupTemplate: "group",
        displayExpr: "Name"
    };
});