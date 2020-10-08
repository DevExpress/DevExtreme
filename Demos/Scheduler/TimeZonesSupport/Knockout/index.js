window.onload = function() {
    var dataSource = new DevExpress.data.DataSource({
        store: data,
        filter: ["startDateTimeZone", locations[0].value]
    });

    var currentLocation = ko.observable(locations[0].value);

    var timeZone = ko.computed(function(){
        var result = currentLocation();
        dataSource.filter(["startDateTimeZone", result]);
        return result;
    });

    var viewModel = {
        schedulerOptions: {
            dataSource: dataSource,
            views: ["workWeek"],
            currentView: "workWeek",
            currentDate: new Date(2021, 4, 25),
            height: 600,
            timeZone: timeZone,
            resources: [
                {
                    fieldExpr: "startDateTimeZone",
                    valueExpr: "value",
                    dataSource: locations
                }
            ],
            onAppointmentFormOpening: function(e){
                e.form.itemOption("startDateTimeZone", { visible: true });
                e.form.itemOption("endDateTimeZone", { visible: true });
            }
        },
        locationSwitcherOptions: {
            items: locations,
            width: 200,
            value: currentLocation,
            displayExpr: "text",
            valueExpr: "value"
        }
    };

    ko.applyBindings(viewModel, document.getElementById("scheduler-demo"));
};