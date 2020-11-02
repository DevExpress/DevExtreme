var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.chartOptions = {
        commonSeriesSettings: {
            type: "bar"
        },
        tooltip: {
            enabled: true,
            customizeTooltip: function (args) {
                var valueText = (args.seriesName.indexOf("Total") != -1)
                    ? new Intl.NumberFormat('en-EN', { style: 'currency', currency: 'USD' }).format(args.originalValue)
                    : args.originalValue;
    
                return {
                    html: args.seriesName + "<div class='currency'>"
                        + valueText + "</div>"
                };
            }
        },
        size: {
            height: 320
        },
        adaptiveLayout: {
            width: 450
        },
        onInitialized: function(e) {
            $scope.chart = e.component;
        }
    };
    
    $scope.pivotGridOptions = {
        allowSortingBySummary: true,
        allowFiltering: true,
        showBorders: true,
        showColumnGrandTotals: false,
        showRowGrandTotals: false,
        showRowTotals: false,
        showColumnTotals: false,
        fieldChooser: {
            enabled: true
        },
        onInitialized: function(e) {
            e.component.bindChart($scope.chart, {
                dataFieldsDisplayMode: "splitPanes",
                alternateDataFields: false
            });
        },
        dataSource: {
            fields: [{
                caption: "Region",
                width: 120,
                dataField: "region",
                area: "row",
                sortBySummaryField: "Total"
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
                groupInterval: "month",
                visible: false
            }, {
                caption: "Total",
                dataField: "amount",
                dataType: "number",
                summaryType: "sum",
                format: "currency",
                area: "data"
            }, {
                summaryType: "count",
                area: "data"
            }],
            store: sales
        }
    };
});