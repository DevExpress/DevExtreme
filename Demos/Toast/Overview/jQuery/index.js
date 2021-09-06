$(() => {
  const checkAvailable = function (data) {
    const type = data.value ? 'success' : 'error';
    const productName = data.element.parent().find('.name').text();
    const text = productName
                + (data.value ? ' is available' : ' is not available');

    DevExpress.ui.notify(text, type, 600);
  };

  $.each(products, (i, product) => {
    $('<li />').append(
      $('<img />').attr('src', product.ImageSrc),
      $('<div />').attr('class', 'name').text(product.Name),
      $('<div />')
        .dxCheckBox({
          text: 'Available',
          onValueChanged: checkAvailable,
        }),
    ).appendTo($('.products'));
  });
});
