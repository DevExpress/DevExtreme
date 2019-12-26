import BaseAppointmentsStrategy from './ui.scheduler.appointments.strategy.base';
import { extend } from '../../../core/utils/extend';
import { isNumeric } from '../../../core/utils/type';
import devices from '../../../core/devices';
import dateUtils from '../../../core/utils/date';

const WEEK_APPOINTMENT_DEFAULT_OFFSET = 25;
const WEEK_APPOINTMENT_MOBILE_OFFSET = 50;

const APPOINTMENT_MIN_WIDTH = 5;

const ALLDAY_APPOINTMENT_MIN_VERTICAL_OFFSET = 5;
const ALLDAY_APPOINTMENT_MAX_VERTICAL_OFFSET = 20;

const toMs = dateUtils.dateToMilliseconds;

class VerticalRenderingStrategy extends BaseAppointmentsStrategy {
    getDeltaTime(args, initialSize, appointment) {
        let deltaTime = 0;

        if(this.isAllDay(appointment)) {
            deltaTime = this._getDeltaWidth(args, initialSize) * toMs('day');
        } else {
            const deltaHeight = args.height - initialSize.height;
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
        const allDay = this.isAllDay(item);
        const isRecurring = !!this.instance.fire('getField', 'recurrenceRule', item);

        if(allDay) {
            return super._getItemPosition(item);
        }

        const position = this._getAppointmentCoordinates(item);
        let result = [];

        for(let j = 0; j < position.length; j++) {
            const height = this.calculateAppointmentHeight(item, position[j], isRecurring);
            const width = this.calculateAppointmentWidth(item, position[j], isRecurring);
            let resultHeight = height;
            let appointmentReduced = null;
            let multiDaysAppointmentParts = [];
            const currentMaxAllowedPosition = position[j].vMax;

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
        const maxTop = position.vMax;
        const result = height > (maxTop - position.top);

        return result;
    }

    _reduceMultiDayAppointment(sourceAppointmentHeight, bound) {
        sourceAppointmentHeight = bound.bottom - Math.floor(bound.top);

        return sourceAppointmentHeight;
    }

    _getAppointmentParts(appointmentGeometry, appointmentSettings) {
        let tailHeight = appointmentGeometry.sourceAppointmentHeight - appointmentGeometry.reducedHeight;
        const width = appointmentGeometry.width;
        const result = [];
        let currentPartTop = this.instance.fire('getGroupTop', appointmentSettings.groupIndex);
        const offset = this.instance.fire('isGroupedByDate') ? this.getDefaultCellWidth() * this.instance.fire('getGroupCount') : this.getDefaultCellWidth();
        const left = appointmentSettings.left + offset;

        if(tailHeight) {
            const minHeight = this.getAppointmentMinSize();

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
        const cellBorderSize = 1;
        const cellWidth = this.getDefaultCellWidth() || this.getAppointmentMinSize();

        return itemLeft + (cellBorderSize + cellWidth) * index;
    }

    _checkLongCompactAppointment(item, result) {
        this._splitLongCompactAppointment(item, result);

        return result;
    }

    _getVerticalAppointmentGeometry(coordinates) {
        const overlappingMode = this.instance.fire('getMaxAppointmentsPerCell');

        if(overlappingMode) {
            const config = this._calculateVerticalGeometryConfig(coordinates);

            return this._customizeVerticalCoordinates(coordinates, config.width, config.appointmentCountPerCell, config.offset);
        } else {
            let width = this._getAppointmentMaxWidth() / coordinates.count;
            const height = coordinates.height;
            const top = coordinates.top;
            const left = coordinates.left + (coordinates.index * width);

            if(width < APPOINTMENT_MIN_WIDTH) {
                width = APPOINTMENT_MIN_WIDTH;
            }

            return { height: height, width: width, top: top, left: left, empty: this._isAppointmentEmpty(height, width) };
        }
    }

    _customizeVerticalCoordinates(coordinates, width, appointmentCountPerCell, topOffset, isAllDay) {
        const index = coordinates.index;
        let appointmentWidth = Math.max(width / appointmentCountPerCell, width / coordinates.count);
        const height = coordinates.height;
        let appointmentLeft = coordinates.left + (coordinates.index * appointmentWidth);
        let top = coordinates.top;
        let compactAppointmentDefaultSize;
        let compactAppointmentDefaultOffset;

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
        const overlappingMode = this.instance.fire('getMaxAppointmentsPerCell');
        const offsets = this._getOffsets();
        const appointmentDefaultOffset = this._getAppointmentDefaultOffset();

        let appointmentCountPerCell = this._getAppointmentCount(overlappingMode, coordinates);
        let ratio = this._getDefaultRatio(coordinates, appointmentCountPerCell);
        let maxWidth = this._getMaxWidth();

        if(!appointmentCountPerCell) {
            appointmentCountPerCell = coordinates.count;
            ratio = (maxWidth - offsets.unlimited) / maxWidth;
        }

        let topOffset = (1 - ratio) * maxWidth;
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
        const allDay = this.instance.fire('getField', 'allDay', appointmentData);

        if(allDay) {
            return true;
        }

        return this.instance.appointmentTakesAllDay(appointmentData);
    }

    _getAppointmentMaxWidth() {
        const offset = devices.current().deviceType === 'desktop' && !this.instance.fire('isAdaptive') ? WEEK_APPOINTMENT_DEFAULT_OFFSET : WEEK_APPOINTMENT_MOBILE_OFFSET;
        const width = this.getDefaultCellWidth() - offset;

        return width > 0 ? width : this.getAppointmentMinSize();
    }

    calculateAppointmentWidth(appointment, position, isRecurring) {
        if(!this.isAllDay(appointment)) {
            return 0;
        }

        let startDate = new Date(this.startDate(appointment, false, position));
        const endDate = this.endDate(appointment, position, isRecurring);
        const cellWidth = this.getDefaultCellWidth() || this.getAppointmentMinSize();

        startDate = dateUtils.trimTime(startDate);
        const durationInHours = (endDate.getTime() - startDate.getTime()) / toMs('hour');

        let width = Math.ceil(durationInHours / 24) * cellWidth;

        width = this.cropAppointmentWidth(width, cellWidth);
        return width;
    }

    calculateAppointmentHeight(appointment, position, isRecurring) {
        const endDate = this.endDate(appointment, position, isRecurring);
        const startDate = this.startDate(appointment, false, position);
        const allDay = this.instance.fire('getField', 'allDay', appointment);

        if(this.isAllDay(appointment)) {
            return 0;
        }

        const fullDuration = this._getAppointmentDurationInMs(startDate, endDate, allDay);
        const durationInMinutes = this._adjustDurationByDaylightDiff(fullDuration, startDate, endDate) / toMs('minute');

        const height = durationInMinutes * this._getMinuteHeight();

        return height;
    }

    getDirection() {
        return 'vertical';
    }

    _sortCondition(a, b) {
        const allDayCondition = a.allDay - b.allDay, isAllDay = a.allDay && b.allDay, condition = this.instance._groupOrientation === 'vertical' && isAllDay ? this._columnCondition(a, b) : this._rowCondition(a, b);
        return allDayCondition ? allDayCondition : condition;
    }

    hasAllDayAppointments() {
        return true;
    }

    _getAllDayAppointmentGeometry(coordinates) {
        const config = this._calculateGeometryConfig(coordinates);

        return this._customizeCoordinates(coordinates, config.height, config.appointmentCountPerCell, config.offset, true);
    }

    _calculateGeometryConfig(coordinates) {
        if(!this.instance._allowResizing() || !this.instance._allowAllDayResizing()) {
            coordinates.skipResizing = true;
        }

        const config = super._calculateGeometryConfig(coordinates);

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
