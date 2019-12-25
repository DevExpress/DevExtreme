import HorizontalAppointmentsStrategy from './ui.scheduler.appointments.strategy.horizontal';
import dateUtils from '../../../core/utils/date';
import query from '../../../data/query';

var HOURS_IN_DAY = 24,
    MINUTES_IN_HOUR = 60,
    MILLISECONDS_IN_MINUTE = 60000;

class HorizontalMonthLineRenderingStrategy extends HorizontalAppointmentsStrategy {
    calculateAppointmentWidth(appointment, position, isRecurring) {
        let startDate = new Date(this.startDate(appointment, false, position)),
            endDate = new Date(this.endDate(appointment, position, isRecurring, true)),
            cellWidth = this.getDefaultCellWidth() || this.getAppointmentMinSize();

        startDate = dateUtils.trimTime(startDate);

        let width = Math.ceil(this._getDurationInHour(startDate, endDate) / HOURS_IN_DAY) * cellWidth;
        width = this.cropAppointmentWidth(width, cellWidth);

        return width;
    }

    _getDurationInHour(startDate, endDate) {
        var adjustedDuration = this._adjustDurationByDaylightDiff(endDate.getTime() - startDate.getTime(), startDate, endDate);
        return adjustedDuration / dateUtils.dateToMilliseconds('hour');
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
        var result = super._getSortedPositions(map);

        if(!skipSorting) {
            result = query(result).sortBy('top').thenBy('left').thenBy('cellPosition').thenBy('i').toArray();
        }

        return result;
    }

    needCorrectAppointmentDates() {
        return false;
    }
}

module.exports = HorizontalMonthLineRenderingStrategy;
