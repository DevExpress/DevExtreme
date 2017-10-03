"use strict";

var BaseAppointmentsStrategy = require("./ui.scheduler.appointments.strategy.base"),
    extend = require("../../core/utils/extend").extend,
    dateUtils = require("../../core/utils/date");

var WEEK_APPOINTMENT_DEFAULT_OFFSET = 25,
    ALLDAY_APPOINTMENT_MIN_OFFSET = 5,
    ALLDAY_APPOINTMENT_MAX_OFFSET = 20,
    APPOINTMENT_COUNT_PER_CELL = 2;

var VerticalRenderingStrategy = BaseAppointmentsStrategy.inherit({
    getDeltaTime: function(args, initialSize, appointment) {
        var deltaTime = 0;

        if(this.isAllDay(appointment)) {
            deltaTime = this._getDeltaWidth(args, initialSize) * 24 * 60 * 60000;
        } else {
            var deltaHeight = args.height - initialSize.height;

            if(deltaHeight < 0) {
                deltaHeight = this._correctOnePxGap(deltaHeight);
            }

            deltaTime = 60000 * Math.round(deltaHeight / this._defaultHeight * this.instance.getAppointmentDurationInMinutes());
        }
        return deltaTime;
    },

    getAppointmentGeometry: function(coordinates) {
        var result,
            allDay = coordinates.allDay;

        if(allDay) {
            result = this._getAllDayAppointmentGeometry(coordinates);
        } else {
            result = this._getSimpleAppointmentGeometry(coordinates);
        }

        return this.callBase(result);
    },

    _getItemPosition: function(item) {
        var allDay = this.isAllDay(item);

        if(allDay) {
            return this.callBase(item);
        }

        var position = this._getAppointmentCoordinates(item),
            result = [];

        for(var j = 0; j < position.length; j++) {
            var height = this.calculateAppointmentHeight(item, position[j]),
                width = this.calculateAppointmentWidth(item, position[j]),
                resultHeight = height,
                appointmentReduced = null,
                multiDaysAppointmentParts = [],
                currentMaxAllowedPosition = position[j].vMax;

            if(this._isMultiDayAppointment(position[j], height)) {

                appointmentReduced = "head";

                resultHeight = this._reduceMultiDayAppointment(height, {
                    top: position[j].top,
                    bottom: currentMaxAllowedPosition
                });

                multiDaysAppointmentParts = this._getAppointmentParts({
                    sourceAppointmentHeight: height,
                    reducedHeight: resultHeight,
                    width: width
                }, position[j]);
            }

            extend(position[j], {
                height: resultHeight,
                width: width,
                allDay: allDay,
                appointmentReduced: appointmentReduced
            });

            result = this._getAppointmentPartsPosition(multiDaysAppointmentParts, position[j], result);
        }

        return result;
    },

    _isMultiDayAppointment: function(position, height) {
        var maxTop = position.vMax,
            result = height > (maxTop - position.top);

        return result;
    },

    _reduceMultiDayAppointment: function(sourceAppointmentHeight, bound) {
        sourceAppointmentHeight = bound.bottom - Math.floor(bound.top);

        return sourceAppointmentHeight;
    },

    _getAppointmentParts: function(appointmentGeometry, appointmentSettings) {
        var tailHeight = appointmentGeometry.sourceAppointmentHeight - appointmentGeometry.reducedHeight,
            width = appointmentGeometry.width,
            result = [],
            currentPartTop = 0,
            left = appointmentSettings.left + this._defaultWidth;

        if(tailHeight) {
            result.push(extend(true, {}, appointmentSettings, {
                top: currentPartTop,
                left: left,
                height: tailHeight,
                width: width,
                appointmentReduced: "tail",
                rowIndex: ++appointmentSettings.rowIndex
            }));
        }

        return result;
    },

    _correctOnePxGap: function(deltaHeight) {
        if(Math.abs(deltaHeight) % this._defaultHeight) {
            deltaHeight--;
        }
        return deltaHeight;
    },

    _getMinuteHeight: function() {
        return this._defaultHeight / this.instance.getAppointmentDurationInMinutes();
    },

    _getCompactLeftCoordinate: function(itemLeft, index) {
        var cellBorderSize = 1,
            cellWidth = this._defaultWidth || this.getAppointmentMinSize();

        return itemLeft + (cellBorderSize + cellWidth) * index;
    },

    _checkLongCompactAppointment: function(item, result) {
        if(item.allDay) {
            this._splitLongCompactAppointment(item, result);
        }

        return result;
    },

    _getSimpleAppointmentGeometry: function(coordinates) {
        var width = this._getAppointmentMaxWidth() / coordinates.count,
            height = coordinates.height,
            top = coordinates.top,
            left = coordinates.left + (coordinates.index * width);

        return { height: height, width: width, top: top, left: left };
    },

    isAllDay: function(appointmentData) {
        var allDay = this.instance.fire("getField", "allDay", appointmentData);

        if(allDay) {
            return true;
        }

        return this.instance.appointmentTakesAllDay(appointmentData);
    },

    _getAppointmentMaxWidth: function() {
        return (this._defaultWidth - WEEK_APPOINTMENT_DEFAULT_OFFSET) || this.getAppointmentMinSize();
    },

    calculateAppointmentWidth: function(appointment, position) {
        if(!this.isAllDay(appointment)) {
            return 0;
        }

        var startDate = new Date(this._startDate(appointment, false, position)),
            endDate = this._endDate(appointment, position),
            cellWidth = this._defaultWidth || this.getAppointmentMinSize();

        startDate = dateUtils.trimTime(startDate);
        var durationInHours = (endDate.getTime() - startDate.getTime()) / 3600000;

        var width = Math.ceil(durationInHours / 24) * cellWidth;
        return width;
    },

    calculateAppointmentHeight: function(appointment, position) {
        var endDate = this._endDate(appointment, position),
            startDate = this._startDate(appointment, false, position),
            allDay = this.instance.fire("getField", "allDay", appointment);

        if(this.isAllDay(appointment)) {
            return 0;
        }

        var durationInMinutes = this._getAppointmentDurationInMs(startDate, endDate, allDay) / 60000;

        var minHeight = this.getAppointmentMinSize(),
            height = Math.round(durationInMinutes * this._getMinuteHeight());

        if(height < minHeight) {
            height = minHeight;
        }

        return height;
    },

    _sortCondition: function(a, b) {
        var allDayCondition = a.allDay - b.allDay,
            result = allDayCondition ? allDayCondition : this._rowCondition(a, b);

        return this._fixUnstableSorting(result, a, b);
    },

    _getDynamicAppointmentCountPerCell: function() {
        return APPOINTMENT_COUNT_PER_CELL;
    },

    _getAllDayAppointmentGeometry: function(coordinates) {
        var config = this._calculateGeometryConfig(coordinates);

        return this._customizeCoordinates(coordinates, config.ratio, config.appointmentCountPerCell, config.offset, config.maxHeight, true);
    },

    _calculateGeometryConfig: function(coordinates) {
        if(!this.instance._allowResizing() || !this.instance._allowAllDayResizing()) {
            coordinates.skipResizing = true;
        }

        var config = this.callBase(coordinates);
        if(coordinates.count <= 2) {
            config.offset = 0;
        }

        return config;
    },

    _getAppointmentCount: function(overlappingMode, coordinates) {
        return overlappingMode !== "auto" && coordinates.count === 1 ? coordinates.count : this._getMaxAppointmentCountPerCell();
    },

    _getDefaultRatio: function(coordinates, appointmentCountPerCell) {
        return (this.instance.fire("getMaxAppointmentsPerCell") && appointmentCountPerCell !== 1) || coordinates.count > APPOINTMENT_COUNT_PER_CELL ? 0.65 : 1;
    },

    _getOffsets: function() {
        return {
            unlimited: ALLDAY_APPOINTMENT_MIN_OFFSET,
            auto: ALLDAY_APPOINTMENT_MAX_OFFSET
        };
    },

    _getMaxHeight: function() {
        return this._allDayHeight || this.getAppointmentMinSize();
    }
});

module.exports = VerticalRenderingStrategy;
