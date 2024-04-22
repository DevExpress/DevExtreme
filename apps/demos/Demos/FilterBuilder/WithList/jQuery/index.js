$(() => {
  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const filterBuilderInstance = $('#filterBuilder').dxFilterBuilder({
    fields,
    value: filter,
  }).dxFilterBuilder('instance');

  $('#listWidget').dxList({
    dataSource: new DevExpress.data.DataSource({
      store: products,
      filter: filterBuilderInstance.getFilterExpression(),
    }),
    height: '100%',
    itemTemplate(data) {
      const result = $('<div>').addClass('product');
      $('<img>').attr('src', data.ImageSrc).attr('alt', `Picture of ${data.Name}`).appendTo(result);
      $('<div>').text(data.Name).appendTo(result);
      $('<div>').addClass('price')
        .html(currencyFormatter.format(data.Price)).appendTo(result);
      return result;
    },
  });

  $('#apply').dxButton({
    text: 'Apply Filter',
    type: 'default',
    onClick() {
      const filter = filterBuilderInstance.getFilterExpression();
      const dataSource = $('#listWidget').dxList('instance').getDataSource();
      dataSource.filter(filter);
      dataSource.load();
    },
  });
});
