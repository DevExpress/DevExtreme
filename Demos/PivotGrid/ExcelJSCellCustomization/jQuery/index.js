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
              area: "row",
              expanded: true
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
              area: "column",
              expanded: true,
              filterValues: [[2015]]
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
              { width: 10 }, { width: 10 }, { width: 10 }, { width: 15 }, { width: 15 }, { width: 15 }, { width: 15 }, { width: 15 }, { width: 15 }, { width: 15 }, { width: 10 }
          ];

          DevExpress.excelExporter.exportPivotGrid({
              component: e.component,
              worksheet: worksheet,
              topLeftCell: { row: 1, column: 1 },
              keepColumnWidths: false,
              customizeCell: function({excelCell, pivotCell}) {
                // cell customization
                if( pivotCell.area === 'row') {
                  if (pivotCell.type === 'T') {
                    excelCell.fill = { type: 'pattern', pattern:'solid', fgColor: { argb:'94FF82'} }
                  } else {
                    excelCell.font = { italic: true, size: 10 };
                  }
                }
                if( pivotCell.area === 'column') {
                  excelCell.font = { color: { argb: "0000cc"}, bold: true };
                  excelCell.fill = { type: 'pattern', pattern:'solid', fgColor: { argb:'FFFF5E'} }
                  excelCell.alignment = { vertical: 'middle', horizontal: 'center' };
                }
                if (pivotCell.rowType === 'T') {
                  excelCell.fill = { type: 'pattern', pattern:'solid', fgColor: { argb:'94FF82'} }
                }
                if(pivotCell.rowType === 'GT') {
                  excelCell.fill = { type: 'pattern', pattern:'solid', fgColor: { argb:'5EFF5E'} }
                  excelCell.font = { bold: true, size: 10 };
                }
                if(pivotCell.columnType === 'GT') {
                  if(pivotCell.rowPath && pivotCell.rowPath[0] === 'Africa') {
                    excelCell.fill = { type: 'pattern', pattern:'solid', fgColor: { argb:'B6FF19'} }
                  } else {
                    excelCell.fill = { type: 'pattern', pattern:'solid', fgColor: { argb:'5EFF5E'} }
                  }
                }
              }}).then(function() {
                  // https://github.com/exceljs/exceljs#writing-xlsx
                  workbook.xlsx.writeBuffer().then(function(buffer) {
                      saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Sales.xlsx');
                  });
              });
          e.cancel = true;
      }  
  });
});