$(() => {
  const store = DevExpress.data.AspNet.createStore({
    key: 'ProductID',
    loadUrl: 'https://js.devexpress.com/Demos/Mvc/api/ListData/Orders',
  });

  const listData = new DevExpress.data.DataSource({
    store,
    paginate: true,
    pageSize: 1,
    sort: 'ProductName',
    group: 'Category.CategoryName',
    filter: ['UnitPrice', '>', 15],
  });

  const formatCurrency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format;

  $('#list').dxList({
    dataSource: listData,
    itemTemplate(data) {
      const price = formatCurrency(data.UnitPrice);
      return $('<div>')
        .append($('<div>').text(data.CategoryName))
        .append($('<div>').text(data.ProductName))
        .append($('<b>').text(price));
    },
    grouped: true,
    collapsibleGroups: true,
    selectionMode: 'multiple',
    showSelectionControls: true,
    pageLoadMode: 'scrollBottom',
    height: 600,
  });
});
