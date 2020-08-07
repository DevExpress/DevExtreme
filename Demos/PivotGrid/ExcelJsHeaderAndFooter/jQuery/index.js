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
                    // header
                    var headerRow = worksheet.getRow(1);
                    headerRow.height = 70; 
                    worksheet.mergeCells('B1:K1');
                    headerRow.getCell(3).value = 'Average Sales \n Amount by Region';
                    headerRow.getCell(3).font = { name: 'Segoe UI Light', size: 22, bold: true };
                    headerRow.getCell(3).alignment = { horizontal: 'center',  wrapText: true };
                    worksheet.getCell('C1').note = 'Based on open data';
              
                    worksheet.getRow(2).height = 40;

                    // footer
                    var footerRowIndex = gridRange.to.row + 2;
                    var footerRow = worksheet.getRow(footerRowIndex);
                    worksheet.mergeCells(footerRowIndex, 1, footerRowIndex, 11);

                    footerRow.getCell(1).value = 'www.wikipedia.org';
                    footerRow.getCell(1).font = { color: { argb: 'BFBFBF' }, italic: true };
                    footerRow.getCell(1).alignment = { horizontal: 'right' };

                    // field panel
                    var fields = grid.getDataSource().fields();      
                    var rowFields = fields.filter(r => r.area === 'row').map(r => r.dataField);
                    var dataFields = fields.filter(r => r.area === 'data').map(r => `[${r.summaryType}(${r.dataField}])`);
                    var columnFields = [...new Set(fields.filter(r => r.area === 'column').map(r => r.dataField))];
                    var filterFields = fields.filter(r => r.area === 'filter').map(r => r.dataField);
                    var appliedFilters = fields.filter(r => r.filterValues !== undefined).map(r => `[${r.dataField}:${r.filterValues}]`);
                    var firstRow = worksheet.getRow(1),
                        fieldPanelCell = firstRow.getCell(13);
                  
                    firstRow.height = 90;
                    worksheet.mergeCells('L1:N1');
                    fieldPanelCell.value = 'Feld Panel area:'
                      + ` \n - Filter fields: [${filterFields.join(', ')}]`              
                      + ` \n - Row fields: [${rowFields.join(', ')}]`
                      + ` \n - Column fields: [${columnFields.join(', ')}]`
                      + ` \n - Data fields: [${dataFields.join(', ')}]`
                      + ` \n - Applied filters: [${appliedFilters.join(', ')}]`;
                 
                    fieldPanelCell.alignment = { horizontal: 'left', vertical: 'top',  wrapText: true };
                    fieldPanelCell.width = 30;
        
                    return Promise.resolve();
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