(function (factory) {
    if (window.Promise && window.System) {
        Promise.all([
            System.import("devextreme/ui/gallery")
        ]).then(function (args) {
            factory(args[0]);
        });
    } else {
        factory(DevExpress.ui.dxGallery);
    }
})(function (dxGallery) {
    var i = dxGallery.getInstance(document.getElementById("gallery"));
    i.option("slideshowDelay", 0);
    i.goToItem(0, false);
    i._optionChanged = function() {};
});
