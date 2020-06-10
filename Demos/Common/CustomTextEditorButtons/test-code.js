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
    dxDateBox.getInstance($(".dx-datebox")).option("value", new Date("2019/04/22"));
});