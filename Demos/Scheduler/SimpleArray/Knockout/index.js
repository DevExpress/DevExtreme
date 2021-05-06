window.onload = function() {    
    var viewModel = {
        schedulerOptions: {
            timeZone: "America/Los_Angeles",
            dataSource: data,
            views: ["week", "month"],
            currentView: "week",
            currentDate: new Date(2021, 2, 28),
            startDayHour: 9,
            height: 600
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("scheduler-demo"));
};