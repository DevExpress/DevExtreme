$(function() {
    var pivotGridChart = $("#pivotgrid-chart").dxChart({
        commonSeriesSettings: {
            type: "bar"
        },
        tooltip: {
            enabled: true,
            format: "currency",
            customizeTooltip: function(args) {
                return {
                    html: args.seriesName + " | Total<div class='currency'>" + args.valueText + "</div>"
                };
            }
        },
        size: {
            height: 200
        },
        adaptiveLayout: {
            width: 450
        }
    }).dxChart("instance");

    var pivotGrid = $("#pivotgrid").dxPivotGrid({
        allowSortingBySummary: true,
        allowFiltering: true,
        showBorders: true,
        showColumnGrandTotals: false,
        showRowGrandTotals: false,
        showRowTotals: false,
        showColumnTotals: false,
        fieldChooser: {
            enabled: true,
            height: 400
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
            }],
            store: sales
        }
    }).dxPivotGrid("instance");

    pivotGrid.bindChart(pivotGridChart, {
        dataFieldsDisplayMode: "splitPanes",
        alternateDataFields: false
    });

    function expand() {
        var dataSource = pivotGrid.getDataSource();
        dataSource.expandHeaderItem("row", ["North America"]);
        dataSource.expandHeaderItem("column", [2013]);
    }

    setTimeout(expand, 0);
});
