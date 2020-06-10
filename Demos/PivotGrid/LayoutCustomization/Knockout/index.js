window.onload = function() {
    var showTotalsPrior = ko.observable(false),
        dataFieldInRows = ko.observable(false),
        treeRowHeaderLayout = ko.observable(true);
    
    var viewModel = {
        pivotGridOptions: {
            showTotalsPrior: ko.computed(function() {
                return showTotalsPrior() ? "both" : "none";
            }),
            dataFieldArea: ko.computed(function() {
                return dataFieldInRows() ? "row" : "column";
            }),
            rowHeaderLayout: ko.computed(function() {
                return treeRowHeaderLayout() ? "tree" : "standard";
            }),
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
        },
        showTotalsPriorOptions: {
            text: "Show Totals Prior",
            value: showTotalsPrior,
        },
        dataFieldInRowsOptions: {
            text: "Data Field Headers in Rows",
            value: dataFieldInRows,
        },
        treeRowHeaderLayoutOptions: {
            text: "Tree Row Header Layout",
            value: treeRowHeaderLayout,
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("pivotgrid"));
};