var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    var now = new Date();
    
    $scope.zoomLevels = ["month", "year", "decade", "century"];
    $scope.currentValue = new Date();
    $scope.calendarDisabled = false;
    $scope.isMondayFirst = 0;
    $scope.minDateValue = null;
    $scope.maxDateValue = null;
    $scope.zoomLevel = $scope.zoomLevels[0];
    $scope.cellTemplate = "cell";
    
    $scope.setMinDate = function(e) {
        if(e.value) {
            $scope.minDateValue = new Date(now.getTime() - 1000*60*60*24*3);
        } else {
            $scope.minDateValue = null;
        }
    };
    
    $scope.setMaxDate = function(e) {
        if(e.value) {
            $scope.maxDateValue = new Date(now.getTime() + 1000*60*60*24*3);
        } else {
            $scope.maxDateValue = null;
        }
    };

    $scope.disableWeekend = function(e) {
        if(e.value) {
            $scope.disabledDates = function(data) {
                return data.view === "month" && isWeekend(data.date);
            };
        } else {
            $scope.disabledDates = null;
        }
    };
    
    $scope.setFirstDay = function(e) {
        if(e.value) {
            $scope.firstDay = 1;
        } else {
            $scope.firstDay = 0;
        }
    };
    
    $scope.useCellTemplate = function(e) {
        if(e.value) {
            $scope.cellTemplate = getCellTemplate;
        } else {
            $scope.cellTemplate = "cell";
        }
    };
    
    var holydays = [[1,0], [4,6], [25,11]];
    
    function isWeekend(date) {
        var day = date.getDay();

        return day === 0 || day === 6;
    }

    function getCellTemplate(data) {
        var cssClass = "";
        if(isWeekend(data.date))
            cssClass = "weekend";
    
        $.each(holydays, function(_, item) {
            if(data.date.getDate() === item[0] && data.date.getMonth() === item[1]) {
                cssClass = "holyday";
                return false;
            }
        });
    
        return "<span class='" + cssClass + "'>" + data.text + "</span>";
    }
});