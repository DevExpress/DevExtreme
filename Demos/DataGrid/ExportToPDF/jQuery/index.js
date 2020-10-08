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
