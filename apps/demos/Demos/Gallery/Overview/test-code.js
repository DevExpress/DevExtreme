testUtils.importAnd(() => 'devextreme/ui/gallery', () => DevExpress.ui.dxGallery, (dxGallery) => testUtils
  .postponeUntilFound('#gallery', 100, 5000)
  .then(() => {
    const i = dxGallery.getInstance(document.querySelector('#gallery'));
    i.option('slideshowDelay', 0);
    i.goToItem(0, false);
    // eslint-disable-next-line no-underscore-dangle
    i._optionChanged = function () { };
  }),
);
