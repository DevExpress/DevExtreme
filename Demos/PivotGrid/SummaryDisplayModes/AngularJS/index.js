var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.pivotGridOptions = {
        allowSortingBySummary: true,
        allowSorting: true,
        allowExpandAll: true,
        showBorders: true,
        fieldChooser: {
            enabled: false
        },
        fieldPanel: {
            showFilterFields: false,
            allowFieldDragging: false,
            visible: true
        },
        onContextMenuPreparing: function (e) {
            var dataSource = e.component.getDataSource();
            if (e.field && e.field.dataField === "amount") {
                $.each(summaryDisplayModes, function (_, summaryDisplayMode) {
                    var summaryDisplayModeValue = summaryDisplayMode.value;
    
                    e.items.push({
                        text: summaryDisplayMode.text,
                        selected: e.field.summaryDisplayMode === summaryDisplayModeValue,
                        onItemClick: function () {
                            var format,
                                caption = summaryDisplayModeValue === "none" ? "Total Sales" : "Relative Sales";
                            if (summaryDisplayModeValue === "none"
                                || summaryDisplayModeValue === "absoluteVariation") {
                                format = "currency";
                            }
                            dataSource.field(e.field.index, {
                                summaryDisplayMode: summaryDisplayModeValue,
                                format: format,
                                caption: caption
                            });
    
                            dataSource.load();
                        }
                    });
                });
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
                groupName: "date",
                groupInterval: "year",
                expanded: true
            }, {
                caption: "Relative Sales",
                dataField: "amount",
                dataType: "number",
                summaryType: "sum",
                area: "data",
                summaryDisplayMode: "percentOfColumnGrandTotal"
            }],
            store: sales
        }
    };
    
    var summaryDisplayModes = [
        { text: "None", value: "none" },
        { text: "Absolute Variation", value: "absoluteVariation" },
        { text: "Percent Variation", value: "percentVariation" },
        { text: "Percent of Column Total", value: "percentOfColumnTotal" },
        { text: "Percent of Row Total", value: "percentOfRowTotal" },
        { text: "Percent of Column Grand Total", value: "percentOfColumnGrandTotal" },
        { text: "Percent of Row Grand Total", value: "percentOfRowGrandTotal" },
        { text: "Percent of Grand Total", value: "percentOfGrandTotal" }
    ];
});