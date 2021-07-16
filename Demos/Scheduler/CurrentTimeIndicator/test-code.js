testUtils.importAnd(() => 'devextreme/ui/scheduler', () => DevExpress.ui.dxScheduler, function (dxScheduler) {
    var today = new Date();
    today.setHours(11, 35, 0, 0);

    const indicatorTime = new Date(today.setDate(today.getDate() - today.getDay() + 3));

    return testUtils.postponeUntilFound('.dx-scheduler').then(x => {
        var instance = dxScheduler.getInstance(document.querySelector('.dx-scheduler'));
        instance.option('indicatorTime', indicatorTime);
    }).then(testUtils.postpone(2000)).then(()=>{
        dxScheduler.getInstance(document.querySelector('.dx-scheduler')).scrollTo(indicatorTime);
    }).then(testUtils.postpone(2000));
});
