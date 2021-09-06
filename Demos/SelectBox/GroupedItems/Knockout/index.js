window.onload = function () {
  const fromUngroupedData = new DevExpress.data.DataSource({
    store: ungroupedData,
    key: 'id',
    group: 'Category',
  });

  const fromPregroupedData = new DevExpress.data.DataSource({
    store: pregroupedData,
    key: 'id',
    map(item) {
      item.key = item.Category;
      item.items = item.Products;
      return item;
    },
  });

  const viewModel = {
    fromUngroupedDataOptions: {
      dataSource: fromUngroupedData,
      valueExpr: 'ID',
      grouped: true,
      displayExpr: 'Name',
    },

    fromPregroupedDataOptions: {
      dataSource: fromPregroupedData,
      valueExpr: 'ID',
      grouped: true,
      displayExpr: 'Name',
    },

    customGroupTemplateOptions: {
      dataSource: fromUngroupedData,
      valueExpr: 'ID',
      grouped: true,
      groupTemplate: 'group',
      displayExpr: 'Name',
    },
  };

  ko.applyBindings(viewModel, document.getElementById('select-box-demo'));
};
