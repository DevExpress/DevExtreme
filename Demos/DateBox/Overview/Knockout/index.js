window.onload = function() {
    var now = new Date(),
        eventDateBoxValue = ko.observable(new Date(1981, 3, 27));
    
    var viewModel = {
        dateFormat: {
            type: "date",
            value: now
        },
        timeFormat: {
            type: "time",
            value: now
        },
        dateTimeFormat: {
            type: "datetime",
            value: now
        },
        customFormat: {
            displayFormat: "EEEE, MMM dd",
            value: now
        },
        dateByPicker: {
            pickerType: "rollers",
            value: now
        },
        disabled: {
            type: "datetime",
            disabled: true,
            value: now
        },
        disabledDates: {
            type: "date",
            pickerType: "calendar",
            value: new Date(2017, 0, 3),
            disabledDates: federalHolidays
        },
        clear: {
            type: "time",
            showClearButton: true,
            value: new Date(2015, 11, 1, 6)
        },
        eventDateBoxOptions: {
            applyValueMode: "useButtons",
            value: eventDateBoxValue,
            max: new Date(),
            min: new Date(1900, 0, 1),
            diffInDay:  ko.computed(function() {
                return Math.floor(Math.abs((new Date() - eventDateBoxValue())/(24*60*60*1000))) + " days";
            })
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("date-box-demo"));
};