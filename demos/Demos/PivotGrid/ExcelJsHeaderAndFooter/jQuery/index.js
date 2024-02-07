$(() => {
  const exportHeaderOptions = {
    exportRowFieldHeaders: false,
    exportColumnFieldHeaders: false,
    exportDataFieldHeaders: false,
    exportFilterFieldHeaders: false,
  };

  $('#sales').dxPivotGrid({
    allowSorting: true,
    allowFiltering: true,
    height: 440,
    showBorders: true,
    fieldPanel: {
      showColumnFields: true,
      showDataFields: true,
      showFilterFields: true,
      showRowFields: true,
      allowFieldDragging: true,
      visible: true,
    },
    fieldChooser: {
      enabled: false,
    },
    export: {
      enabled: true,
    },
    dataSource: {
      fields: [{
        caption: 'Region',
        width: 120,
        dataField: 'region',
        area: 'row',
        expanded: true,
      }, {
        caption: 'City',
        dataField: 'city',
        width: 150,
        area: 'row',
      }, {
        dataField: 'date',
        dataType: 'date',
        area: 'column',
        filterValues: [[2013], [2014], [2015]],
        expanded: false,
      }, {
        caption: 'Sales',
        dataField: 'amount',
        dataType: 'number',
        summaryType: 'sum',
        format: 'currency',
        area: 'data',
      }, {
        caption: 'Country',
        dataField: 'country',
        area: 'filter',
      }],
      store: sales,
    },
    onExporting(e) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Sales');

      worksheet.columns = [
        { width: 30 }, { width: 20 }, { width: 30 }, { width: 30 }, { width: 30 }, { width: 30 },
      ];

      DevExpress.excelExporter.exportPivotGrid({
        component: e.component,
        worksheet,
        topLeftCell: { row: 4, column: 1 },
        keepColumnWidths: false,
        ...exportHeaderOptions,
      }).then((cellRange) => {
        // Header
        const headerRow = worksheet.getRow(2);
        headerRow.height = 30;

        const columnFromIndex = worksheet.views[0].xSplit + 1;
        const columnToIndex = columnFromIndex + 3;
        worksheet.mergeCells(2, columnFromIndex, 2, columnToIndex);

        const headerCell = headerRow.getCell(columnFromIndex);
        headerCell.value = 'Sales Amount by Region';
        headerCell.font = { name: 'Segoe UI Light', size: 22, bold: true };
        headerCell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };

        // Footer
        const footerRowIndex = cellRange.to.row + 2;
        const footerCell = worksheet.getRow(footerRowIndex).getCell(cellRange.to.column);
        footerCell.value = 'www.wikipedia.org';
        footerCell.font = { color: { argb: 'BFBFBF' }, italic: true };
        footerCell.alignment = { horizontal: 'right' };
      }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
          saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Sales.xlsx');
        });
      });
    },
  });

  $('#export-data-field-headers').dxCheckBox({
    text: 'Export Data Field Headers',
    value: false,
    onValueChanged({ value }) {
      exportHeaderOptions.exportDataFieldHeaders = value;
    },
  });

  $('#export-row-field-headers').dxCheckBox({
    text: 'Export Row Field Headers',
    value: false,
    onValueChanged({ value }) {
      exportHeaderOptions.exportRowFieldHeaders = value;
    },
  });

  $('#export-column-field-headers').dxCheckBox({
    text: 'Export Column Field Headers',
    value: false,
    onValueChanged({ value }) {
      exportHeaderOptions.exportColumnFieldHeaders = value;
    },
  });

  $('#export-filter-field-headers').dxCheckBox({
    text: 'Export Filter Field Headers',
    value: false,
    onValueChanged({ value }) {
      exportHeaderOptions.exportFilterFieldHeaders = value;
    },
  });
});
