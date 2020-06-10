window.onload = function() {
    var drillDownDataSource = ko.observable({}),
        salesPopupVisible = ko.observable(false),
        salesPopupTitle = ko.observable("");
    
    var viewModel = {
        drillDownDataSource: drillDownDataSource,
        pivotGridOptions: {
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
    
                    drillDownDataSource(pivotGridDataSource.createDrillDownDataSource(e.cell));
                    salesPopupTitle(popupTitle);
                    salesPopupVisible(true); 
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
        },
        dataGridOptions: {
            dataSource: drillDownDataSource,
            width: 560,
            height: 300,
            columns: ['region', 'city', 'amount', 'date']
        },
        popupOptions: {
            title: salesPopupTitle,
            width: 600,
            height: 400,
            visible: salesPopupVisible
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("pivotgrid"));
};