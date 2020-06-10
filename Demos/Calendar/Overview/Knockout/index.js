window.onload = function() {
    var zoomLevels = ["month", "year", "decade", "century"],
        holydays = [[1,0], [4,6], [25,11]],
        useCellTemplate = ko.observable(false),
        disableWeekend = ko.observable(false),
        cellTemplate = ko.computed(function() {
            if (useCellTemplate())
                return getCellTemplate;
            else
                return "cell";
        }),
        disabledDates = ko.computed(function() {
            if(disableWeekend()) {
                return isDateDisabled;
            } else {
                return null;
            }
        }),
        viewModel = {
            now: new Date(),
            zoomLevels: zoomLevels,
            currentValue: ko.observable(new Date()),
            calendarDisabled: ko.observable(false),
            isMondayFirst: ko.observable(false),
            useMinDate: ko.observable(false),
            useMaxDate: ko.observable(false),
            disableWeekend: disableWeekend,
            disabledDates: disabledDates,
            zoomLevel: ko.observable(zoomLevels[0]),
            cellTemplate: cellTemplate,
            useCellTemplate: useCellTemplate
        };
    
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

    function isDateDisabled(data) {
        return data.view === "month" && isWeekend(data.date);
    }
    
    ko.applyBindings(viewModel, document.getElementById("calendar-demo"));
};