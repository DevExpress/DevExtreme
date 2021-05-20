// This code is used for backwards compatibility with the older jsPDF variable name
// Read more: https://github.com/MrRio/jsPDF/releases/tag/v2.0.0
window.jsPDF = window.jspdf.jsPDF;
applyPlugin(window.jsPDF);

$(function(){
    $('#exportButton').dxButton({
        icon: 'exportpdf',
        text: 'Export to PDF',
        onClick: function() {
          const doc = new jsPDF();
          DevExpress.pdfExporter.exportDataGrid({
            jsPDFDocument: doc,
            component: dataGrid
          }).then(function() {
            doc.save('Customers.pdf');
          });
        }
    });

    var dataGrid = $('#gridContainer').dxDataGrid({
        dataSource: customers,
        keyExpr: "ID",
        allowColumnReordering: true,
        showBorders: true,
        grouping: {
            autoExpandAll: true,
        },
        searchPanel: {
            visible: true
        },
        paging: {
            pageSize: 10
        },  
        groupPanel: {
            visible: true
        },
        columns: [
            'CompanyName',
            'Phone',
            'Fax',
            'City',
            {
                dataField: 'State',
                groupIndex: 0
            }
        ]
    }).dxDataGrid('instance');
});
