$(function() {
    var BASE_PATH = "https://js.devexpress.com/Demos/NetCore/";
    var url = BASE_PATH + "api/SchedulerSignalR";
    var createScheduler = function(index) {
        $("#scheduler" + index).dxScheduler({
        timeZone: "America/Los_Angeles",
            dataSource: DevExpress.data.AspNet.createStore({
                key: "AppointmentId",
                loadUrl: url,
                insertUrl: url,
                updateUrl: url,
                deleteUrl: url,
                onBeforeSend: function(method, ajaxOptions) {
                    ajaxOptions.xhrFields = { withCredentials: true };
                }
            }),
            remoteFiltering: true,
            views: ["day", "workWeek"],
            currentView: "day",
            currentDate: new Date(2021, 4, 25),
            startDayHour: 9,
            endDayHour: 19,
            height: 600,
            dateSerializationFormat: "yyyy-MM-ddTHH:mm:ssZ",
            textExpr: "Text",
            descriptionExpr: "Description",
            startDateExpr: "StartDate",
            endDateExpr: "EndDate",
            allDayExpr: "AllDay"
        });
    };
    createScheduler(1);
    createScheduler(2);

    var store1 = $("#scheduler1").dxScheduler("getDataSource").store();
    var store2 = $("#scheduler2").dxScheduler("getDataSource").store();

    var connection = new signalR.HubConnectionBuilder()
        .withUrl(BASE_PATH + "schedulerSignalRHub", {
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets
        })
        .configureLogging(signalR.LogLevel.Information)
        .build();

    connection.start()
        .then(function () {
            connection.on("update", function (key, data) {
                store1.push([{ type: "update", key: key, data: data }]);
                store2.push([{ type: "update", key: key, data: data }]);
            });

            connection.on("insert", function (data) {
                store1.push([{ type: "insert", data: data }]);
                store2.push([{ type: "insert", data: data }]);
            });

            connection.on("remove", function (key) {
                store1.push([{ type: "remove", key: key }]);
                store2.push([{ type: "remove", key: key }]);
            });
        });
});
