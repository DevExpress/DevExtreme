"use strict";

var BaseAppointmentsStrategy = require("./ui.scheduler.appointments.strategy.base"),
    dateUtils = require("../../core/utils/date");

var MAX_APPOINTMENT_HEIGHT = 100,
    BOTTOM_CELL_GAP = 20,

    toMs = dateUtils.dateToMilliseconds;

var HorizontalRenderingStrategy = BaseAppointmentsStrategy.inherit({
    _needVerifyItemSize: function() {
        return true;
    },

    calculateAppointmentWidth: function(appointment, position) {
        var cellWidth = this._defaultWidth || this.getAppointmentMinSize(),
            allDay = this.instance.fire("getField", "allDay", appointment),
            minWidth = this.getAppointmentMinSize(),
            width;

        var startDate = this._startDate(appointment, false, position),
            endDate = this._endDate(appointment, position),
            appointmentDuration = this._getAppointmentDurationInMs(startDate, endDate, allDay);

        var cellDuration = this.instance.getAppointmentDurationInMinutes() * toMs("minute"),
            durationInCells = appointmentDuration / cellDuration;

        width = durationInCells * cellWidth;

        if(width < minWidth) {
            width = minWidth;
        }

        return width;
    },

    getAppointmentGeometry: function(coordinates) {
        var result = this._customizeAppointmentGeometry(coordinates);

        return this.callBase(result);
    },

    _customizeAppointmentGeometry: function(coordinates) {
        var cellHeight = (this._defaultHeight || this.getAppointmentMinSize()) - BOTTOM_CELL_GAP,
            height = cellHeight / coordinates.count;

        if(height > MAX_APPOINTMENT_HEIGHT) {
            height = MAX_APPOINTMENT_HEIGHT;
        }

        var top = coordinates.top + coordinates.index * height;

        return {
            height: height,
            width: coordinates.width,
            top: top,
            left: coordinates.left
        };
    },

    _correctRtlCoordinatesParts: function(coordinates, width) {
        for(var i = 1; i < coordinates.length; i++) {
            coordinates[i].left -= width;
        }

        return coordinates;
    },

    _sortCondition: function(a, b) {
        var result = this._columnCondition(a, b);
        return this._fixUnstableSorting(result, a, b);
    },

    _getMaxAppointmentWidth: function(startDate) {
        var result;
        this.instance.fire("getMaxAppointmentWidth", {
            date: startDate,
            callback: function(width) {
                result = width;
            }
        });

        return result;
    },

    getDeltaTime: function(args, initialSize) {
        var deltaTime = 0,
            deltaWidth = args.width - initialSize.width;

        deltaTime = 60000 * Math.round(deltaWidth / this._defaultWidth * this.instance.getAppointmentDurationInMinutes());

        return deltaTime;
    },

    isAllDay: function(appointmentData) {
        return this.instance.fire("getField", "allDay", appointmentData);
    }
});

module.exports = HorizontalRenderingStrategy;
