$(() => {
  $('#tileview').dxTileView({
    items: homes,
    itemTemplate(itemData, itemIndex, itemElement) {
      itemElement.append(`<div class="image" style="background-image: url(${itemData.ImageSrc})"></div>`);
    },
  });
});
