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
    minHeight: 150,
    maxHeight: 370,
    area: '.widget-container .dx-field',
  }).dxResizable('instance');

  $('#keepAspectRatio').dxCheckBox({
    text: 'Keep aspect ratio',
    value: true,
    onValueChanged: ({ value }) => {
      resizable.option('keepAspectRatio', value);
    },
  });

  const allHandles = ['left', 'top', 'right', 'bottom'];
  $('#handles').dxTagBox({
    items: allHandles,
    value: allHandles,
    inputAttr: { 'aria-label': 'Handle' },
    onValueChanged: ({ value }) => {
      const resizableClasses = allHandles.reduce((classes, handle) => {
        const newClass = value.includes(handle) ? '' : ` no-${handle}-handle`;
        return classes + newClass;
      }, '');

      resizable.option({
        handles: value.join(' '),
        elementAttr: {
          class: resizableClasses,
        },
      });
    },
  });
});
