$(() => {
  $('#gridContainer').dxDataGrid({
    dataSource: orders,
    keyExpr: 'OrderNumber',
    showBorders: true,
    pager: {
      visible: true,
    }
  });
});
