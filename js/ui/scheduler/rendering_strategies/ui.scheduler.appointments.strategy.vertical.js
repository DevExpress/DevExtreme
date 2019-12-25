import BaseAppointmentsStrategy from './ui.scheduler.appointments.strategy.base';
import { extend } from '../../../core/utils/extend';
import { isNumeric } from '../../../core/utils/type';
import devices from '../../../core/devices';
import dateUtils from '../../../core/utils/date';

const WEEK_APPOINTMENT_DEFAULT_OFFSET = 25,
    WEEK_APPOINTMENT_MOBILE_OFFSET = 50,

    APPOINTMENT_MIN_WIDTH = 5,

    ALLDAY_APPOINTMENT_MIN_VERTICAL_OFFSET = 5,
    ALLDAY_APPOINTMENT_MAX_VERTICAL_OFFSET = 20;

const toMs = dateUtils.dateToMilliseconds;

class VerticalRenderingStrategy extends BaseAppointmentsStrategy {
    getDeltaTime(args, initialSize, appointment) {
        var deltaTime = 0;

        if(this.isAllDay(appointment)) {
            deltaTime = this._getDeltaWidth(args, initialSize) * toMs('day');
        } else {
            var deltaHeight = args.height - initialSize.height;
            deltaTime = toMs('minute') * Math.round(deltaHeight / this.getDefaultCellHeight() * this.instance.getAppointmentDurationInMinutes());
        }
        return deltaTime;
    }

    _correctCompactAppointmentCoordinatesInAdaptive(coordinates, isAllDay) {
        if(isAllDay) {
            super._correctCompactAppointmentCoordinatesInAdaptive(coordinates, isAllDay);
        } else if(this._getMaxAppointmentCountPerCellByType() === 0) {
            const cellHeight = this.getDefaultCellHeight();
            const cellWidth = this.getDefaultCellWidth();

            coordinates.top += (cellHeight - this.getDropDownButtonAdaptiveSize()) / 2;
            coordinates.left += (cellWidth - this.getDropDownButtonAdaptiveSize()) / 2;
        }
    }

    getAppointmentGeometry(coordinates) {
        let geometry = null;
        if(coordinates.allDay) {
            geometry = this._getAllDayAppointmentGeometry(coordinates);
        } else {
            geometry = this._isAdaptive() && coordinates.isCompact ? this._getAdaptiveGeometry(coordinates) : this._getVerticalAppointmentGeometry(coordinates);
        }

        return super.getAppointmentGeometry(geometry);
    }

    _getAdaptiveGeometry(coordinates) {
        const config = this._calculateGeometryConfig(coordinates);
        return this._customizeCoordinates(coordinates, config.height, config.appointmentCountPerCell, config.offset);
    }

