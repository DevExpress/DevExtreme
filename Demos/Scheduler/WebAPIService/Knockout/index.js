window.onload = function() {
    var url = "https://js.devexpress.com/Demos/Mvc/api/SchedulerData";
    var viewModel = {
        schedulerOptions: {
            timeZone: "America/Los_Angeles",
            dataSource: DevExpress.data.AspNet.createStore({
                key: "AppointmentId",
                loadUrl: url + "/Get",
                insertUrl: url + "/Post",
                updateUrl: url + "/Put",
                deleteUrl: url + "/Delete",
                onBeforeSend: function(method, ajaxOptions) {
                    ajaxOptions.xhrFields = { withCredentials: true };
                }
            }),
            remoteFiltering: true,
            dateSerializationFormat: "yyyy-MM-ddTHH:mm:ssZ",
            views: ["day", "workWeek", "month"],
            currentView: "day",
            currentDate: new Date(2021, 4, 25),
            startDayHour: 9,
            endDayHour: 19,
            height: 600,
            textExpr: "Text",
            startDateExpr: "StartDate",
            endDateExpr: "EndDate",
            allDayExpr: "AllDay",
            recurrenceRuleExpr: "RecurrenceRule",
            recurrenceExceptionExpr: "RecurrenceException"
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("scheduler-demo"));
};