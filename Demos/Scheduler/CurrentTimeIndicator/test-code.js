(function (factory) {
    if (window.Promise && window.System) {
        Promise.all([
            System.import("devextreme/ui/scheduler")
        ]).then(function (args) {
            factory(args[0]);
        });
    } else {
        factory(DevExpress.ui.dxScheduler);
    }
})(function (dxScheduler) {
    var instance = dxScheduler.getInstance(document.querySelector(".dx-scheduler"));

    var today = new Date();
    today.setHours(11, 35, 0, 0);
    
    const indicatorTime = new Date(today.setDate(today.getDate() - today.getDay() + 3));
    instance.option("indicatorTime", indicatorTime);

    return new Promise(function(resolve) {
        setTimeout(function() {
            instance.scrollTo(indicatorTime);
            resolve();
        }, 1000);
    });
});
