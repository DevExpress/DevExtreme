import BaseAppointmentsStrategy from './ui.scheduler.appointments.strategy.base';
import dateUtils from '../../../core/utils/date';

const MAX_APPOINTMENT_HEIGHT = 100,
    DEFAULT_APPOINTMENT_HEIGHT = 60,
    MIN_APPOINTMENT_HEIGHT = 35,
    DROP_DOWN_BUTTON_OFFSET = 2,
    BOTTOM_CELL_GAP = 20;

const toMs = dateUtils.dateToMilliseconds;

class HorizontalRenderingStrategy extends BaseAppointmentsStrategy {
    _needVerifyItemSize() {
        return true;
    }

    calculateAppointmentWidth(appointment, position, isRecurring) {
        var cellWidth = this.getDefaultCellWidth() || this.getAppointmentMinSize(),
            allDay = this.instance.fire('getField', 'allDay', appointment),
            width;

        var startDate = this.startDate(appointment, false, position),
            endDate = this.endDate(appointment, position, isRecurring, true),
            appointmentDuration = this._getAppointmentDurationInMs(startDate, endDate, allDay);

        appointmentDuration = this._adjustDurationByDaylightDiff(appointmentDuration, startDate, endDate);

        var cellDuration = this.instance.getAppointmentDurationInMinutes() * toMs('minute'),
            durationInCells = appointmentDuration / cellDuration;

        width = durationInCells * cellWidth;

        width = this.cropAppointmentWidth(width, cellWidth);

        return width;
    }

    _needAdjustDuration(diff) {
        return diff < 0;
    }

    getAppointmentGeometry(coordinates) {
        var result = this._customizeAppointmentGeometry(coordinates);

        return super.getAppointmentGeometry(result);
    }

    _customizeAppointmentGeometry(coordinates) {
        var overlappingMode = this.instance.fire('getMaxAppointmentsPerCell');

        if(overlappingMode) {
            var config = this._calculateGeometryConfig(coordinates);

            return this._customizeCoordinates(coordinates, config.height, config.appointmentCountPerCell, config.offset);
        } else {
            var cellHeight = (this.getDefaultCellHeight() || this.getAppointmentMinSize()) - BOTTOM_CELL_GAP,
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
        }
    }

    _getOffsets() {
        return {
            unlimited: 0,
            auto: 0
        };
    }

    _checkLongCompactAppointment(item, result) {
        var overlappingMode = this.instance.fire('getMaxAppointmentsPerCell');

        if(overlappingMode) {
            this._splitLongCompactAppointment(item, result);

            return result;
        }
    }

    _getCompactLeftCoordinate(itemLeft, index) {
        var cellWidth = this.getDefaultCellWidth() || this.getAppointmentMinSize();

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
        var result = this._columnCondition(a, b);
        return this._fixUnstableSorting(result, a, b);
    }

    _getMaxAppointmentWidth(startDate) {
        var result;
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
        var deltaTime = 0,
            deltaWidth = args.width - initialSize.width;

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
