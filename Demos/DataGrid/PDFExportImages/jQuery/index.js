$(() => {
  $('#gridContainer').dxDataGrid({
    dataSource: employees,
    keyExpr: 'ID',
    showBorders: true,
    showRowLines: true,
    showColumnLines: false,
    export: {
      enabled: true,
      formats: ['pdf'],
    },
    onExporting(e) {
      // eslint-disable-next-line new-cap
      const doc = new jsPDF();

      DevExpress.pdfExporter.exportDataGrid({
        jsPDFDocument: doc,
        component: e.component,
        margin: {
          top: 10,
          right: 10,
          bottom: 10,
          left: 10,
        },
        topLeft: { x: 0, y: 5 },
        columnWidths: [30, 30, 30, 30, 30, 30],
        onRowExporting: (arg) => {
          const isHeader = arg.rowCells[0].text === 'Picture';
          if (!isHeader) {
            arg.rowHeight = 40;
          }
        },
        customDrawCell: (arg) => {
          if (arg.gridCell.rowType === 'data' && arg.gridCell.column.dataField === 'Picture') {
            doc.addImage(arg.gridCell.value, 'PNG', arg.rect.x, arg.rect.y, arg.rect.w, arg.rect.h);
            arg.cancel = true;
          }
        },
      }).then(() => {
        doc.save('DataGrid.pdf');
      });
    },
    columns: [
      {
        dataField: 'Picture',
        width: 90,
        cellTemplate(container, options) {
          $('<div>')
            .append($('<img>', { src: options.value }))
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
  });
});
