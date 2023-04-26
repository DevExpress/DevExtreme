$(() => {
  let currentHouse;

  DevExpress.setTemplateEngine({
    compile: (element) => $(element).html(),
    render: (template, data) => Mustache.render(template, data),
  });

  window.formatCurrency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format;

  const popupOptions = {
    width: 660,
    height: 540,
    contentTemplate() {
      const result = $(Mustache.render($('#property-details').html(), currentHouse));
      const button = result.find('#favorites')
        .dxButton(buttonOptions)
        .dxButton('instance');
      setButtonText(button, currentHouse.Favorite);
      return result;
    },
    showTitle: true,
    visible: false,
    dragEnabled: false,
    hideOnOutsideClick: true,
  };

  const buttonOptions = {
    icon: 'favorites',
    width: 260,
    height: 44,
    onClick(e) {
      currentHouse.Favorite = !currentHouse.Favorite;
      setButtonText(e.component, currentHouse.Favorite);
      showToast(currentHouse.Favorite);
    },
  };

  const popoverOptions = {
    showEvent: 'mouseenter',
    hideEvent: 'mouseleave',
    width: 260,
    position: {
      offset: '0, 2',
      at: 'bottom',
      my: 'top',
      collision: 'fit flip',
    },
  };

  function showToast(favoriteState) {
    const message = `This item has been ${
      favoriteState ? 'added to' : 'removed from'
    } the Favorites list!`;
    DevExpress.ui.notify({
      message,
      width: 450,
    }, favoriteState ? 'success' : 'error', 2000);
  }

  function setButtonText(button, isFav) {
    button.option('text', isFav
      ? 'Remove from Favorites'
      : 'Add to Favorites');
  }

  $.each(houses, (index, house) => {
    const template = $(Mustache.render($('#property-item').html(), house));

    template.find(`#popover${house.ID}`)
      .dxPopover($.extend(popoverOptions, {
        target: `#house${house.ID}`,
      }));

    template.find('.item-content').on('dxclick', () => {
      currentHouse = house;
      $('.popup-property-details').remove();
      const container = $('<div />')
        .addClass('popup-property-details')
        .appendTo($('#popup'));
      const popup = container.dxPopup(popupOptions).dxPopup('instance');
      popup.option('title', currentHouse.Address);
      popup.show();
    });

    $('.images').append(template);
  });
});
