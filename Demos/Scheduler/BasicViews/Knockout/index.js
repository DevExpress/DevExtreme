window.onload = function() {    
    var viewModel = {
        schedulerOptions: {
            timeZone: "America/Los_Angeles",
            dataSource: data,
            views: ["day", "week", "workWeek", "month"],
            currentView: "day",
            currentDate: new Date(2021, 3, 29),
            startDayHour: 9,
            height: 600
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("scheduler-demo"));
};