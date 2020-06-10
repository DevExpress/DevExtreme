window.onload = function() {
    var viewModel = {
        chart: null,
        chartOptions: {
            commonSeriesSettings: {
                type: "bar"
            },
            tooltip: {
                enabled: true,
                customizeTooltip: function (args) {
                    var valueText = (args.seriesName.indexOf("Total") != -1) ? 
                            Globalize.formatCurrency(args.originalValue,
                                "USD", { maximumFractionDigits: 0 }) :
                            args.originalValue;
    
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
                viewModel.chart = e.component;
            }
        },
        pivotGridOptions: {
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
                e.component.bindChart(viewModel.chart, {
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
        },
    };
    
    ko.applyBindings(viewModel, document.getElementById("pivotgrid-demo"));
};