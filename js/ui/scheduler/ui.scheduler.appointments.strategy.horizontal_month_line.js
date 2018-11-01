var HorizontalAppointmentsStrategy = require("./ui.scheduler.appointments.strategy.horizontal"),
    dateUtils = require("../../core/utils/date"),
    query = require("../../data/query");

var HorizontalMonthLineRenderingStrategy = HorizontalAppointmentsStrategy.inherit({

    calculateAppointmentWidth: function(appointment, position, isRecurring) {
        var startDate = new Date(this.startDate(appointment, false, position)),
            endDate = new Date(this.endDate(appointment, position, isRecurring)),
            cellWidth = this._defaultWidth || this.getAppointmentMinSize();


        startDate = dateUtils.trimTime(startDate);
        var fullDuration = endDate.getTime() - startDate.getTime();
        fullDuration = this._adjustDurationByDaylightDiff(fullDuration, startDate, endDate);

        var durationInHours = (fullDuration) / 3600000;
        var width = Math.ceil(durationInHours / 24) * cellWidth;

        width = this.cropAppointmentWidth(width, cellWidth);

        return width;
    },

    getDeltaTime: function(args, initialSize) {
        var deltaWidth = this._getDeltaWidth(args, initialSize);

        return 24 * 60 * 60000 * deltaWidth;
    },

    isAllDay: function() {
        return false;
    },

    createTaskPositionMap: function(items, skipSorting) {
        if(!skipSorting) {
            this.instance.getAppointmentsInstance()._sortAppointmentsByStartDate(items);
        }

        return this.callBase(items);
    },

    _getSortedPositions: function(map, skipSorting) {
        var result = this.callBase(map);

        if(!skipSorting) {
            result = query(result).sortBy("top").thenBy("left").thenBy("i").toArray();
        }

        return result;
    },

    needCorrectAppointmentDates: function() {
        return false;
    }
});

module.exports = HorizontalMonthLineRenderingStrategy;
