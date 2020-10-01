window.onload = function() {    
    var viewModel = {
        schedulerOptions: {
            dataSource: data,
            views: ["week", "month"],
            currentView: "week",
            currentDate: new Date(2021, 4, 25),
            startDayHour: 9,
            height: 600
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("scheduler-demo"));
};