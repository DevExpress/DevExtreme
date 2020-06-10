var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.showCurrentTimeIndicatorValue = true;
    $scope.shadeUntilCurrentTimeValue = true;
    $scope.updateIntervalOptionsValue = 10;
    $scope.updateIntervalInMs = function() {
        return $scope.updateIntervalOptionsValue * 1000;
    };

    $scope.schedulerOptions = {
        dataSource: data,
        views: ["week", "timelineWeek"],
        currentView: "week",
        bindingOptions: {
            showCurrentTimeIndicator: "showCurrentTimeIndicatorValue",
            indicatorUpdateInterval: "updateIntervalInMs()",
            shadeUntilCurrentTime: "shadeUntilCurrentTimeValue"
        },
        showAllDayPanel: false,
        currentDate: new Date(),
        editing: false,
        height: 600,
        resources: [{
            fieldExpr: "movieId",
            dataSource: moviesData
        }],
        appointmentTemplate: "appointment-template",
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
    };

    $scope.showIndicatorOptions = {
        bindingOptions: {
            value: "showCurrentTimeIndicatorValue"
        }
    };

    $scope.allowShadingOptions = {
        bindingOptions: {
            value: "shadeUntilCurrentTimeValue"
        }
    };

    $scope.updateIntervalOptions = {
        min: 1,
        max: 1200,
        bindingOptions: {
            value: "updateIntervalOptionsValue"
        },
        step: 10,
        showSpinButtons: true,
        width: "100px",
        format: "#0 s"
    };

    $scope.getMovieById = getMovieById;

    function getMovieById(id) {
        return DevExpress.data.query(moviesData)
            .filter("id", id)
            .toArray()[0];
    }
});