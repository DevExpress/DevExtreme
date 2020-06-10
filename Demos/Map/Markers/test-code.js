(function (factory) {
    if (window.Promise && window.System) {
        Promise.all([
            System.import("devextreme/ui/map")
        ]).then(function (args) {
            factory(args[0]);
        });
    } else {
        factory(DevExpress.ui.dxMap);
    }
})(function (dxMap) {
    var instance = dxMap.getInstance($(".dx-map").get(0));
    instance.option("visible", false);
});