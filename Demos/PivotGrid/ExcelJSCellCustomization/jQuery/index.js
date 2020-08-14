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
        onExporting: function(e) {
            var workbook = new ExcelJS.Workbook();
            var worksheet = workbook.addWorksheet('Sales');

            DevExpress.excelExporter.exportPivotGrid({
                component: e.component,
                worksheet: worksheet,
                customizeCell: function(options) {
                    var excelCell = options.excelCell;
                    var pivotCell = options.pivotCell;

                    if(pivotCell.type === 'GT' || pivotCell.type === "GT" || pivotCell.rowType === "GT" || pivotCell.columnType === "GT") {
                        excelCell.font = { bold: true };
                        excelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DDDDDD' } };
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
                // https://github.com/exceljs/exceljs#writing-xlsx
                workbook.xlsx.writeBuffer().then(function(buffer) {
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Sales.xlsx');
                });
            });
            e.cancel = true;
        }
    });
});