    _getItemPosition(item) {
        var allDay = this.isAllDay(item),
            isRecurring = !!this.instance.fire('getField', 'recurrenceRule', item);

        if(allDay) {
            return super._getItemPosition(item);
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

                appointmentReduced = 'head';

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
    }

    _isMultiDayAppointment(position, height) {
        var maxTop = position.vMax,
            result = height > (maxTop - position.top);

        return result;
    }

    _reduceMultiDayAppointment(sourceAppointmentHeight, bound) {
        sourceAppointmentHeight = bound.bottom - Math.floor(bound.top);

        return sourceAppointmentHeight;
    }

    _getAppointmentParts(appointmentGeometry, appointmentSettings) {
        var tailHeight = appointmentGeometry.sourceAppointmentHeight - appointmentGeometry.reducedHeight,
            width = appointmentGeometry.width,
            result = [],
            currentPartTop = this.instance.fire('getGroupTop', appointmentSettings.groupIndex),
            offset = this.instance.fire('isGroupedByDate') ? this.getDefaultCellWidth() * this.instance.fire('getGroupCount') : this.getDefaultCellWidth(),
            left = appointmentSettings.left + offset;

        if(tailHeight) {
            var minHeight = this.getAppointmentMinSize();

            if(tailHeight < minHeight) {
                tailHeight = minHeight;
            }

            currentPartTop += this.instance.fire('getOffsetByAllDayPanel', appointmentSettings.groupIndex);

            result.push(extend(true, {}, appointmentSettings, {
                top: currentPartTop,
                left: left,
                height: tailHeight,
                width: width,
                appointmentReduced: 'tail',
                rowIndex: ++appointmentSettings.rowIndex
            }));
        }

        return result;
    }

    _getMinuteHeight() {
        return this.getDefaultCellHeight() / this.instance.getAppointmentDurationInMinutes();
    }

    _getCompactLeftCoordinate(itemLeft, index) {
        var cellBorderSize = 1,
            cellWidth = this.getDefaultCellWidth() || this.getAppointmentMinSize();

        return itemLeft + (cellBorderSize + cellWidth) * index;
    }

    _checkLongCompactAppointment(item, result) {
        this._splitLongCompactAppointment(item, result);

        return result;
    }

    _getVerticalAppointmentGeometry(coordinates) {
        var overlappingMode = this.instance.fire('getMaxAppointmentsPerCell');

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
    }

    _customizeVerticalCoordinates(coordinates, width, appointmentCountPerCell, topOffset, isAllDay) {
        var index = coordinates.index,
            appointmentWidth = Math.max(width / appointmentCountPerCell, width / coordinates.count),
            height = coordinates.height,
            appointmentLeft = coordinates.left + (coordinates.index * appointmentWidth),
            top = coordinates.top,
            compactAppointmentDefaultSize,
            compactAppointmentDefaultOffset;

        if(coordinates.isCompact) {
            compactAppointmentDefaultSize = this.getCompactAppointmentDefaultWidth();
            compactAppointmentDefaultOffset = this.getCompactAppointmentLeftOffset();
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
    }

    _calculateVerticalGeometryConfig(coordinates) {
        var overlappingMode = this.instance.fire('getMaxAppointmentsPerCell'),
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
        if(overlappingMode === 'auto' || isNumeric(overlappingMode)) {
            ratio = 1;
            maxWidth = maxWidth - appointmentDefaultOffset;
            topOffset = 0;
        }

        return {
            width: ratio * maxWidth,
            appointmentCountPerCell: appointmentCountPerCell,
            offset: topOffset
        };
    }

    _getMaxWidth() {
        return this.getDefaultCellWidth() || this.invoke('getCellWidth');
    }

    isAllDay(appointmentData) {
        var allDay = this.instance.fire('getField', 'allDay', appointmentData);

        if(allDay) {
            return true;
        }

        return this.instance.appointmentTakesAllDay(appointmentData);
    }

    _getAppointmentMaxWidth() {
        var offset = devices.current().deviceType === 'desktop' && !this.instance.fire('isAdaptive') ? WEEK_APPOINTMENT_DEFAULT_OFFSET : WEEK_APPOINTMENT_MOBILE_OFFSET,
            width = this.getDefaultCellWidth() - offset;

        return width > 0 ? width : this.getAppointmentMinSize();
    }

    calculateAppointmentWidth(appointment, position, isRecurring) {
        if(!this.isAllDay(appointment)) {
            return 0;
        }

        var startDate = new Date(this.startDate(appointment, false, position)),
            endDate = this.endDate(appointment, position, isRecurring),
            cellWidth = this.getDefaultCellWidth() || this.getAppointmentMinSize();

        startDate = dateUtils.trimTime(startDate);
        var durationInHours = (endDate.getTime() - startDate.getTime()) / toMs('hour');

        var width = Math.ceil(durationInHours / 24) * cellWidth;

        width = this.cropAppointmentWidth(width, cellWidth);
        return width;
    }

    calculateAppointmentHeight(appointment, position, isRecurring) {
        var endDate = this.endDate(appointment, position, isRecurring),
            startDate = this.startDate(appointment, false, position),
            allDay = this.instance.fire('getField', 'allDay', appointment);

        if(this.isAllDay(appointment)) {
            return 0;
        }

        var fullDuration = this._getAppointmentDurationInMs(startDate, endDate, allDay),
            durationInMinutes = this._adjustDurationByDaylightDiff(fullDuration, startDate, endDate) / toMs('minute');

        var height = durationInMinutes * this._getMinuteHeight();

        return height;
    }

    getDirection() {
        return 'vertical';
    }

    _sortCondition(a, b) {
        var allDayCondition = a.allDay - b.allDay,
            isAllDay = a.allDay && b.allDay,
            condition = this.instance._groupOrientation === 'vertical' && isAllDay ? this._columnCondition(a, b) : this._rowCondition(a, b);
        return allDayCondition ? allDayCondition : condition;
    }

    hasAllDayAppointments() {
        return true;
    }

    _getAllDayAppointmentGeometry(coordinates) {
        var config = this._calculateGeometryConfig(coordinates);

        return this._customizeCoordinates(coordinates, config.height, config.appointmentCountPerCell, config.offset, true);
    }

    _calculateGeometryConfig(coordinates) {
        if(!this.instance._allowResizing() || !this.instance._allowAllDayResizing()) {
            coordinates.skipResizing = true;
        }

        var config = super._calculateGeometryConfig(coordinates);

        if(coordinates.count <= this._getDynamicAppointmentCountPerCell().allDay) {
            config.offset = 0;
        }

        return config;
    }

    _getAppointmentCount(overlappingMode, coordinates) {
        return overlappingMode !== 'auto' && (coordinates.count === 1 && !isNumeric(overlappingMode)) ? coordinates.count : this._getMaxAppointmentCountPerCellByType(coordinates.allDay);
    }

    _getDefaultRatio(coordinates, appointmentCountPerCell) {
        return coordinates.count > this.instance.option('_appointmentCountPerCell') ? 0.65 : 1;
    }

    _getOffsets() {
        return {
            unlimited: ALLDAY_APPOINTMENT_MIN_VERTICAL_OFFSET,
            auto: ALLDAY_APPOINTMENT_MAX_VERTICAL_OFFSET
        };
    }

    _getMaxHeight() {
        return this.getDefaultAllDayCellHeight() || this.getAppointmentMinSize();
    }

    _needVerticalGroupBounds(allDay) {
        return !allDay;
    }

    _needHorizontalGroupBounds() {
        return false;
    }
}

module.exports = VerticalRenderingStrategy;
