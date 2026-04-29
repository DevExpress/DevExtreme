$(() => {
  const toast = $('#toast').dxToast({ displayTime: 600 }).dxToast('instance');

  const checkAvailable = function (data) {
    const type = data.value ? 'success' : 'error';
    const productName = data.element.parent().find('.name').text();
    const message = productName + (data.value ? ' is available' : ' is not available');

    toast.option({ message, type });
    toast.show();
  };

  $.each(products, (i, product) => {
    $('<li />').append(
      $('<img />').attr('alt', product.Name).attr('src', product.ImageSrc),
      $('<div />').attr('class', 'name').text(product.Name),
      $('<div />')
        .dxCheckBox({
          text: 'Available',
          onValueChanged: checkAvailable,
        }),
    ).appendTo($('.products'));
  });
});
