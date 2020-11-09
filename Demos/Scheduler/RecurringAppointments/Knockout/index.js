window.onload = function() {    
    var viewModel = {
        schedulerOptions: {
            timeZone: "America/Los_Angeles",
            dataSource: data,
            views: ["day", "week", "month"],
            currentView: "month",
            currentDate: new Date(2021, 2, 25),
            startDayHour: 9,
            firstDayOfWeek: 1,
            resources: [{
                fieldExpr: "roomId",
                dataSource: resourcesData,
                label: "Room"
            }],
            height: 600
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("scheduler-demo"));
};