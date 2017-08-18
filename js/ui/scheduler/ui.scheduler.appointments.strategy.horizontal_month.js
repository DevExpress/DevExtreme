"use strict";

var noop = require("../../core/utils/common").noop,
    extend = require("../../core/utils/extend").extend,
    HorizontalMonthLineAppointmentsStrategy = require("./ui.scheduler.appointments.strategy.horizontal_month_line");

var MONTH_APPOINTMENT_HEIGHT_RATIO = 0.6,
    MONTH_APPOINTMENT_MIN_OFFSET = 21,
    MONTH_APPOINTMENT_MAX_OFFSET = 30;

var HorizontalMonthRenderingStrategy = HorizontalMonthLineAppointmentsStrategy.inherit({

    _getAppointmentParts: function(appointmentGeometry, appointmentSettings, startDate, groupIndex) {
        var deltaWidth = appointmentGeometry.sourceAppointmentWidth - appointmentGeometry.reducedWidth,
            height = appointmentGeometry.height,
            fullWeekAppointmentWidth = this._getFullWeekAppointmentWidth(groupIndex),
            maxAppointmentWidth = this._getMaxAppointmentWidth(startDate),
            longPartCount = Math.ceil((deltaWidth) / fullWeekAppointmentWidth) - 1,
            tailWidth = Math.floor(deltaWidth % fullWeekAppointmentWidth) || fullWeekAppointmentWidth,
            result = [],
            totalWidth = appointmentGeometry.reducedWidth + tailWidth,
            currentPartTop = appointmentSettings.top + this._defaultHeight,
            left = this._calculateMultiWeekAppointmentLeftOffset(appointmentSettings.hMax, fullWeekAppointmentWidth);

        for(var i = 0; i < longPartCount; i++) {
            if(totalWidth > maxAppointmentWidth) {
                break;
            }

            result.push(extend(true, {}, appointmentSettings, {
                top: currentPartTop,
                left: left,
                height: height,
                width: fullWeekAppointmentWidth,
                appointmentReduced: "body",
                rowIndex: ++appointmentSettings.rowIndex,
                cellIndex: 0
            }));

            currentPartTop += this._defaultHeight;
            totalWidth += fullWeekAppointmentWidth;
        }

        if(tailWidth) {
            if(this._isRtl()) {
                left = left + (fullWeekAppointmentWidth - tailWidth);
            }

            result.push(extend(true, {}, appointmentSettings, {
                top: currentPartTop,
                left: left,
                height: height,
                width: tailWidth,
                appointmentReduced: "tail",
                rowIndex: ++appointmentSettings.rowIndex,
                cellIndex: 0
            }));
        }

        return result;
    },

    _calculateMultiWeekAppointmentLeftOffset: function(max, width) {
        return this._isRtl() ? max : max - width;
    },

    _correctRtlCoordinatesParts: noop,

    _getFullWeekAppointmentWidth: function(groupIndex) {
        this.instance.fire("getFullWeekAppointmentWidth", {
            groupIndex: groupIndex,
            callback: (function(width) {
                this._maxFullWeekAppointmentWidth = width;
            }).bind(this)
        });

        return this._maxFullWeekAppointmentWidth;
    },

    _getCompactLeftCoordinate: function(itemLeft, index) {
        var cellWidth = this._defaultWidth || this.getAppointmentMinSize();

        return itemLeft + cellWidth * index;
    },

    _checkLongCompactAppointment: function(item, result) {
        this._splitLongCompactAppointment(item, result);

        return result;
    },

    _customizeAppointmentGeometry: function(coordinates) {
        var overlappingMode = this.instance.fire("getMaxAppointmentsPerCell");

        var appointmentCountPerCell = this._getAppointmentCountPerCell();
        var ratio = MONTH_APPOINTMENT_HEIGHT_RATIO;
        var maxHeight = this._defaultHeight || this.getAppointmentMinSize();

        if(!appointmentCountPerCell) {
            appointmentCountPerCell = coordinates.count;
            ratio = (maxHeight - MONTH_APPOINTMENT_MIN_OFFSET) / maxHeight;
        }
        if(overlappingMode === "auto") {
            ratio = (maxHeight - MONTH_APPOINTMENT_MAX_OFFSET) / maxHeight;
        }

        return this._customizeCoordinates(coordinates, ratio, appointmentCountPerCell, maxHeight);
    },

    createTaskPositionMap: function(items) {
        return this.callBase(items, true);
    },

    _getSortedPositions: function(map) {
        return this.callBase(map, true);
    }
});

module.exports = HorizontalMonthRenderingStrategy;
