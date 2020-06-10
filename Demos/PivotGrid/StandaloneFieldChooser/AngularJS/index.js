var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    var pivotGridDataSource = new DevExpress.data.PivotGridDataSource({
        fields: [{
            caption: "Region",
            width: 120,
            dataField: "region",
            area: "row",
            headerFilter: {
                allowSearch: true
            }
        }, {
            caption: "City",
            dataField: "city",
            width: 150,
            area: "row",
            headerFilter: {
                allowSearch: true
            },
            selector: function(data) {
                return  data.city + " (" + data.country + ")";
            }
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
        }],
        store: sales
    });
    
    $scope.layout = 0;
    $scope.buttonsVisibility = false;
    $scope.applyChangesMode = "instantly";
    $scope.state = {};
    
    $scope.pivotGridOptions = {
        allowSortingBySummary: true,
        allowSorting: true,
        allowFiltering: true,
        showBorders: true,
        dataSource: pivotGridDataSource,
        fieldChooser: {
            enabled: false
        }
    };
    
    $scope.fieldChooserOptions = {
        dataSource: pivotGridDataSource,
        texts: {
            allFields: "All",
            columnFields: "Columns",
            dataFields: "Data",
            rowFields: "Rows",
            filterFields: "Filter"
        },
        width: 400,
        height: 400,
        bindingOptions: {
            layout: "layout",
            applyChangesMode: "applyChangesMode", 
            state: "state"
        } 
    };

    $scope.applyButtonOptions = {
        text: "Apply",
        type: "default",
        onClick: function(data) {
            pivotGridDataSource.state($scope.state);
        },
        bindingOptions: {
            visible: "buttonsVisibility"
        }
    };

    $scope.cancelButtonOptions = {
        text: "Cancel",
        onClick: function(data) {
            $scope.state = pivotGridDataSource.state();
        },
        bindingOptions: {
            visible: "buttonsVisibility"
        }
    };
    
    $scope.layoutsOptions = {
        items: layouts,
        layout: "vertical",
        valueExpr: "key",
        displayExpr: "name",
        bindingOptions: {
            value: "layout"
        }
    };

    $scope.applyChangesModeOptions = {
        items: ["instantly", "onDemand"],
        width: 180,
        bindingOptions: {
            value: "applyChangesMode",
        },
        onValueChanged: function(data) {
            $scope.applyChangesMode = data.value;
            $scope.buttonsVisibility = (data.value === "onDemand");
        }
    };
    
});