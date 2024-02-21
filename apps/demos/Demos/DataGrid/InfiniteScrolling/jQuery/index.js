$(() => {
  $('#gridContainer').dxDataGrid({
    dataSource: generateData(100000),
    keyExpr: 'id',
    showBorders: true,
    customizeColumns(columns) {
      columns[0].width = 70;
    },
    loadPanel: {
      enabled: false,
    },
    scrolling: {
      mode: 'infinite',
    },
    sorting: {
      mode: 'none',
    },
  });
});
