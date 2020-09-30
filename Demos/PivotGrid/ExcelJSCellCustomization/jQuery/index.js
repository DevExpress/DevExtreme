$(function() {
    $("#sales").dxPivotGrid({
        allowSortingBySummary: true,
        allowSorting: true,
        allowFiltering: true,
        allowExpandAll: true,
        height: 490,
        showBorders: true,
        fieldChooser: {
            enabled: false
        },
        export: {
            enabled: true
        },
        dataSource: {
            fields: [{
                caption: 'Region',
                dataField: 'region',
                area: 'row',
                expanded: true
            }, {
                caption: 'City',
                dataField: 'city',
                width: 150,
                area: 'row'
            }, {
                dataField: 'date',
                dataType: 'date',
                area: 'column'
            }, {
                caption: "Sales",
                dataField: "amount",
                dataType: "number",
                summaryType: "sum",
                format: "currency",
                area: "data"
            }],
            store: sales
        },
        onCellPrepared: function(e) {
            var cell = e.cell;
            cell.area =  e.area;
            
            if (isDataCell(cell) || isTotalCell(cell)) {
                var appearance = getConditionalAppearance(cell);
                Object.assign(e.cellElement.get(0).style, getCssStyles(appearance));
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
                    
                    if (isDataCell(pivotCell) || isTotalCell(pivotCell)) {
                        var appearance = getConditionalAppearance(pivotCell);
                        Object.assign(excelCell, getExcelCellFormat(appearance));
                    }
                    
                    var borderStyle = { style: "thin", color: { argb: "FF7E7E7E" } };
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

    function isDataCell(cell) {
        return (cell.area === "data" && cell.rowType === "D" && cell.columnType === "D");
    }

    function isTotalCell(cell) {
        return (cell.type === "T" || cell.type === "GT" || cell.rowType === "T" || cell.rowType === "GT" || cell.columnType === "T" || cell.columnType === "GT");
    }

    function getExcelCellFormat(appearance) {
        return {
            fill: { type: "pattern", pattern: "solid", fgColor: { argb: appearance.fill }},
            font: { color: { argb: appearance.font }, bold: appearance.bold }
        };
    }

    function getCssStyles(appearance) {
        return {
            "background-color": "#" + appearance.fill,
            color: "#" + appearance.font,
            "font-weight": appearance.bold ? "bold" : undefined
        };
    }

    function getConditionalAppearance(cell) {
        if (isTotalCell(cell)) {
            return { fill: "F2F2F2", font: "3F3F3F", bold: true };
        } else {
            if (cell.value < 20000) {
                return { font: "9C0006", fill: "FFC7CE" };
            }
            if (cell.value > 50000) {
                return { font: "006100", fill: "C6EFCE" };
            }
            return { font: "9C6500", fill: "FFEB9C" };
        }
    }
});
