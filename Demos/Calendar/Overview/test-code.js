testUtils.importAnd(()=>'devextreme/ui/calendar', ()=>DevExpress.ui.dxCalendar, function (dxCalendar) {
    return testUtils
        .postponeUntilFound('.dx-calendar', 100, 10000)
        .then(() => {
            const instance = dxCalendar.getInstance(document.querySelector('.dx-calendar'));
            instance.option("value", new Date("Mon Oct 10 2014 14:18:19"));
        })
        .then(testUtils.postpone(2000));
});
