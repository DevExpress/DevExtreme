testUtils.importAnd(() => 'devextreme/ui/scheduler', () => DevExpress.ui.dxScheduler, function (dxScheduler) {
    const today = new Date();
    today.setHours(11, 35, 0, 0);

    const indicatorTime = new Date(today.setDate(today.getDate() - today.getDay() + 3));

    return testUtils.postponeUntilFound('.dx-scheduler').then(() => {
        const instance = dxScheduler.getInstance(document.querySelector('.dx-scheduler'));
        instance.option('indicatorTime', indicatorTime);
        testUtils.postpone(2000).then(() => {
            instance.scrollTo(indicatorTime);
        })
    })
});
