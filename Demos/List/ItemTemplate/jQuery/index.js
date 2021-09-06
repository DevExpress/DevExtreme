$(() => {
  const formatCurrency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format;

  $('#listWidget').dxList({
    dataSource: products,
    height: '100%',
    itemTemplate(data) {
      const result = $('<div>').addClass('product');

      $('<img>').attr('src', data.ImageSrc).appendTo(result);
      $('<div>').text(data.Name).appendTo(result);
      $('<div>').addClass('price')
        .html(formatCurrency(data.Price)).appendTo(result);

      return result;
    },
  }).dxList('instance');
});
