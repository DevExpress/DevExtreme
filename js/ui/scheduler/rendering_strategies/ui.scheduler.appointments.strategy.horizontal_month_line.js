import HorizontalAppointmentsStrategy from './ui.scheduler.appointments.strategy.horizontal';
import dateUtils from '../../../core/utils/date';
import query from '../../../data/query';

const HOURS_IN_DAY = 24;
const MINUTES_IN_HOUR = 60;
const MILLISECONDS_IN_MINUTE = 60000;
const ZERO_APPOINTMENT_DURATION_IN_DAYS = 1;

class HorizontalMonthLineRenderingStrategy extends HorizontalAppointmentsStrategy {
    calculateAppointmentWidth(appointment, position) {
        const startDate = dateUtils.trimTime(position.info.appointment.startDate);
        const endDate = this.normalizeEndDateByViewEnd(appointment, position.info.appointment.endDate);
        const cellWidth = this.getDefaultCellWidth() || this.getAppointmentMinSize();
        const duration = this._getDurationInDays(startDate, endDate);
        const width = this.cropAppointmentWidth(Math.ceil(duration) * cellWidth, cellWidth);

        return width;
    }

    _getDurationInDays(startDate, endDate) {
        const adjustedDuration = this._adjustDurationByDaylightDiff(endDate.getTime() - startDate.getTime(), startDate, endDate);
//         return (adjustedDuration / dateUtils.dateToMilliseconds('day')) || ZERO_APPOINTMENT_DURATION_IN_DAYS;
        return ZERO_APPOINTMENT_DURATION_IN_DAYS;
    }

    getDeltaTime(args, initialSize) {
        return HOURS_IN_DAY * MINUTES_IN_HOUR * MILLISECONDS_IN_MINUTE * this._getDeltaWidth(args, initialSize);
    }

    isAllDay() {
        return false;
    }

    createTaskPositionMap(items, skipSorting) {
        if(!skipSorting) {
            this.instance.getAppointmentsInstance()._sortAppointmentsByStartDate(items);
        }

        return super.createTaskPositionMap(items);
    }

    _getSortedPositions(map, skipSorting) {
        let result = super._getSortedPositions(map);

        if(!skipSorting) {
            result = query(result).sortBy('top').thenBy('left').thenBy('cellPosition').thenBy('i').toArray();
        }

        return result;
    }

    needCorrectAppointmentDates() {
        return false;
    }
}

export default HorizontalMonthLineRenderingStrategy;
