// This code is used for backwards compatibility with the older jsPDF variable name
// Read more: https://github.com/MrRio/jsPDF/releases/tag/v2.0.0
window.jsPDF = window.jspdf.jsPDF;

$(() => {
  $('#gridContainer').dxDataGrid({
    dataSource: customers,
    keyExpr: 'ID',
    allowColumnReordering: true,
    showBorders: true,
    grouping: {
      autoExpandAll: true,
    },
    selection: {
      mode: 'multiple',
    },
    paging: {
      pageSize: 10,
    },
    columns: [
      'CompanyName',
      'Phone',
      'Fax',
      'City',
      {
        dataField: 'State',
        groupIndex: 0,
      },
    ],
    export: {
      enabled: true,
      formats: ['pdf'],
      allowExportSelectedData: true,
    },
    onExporting(e) {
      // eslint-disable-next-line new-cap
      const doc = new jsPDF();

      DevExpress.pdfExporter.exportDataGrid({
        jsPDFDocument: doc,
        component: e.component,
        indent: 5,
      }).then(() => {
        doc.save('Companies.pdf');
      });
    },
  });
});
