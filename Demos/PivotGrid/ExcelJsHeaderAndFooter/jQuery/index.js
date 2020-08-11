$(function(){
    $("#sales").dxPivotGrid({
        allowSortingBySummary: true,
        allowSorting: true,
        allowFiltering: true,
        allowExpandAll: true,
        height: 440,
        showBorders: true,
        fieldPanel: {
            showColumnFields: true,
            showDataFields: true,
            showFilterFields: true,
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
                area: "filter",
                selector: function(data) {
                    return  data.city + " (" + data.country + ")";
                }
            }, {
                dataField: "date",
                dataType: "date",
                area: "column",
                filterValues: [[2014], [2015]],
                expanded: true
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
                topLeftCell: { row: 2, column: 1 },
                keepColumnWidths: true,
            }).then(function(gridRange) {
                exportHeader(worksheet);
                exportFooter(gridRange, worksheet);
                exportFieldPanel(worksheet, grid);
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

function exportHeader(worksheet) {
    var headerRow = worksheet.getRow(1);
    headerRow.height = 70;
    worksheet.mergeCells('B1:K1');
    headerRow.getCell(2).value = 'Average Sales. Amount by Region';
    headerRow.getCell(2).font = { name: 'Segoe UI Light', size: 22, bold: true };
    headerRow.getCell(2).alignment = { horizontal: 'left', vertical: 'top', wrapText: true };
}

function exportFooter(gridRange, worksheet) {
    var footerRowIndex = gridRange.to.row + 1;
    var footerRow = worksheet.getRow(footerRowIndex);
    worksheet.mergeCells(footerRowIndex, 1, footerRowIndex, 11);
    footerRow.getCell(1).value = 'www.wikipedia.org';
    footerRow.getCell(1).font = { color: { argb: 'BFBFBF' }, italic: true };
    footerRow.getCell(1).alignment = { horizontal: 'right' };
}

function exportFieldPanel(worksheet, grid) {
    var fields = grid.getDataSource().fields();

    var rowFields = getFields(fields, 'row', r => r.dataField);
    var dataFields = getFields(fields, 'data', r => `[${r.summaryType}(${r.dataField}])`);
    var columnFields = getFields(fields, 'column', r => r.dataField);
    var appliedFilters = fields.filter(r => r.filterValues !== undefined).map(r => `[${r.dataField}:${r.filterValues}]`);
    var filterFields = getFields(fields, 'filter', r => r.dataField);    
    
    var firstRow = worksheet.getRow(1),
        fieldPanelCell = firstRow.getCell(13);

    worksheet.mergeCells('L1:N1');
    fieldPanelCell.value = 'Feld Panel area:'
        + ` \n - Filter fields: [${filterFields.join(', ')}]`
        + ` \n - Row fields: [${rowFields.join(', ')}]`
        + ` \n - Column fields: [${columnFields.join(', ')}]`
        + ` \n - Data fields: [${dataFields.join(', ')}]`
        + ` \n - Applied filters: [${appliedFilters.join(', ')}]`;

    fieldPanelCell.alignment = { horizontal: 'left', vertical: 'top', wrapText: true };
    fieldPanelCell.width = 30;
    firstRow.height = 90;    
}

function getFields(fields, area, mapper){
    return [...new Set(fields.filter(r => r.area === area).map(mapper))];
}