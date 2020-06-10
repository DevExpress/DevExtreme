var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.customIconOptions = {
        items: simpleProducts
    };
    
    $scope.isLoaded = true;
    
    $scope.loadIndicatorOptions = {
        items: simpleProducts,
        dataSource: {
            loadMode: 'raw',
            load: function() {
                var d = $.Deferred();
                $scope.isLoaded = false;
                
                setTimeout(function() {
                    d.resolve(simpleProducts);
                    $scope.isLoaded = true;
                }, 3000);
                return d.promise();
            }
        }
    };
    
    $scope.selectedItem = null;
    
    $scope.dynamicDropDownButtonOptions = {
        items: products,
        value: 1,
        showClearButton: true,
        displayExpr: "Name",
        valueExpr: "ID",
        bindingOptions: {
            selectedItem: 'selectedItem'
        }
    };
});