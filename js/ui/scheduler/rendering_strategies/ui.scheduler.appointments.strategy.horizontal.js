import BaseAppointmentsStrategy from './ui.scheduler.appointments.strategy.base';
import dateUtils from '../../../core/utils/date';

const MAX_APPOINTMENT_HEIGHT = 100;
const DEFAULT_APPOINTMENT_HEIGHT = 60;
const MIN_APPOINTMENT_HEIGHT = 35;
const DROP_DOWN_BUTTON_OFFSET = 2;
const BOTTOM_CELL_GAP = 20;

const toMs = dateUtils.dateToMilliseconds;

class HorizontalRenderingStrategy extends BaseAppointmentsStrategy {
    _needVerifyItemSize() {
        return true;
    }

    calculateAppointmentWidth(appointment, position, isRecurring) {
        const cellWidth = this.getDefaultCellWidth() || this.getAppointmentMinSize();
        const allDay = this.instance.fire('getField', 'allDay', appointment);
        let width;

        const startDate = this.startDate(appointment, false, position);
        const endDate = this.endDate(appointment, position, isRecurring);
        let appointmentDuration = this._getAppointmentDurationInMs(startDate, endDate, allDay);

        appointmentDuration = this._adjustDurationByDaylightDiff(appointmentDuration, startDate, endDate);

        const cellDuration = this.instance.getAppointmentDurationInMinutes() * toMs('minute');
        const durationInCells = appointmentDuration / cellDuration;

        width = durationInCells * cellWidth;

        width = this.cropAppointmentWidth(width, cellWidth);

        return width;
    }

    _needAdjustDuration(diff) {
        return diff < 0;
    }

    getAppointmentGeometry(coordinates) {
        const result = this._customizeAppointmentGeometry(coordinates);

        return super.getAppointmentGeometry(result);
    }

    _customizeAppointmentGeometry(coordinates) {
        const overlappingMode = this.instance.fire('getMaxAppointmentsPerCell');

        if(overlappingMode) {
            const config = this._calculateGeometryConfig(coordinates);

            return this._customizeCoordinates(coordinates, config.height, config.appointmentCountPerCell, config.offset);
        } else {
            const cellHeight = (this.getDefaultCellHeight() || this.getAppointmentMinSize()) - BOTTOM_CELL_GAP;
            let height = cellHeight / coordinates.count;

            if(height > MAX_APPOINTMENT_HEIGHT) {
                height = MAX_APPOINTMENT_HEIGHT;
            }

            const top = coordinates.top + coordinates.index * height;

            return {
                height: height,
                width: coordinates.width,
                top: top,
                left: coordinates.left
            };
        }
    }

    _getOffsets() {
        return {
            unlimited: 0,
            auto: 0
        };
    }

    _checkLongCompactAppointment(item, result) {
        const overlappingMode = this.instance.fire('getMaxAppointmentsPerCell');

        if(overlappingMode) {
            this._splitLongCompactAppointment(item, result);

            return result;
        }
    }

    _getCompactLeftCoordinate(itemLeft, index) {
        const cellWidth = this.getDefaultCellWidth() || this.getAppointmentMinSize();

        return itemLeft + cellWidth * index;
    }

    _getMaxHeight() {
        return this.getDefaultCellHeight() || this.getAppointmentMinSize();
    }

    _getAppointmentCount(overlappingMode, coordinates) {
        return this._getMaxAppointmentCountPerCellByType(false);
    }

    _getAppointmentDefaultHeight() {
        return DEFAULT_APPOINTMENT_HEIGHT;
    }

    _getAppointmentMinHeight() {
        return MIN_APPOINTMENT_HEIGHT;
    }

    _sortCondition(a, b) {
        const result = this._columnCondition(a, b);
        return this._fixUnstableSorting(result, a, b);
    }

    _getMaxAppointmentWidth(startDate) {
        let result;
        this.instance.fire('getMaxAppointmentWidth', {
            date: startDate,
            callback: function(width) {
                result = width;
            }
        });

        return result;
    }

    getDropDownAppointmentWidth() {
        return this.getDefaultCellWidth() - DROP_DOWN_BUTTON_OFFSET * 2;
    }

    getDeltaTime(args, initialSize) {
        let deltaTime = 0;
        const deltaWidth = args.width - initialSize.width;

        deltaTime = toMs('minute') * Math.round(deltaWidth / this.getDefaultCellWidth() * this.instance.getAppointmentDurationInMinutes());

        return deltaTime;
    }

    isAllDay(appointmentData) {
        return this.instance.fire('getField', 'allDay', appointmentData);
    }

    needSeparateAppointment() {
        return this.instance.fire('isGroupedByDate');
    }
}

module.exports = HorizontalRenderingStrategy;
