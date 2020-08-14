$(function() {
    $("#sales").dxPivotGrid({
        allowSortingBySummary: true,
        allowSorting: true,
        allowFiltering: true,
        allowExpandAll: true,
        height: 440,
        showBorders: true,
        fieldChooser: {
            enabled: false
        },
        export: {
            enabled: true
        },
        dataSource: {
            fields: [{
                caption: "Region",
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
                caption: "Amount",
                dataField: "amount",
                dataType: "number",
                summaryType: "sum",
                format: "currency",
                area: "data"
            }, {
                caption: "Count",
                dataField: "amount",
                dataType: "number",
                summaryType: "count",
                area: "data"
            }],
            store: sales
        },
        onCellPrepared: function(e) {
            if(e.rowType === 'T' || e.type === 'T' || e.type === 'GT' || e.type === "GT" || e.rowType === "GT" || e.columnType === "GT") {
                e.cellElement.css({ backgroundColor: '#DDDDDD' });
            }
            if(e.area === 'data') {
                if(e.cell.dataIndex === 1) {
                    e.cellElement.css({ 'font-weight': 'bold' });
                } else {
                    console.log(e)
                    if(e.cell.value < 100000) {
                        e.cellElement.css({ color: '#DC3545' });
                    } else {
                        e.cellElement.css({ color: '#28A745' });
                    }
                }
            }

            if(e.area === 'row' || e.area === 'column') {
                e.cellElement.css({ 'font-weight': 'bold' });
            }
        },
        onExporting: function(e) {
            var workbook = new ExcelJS.Workbook();
            var worksheet = workbook.addWorksheet('Sales');

            DevExpress.excelExporter.exportPivotGrid({
                component: e.component,
                worksheet: worksheet,
                customizeCell: function(options) {
                    var excelCell = options.excelCell;
                    var pivotCell = options.pivotCell;

                    if(pivotCell.rowType === 'T' || pivotCell.type === 'T' || pivotCell.type === 'GT' || pivotCell.type === "GT" || pivotCell.rowType === "GT" || pivotCell.columnType === "GT") {
                        excelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DDDDDD' } };
                        if(pivotCell.dataIndex === 0) {
                            excelCell.numFmt = '$ #,##.#,"K"';
                        }
                    }

                    if(pivotCell.area === 'data') {
                        if(pivotCell.dataIndex === 1) {
                            excelCell.font = { bold: true };
                        } else {
                            var color = pivotCell.value < 100000 ? 'DC3545' : '28A745';
                            excelCell.font = { color: { argb: color } };
                        }
                    }

                    if(pivotCell.area === 'row' || pivotCell.area === 'column') {
                        excelCell.font = { bold: true };
                    }

                    var borderStyle = { style: 'thin', color: { argb: 'FF7E7E7E' } };
                    excelCell.border = {
                        bottom: borderStyle,
                        left: borderStyle,
                        right: borderStyle,
                        top: borderStyle
                    };
                }
            }).then(function() {
                workbook.xlsx.writeBuffer().then(function(buffer) {
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Sales.xlsx');
                });
            });
            e.cancel = true;
        }
    });
});
