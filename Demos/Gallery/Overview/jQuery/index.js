$(() => {
  const galleryWidget = $('#gallery').dxGallery({
    dataSource: gallery,
    height: 300,
    loop: true,
    slideshowDelay: 2000,
    showNavButtons: true,
    showIndicator: true,
  }).dxGallery('instance');

  $('#useLoop').dxCheckBox({
    value: true,
    text: 'Loop mode',
    onValueChanged(data) {
      galleryWidget.option('loop', data.value);
    },
  });

  $('#slideShow').dxCheckBox({
    value: true,
    text: 'Slide show',
    onValueChanged(data) {
      galleryWidget.option('slideshowDelay', data.value ? 2000 : 0);
    },
  });

  $('#showNavButtons').dxCheckBox({
    value: true,
    text: 'Navigation buttons',
    onValueChanged(data) {
      galleryWidget.option('showNavButtons', data.value);
    },
  });

  $('#showIndicator').dxCheckBox({
    value: true,
    text: 'Indicator',
    onValueChanged(data) {
      galleryWidget.option('showIndicator', data.value);
    },
  });
});
