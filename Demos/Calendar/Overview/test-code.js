(function (factory) {
    if (window.Promise && window.System) {
        Promise.all([
            System.import("devextreme/ui/calendar")
        ]).then(function (args) {
            factory(args[0]);
        });
    } else {
        factory(DevExpress.ui.dxCalendar);
    }
})(function (dxCalendar) {
    var instance = dxCalendar.getInstance(document.querySelector(".dx-calendar"));
    instance.option("value", new Date("Mon Oct 10 2014 14:18:19"));
});