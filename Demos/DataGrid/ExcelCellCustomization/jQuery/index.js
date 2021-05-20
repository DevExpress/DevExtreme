$(function(){
    $("#gridContainer").dxDataGrid({
        dataSource: orders,
        keyExpr: "ID",
        showBorders: true,
        groupPanel: {
            visible: true
        },
        grouping: {
            autoExpandAll: true,
        },
        sortByGroupSummaryInfo: [{
            summaryItem: "count"
        }],
        columns: [
            {
                dataField: "Employee",
                groupIndex: 0,
            },
            {
                dataField: "OrderNumber",
                caption: "Invoice Number",
                width: 130,
            },
            {
                dataField: "OrderDate",
                dataType: "date",
                width: 160
            },
            {
                caption: "City",
                dataField: "CustomerStoreCity",
                groupIndex: 1
            },
            {
                caption: "State",
                dataField: "CustomerStoreState"  
            },
            {
                dataField: "SaleAmount",
                alignment: "right",
                format: "currency",
                sortOrder: "desc"
            }
        ],
        summary: {
            groupItems: [{
                column: "OrderNumber",
                summaryType: "count",
                displayFormat: "{0} orders",
            }, {
                column: "SaleAmount",
                summaryType: "max",
                displayFormat: "Max: {0}",
                valueFormat: "currency",
                alignByColumn: true,
                showInGroupFooter: false
            }, {
                column: "SaleAmount",
                summaryType: "sum",
                displayFormat: "Sum: {0}",
                valueFormat: "currency",
                alignByColumn: true,
                showInGroupFooter: true
            }],

            totalItems: [{
                column: "SaleAmount",
                summaryType: "sum",
                displayFormat: "Total Sum: {0}",
                valueFormat: "currency"
            }]
        },

        onCellPrepared: function(e) {
            if(e.rowType === "data") {
                if(e.data.OrderDate < new Date(2014, 2, 3)) {
                    e.cellElement.css({ color: "#AAAAAA" });
                }
                if(e.data.SaleAmount > 15000) {
                    if(e.column.dataField === "OrderNumber") {
                        e.cellElement.css({ "font-weight": "bold" });
                    }
                    if(e.column.dataField === "SaleAmount") {
                        e.cellElement.css({ "background-color": "#FFBB00", "color": "#000" });
                    }
                }
            }

            if(e.rowType === "group") {
                if(e.row.groupIndex === 0) {
                    e.cellElement.css({ "background-color": "#BEDFE6", "color": "#000" });
                }
                if(e.row.groupIndex === 1) {
                    e.cellElement.css({ "background-color": "#C9ECD7", "color": "#000" });
                }
                e.cellElement.children().css({ "color": "#000" });
            }

            if(e.rowType === "groupFooter" && e.column.dataField === "SaleAmount") {
                e.cellElement.css({ "font-style": "italic" });
            }         
        },
        export: {
            enabled: true,
            customizeExcelCell: function(options) {
                var gridCell = options.gridCell;
                if(!gridCell) {
                    return;
                }

                if(gridCell.rowType === "data") {
                    if(gridCell.data.OrderDate < new Date(2014, 2, 3)) {
                        options.font.color = "#AAAAAA";
                    }
                    if(gridCell.data.SaleAmount > 15000) {
                        if(gridCell.column.dataField === "OrderNumber") {
                            options.font.bold = true;
                        }
                        if(gridCell.column.dataField === "SaleAmount") {
                            options.backgroundColor = "#FFBB00";
                            options.font.color = "#000";
                        }
                    }
                }

                if(gridCell.rowType === "group") {
                    if(gridCell.groupIndex === 0) {
                        options.backgroundColor = "#BEDFE6";
                    }
                    if(gridCell.groupIndex === 1) {
                        options.backgroundColor = "#C9ECD7";
                    }
                    if(gridCell.column.dataField === "Employee") {
                        options.value = gridCell.value + " (" + gridCell.groupSummaryItems[0].value + " items)";
                        options.font.bold = false;
                    }
                    if(gridCell.column.dataField === "SaleAmount") {
                        options.value = gridCell.groupSummaryItems[0].value;
                        options.numberFormat = "&quot;Max: &quot;$0.00";
                    }
                }

                if(gridCell.rowType === "groupFooter" && gridCell.column.dataField === "SaleAmount") {
                    options.value = options.gridCell.value;
                    options.numberFormat = "&quot;Sum: &quot;$0.00";
                    options.font.italic = true;
                }

                if(gridCell.rowType === "totalFooter" && gridCell.column.dataField === "SaleAmount") {
                    options.value = options.gridCell.value;
                    options.numberFormat = "&quot;Total Sum: &quot;$0.00";
                }                    
            }
        } 
    });
});
