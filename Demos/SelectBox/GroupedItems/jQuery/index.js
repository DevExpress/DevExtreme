$(() => {
  const fromUngroupedData = new DevExpress.data.DataSource({
    store: ungroupedData,
    key: 'id',
    group: 'Category',
  });

  const fromPregroupedData = new DevExpress.data.DataSource({
    store: pregroupedData,
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
