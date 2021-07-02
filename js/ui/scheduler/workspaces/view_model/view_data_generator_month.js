import { getToday, setOptionHour } from '../utils/base';
import { ViewDataGenerator } from './view_data_generator';
import dateUtils from '../../../../core/utils/date';
import { calculateCellIndex, getCellText, isFirstCellInMonthWithIntervalCount } from '../utils/month';

const DAY_IN_MILLISECONDS = dateUtils.dateToMilliseconds('day');

export class ViewDataGeneratorMonth extends ViewDataGenerator {
    getCellData(rowIndex, columnIndex, options, allDay) {
        const data = super.getCellData(rowIndex, columnIndex, options, false);

        const startDate = data.startDate;
        const {
            indicatorTime,
            timeZoneCalculator,
            intervalCount,
            maxVisibleDate,
            minVisibleDate,
        } = options;

        data.today = this.isCurrentDate(startDate, indicatorTime, timeZoneCalculator);
        data.otherMonth = this.isOtherMonth(startDate, minVisibleDate, maxVisibleDate);
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

}
