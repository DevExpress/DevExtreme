$(() => {
  $('#tileview').dxTileView({
    items: homes,
    itemTemplate(itemData, itemIndex, itemElement) {
      const $image = $('<div>')
        .addClass('image')
        .css('background-image', `url(${itemData.ImageSrc})`);

      itemElement.append($image);
    },
  });
});
