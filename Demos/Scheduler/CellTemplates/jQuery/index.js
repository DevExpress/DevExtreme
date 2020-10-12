$(function () {
    $("#scheduler").dxScheduler({
        dataSource: data,
        views: ["workWeek", "month"],
        currentView: "workWeek",
        currentDate: new Date(2021, 4, 25),
        firstDayOfWeek: 0,
        startDayHour: 9,
        endDayHour: 19,
        showAllDayPanel: false,
        height: 600,

        dataCellTemplate: function(itemData, itemIndex, itemElement) {
            var date = itemData.startDate;
            var isDisabled = isHoliday(date) || isWeekend(date);
            var element = $(`<div>${itemData.text}</div>`);

            if (isDisabled) {
                element.addClass('disable-date');
            } else if (isDinner(date)) {
                element.addClass('dinner');
            }

            return itemElement.append(element);
        },

        dateCellTemplate: function(itemData, itemIndex, itemElement) {
            var element = $(`<div>${itemData.text}</div>`);

            if (isWeekend(itemData.date)) {
                element.addClass('disable-date');
            }

            return itemElement.append(element);
        },

        timeCellTemplate: function(itemData, itemIndex, itemElement) {
            var element = $(`<div>${itemData.text}</div>`);
            var date = itemData.date;

            if (isDinner(date)) {
                element.addClass('dinner');
            }
            if (hasCoffeeCupIcon(date)) {
                element.append('<div class="cafe" />');
            }

            return itemElement.append(element);
        },

        onAppointmentFormOpening: function(e) {
            var startDate = new Date(e.appointmentData.startDate);
            if(!isValidAppointmentDate(startDate)) {
                e.cancel = true;
                notifyDisableDate();
            }
            applyDisableDatesToDateEditors(e.form);
        },

        onAppointmentAdding: function(e) {
            if(!isValidAppointment(e.component, e.appointmentData)) {
                e.cancel = true;
                notifyDisableDate();
            }
        },

        onAppointmentUpdating: function(e) {
            if(!isValidAppointment(e.component, e.newData)) {
                e.cancel = true;
                notifyDisableDate();
            }
        }
    });
});

var dinnerTime = { from: 12, to: 13 };
var holidays = [
    new Date(2021, 4, 27),
    new Date(2021, 6, 4)
];

function notifyDisableDate() {
    DevExpress.ui.notify("Cannot create or move an appointment/event to disabled time/date regions.", "warning", 1000);
}

function isValidAppointment(component, appointmentData) {
    var startDate = new Date(appointmentData.startDate);
    var endDate = new Date(appointmentData.endDate);
    var cellDuration = component.option('cellDuration');
    return isValidAppointmentInterval(startDate, endDate, cellDuration);
}

function isValidAppointmentInterval(startDate, endDate, cellDuration) {
    var edgeEndDate = new Date(endDate.getTime() - 1);

    if (!isValidAppointmentDate(edgeEndDate)) {
        return false;
    }

    var durationInMs = cellDuration * 60 * 1000;
    var date = startDate;
    while (date <= endDate) {
        if (!isValidAppointmentDate(date)) {
            return false;
        }
        var newDateTime = date.getTime() + durationInMs - 1;
        date.setTime(newDateTime);
    }

    return true;
}

function isValidAppointmentDate(date) {
    return !isHoliday(date) && !isDinner(date) && !isWeekend(date);
}

function isHoliday(date) {
    var localeDate = date.toLocaleDateString();
    return holidays.filter(function(holiday) {
        return holiday.toLocaleDateString() === localeDate;
    }).length > 0;
}

function isWeekend(date) {
    var day = date.getDay();
    return day === 0 || day === 6;
}

function isDinner(date) {
    var hours = date.getHours();
    return hours >= dinnerTime.from && hours < dinnerTime.to;
}

function hasCoffeeCupIcon(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();

    return hours === dinnerTime.from && minutes === 0;
}

function applyDisableDatesToDateEditors(form) {
    var startDateEditor = form.getEditor('startDate');
    startDateEditor.option('disabledDates', holidays);

    var endDateEditor = form.getEditor('endDate');
    endDateEditor.option('disabledDates', holidays);
}
