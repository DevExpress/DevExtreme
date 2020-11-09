window.onload = function() {
  var viewModel = {
    gridOptions: {
      dataSource: countries,
      showBorders: true,
      export: {
        enabled: true
      },
      onExporting: function(e) {
        var workbook = new ExcelJS.Workbook();
        var worksheet = workbook.addWorksheet('CountriesPopulation');
        
        DevExpress.excelExporter.exportDataGrid({
          component: e.component,
          worksheet: worksheet,
          topLeftCell: { row: 4, column: 1 }
        }).then(function(cellRange) {
          // header
          var headerRow = worksheet.getRow(2);
          headerRow.height = 30; 
          worksheet.mergeCells(2, 1, 2, 8);

          headerRow.getCell(1).value = 'Country Area, Population, and GDP Structure';
          headerRow.getCell(1).font = { name: 'Segoe UI Light', size: 22 };
          headerRow.getCell(1).alignment = { horizontal: 'center' };
          
          // footer
          var footerRowIndex = cellRange.to.row + 2;
          var footerRow = worksheet.getRow(footerRowIndex);
          worksheet.mergeCells(footerRowIndex, 1, footerRowIndex, 8);
          
          footerRow.getCell(1).value = 'www.wikipedia.org';
          footerRow.getCell(1).font = { color: { argb: 'BFBFBF' }, italic: true };
          footerRow.getCell(1).alignment = { horizontal: 'right' };
        }).then(function() {
          workbook.xlsx.writeBuffer().then(function(buffer) {
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'CountriesPopulation.xlsx');
          });
        });
        e.cancel = true;
      },
      columns: [
        'Country',
        'Area',
        {
          caption: 'Population',
          columns: [{
            caption: 'Total',
            dataField: 'Population_Total',
            format: 'fixedPoint'
          }, {
            caption: 'Urban',
            dataField: 'Population_Urban',
            dataType: 'number',
            format: { type: 'percent'}
          }]
        }, {
          caption: 'Nominal GDP',
          columns: [{
            caption: 'Total, mln $',
            dataField: 'GDP_Total',
            format: 'fixedPoint',
            sortOrder: 'desc'
          }, {
            caption: 'By Sector',
            columns: [{
              caption: 'Agriculture',
              dataField: 'GDP_Agriculture',
              width: 95,
              format: {
                type: 'percent',
                precision: 1
              }
            }, {
              caption: 'Industry',
              dataField: 'GDP_Industry',
              width: 80,
              format: {
                type: 'percent',
                precision: 1
              }
            }, {
              caption: 'Services',
              dataField: 'GDP_Services',
              width: 85,
              format: {
                type: 'percent',
                precision: 1
              }
            }]
          }]
        }
      ]
    }
  };
  
  ko.applyBindings(viewModel, document.getElementById("grid"));
};