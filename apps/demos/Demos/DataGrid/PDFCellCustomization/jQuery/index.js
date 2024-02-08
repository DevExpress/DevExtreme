// This code is used for backwards compatibility with the older jsPDF variable name
// Read more: https://github.com/MrRio/jsPDF/releases/tag/v2.0.0
window.jsPDF = window.jspdf.jsPDF;

$(() => {
  $('#gridContainer').dxDataGrid({
    dataSource: companies,
    keyExpr: 'ID',
    width: '100%',
    showBorders: true,
    groupPanel: {
      visible: true,
    },
    grouping: {
      autoExpandAll: true,
    },
    sortByGroupSummaryInfo: [{
      summaryItem: 'count',
    }],
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
        columnWidths: [40, 40, 30, 30, 40],
        customizeCell({ gridCell, pdfCell }) {
          if (gridCell.rowType === 'data' && gridCell.column.dataField === 'Phone') {
            pdfCell.text = pdfCell.text.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
          } else if (gridCell.rowType === 'group') {
            pdfCell.backgroundColor = '#BEDFE6';
          } else if (gridCell.rowType === 'totalFooter') {
            pdfCell.font.style = 'italic';
          }
        },
        customDrawCell(options) {
          const { gridCell, pdfCell } = options;

          if (gridCell.rowType === 'data' && gridCell.column.dataField === 'Website') {
            options.cancel = true;
            doc.setFontSize(11);
            doc.setTextColor('#0000FF');

            const textHeight = doc.getTextDimensions(pdfCell.text).h;
            doc.textWithLink('website',
              options.rect.x + pdfCell.padding.left,
              options.rect.y + options.rect.h / 2 + textHeight / 2, { url: pdfCell.text });
          }
        },
      }).then(() => {
        doc.save('Companies.pdf');
      });
    },
    columns: [{
      dataField: 'Name',
      width: 190,
    }, {
      dataField: 'Address',
      width: 200,
    },
    'City',
    {
      dataField: 'State',
      groupIndex: 0,
    }, {
      dataField: 'Phone',
      format(value) {
        const USNumber = value.match(/(\d{3})(\d{3})(\d{4})/);
        return `(${USNumber[1]}) ${USNumber[2]}-${USNumber[3]}`;
      },
    }, {
      dataField: 'Website',
      caption: '',
      alignment: 'center',
      width: 100,
      cellTemplate(container, options) {
        return $('<a>', { href: options.value, target: '_blank' }).text('Website');
      },
    }],
    summary: {
      totalItems: [{
        column: 'Name',
        summaryType: 'count',
        displayFormat: 'Total count: {0}',
      }],
    },
  });
});
