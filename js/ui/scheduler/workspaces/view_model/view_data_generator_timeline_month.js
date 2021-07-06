import { ViewDataGenerator } from './view_data_generator';
import { calculateCellIndex } from '../utils/month';
import { setOptionHour } from '../utils/base';
import dateUtils from '../../../../core/utils/date';

const DAY_IN_MILLISECONDS = dateUtils.dateToMilliseconds('day');

export class ViewDataGeneratorTimelineMonth extends ViewDataGenerator {
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
