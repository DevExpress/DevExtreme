$(function(){
    $("#sales").dxPivotGrid({
        allowSorting: true,
        allowFiltering: true,
        height: 440,
        showBorders: true,
        fieldPanel: {
            showColumnFields: true,
            showDataFields: true,
            showFilterFields: false,
            showRowFields: true,
            allowFieldDragging: false,
            visible: true
        },        
        fieldChooser: {
            enabled: false
        },
        export: {
            enabled: true
        },
        dataSource: {
            fields: [{
                caption: "Region",
                width: 120,
                dataField: "region",
                area: "row",
                expanded: true
            }, {
                caption: "City",
                dataField: "city",
                width: 150,
                area: "row"
            }, {
                dataField: "date",
                dataType: "date",
                area: "column",
                filterValues: [[2013], [2014], [2015]],
                expanded: false,
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
        onExporting: function(e) {
            var workbook = new ExcelJS.Workbook();
            var worksheet = workbook.addWorksheet('Sales');

            worksheet.columns = [
                { width: 30 }, { width: 20 }, { width: 30 }, { width: 30 }, { width: 30 }, { width: 30 }
            ];  

            var grid = e.component;
            DevExpress.excelExporter.exportPivotGrid({
                component: grid,
                worksheet: worksheet,
                topLeftCell: { row: 4, column: 1 },
                keepColumnWidths: false
            }).then(function(cellRange) {
                exportHeader(worksheet);
                exportFooter(worksheet, cellRange, cellRange);
            }).then(function() {
                workbook.xlsx.writeBuffer().then(function(buffer) {
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Sales.xlsx');
                });
            });
            e.cancel = true;
        }  
    });
});

function exportHeader(worksheet) {
    var headerRow = worksheet.getRow(2);
    headerRow.height = 30; 

    var columnFromIndex = worksheet.views[0].xSplit + 1;
    var columnToIndex = columnFromIndex + 3;
    worksheet.mergeCells(2, columnFromIndex, 2, columnToIndex);

    var headerCell = headerRow.getCell(columnFromIndex);
    headerCell.value = 'Sales Amount by Region';
    headerCell.font = { name: 'Segoe UI Light', size: 22, bold: true };
    headerCell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
}

function exportFooter(worksheet, cellRange) {
    var footerRowIndex = cellRange.to.row + 2;
    var footerCell = worksheet.getRow(footerRowIndex).getCell(cellRange.to.column);
    footerCell.value = 'www.wikipedia.org';
    footerCell.font = { color: { argb: 'BFBFBF' }, italic: true };
    footerCell.alignment = { horizontal: 'right' };
}
