$(() => {
  $('#sales').dxPivotGrid({
    height: 440,
    rowHeaderLayout: 'tree',
    showBorders: true,
    fieldChooser: {
      enabled: false,
    },
    export: {
      enabled: true,
    },
    dataSource: {
      fields: [{
        caption: 'Region',
        dataField: 'region',
        area: 'row',
        expanded: true,
      }, {
        caption: 'City',
        dataField: 'city',
        area: 'row',
        width: 150,
      }, {
        dataField: 'date',
        dataType: 'date',
        area: 'column',
        expanded: true,
      }, {
        caption: 'Sales',
        dataField: 'amount',
        dataType: 'number',
        area: 'data',
        summaryType: 'sum',
        format: 'currency',
      }],
      store: sales,
    },
    onExporting(e) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Sales');

      DevExpress.excelExporter.exportPivotGrid({
        component: e.component,
        worksheet,
      }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
          saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Sales.xlsx');
        });
      });
    },
  });
});
