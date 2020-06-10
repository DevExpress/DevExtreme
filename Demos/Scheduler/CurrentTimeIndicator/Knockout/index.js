window.onload = function() { 
    var showCurrentTimeIndicatorValue = ko.observable(true),
        shadeUntilCurrentTimeValue = ko.observable(true),
        updateIntervalOptionsValue = ko.observable(10),
        updateIntervalInMs = ko.computed(function () {
            return updateIntervalOptionsValue() * 1000;
        });    

    var viewModel = {
        schedulerOptions: {
            dataSource: data,
            views: ["week", "timelineWeek"],
            currentView: "week",
            showCurrentTimeIndicator: showCurrentTimeIndicatorValue,
            showAllDayPanel: false,
            shadeUntilCurrentTime: shadeUntilCurrentTimeValue,
            indicatorUpdateInterval: updateIntervalInMs,
            currentDate: new Date(),
            editing: false,
            height: 600,
            resources: [{
                fieldExpr: "movieId",
                dataSource: moviesData
            }],
            appointmentTemplate: 'appointment-template',
            onContentReady: function(e) {
                var currentHour = new Date().getHours() - 1;

                e.component.scrollToTime(currentHour, 30, new Date());
            },
            onAppointmentClick: function(e) {
                e.cancel = true;
            },
            onAppointmentDblClick: function(e) {
                e.cancel = true;
            }
        },
        showIndicatorOptions: {
            value: showCurrentTimeIndicatorValue
        },
        allowShadingOptions: {
            value: shadeUntilCurrentTimeValue
        },
        updateIntervalOptions: {
            min: 1,
            max: 1200,
            value: updateIntervalOptionsValue,
            step: 10,
            showSpinButtons: true,
            width: "100px",
            format: "#0 s"
        },
        getMovieById: getMovieById
    };

    ko.applyBindings(viewModel, document.getElementById("scheduler-demo"));

    function getMovieById(id) {
        return DevExpress.data.query(moviesData)
            .filter("id", id)
            .toArray()[0];
    }
};