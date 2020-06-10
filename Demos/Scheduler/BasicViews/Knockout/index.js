window.onload = function() {    
    var viewModel = {
        schedulerOptions: {
            dataSource: data,
            views: ["day", "week", "workWeek", "month"],
            currentView: "day",
            currentDate: new Date(2017, 4, 25),
            startDayHour: 9,
            height: 600
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("scheduler-demo"));
};