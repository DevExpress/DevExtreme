var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.drillDownDataSource = {};
    $scope.salesPopupVisible = false;
    $scope.salesPopupTitle = "";
    $scope.drillDownDataGrid = {};
    
    $scope.pivotGridOptions = {
        allowSortingBySummary: true,
        allowSorting: true,
        allowFiltering: true,
        allowExpandAll: true,
        showBorders: true,
        fieldChooser: {
            enabled: false
        },
        onCellClick: function(e) {
            if(e.area == "data") {
                var pivotGridDataSource = e.component.getDataSource(),
                    rowPathLength = e.cell.rowPath.length,
                    rowPathName = e.cell.rowPath[rowPathLength - 1],
                    popupTitle = (rowPathName ? rowPathName : "Total") + " Drill Down Data";
    
                $scope.drillDownDataSource = pivotGridDataSource.createDrillDownDataSource(e.cell);
                $scope.salesPopupTitle = popupTitle;
                $scope.salesPopupVisible = true;
            }
        },
        dataSource: {
            fields: [{
                caption: "Region",
                width: 120,
                dataField: "region",
                area: "row" 
            }, {
                caption: "City",
                dataField: "city",
                width: 150,
                area: "row"
            }, {
                dataField: "date",
                dataType: "date",
                area: "column"
            }, {
                caption: "Total",
                dataField: "amount",
                dataType: "number",
                summaryType: "sum",
                format: "currency",
                area: "data"
            }],
            store: sales
        }
    };
    
    $scope.dataGridOptions = {
        bindingOptions: {
            dataSource: {
                dataPath: 'drillDownDataSource',
                deep: false 
            }
        },
        onInitialized: function(e) {
            $scope.drillDownDataGrid = e.component;
        },
        width: 560,
        height: 300,
        columns: ['region', 'city', 'amount', 'date']
    };
    
    $scope.popupOptions = {
        width: 600,
        height: 400,
        onShown: function() {
            $scope.drillDownDataGrid.updateDimensions();
        },
        bindingOptions: {
            title: "salesPopupTitle",
            visible: "salesPopupVisible"
        }
    };
});