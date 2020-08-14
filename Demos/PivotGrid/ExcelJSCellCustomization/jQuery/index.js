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
                  return data.city + " (" + data.country + ")";
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
              { width: 10 }, { width: 10 }, { width: 10 }, { width: 15 }, { width: 15 }, { width: 15 }, 
              { width: 15 }, { width: 15 }, { width: 15 }, { width: 15 }, { width: 10 }
          ];

          DevExpress.excelExporter.exportPivotGrid({
              component: e.component,
              worksheet: worksheet,
              topLeftCell: {
                  row: 1,
                  column: 1
              },
              keepColumnWidths: false,
              customizeCell: function({ excelCell, pivotCell }) {
                  if (pivotCell.area === 'row') {
                      if (pivotCell.type === 'T') {
                          excelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'BEDFE6' } };
                      } else {
                          excelCell.font = { italic: true, size: 10 };
                      }
                  }
                  if (pivotCell.area === 'column') {
                      excelCell.alignment = { vertical: 'middle', horizontal: 'center' };
                  }

                  if (pivotCell.area === 'data') {
                      var fillColor = '6BB6A1';
                      if (pivotCell.value < 3000) {
                          fillColor = 'DF6033';
                      } else if (pivotCell.value < 6000) {
                          fillColor = 'F5E68B';
                      }
                      excelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fillColor } };
                  }

                  if (pivotCell.rowType === 'T') {
                      excelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'BEDFE6' } };
                  }
                  if(pivotCell.rowType === 'GT') {
                    excelCell.font = { bold: true };
                    excelCell.numFmt = '$ #,##.#,"K"';                  
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