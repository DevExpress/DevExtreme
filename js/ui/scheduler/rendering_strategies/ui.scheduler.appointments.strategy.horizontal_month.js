var extend = require("../../../core/utils/extend").extend,
    HorizontalMonthLineAppointmentsStrategy = require("./ui.scheduler.appointments.strategy.horizontal_month_line");

var MONTH_APPOINTMENT_HEIGHT_RATIO = 0.6,
    MONTH_APPOINTMENT_MIN_OFFSET = 26,
    MONTH_APPOINTMENT_MAX_OFFSET = 30,
    MONTH_DROPDOWN_APPOINTMENT_MIN_RIGHT_OFFSET = 36,
    MONTH_DROPDOWN_APPOINTMENT_MAX_RIGHT_OFFSET = 60;

var HorizontalMonthRenderingStrategy = HorizontalMonthLineAppointmentsStrategy.inherit({

    _getAppointmentParts: function(appointmentGeometry, appointmentSettings, startDate) {
        var deltaWidth = appointmentGeometry.sourceAppointmentWidth - appointmentGeometry.reducedWidth,
            height = appointmentGeometry.height,
            fullWeekAppointmentWidth = this._getFullWeekAppointmentWidth(appointmentSettings.groupIndex),
            maxAppointmentWidth = this._getMaxAppointmentWidth(startDate),
            longPartCount = Math.ceil((deltaWidth) / fullWeekAppointmentWidth) - 1,
            tailWidth = Math.floor(deltaWidth % fullWeekAppointmentWidth) || fullWeekAppointmentWidth,
            result = [],
            totalWidth = appointmentGeometry.reducedWidth + tailWidth,
            currentPartTop = appointmentSettings.top + this._defaultHeight,
            left = this._calculateMultiWeekAppointmentLeftOffset(appointmentSettings.hMax, fullWeekAppointmentWidth);

        if(this.instance._groupOrientation === "vertical") {
            left += this.instance.fire("getWorkSpaceDateTableOffset");
        }
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

    _getFullWeekAppointmentWidth: function(groupIndex) {
        this.instance.fire("getFullWeekAppointmentWidth", {
            groupIndex: groupIndex,
            callback: (function(width) {
                this._maxFullWeekAppointmentWidth = width;
            }).bind(this)
        });

        return this._maxFullWeekAppointmentWidth;
    },

    _getAppointmentDefaultHeight: function() {
        return this._getAppointmentHeightByTheme();
    },

    _getAppointmentMinHeight: function() {
        return this._getAppointmentDefaultHeight();
    },

    _checkLongCompactAppointment: function(item, result) {
        this._splitLongCompactAppointment(item, result);

        return result;
    },

    _columnCondition: function(a, b) {
        var isSomeEdge = this._isSomeEdge(a, b);

        var columnCondition = this._normalizeCondition(a.left, b.left, isSomeEdge),
            rowCondition = this._normalizeCondition(a.top, b.top, isSomeEdge),
            cellPositionCondition = this._normalizeCondition(a.cellPosition, b.cellPosition, isSomeEdge);

        return rowCondition ? rowCondition : columnCondition ? columnCondition : cellPositionCondition ? cellPositionCondition : a.isStart - b.isStart;
    },

    createTaskPositionMap: function(items) {
        return this.callBase(items, true);
    },

    _getSortedPositions: function(map) {
        return this.callBase(map, true);
    },

    _customizeAppointmentGeometry: function(coordinates) {
        var config = this._calculateGeometryConfig(coordinates);

        return this._customizeCoordinates(coordinates, config.height, config.appointmentCountPerCell, config.offset);
    },

    _getDefaultRatio: function() {
        return MONTH_APPOINTMENT_HEIGHT_RATIO;
    },

    _getOffsets: function() {
        return {
            unlimited: MONTH_APPOINTMENT_MIN_OFFSET,
            auto: MONTH_APPOINTMENT_MAX_OFFSET
        };
    },

    getCompactAppointmentGroupMaxWidth: function(intervalCount) {
        var offset = intervalCount > 1 ? MONTH_DROPDOWN_APPOINTMENT_MAX_RIGHT_OFFSET : MONTH_DROPDOWN_APPOINTMENT_MIN_RIGHT_OFFSET;
        return this.getDefaultCellWidth() - offset;
    },

    needCorrectAppointmentDates: function() {
        return false;
    },

    _needVerticalGroupBounds: function() {
        return false;
    },

    _needHorizontalGroupBounds: function() {
        return true;
    }
});

module.exports = HorizontalMonthRenderingStrategy;
