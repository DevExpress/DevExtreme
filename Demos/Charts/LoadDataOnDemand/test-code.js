testUtils.importAnd(() => ['devextreme/viz/chart', 'devextreme/data/data_source'], () => [DevExpress.viz.dxChart, DevExpress.data.DataSource], function (dxChart, DataSource) {
    window.checkReady = function() {
        var dataSource = dxChart.getInstance(document.querySelector("#chart")).getDataSource();
        return dataSource ? dataSource.items().length > 0 : false;
    }
    var dataSourceItems = [{ "date": "2017-03-29", "maxTemp": 7, "minTemp": 4 }, { "date": "2017-03-30", "maxTemp": 2, "minTemp": 1 }, { "date": "2017-03-31", "maxTemp": 3, "minTemp": 2 }, { "date": "2017-04-01", "maxTemp": 7, "minTemp": 3 }, { "date": "2017-04-02", "maxTemp": 10, "minTemp": 3 }, { "date": "2017-04-03", "maxTemp": 7, "minTemp": 3 }, { "date": "2017-04-04", "maxTemp": 10, "minTemp": 7 }, { "date": "2017-04-05", "maxTemp": 10, "minTemp": 5 }, { "date": "2017-04-06", "maxTemp": 6, "minTemp": 5 }, { "date": "2017-04-07", "maxTemp": 4, "minTemp": 0 }, { "date": "2017-04-08", "maxTemp": 11, "minTemp": 2 }, { "date": "2017-04-09", "maxTemp": 13, "minTemp": 5 }, { "date": "2017-04-10", "maxTemp": 18, "minTemp": 11 }, { "date": "2017-04-11", "maxTemp": 13, "minTemp": 8 }, { "date": "2017-04-12", "maxTemp": 10, "minTemp": 6 }, { "date": "2017-04-13", "maxTemp": 8, "minTemp": 5 }, { "date": "2017-04-14", "maxTemp": 10, "minTemp": 3 }, { "date": "2017-04-15", "maxTemp": 11, "minTemp": 6 }, { "date": "2017-04-16", "maxTemp": 17, "minTemp": 13 }, { "date": "2017-04-17", "maxTemp": 10, "minTemp": 6 }];
    var dataSource = new DataSource(dataSourceItems);

    return testUtils
        .postponeUntilFound('#chart', 100, 10000)
        .then(() => {
            const instance = dxChart.getInstance(document.querySelector('#chart'));
            instance.option("dataSource", dataSource);
        })
        .then(testUtils.postpone(2000));
});
