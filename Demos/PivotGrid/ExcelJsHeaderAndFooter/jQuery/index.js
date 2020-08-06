$(function(){
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
                width: 120,
                dataField: "region",
                area: "row" 
            }, {
                caption: "City",
                dataField: "city",
                width: 150,
                area: "row",
                selector: function(data) {
                    return  data.city + " (" + data.country + ")";
                }
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
            }],
            store: sales
        },
        onExporting: function(e) {
            var workbook = new ExcelJS.Workbook();
            var worksheet = workbook.addWorksheet('Sales');

            // https://github.com/exceljs/exceljs#columns
            worksheet.columns = [
                { width: 10 }, { width: 10 }, { width: 10 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }
            ];            

            DevExpress.excelExporter.exportPivotGrid({
                component: e.component,
                worksheet: worksheet,
                topLeftCell: { row: 2, column: 3 },
                keepColumnWidths: false,
            }).then(function(dataGridRange) {
                    // header
                    var headerRow = worksheet.getRow(1);
                    headerRow.height = 70; 
                    worksheet.mergeCells('D1:H1');
                    headerRow.getCell(4).value = 'Average Sales \n Amount by Region';
                    headerRow.getCell(4).font = { name: 'Segoe UI Light', size: 22, bold: true };
                    headerRow.getCell(4).alignment = { horizontal: 'center',  wrapText: true };
                    worksheet.getCell('D1').note = 'Based on open data';
              
                    worksheet.getRow(2).height = 40;

                    // footer
                    var footerRowIndex = dataGridRange.to.row + 2;
                    var footerRow = worksheet.getRow(footerRowIndex);
                    worksheet.mergeCells(footerRowIndex, 1, footerRowIndex, 8);

                    footerRow.getCell(1).value = 'www.wikipedia.org';
                    footerRow.getCell(1).font = { color: { argb: 'BFBFBF' }, italic: true };
                    footerRow.getCell(1).alignment = { horizontal: 'right' };
        
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