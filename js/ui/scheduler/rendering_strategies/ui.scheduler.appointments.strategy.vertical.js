var BaseAppointmentsStrategy = require("./ui.scheduler.appointments.strategy.base"),
    extend = require("../../../core/utils/extend").extend,
    isNumeric = require("../../../core/utils/type").isNumeric,
    devices = require("../../../core/devices"),
    dateUtils = require("../../../core/utils/date");

var WEEK_APPOINTMENT_DEFAULT_OFFSET = 25,
    WEEK_APPOINTMENT_MOBILE_OFFSET = 50,
    APPOINTMENT_MIN_WIDTH = 5,
    APPOINTMENT_DEFAULT_WIDTH = 50,
    ALLDAY_APPOINTMENT_MIN_VERTICAL_OFFSET = 5,
    ALLDAY_APPOINTMENT_MAX_VERTICAL_OFFSET = 20;

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
            result = this._getVerticalAppointmentGeometry(coordinates);
        }

        return this.callBase(result);
    },

    _getItemPosition: function(item) {
        var allDay = this.isAllDay(item),
            isRecurring = !!this.instance.fire("getField", "recurrenceRule", item);

        if(allDay) {
            return this.callBase(item);
        }

        var position = this._getAppointmentCoordinates(item),
            result = [];

        for(var j = 0; j < position.length; j++) {
            var height = this.calculateAppointmentHeight(item, position[j], isRecurring),
                width = this.calculateAppointmentWidth(item, position[j], isRecurring),
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
            currentPartTop = this.instance.fire("getGroupTop", appointmentSettings.groupIndex),
            offset = this.instance.fire("isGroupedByDate") ? this._defaultWidth * this.instance.fire("getGroupCount") : this._defaultWidth,
            left = appointmentSettings.left + offset;

        if(tailHeight) {
            var minHeight = this.getAppointmentMinSize();

            if(tailHeight < minHeight) {
                tailHeight = minHeight;
            }

            currentPartTop += this.instance.fire("getOffsetByAllDayPanel", appointmentSettings.groupIndex);

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
        this._splitLongCompactAppointment(item, result);

        return result;
    },

    _getVerticalAppointmentGeometry: function(coordinates) {
        var overlappingMode = this.instance.fire("getMaxAppointmentsPerCell");

        if(overlappingMode) {
            var config = this._calculateVerticalGeometryConfig(coordinates);

            return this._customizeVerticalCoordinates(coordinates, config.width, config.appointmentCountPerCell, config.offset);
        } else {
            var width = this._getAppointmentMaxWidth() / coordinates.count,
                height = coordinates.height,
                top = coordinates.top,
                left = coordinates.left + (coordinates.index * width);

            if(width < APPOINTMENT_MIN_WIDTH) {
                width = APPOINTMENT_MIN_WIDTH;
            }

            return { height: height, width: width, top: top, left: left, empty: this._isAppointmentEmpty(height, width) };
        }
    },

    _customizeVerticalCoordinates: function(coordinates, width, appointmentCountPerCell, topOffset, isAllDay) {
        var index = coordinates.index,
            appointmentWidth = Math.max(width / appointmentCountPerCell, width / coordinates.count),
            height = coordinates.height,
            appointmentLeft = coordinates.left + (coordinates.index * appointmentWidth),
            top = coordinates.top,
            compactAppointmentDefaultSize,
            compactAppointmentDefaultOffset;

        if(coordinates.isCompact) {
            compactAppointmentDefaultSize = this.getCompactAppointmentDefaultSize();
            compactAppointmentDefaultOffset = this.getCompactAppointmentDefaultOffset();
            top = coordinates.top + compactAppointmentDefaultOffset;
            appointmentLeft = coordinates.left + (index - appointmentCountPerCell) * (compactAppointmentDefaultSize + compactAppointmentDefaultOffset) + compactAppointmentDefaultOffset;
            appointmentWidth = compactAppointmentDefaultSize;
            width = compactAppointmentDefaultSize;

            this._markAppointmentAsVirtual(coordinates, isAllDay);
        }

        return {
            height: height,
            width: appointmentWidth,
            top: top,
            left: appointmentLeft,
            empty: this._isAppointmentEmpty(height, width)
        };
    },

    _calculateVerticalGeometryConfig: function(coordinates) {
        var overlappingMode = this.instance.fire("getMaxAppointmentsPerCell"),
            offsets = this._getOffsets(),
            appointmentDefaultOffset = this._getAppointmentDefaultOffset();

        var appointmentCountPerCell = this._getAppointmentCount(overlappingMode, coordinates);
        var ratio = this._getDefaultRatio(coordinates, appointmentCountPerCell);
        var maxWidth = this._getMaxWidth();

        if(!appointmentCountPerCell) {
            appointmentCountPerCell = coordinates.count;
            ratio = (maxWidth - offsets.unlimited) / maxWidth;
        }

        var topOffset = (1 - ratio) * maxWidth;
        if(overlappingMode === "auto" || isNumeric(overlappingMode)) {
            ratio = 1;
            maxWidth = maxWidth - appointmentDefaultOffset;
            topOffset = 0;
        }

        return {
            width: ratio * maxWidth,
            appointmentCountPerCell: appointmentCountPerCell,
            offset: topOffset
        };
    },

    _getMaxWidth: function() {
        return this._defaultWidth || this.invoke("getCellWidth");
    },

    isAllDay: function(appointmentData) {
        var allDay = this.instance.fire("getField", "allDay", appointmentData);

        if(allDay) {
            return true;
        }

        return this.instance.appointmentTakesAllDay(appointmentData);
    },

    _getAppointmentMaxWidth: function() {
        var offset = devices.current().deviceType === "desktop" ? WEEK_APPOINTMENT_DEFAULT_OFFSET : WEEK_APPOINTMENT_MOBILE_OFFSET,
            width = this._defaultWidth - offset;

        return width > 0 ? width : this.getAppointmentMinSize();
    },

    calculateAppointmentWidth: function(appointment, position, isRecurring) {
        if(!this.isAllDay(appointment)) {
            return 0;
        }

        var startDate = new Date(this.startDate(appointment, false, position)),
            endDate = this.endDate(appointment, position, isRecurring),
            cellWidth = this._defaultWidth || this.getAppointmentMinSize();

        startDate = dateUtils.trimTime(startDate);
        var durationInHours = (endDate.getTime() - startDate.getTime()) / 3600000;

        var width = Math.ceil(durationInHours / 24) * cellWidth;

        width = this.cropAppointmentWidth(width, cellWidth);
        return width;
    },

    calculateAppointmentHeight: function(appointment, position, isRecurring) {
        var endDate = this.endDate(appointment, position, isRecurring),
            startDate = this.startDate(appointment, false, position),
            allDay = this.instance.fire("getField", "allDay", appointment);

        if(this.isAllDay(appointment)) {
            return 0;
        }

        var fullDuration = this._getAppointmentDurationInMs(startDate, endDate, allDay),
            durationInMinutes = this._adjustDurationByDaylightDiff(fullDuration, startDate, endDate) / 60000;

        var height = durationInMinutes * this._getMinuteHeight();

        return height;
    },

    getDirection: function() {
        return "vertical";
    },

    _sortCondition: function(a, b) {
        var allDayCondition = a.allDay - b.allDay,
            isAllDay = a.allDay && b.allDay,
            condition = this.instance._groupOrientation === "vertical" && isAllDay ? this._columnCondition(a, b) : this._rowCondition(a, b),
            result = allDayCondition ? allDayCondition : condition;
        return this._fixUnstableSorting(result, a, b);
    },

    _getDynamicAppointmentCountPerCell: function() {
        return {
            allDay: this.instance._groupOrientation === "vertical" ? this.callBase() : this.instance.option("_appointmentCountPerCell"),
            simple: this._calculateDynamicAppointmentCountPerCell() || this._getAppointmentMinCount()
        };
    },

    _calculateDynamicAppointmentCountPerCell: function() {
        return Math.floor(this._getAppointmentMaxWidth() / APPOINTMENT_DEFAULT_WIDTH);
    },

    _getAllDayAppointmentGeometry: function(coordinates) {
        var config = this._calculateGeometryConfig(coordinates);

        return this._customizeCoordinates(coordinates, config.height, config.appointmentCountPerCell, config.offset, true);
    },

    _calculateGeometryConfig: function(coordinates) {
        if(!this.instance._allowResizing() || !this.instance._allowAllDayResizing()) {
            coordinates.skipResizing = true;
        }

        var config = this.callBase(coordinates);

        if(coordinates.count <= this._getDynamicAppointmentCountPerCell().allDay) {
            config.offset = 0;
        }

        return config;
    },

    _getAppointmentCount: function(overlappingMode, coordinates) {
        return overlappingMode !== "auto" && (coordinates.count === 1 && !isNumeric(overlappingMode)) ? coordinates.count : this._getMaxAppointmentCountPerCellByType(coordinates.allDay);
    },

    _getDefaultRatio: function(coordinates, appointmentCountPerCell) {
        return coordinates.count > this.instance.option("_appointmentCountPerCell") ? 0.65 : 1;
    },

    _getOffsets: function() {
        return {
            unlimited: ALLDAY_APPOINTMENT_MIN_VERTICAL_OFFSET,
            auto: ALLDAY_APPOINTMENT_MAX_VERTICAL_OFFSET
        };
    },

    _getMaxHeight: function() {
        return this._allDayHeight || this.getAppointmentMinSize();
    },

    _needVerticalGroupBounds: function(allDay) {
        return !allDay;
    },

    _needHorizontalGroupBounds: function() {
        return false;
    }
});

module.exports = VerticalRenderingStrategy;
