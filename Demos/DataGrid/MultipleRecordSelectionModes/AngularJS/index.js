var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    
    $scope.selectAllMode = "allPages";
    $scope.showCheckBoxesMode = "onClick";
    
    $scope.gridOptions = {
        dataSource: sales,
        keyExpr: "orderId",
        showBorders: true,
        bindingOptions: {
            "selection.selectAllMode": "selectAllMode",
            "selection.showCheckBoxesMode": "showCheckBoxesMode",
        },
        selection: {
            mode: "multiple"
        },
        paging: {
            pageSize: 10
        },
        filterRow: { 
            visible: true
        },
        columns: [{ 
            dataField: "orderId", 
            caption: "Order ID",
            width: 90
        },
        "city", { 
            dataField: "country", 
            width: 180
        },
        "region", {
            dataField: "date",
            dataType: "date"
        }, {
            dataField: "amount",
            format: "currency",
            width: 90
        }]
    };

    $scope.selectAllModeOptions = {
        dataSource: ["allPages", "page"],
        bindingOptions: {
            value: "selectAllMode",
            disabled: "showCheckBoxesMode === 'none'"
        }
    };
    
    $scope.checkBoxesModeOptions = {
        dataSource: ["none", "onClick", "onLongTap", "always"],
        bindingOptions: {
            value: "showCheckBoxesMode"
        }
    };
    
});