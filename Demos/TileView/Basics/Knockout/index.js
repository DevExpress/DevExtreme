window.onload = function () {
  const viewModel = {
    tileViewOptions: {
      items: homes,
      itemTemplate(itemData, itemIndex, itemElement) {
        itemElement.append(`<div class="image" style="background-image: url(${itemData.ImageSrc})"></div>`);
      },
    },
  };

  ko.applyBindings(viewModel, document.getElementById('demo'));
};
