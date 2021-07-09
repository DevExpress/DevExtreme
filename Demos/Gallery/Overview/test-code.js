testUtils.importAnd(() => 'devextreme/ui/gallery', () => DevExpress.ui.dxGallery, function (dxGallery) {
    return testUtils
        .postponeUntilFound('#gallery', 100, 10000)
        .then(() => {
            var i = dxGallery.getInstance(document.querySelector('#gallery'));
            i.option("slideshowDelay", 0);
            i.goToItem(0, false);
            i._optionChanged = function() {};
        })
        .then(testUtils.postpone(2000));
});
