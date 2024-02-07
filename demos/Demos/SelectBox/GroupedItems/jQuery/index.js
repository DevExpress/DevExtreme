$(() => {
  const fromUngroupedData = new DevExpress.data.DataSource({
    store: {
      type: 'array',
      data: ungroupedData,
      key: 'ID',
    },
    group: 'Category',
  });

  const fromPregroupedData = new DevExpress.data.DataSource({
    store: {
      type: 'array',
      data: pregroupedData,
      key: 'ID',
    },
    map(item) {
      item.key = item.Category;
      item.items = item.Products;
      return item;
    },
  });

  fromPregroupedData.load();

  $('#selectbox-ungroupeddata').dxSelectBox({
    dataSource: fromUngroupedData,
    inputAttr: { 'aria-label': 'Data' },
    valueExpr: 'ID',
    grouped: true,
    displayExpr: 'Name',
    value: 1,
  });

  $('#selectbox-pregroupeddata').dxSelectBox({
    dataSource: fromPregroupedData,
    inputAttr: { 'aria-label': 'Pregrouped Data' },
    valueExpr: 'ID',
    grouped: true,
    displayExpr: 'Name',
    value: 1,
  });

  $('#selectbox-template').dxSelectBox({
    dataSource: fromUngroupedData,
    valueExpr: 'ID',
    inputAttr: { 'aria-label': 'Templated Ungrouped Data' },
    grouped: true,
    groupTemplate(data) {
      return $(`<div class='custom-icon'><span class='dx-icon-box icon'></span> ${data.key}</div>`);
    },
    displayExpr: 'Name',
    value: 1,
  });
});
