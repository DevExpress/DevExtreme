window.onload = function () {
  const direction = ko.observable('horizontal');

  const viewModel = {
    tileViewOptions: {
      items: homes,
      height: 390,
      baseItemHeight: 120,
      baseItemWidth: 185,
      width: '100%',
      itemMargin: 10,
      direction,
      itemTemplate(itemData, itemIndex, itemElement) {
        const $image = $('<div>')
          .addClass('image')
          .css('background-image', `url(${itemData.ImageSrc})`);

        itemElement.append($image);
      },
    },

    directionOptions: {
      items: ['horizontal', 'vertical'],
      value: direction,
      onValueChanged(e) {
        direction(e.value);
      },
    },

  };

  ko.applyBindings(viewModel, document.getElementById('demo'));
};
