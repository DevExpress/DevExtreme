(function (factory) {
    if (window.Promise && window.System) {
        Promise.all([
            System.import("devextreme/ui/data_grid"),
            System.import("devextreme/data/data_source")
        ]).then(function (args) {
            factory(args[0], args[1]);
        });
    } else {
        factory(DevExpress.ui.dxDataGrid, DevExpress.data.DataSource);
    }
})(function (dxDataGrid, DataSource) {
    window.checkReady = function() {
        var dataSource = dxDataGrid.getInstance(document.querySelector("#gridContainer")).getDataSource();
        return dataSource ? dataSource.items().length > 0 : false;
    }
    var dataSourceItems = [{"Symbol":"MSFT","Price":38.67105,"DayMax":38.705205,"DayMin":37.1910,"DayOpen":36.5,"LastUpdate":"2018-06-14T07:45:13.806352-07:00","Change":2.17105,"PercentChange":5.95},{"Symbol":"INTC","Price":24.681020,"DayMax":25.344515,"DayMin":24.3530,"DayOpen":24.9,"LastUpdate":"2018-06-14T07:45:13.806352-07:00","Change":-0.218980,"PercentChange":-0.88},{"Symbol":"CSCO","Price":22.904937,"DayMax":23.447501,"DayMin":22.5302,"DayOpen":22.7,"LastUpdate":"2018-06-14T07:45:07.7907561-07:00","Change":0.204937,"PercentChange":0.9},{"Symbol":"SIRI","Price":30.393687,"DayMax":31.318058,"DayMin":30.0958,"DayOpen":30.7,"LastUpdate":"2018-06-14T07:45:07.7907561-07:00","Change":-0.306313,"PercentChange":-1.0},{"Symbol":"AAPL","Price":59.43476,"DayMax":59.898727,"DayMin":57.5554,"DayOpen":54.9,"LastUpdate":"2018-06-14T07:45:07.7907561-07:00","Change":4.53476,"PercentChange":8.26},{"Symbol":"HOKU","Price":108.4490,"DayMax":112.1780,"DayMin":107.80,"DayOpen":121.2,"LastUpdate":"2018-06-14T07:45:07.7907561-07:00","Change":-12.7510,"PercentChange":-10.52},{"Symbol":"ORCL","Price":38.540643,"DayMax":38.868389,"DayMin":37.3478,"DayOpen":37.9,"LastUpdate":"2018-06-14T07:45:03.7595049-07:00","Change":0.640643,"PercentChange":1.69},{"Symbol":"AMAT","Price":17.689245,"DayMax":17.960439,"DayMin":17.259561,"DayOpen":17.5,"LastUpdate":"2018-06-14T07:44:53.7125418-07:00","Change":0.189245,"PercentChange":1.08},{"Symbol":"YHOO","Price":40.126800,"DayMax":41.611920,"DayMin":39.9840,"DayOpen":39.9,"LastUpdate":"2018-06-14T07:45:05.7751192-07:00","Change":0.226800,"PercentChange":0.57},{"Symbol":"LVLT","Price":31.795855,"DayMax":32.483815,"DayMin":31.2130,"DayOpen":32.9,"LastUpdate":"2018-06-14T07:44:45.634382-07:00","Change":-1.104145,"PercentChange":-3.36},{"Symbol":"DELL","Price":20.778536,"DayMax":21.040537,"DayMin":20.219463,"DayOpen":17.9,"LastUpdate":"2018-06-14T07:45:09.8063424-07:00","Change":2.878536,"PercentChange":16.08},{"Symbol":"GOOG","Price":63.642670,"DayMax":64.967630,"DayMin":62.4260,"DayOpen":55.9,"LastUpdate":"2018-06-14T07:45:11.8063377-07:00","Change":7.742670,"PercentChange":13.85}];
    if (window.$ && window.$.connection && window.$.connection.liveUpdateSignalRHub) {
        window.$.connection.liveUpdateSignalRHub.client.updateStockPrice = function () { };
    } else {
        dataSourceItems.forEach(function (item) { for (var key in item) { item[key.charAt(0).toLowerCase() + key.slice(1)] = item[key]; delete item[key]; } });
        if (window.connection && window.connection.methods)
            window.connection.methods["updatestockprice"].splice(0, 1);
    }

    var dataSource = new DataSource(dataSourceItems);
    dxDataGrid.getInstance(document.querySelector("#gridContainer")).option("dataSource", dataSource);
});
