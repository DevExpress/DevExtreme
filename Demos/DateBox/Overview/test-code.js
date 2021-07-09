testUtils.importAnd(() => 'devextreme/ui/date_box', () => DevExpress.ui.dxDateBox, function (dxDateBox) {
    return testUtils
        .postponeUntilFound('.dx-datebox', 100, 10000)
        .then(() => testUtils.findElements(".dx-datebox").slice(0, -1).forEach(x=>
            dxDateBox.getInstance(x).option("value", new Date("2014/08/25 16:35:10"))
        ))
        .then(testUtils.postpone(2000));
});
