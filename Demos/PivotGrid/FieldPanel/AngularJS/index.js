var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.fieldPanel = { 
        showDataFields: true,
        showRowFields: true,
        showColumnFields: true,
        showFilterFields: true,
        allowFieldDragging: true,
        visible: true
    };
    
    $scope.pivotGridOptions = {
        allowSortingBySummary: true,
        allowSorting: true,
        allowFiltering: true,
        showBorders: true,
        height: 490,
        bindingOptions: {
            fieldPanel: "fieldPanel"
        },
        fieldChooser: {
            height: 500
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
                area: "row",
                selector: function(data) {
                    return  data.city + " (" + data.country + ")";
                }
            }, {
                dataField: "date",
                dataType: "date",
                area: "column"
            }, {
                dataField: "sales",
                dataType: "number",
                summaryType: "sum",
                format: "currency",
                area: "data"
            }],
            store: sales
        },
        onContextMenuPreparing: contextMenuPreparing
    };
    
    $scope.showDataFieldsOptions = {
        text: "Show Data Fields",
        bindingOptions: {
            value: "fieldPanel.showDataFields"
        }
    };
    
    $scope.showRowFieldsOptions = {
        text: "Show Row Fields",
        bindingOptions: {
            value: "fieldPanel.showRowFields"
        }
    };
    
    $scope.showColumnFieldsOptions = {
        text: "Show Column Fields",
        bindingOptions: {
            value: "fieldPanel.showColumnFields"
        }
    };
    
    $scope.showFilterFieldsOptions = {
        text: "Show Filter Fields",
        bindingOptions: {
            value: "fieldPanel.showFilterFields"
        }
    };
    
    function contextMenuPreparing(e) {
        var dataSource = e.component.getDataSource(),
            sourceField = e.field;
    
        if (sourceField) {
            if(!sourceField.groupName || sourceField.groupIndex === 0) {
                e.items.push({
                    text: "Hide field",
                    onItemClick: function () {
                        var fieldIndex;
                        if(sourceField.groupName) {
                            fieldIndex = dataSource.getAreaFields(sourceField.area, true)[sourceField.areaIndex].index;
                        } else {
                            fieldIndex = sourceField.index;
                        }
    
                        dataSource.field(fieldIndex, {
                            area: null
                        });
                        dataSource.load();
                    }
                });
            }
    
            if (sourceField.dataType === "number") {
                var setSummaryType = function (args) {
                    dataSource.field(sourceField.index, {
                        summaryType: args.itemData.value
                    });
    
                    dataSource.load();
                },
                menuItems = [];
    
                e.items.push({ text: "Summary Type", items: menuItems });
    
                $.each(["Sum", "Avg", "Min", "Max"], function(_, summaryType) {
                    var summaryTypeValue = summaryType.toLowerCase();
    
                    menuItems.push({
                        text: summaryType,
                        value: summaryType.toLowerCase(),
                        onItemClick: setSummaryType,
                        selected: e.field.summaryType === summaryTypeValue
                    });
                });
            }
        }
    }
});
