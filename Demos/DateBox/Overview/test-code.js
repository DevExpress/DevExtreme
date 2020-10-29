(function(factory) {
    if (window.Promise && window.System) {
        Promise.all([
            System.import("devextreme/ui/date_box")
        ]).then(function (args) {
            factory(args[0]);
        });
    } else {
        factory(DevExpress.ui.dxDateBox);
    }
})(function(dxDateBox) {
    $(".dx-datebox:not(:last)").each(function (_, item) {
        var instance = dxDateBox.getInstance(item);
        instance.option("value", new Date("2014/08/25 16:35:10"));
    });
});
