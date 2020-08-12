window.onload = function() {
    var viewModel = {
        pivotGridOptions: {
            allowSortingBySummary: true,
            allowSorting: true,
            allowFiltering: true,
            allowExpandAll: true,
            height: 440,
            showBorders: true,
            fieldChooser: {
                enabled: false
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
                    caption: "Sales",
                    dataField: "amount",
                    dataType: "number",
                    summaryType: "sum",
                    format: "currency",
                    area: "data"
                }],
                store: sales
            }
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("pivotgrid"));
};