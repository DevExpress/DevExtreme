var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    var pivotGridDataSource = new DevExpress.data.PivotGridDataSource({
        fields: [
            { dataField: "[Product].[Category]", area: "row" },
            { 
                dataField: "[Product].[Subcategory]", 
                area: "row",
                headerFilter: {
                    allowSearch: true
                } 
            },
            { dataField: "[Ship Date].[Calendar Year]", area: "column" },
            { dataField: "[Ship Date].[Month of Year]", area: "column" },
            { dataField: "[Measures].[Customer Count]", area: "data" }
        ],
        store: {
            type: "xmla",
            url: "https://demos.devexpress.com/Services/OLAP/msmdpump.dll",
            catalog: "Adventure Works DW Standard Edition",
            cube: "Adventure Works"
        }
    });
    
    $scope.applyChangesMode = "instantly";
    
    $scope.pivotGridOptions = {
        allowSortingBySummary: true,
        allowSorting: true,
        allowFiltering: true,
        showBorders: true,
        dataSource: pivotGridDataSource,
        height: 470,
        fieldChooser: {
            enabled: true,
            allowSearch: true
        },
        bindingOptions: {
            "fieldChooser.applyChangesMode": "applyChangesMode"
        }
    };
    
    $scope.applyChangesModeOptions = {
        items: ["instantly", "onDemand"],
        width: 180,
        value: "instantly",
        onValueChanged: function(data) {
            $scope.applyChangesMode = data.value;
        }
    };
});