var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.showTotalsPrior = "none";
    $scope.dataFieldArea = "column";
    $scope.rowHeaderLayout = "tree";
    
    $scope.pivotGridOptions = {
        bindingOptions: {
            showTotalsPrior: "showTotalsPrior",
            dataFieldArea: "dataFieldArea",
            rowHeaderLayout: "rowHeaderLayout",
        },
        wordWrapEnabled: false,
        dataSource: {
            fields: [{
                caption: "Region",
                dataField: "region",
                expanded: true,
                area: "row" 
            }, {
                caption: "Country",
                dataField: "country",
                expanded: true,
                area: "row"
            }, {
                caption: "City",
                dataField: "city",
                area: "row"
            }, {
                dataField: "date",
                dataType: "date",
                area: "column"
            }, {
                caption: "Sales",
                dataField: "amount",
                dataType: "number",
                summaryType: "sum",
                format: "currency",
                area: "data"
            }, {
                caption: "Percent",
                dataField: "amount",
                dataType: "number",
                summaryType: "sum",
                summaryDisplayMode: "percentOfRowGrandTotal",
                area: "data"
            }],
            store: sales
        },
        fieldChooser: {
            height: 500
        },
        showBorders: true,
        height: 440
    };
    
    $scope.showTotalsPriorOptions = {
        text: "Show Totals Prior",
        value: false,
        onValueChanged: function(e) {
            $scope.showTotalsPrior = e.value ? "both" : "none";
        }
    };
    
    $scope.dataFieldInRowsOptions = {
        text: "Data Field Headers in Rows",
        value: false,
        onValueChanged: function(e) {
            $scope.dataFieldArea = e.value ? "row" : "column";
        }
    };
    
    $scope.treeRowHeaderLayoutOptions = {
        text: "Tree Row Header Layout",
        value: true,
        onValueChanged: function(e) {
            $scope.rowHeaderLayout = e.value ? "tree" : "standard";
        }
    };
});