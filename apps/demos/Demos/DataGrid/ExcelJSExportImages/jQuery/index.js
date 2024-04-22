$(() => {
  $('#gridContainer').dxDataGrid({
    dataSource: employees,
    keyExpr: 'ID',
    showBorders: true,
    showRowLines: true,
    showColumnLines: false,
    export: {
      enabled: true,
    },
    columns: [
      {
        dataField: 'Picture',
        width: 90,
        cellTemplate(container, options) {
          $('<div>')
            .append($('<img>', { src: options.value, alt: 'Employee photo' }))
            .appendTo(container);
        },
      },
      'FirstName',
      'LastName',
      'Position',
      {
        dataField: 'BirthDate',
        dataType: 'date',
      }, {
        dataField: 'HireDate',
        dataType: 'date',
      },
    ],
    onExporting(e) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Main sheet');

      DevExpress.excelExporter.exportDataGrid({
        component: e.component,
        worksheet,
        topLeftCell: { row: 2, column: 2 },
        autoFilterEnabled: true,
        customizeCell(options) {
          const { gridCell } = options;
          const { excelCell } = options;

          if (gridCell.rowType === 'data') {
            if (gridCell.column.dataField === 'Picture') {
              excelCell.value = undefined;

              const image = workbook.addImage({
                base64: gridCell.value,
                extension: 'png',
              });

              worksheet.getRow(excelCell.row).height = 90;
              worksheet.addImage(image, {
                tl: { col: excelCell.col - 1, row: excelCell.row - 1 },
                br: { col: excelCell.col, row: excelCell.row },
              });
            }
          }
        },
      }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
          saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'DataGrid.xlsx');
        });
      });
    },
  });
});
