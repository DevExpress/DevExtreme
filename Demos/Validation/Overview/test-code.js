(function (factory) {
    if (window.Promise && window.System) {
        Promise.all([
            System.import("devextreme/ui/date_box")
        ]).then(function (args) {
            factory(args[0]);
        });
    } else {
        factory(DevExpress.ui.dxDateBox);
    }
})(function (dxDateBox) {
    var instance = dxDateBox.getInstance(document.querySelector(".dx-datebox"));

    instance.option("value", new Date("2015-10-12T06:04:06"));
});