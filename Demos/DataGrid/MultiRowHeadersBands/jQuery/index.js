$(function(){
    $("#gridContainer").dxDataGrid({
        dataSource: countries,
        keyExpr: "ID",
        columnAutoWidth: true,
        allowColumnReordering: true,
        showBorders: true,
        columnChooser: {
            enabled: true
        },
        columns: ["Country", {
            headerCellTemplate: function(container) {
                container.append($("<div>Area, km<sup>2</sup></div>"));
            },
            dataField: "Area"
        }, {
            caption: "Population",
            columns: [{
                caption: "Total",
                dataField: "Population_Total",
                format: "fixedPoint"
            }, {
                caption: "Urban",
                dataField: "Population_Urban",
                format: "percent"
            }]
        }, {
            caption: "Nominal GDP",
            columns: [{
                caption: "Total, mln $",
                dataField: "GDP_Total",
                format: "fixedPoint",
                sortOrder: "desc"
            }, {
                caption: "By Sector",
                columns: [{
                    caption: "Agriculture",
                    dataField: "GDP_Agriculture",
                    width: 95,
                    format: {
    					type: "percent",
    					precision: 1
    				}
                }, {
                    caption: "Industry",
                    dataField: "GDP_Industry",
                    width: 80,
                    format: {
    					type: "percent",
    					precision: 1
    				}
                }, {
                    caption: "Services",
                    dataField: "GDP_Services",
                    width: 85,
                    format: {
    					type: "percent",
    					precision: 1
    				}
                }]
            }]
        }]
    });
});