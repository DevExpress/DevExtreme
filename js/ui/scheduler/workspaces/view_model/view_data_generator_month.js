import { getToday, setOptionHour } from '../utils/base';
import { ViewDataGenerator } from './view_data_generator';
import dateUtils from '../../../../core/utils/date';
import {
    calculateCellIndex,
    calculateStartViewDate,
    getCellText,
    isFirstCellInMonthWithIntervalCount,
    getViewStartByOptions,
} from '../utils/month';

const DAY_IN_MILLISECONDS = dateUtils.dateToMilliseconds('day');
const DAYS_IN_WEEK = 7;

export class ViewDataGeneratorMonth extends ViewDataGenerator {
    getCellData(rowIndex, columnIndex, options, allDay) {
        const data = super.getCellData(rowIndex, columnIndex, options, false);

        const startDate = data.startDate;
        const {
            indicatorTime,
            timeZoneCalculator,
            intervalCount,
        } = options;

        data.today = this.isCurrentDate(startDate, indicatorTime, timeZoneCalculator);
        data.otherMonth = this.isOtherMonth(startDate, this._minVisibleDate, this._maxVisibleDate);
        data.firstDayOfMonth = isFirstCellInMonthWithIntervalCount(startDate, intervalCount);
        data.text = getCellText(startDate, intervalCount);

        return data;
    }

    isCurrentDate(date, indicatorTime, timeZoneCalculator) {
        return dateUtils.sameDate(date, getToday(indicatorTime, timeZoneCalculator));
    }

    isOtherMonth(cellDate, minDate, maxDate) {
        return !dateUtils.dateInRange(cellDate, minDate, maxDate, 'date');
    }

    _calculateCellIndex(rowIndex, columnIndex, rowCount, columnCount) {
        return calculateCellIndex(rowIndex, columnIndex, rowCount, columnCount);
    }

    calculateEndDate(startDate, interval, endDayHour) {
        return setOptionHour(startDate, endDayHour);
    }

    getInterval() {
        return DAY_IN_MILLISECONDS;
    }

    _calculateStartViewDate(options) {
        return calculateStartViewDate(
            options.currentDate,
            options.startDayHour,
            options.startDate,
            options.intervalCount,
            options.firstDayOfWeek,
        );
    }

    _setVisibilityDates(options) {
        const {
            intervalCount,
            startDate,
            currentDate,
        } = options;

        const firstMonthDate = dateUtils.getFirstMonthDate(startDate);
        const viewStart = getViewStartByOptions(startDate, currentDate, intervalCount, firstMonthDate);

        this._minVisibleDate = new Date(viewStart.setDate(1));

        const nextMonthDate = new Date(viewStart.setMonth(viewStart.getMonth() + intervalCount));
        this._maxVisibleDate = new Date(nextMonthDate.setDate(0));
    }

    getCellCount() {
        return DAYS_IN_WEEK;
    }

    getRowCount(options) {
        return 4 * options.intervalCount + 2;
    }

    getCellCountInDay() {
        return 1;
    }
}
