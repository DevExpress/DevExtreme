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
            allowFieldDragging: true,
            visible: true
        },        
        fieldChooser: {
            enabled: true
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

            var grid = e.component;
            DevExpress.excelExporter.exportPivotGrid({
                component: grid,
                worksheet: worksheet,
                topLeftCell: { row: 4, column: 1 },
                keepColumnWidths: true,
            }).then(function(gridRange) {
                exportHeader(worksheet, grid);
                exportRowHeaders(worksheet, grid, gridRange);
                exportColumnHeaders(worksheet, grid, gridRange);
                exportFooter(worksheet, gridRange, gridRange);
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

function exportHeader(worksheet, grid) {
    var rowIndex = 1;
    var headerRow = worksheet.getRow(rowIndex);
    headerRow.height = 50;

    var columnFromIndex = worksheet.views[0].xSplit + 1;
    var columnToIndex = columnFromIndex + 7;
    worksheet.mergeCells(rowIndex, columnFromIndex, rowIndex, columnToIndex);

    var headerCell = headerRow.getCell(columnFromIndex);
    headerCell.value = 'Sales Amount by Region' + getYearsRange(grid);
    headerCell.font = { name: 'Segoe UI Light', size: 22, bold: true };
    headerCell.alignment = { horizontal: 'left', vertical: 'top', wrapText: true };
}

function exportRowHeaders(worksheet, grid, gridRange){
    var fields = grid.getDataSource().fields();
    var rowFields = getFields(fields, 'row', r => r.dataField);

    var columnFromIndex = 1;
    var columnToIndex = worksheet.views[0].xSplit;
    worksheet.unMergeCells(gridRange.from.row, columnFromIndex, gridRange.from.row, columnToIndex);
    rowFields.forEach(function(field, index) {
        var rowHeaderCell = worksheet.getRow(worksheet.views[0].ySplit).getCell(index + 1)
        rowHeaderCell.value = field;
    });
}

function exportColumnHeaders(worksheet, grid, gridRange){
    var fields = grid.getDataSource().fields();
    var columnFields = getFields(fields, 'column', r => r.dataField);
    var dataFields = getFields(fields, 'data', r => r.dataField);

    var rowIndex = gridRange.from.row - 1;    
    var columnIndex = worksheet.views[0].xSplit + 1;
    var columnHeaderCell = worksheet.getRow(rowIndex).getCell(columnIndex);
    columnHeaderCell.value = dataFields.join(',') + ' by ' + columnFields.join(' and ');
}

function exportFooter(worksheet, gridRange) {
    var footerRowIndex = gridRange.to.row + 2;
    var footerCell = worksheet.getRow(footerRowIndex).getCell(gridRange.to.column);
    footerCell.value = 'www.wikipedia.org';
    footerCell.font = { color: { argb: 'BFBFBF' }, italic: true };
    footerCell.alignment = { horizontal: 'right' };
}

function getYearsRange(grid) {
    var dateFieldIndex = 2;
    var filterValues = grid.getDataSource().fields()[dateFieldIndex].filterValues;
    if(filterValues === null) {
        return '';
    }

    var uniqueYears = [...new Set(filterValues.map(f => f[0]))];
    return ' for ' + uniqueYears.join(', ') 
        + (uniqueYears.length > 1 ? ' years': ' year');
}

function getFields(fields, area, mapper){
    return [...new Set(fields.filter(r => r.area === area).map(mapper))];
}