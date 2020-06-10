var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.headerFilter = {
        allowSearch: true,
        showRelevantValues: true,
        width: 300,
        height: 400
    };
    
    $scope.pivotGridOptions = {
        allowFiltering: true,
        allowSorting: true,
        allowSortingBySummary: true,
        height: 570,
        showBorders: true,
        bindingOptions: {
            headerFilter: "headerFilter"
        },        
        fieldChooser: {
            allowSearch: true
        },
        fieldPanel: {
          	visible: true  
        },
        dataSource: {
            fields: [
                { dataField: "[Product].[Category]", area: "column" },
                { dataField: "[Product].[Subcategory]", area: "column" },
                { dataField: "[Customer].[City]", area: "row" },
                { dataField: "[Measures].[Internet Total Product Cost]", area: "data", format: "currency" },
                { 
                    dataField: "[Customer].[Country]",
                    area: "filter",
                    filterValues: ["[Customer].[Country].&[United Kingdom]"]
                },
                { 
                    dataField: "[Ship Date].[Calendar Year]",
                    area: "filter",
                    filterValues: ["[Ship Date].[Calendar Year].&[2004]"]
                }
            ],
            store: {
                type: "xmla",
                url: "https://demos.devexpress.com/Services/OLAP/msmdpump.dll",
                catalog: "Adventure Works DW Standard Edition",
                cube: "Adventure Works"
            }
        }
    };
    
    $scope.allowSearchOptions = {
        text: "Allow Search",
        bindingOptions: {
            value: "headerFilter.allowSearch"
        }
    };
    
    $scope.showRelevantValuesOptions = {
        text: "Show Relevant Values",
        bindingOptions: {
            value: "headerFilter.showRelevantValues"
        }
    };
});
