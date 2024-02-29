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
        displayFormat: 'Total count: {0} companies',
      }],
    },
    export: {
      enabled: true,
    },
    onExporting(e) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Companies');

      worksheet.columns = [
        { width: 5 }, { width: 30 }, { width: 25 }, { width: 15 }, { width: 25 }, { width: 40 },
      ];

      DevExpress.excelExporter.exportDataGrid({
        component: e.component,
        worksheet,
        keepColumnWidths: false,
        topLeftCell: { row: 2, column: 2 },
        customizeCell(options) {
          const { gridCell } = options;
          const { excelCell } = options;

          if (gridCell.rowType === 'data') {
            if (gridCell.column.dataField === 'Phone') {
              excelCell.value = parseInt(gridCell.value, 10);
              excelCell.numFmt = '[<=9999999]###-####;(###) ###-####';
            }
            if (gridCell.column.dataField === 'Website') {
              excelCell.value = { text: gridCell.value, hyperlink: gridCell.value };
              excelCell.font = { color: { argb: 'FF0000FF' }, underline: true };
              excelCell.alignment = { horizontal: 'left' };
            }
          }
          if (gridCell.rowType === 'group') {
            excelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'BEDFE6' } };
          }
          if (gridCell.rowType === 'totalFooter' && excelCell.value) {
            excelCell.font.italic = true;
          }
        },
      }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
          saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Companies.xlsx');
        });
      });
    },
  });
});
