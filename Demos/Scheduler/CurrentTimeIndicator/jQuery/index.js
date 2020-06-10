$(function() {
    var scheduler = $("#scheduler").dxScheduler({
        dataSource: data,
        views: ["week", "timelineWeek"],
        currentView: "week",
        showCurrentTimeIndicator: true,
        showAllDayPanel: false,
        shadeUntilCurrentTime: true,
        currentDate: new Date(),
        editing: false,
        height: 600,
        resources: [{
            fieldExpr: "movieId",
            dataSource: moviesData
        }],
        appointmentTemplate: function(model) {
            var movieInfo = getMovieById(model.appointmentData.movieId) || {};

            return $("<div class='movie'>" +
                "<img src='" + movieInfo.image + "' />" +
                "<div class='movie-text'>" + movieInfo.text + "</div>" + 
                "</div>");
        },
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
    }).dxScheduler("instance");

    $("#show-indicator").dxSwitch({
        value: true,
        onValueChanged: function(e) {
            scheduler.option("showCurrentTimeIndicator", e.value);
        }
    });

    $("#allow-shading").dxSwitch({
        value: true,
        onValueChanged: function(e) {
            scheduler.option("shadeUntilCurrentTime", e.value);
        }
    });

    $("#update-interval").dxNumberBox({
        min: 1,
        max: 1200,
        value: 10,
        step: 10,
        showSpinButtons: true,
        width: "100px",
        format: "#0 s",
        onValueChanged: function(e) {
            scheduler.option("indicatorUpdateInterval", e.value * 1000);
        }
    });

    function getMovieById(id) {
        return DevExpress.data.query(moviesData)
            .filter("id", id)
            .toArray()[0];
    }
});