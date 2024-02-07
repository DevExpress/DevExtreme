$(() => {
  const direction = 'horizontal';
  const homeTiles = $('#tileview').dxTileView({
    items: homes,
    height: 390,
    baseItemHeight: 120,
    baseItemWidth: 185,
    itemMargin: 10,
    direction,
    itemTemplate(itemData, itemIndex, itemElement) {
      const $image = $('<div>')
        .addClass('image')
        .css('background-image', `url(${itemData.ImageSrc})`);

      itemElement.append($image);
    },
  }).dxTileView('instance');

  $('#use-vertical-direction').dxSelectBox({
    items: ['horizontal', 'vertical'],
    inputAttr: { 'aria-label': 'Direction' },
    value: direction,
    onValueChanged(data) {
      homeTiles.option('direction', data.value);
    },
  });
});
