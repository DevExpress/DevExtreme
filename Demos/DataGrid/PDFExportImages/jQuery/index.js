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
    onExporting({ component }) {
      // eslint-disable-next-line new-cap
      const doc = new jsPDF();

      DevExpress.pdfExporter.exportDataGrid({
        jsPDFDocument: doc,
        component,
        margin: {
          top: 10,
          right: 10,
          bottom: 10,
          left: 10,
        },
        topLeft: { x: 5, y: 5 },
        columnWidths: [30, 30, 30, 30, 30, 30],
        onRowExporting: (e) => {
          const isHeader = e.rowCells[0].text === 'Picture';
          if (!isHeader) {
            e.rowHeight = 40;
          }
        },
        customDrawCell: (e) => {
          if (e.gridCell.rowType === 'data' && e.gridCell.column.dataField === 'Picture') {
            doc.addImage(e.gridCell.value, 'PNG', e.rect.x, e.rect.y, e.rect.w, e.rect.h);
            e.cancel = true;
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
