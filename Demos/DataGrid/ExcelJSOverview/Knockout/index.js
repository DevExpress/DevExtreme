window.onload = function () {
  const viewModel = {
    gridOptions: {
      dataSource: employees,
      showBorders: true,
      selection: {
        mode: 'multiple',
      },
      groupPanel: {
        visible: true,
      },
      export: {
        enabled: true,
        allowExportSelectedData: true,
      },
      onExporting(e) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Employees');

        DevExpress.excelExporter.exportDataGrid({
          component: e.component,
          worksheet,
          autoFilterEnabled: true,
        }).then(() => {
          workbook.xlsx.writeBuffer().then((buffer) => {
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Employees.xlsx');
          });
        });
        e.cancel = true;
      },
      columns: [
        'FirstName',
        'LastName',
        'City',
        {
          dataField: 'State',
          groupIndex: 0,
        }, {
          dataField: 'Position',
          width: 130,
        }, {
          dataField: 'BirthDate',
          dataType: 'date',
          width: 100,
        }, {
          dataField: 'HireDate',
          dataType: 'date',
          width: 100,
        },
      ],
    },
  };

  ko.applyBindings(viewModel, document.getElementById('grid'));
};
