"use strict";

var HorizontalAppointmentsStrategy = require("./ui.scheduler.appointments.strategy.horizontal"),
    dateUtils = require("../../core/utils/date"),
    query = require("../../data/query");

var HorizontalMonthLineRenderingStrategy = HorizontalAppointmentsStrategy.inherit({

    calculateAppointmentWidth: function(appointment, position, isRecurring) {
        var startDate = new Date(this._startDate(appointment, false, position)),
            endDate = new Date(this._endDate(appointment, position, isRecurring)),
            cellWidth = this._defaultWidth || this.getAppointmentMinSize();

        startDate = dateUtils.trimTime(startDate);

        var durationInHours = (endDate.getTime() - startDate.getTime()) / 3600000;

        return Math.ceil(durationInHours / 24) * cellWidth;
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
    }
});

module.exports = HorizontalMonthLineRenderingStrategy;
