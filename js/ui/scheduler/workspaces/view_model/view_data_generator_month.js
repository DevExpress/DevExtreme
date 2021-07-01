import {
    getCellText,
    isCurrentDate,
    isFirstCellInMonthWithIntervalCount,
    isOtherMonth,
} from '../utils/month';
import { ViewDataGenerator } from './view_data_generator';

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

        data.today = isCurrentDate(startDate, indicatorTime, timeZoneCalculator);
        data.otherMonth = isOtherMonth(startDate, minVisibleDate, maxVisibleDate);
        data.firstDayOfMonth = isFirstCellInMonthWithIntervalCount(startDate, intervalCount);
        data.text = getCellText(startDate, intervalCount);

        return data;
    }
}
