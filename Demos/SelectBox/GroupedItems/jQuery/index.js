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

  $('#selectbox-ungroupeddata').dxSelectBox({
    dataSource: fromUngroupedData,
    valueExpr: 'ID',
    grouped: true,
    displayExpr: 'Name',
  });

  $('#selectbox-pregroupeddata').dxSelectBox({
    dataSource: fromPregroupedData,
    valueExpr: 'ID',
    grouped: true,
    displayExpr: 'Name',
  });

  $('#selectbox-template').dxSelectBox({
    dataSource: fromUngroupedData,
    valueExpr: 'ID',
    grouped: true,
    groupTemplate(data) {
      return $(`<div class='custom-icon'><span class='dx-icon-box icon'></span> ${data.key}</div>`);
    },
    displayExpr: 'Name',
  });
});
