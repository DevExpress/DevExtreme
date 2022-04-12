// This code is used for backwards compatibility with the older jsPDF variable name
// Read more: https://github.com/MrRio/jsPDF/releases/tag/v2.0.0
window.jsPDF = window.jspdf.jsPDF;

$(() => {
  const dataGrid = $('#gridContainer').dxDataGrid({
    dataSource: customers,
    keyExpr: 'ID',
    allowColumnReordering: true,
    showBorders: true,
    grouping: {
      autoExpandAll: true,
    },
    searchPanel: {
      visible: true,
    },
    paging: {
      pageSize: 10,
    },
    groupPanel: {
      visible: true,
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
    toolbar: {
      items: [
        'groupPanel',
        {
          widget: 'dxButton',
          location: 'after',
          options: {
            icon: 'exportpdf',
            text: 'Export to PDF',
            onClick() {
              // eslint-disable-next-line new-cap
              const doc = new jsPDF();
              DevExpress.pdfExporter.exportDataGrid({
                jsPDFDocument: doc,
                component: dataGrid,
                indent: 5,
              }).then(() => {
                doc.save('Companies.pdf');
              });
            },
          },
        },
        'searchPanel',
      ],
    },
  }).dxDataGrid('instance');
});
