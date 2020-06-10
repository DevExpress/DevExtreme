$(function(){
    var salesPivotGrid = $("#sales").dxPivotGrid({
        dataFieldArea: "column",
        rowHeaderLayout: "tree",
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
    }).dxPivotGrid("instance");
    
    
    $("#show-totals-prior").dxCheckBox({
        text: "Show Totals Prior",
        value: false,
        onValueChanged: function(data) {
            salesPivotGrid.option("showTotalsPrior", data.value ? "both" : "none");
        }
    });
    
    $("#data-field-area").dxCheckBox({
        text: "Data Field Headers in Rows",
        value: false,
        onValueChanged: function(data) {
            salesPivotGrid.option("dataFieldArea", data.value ? "row" : "column");
        }
    });
    
    $("#row-header-layout").dxCheckBox({
        text: "Tree Row Header Layout",
        value: true,
        onValueChanged: function(data) {
            salesPivotGrid.option("rowHeaderLayout", data.value ? "tree" : "standard");
        }
    });
});