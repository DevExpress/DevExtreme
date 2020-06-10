var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    var filterBuilderInstance;

    $scope.listFilter = null;

    $scope.filterBuilderOptions = {
        fields: fields,
        value: filter,
        onInitialized: function(e) {
            filterBuilderInstance = e.component;
            $scope.listFilter = filterBuilderInstance.getFilterExpression();
        }
    };

    $scope.buttonOptions = {
        text: "Apply Filter",
        type: "default",
        onClick: function() {
            $scope.listFilter = filterBuilderInstance.getFilterExpression();
        },
    };

    $scope.listOptions = {
        dataSource: {
            store: products
        },
        height: "100%",
        bindingOptions: {
            "dataSource.filter": "listFilter"
        }
    };

});