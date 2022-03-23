$(() => {
  $('#grid').dxDataGrid({
    dataSource: orders,
    keyExpr: 'ID',
    showBorders: true,
    height: '100%',
    paging: {
      pageSize: 8,
    },
    scrolling: {
      mode: 'virtual',
    },
    columns: [{
      allowGrouping: false,
      dataField: 'OrderNumber',
      caption: 'Invoice Number',
      width: 130,
    }, {
      caption: 'City',
      dataField: 'CustomerStoreCity',
    }, {
      caption: 'State',
      dataField: 'CustomerStoreState',
    },
    'Employee', {
      dataField: 'OrderDate',
      dataType: 'date',
    }, {
      dataField: 'SaleAmount',
      format: 'currency',
    }],
  });

  const resizable = $('#gridContainer').dxResizable({
    minWidth: 400,
    maxWidth: 1050,
    minHeight: 150,
    maxHeight: 370,
  }).dxResizable('instance');

  $('#keepAspectRatio').dxCheckBox({
    text: 'Keep aspect ratio',
    value: true,
    onValueChanged: ({ value }) => {
      resizable.option('keepAspectRatio', value);
    },
  });

  $('#handles').dxTagBox({
    items: ['left', 'top', 'right', 'bottom'],
    value: ['left', 'top', 'right', 'bottom'],
    onValueChanged: ({ value }) => {
      resizable.option('handles', value.join(' '));
    },
  });
});
