import { calculateStartViewDate, getIntervalDuration } from '../utils/week';
import { ViewDataGenerator } from './view_data_generator';

export class ViewDataGeneratorWeek extends ViewDataGenerator {
    _getIntervalDuration(intervalCount) {
        return getIntervalDuration(intervalCount);
    }

    _calculateStartViewDate(options) {
        return calculateStartViewDate(
            options.currentDate,
            options.startDayHour,
            options.startDate,
            this._getIntervalDuration(options.intervalCount),
            options.firstDayOfWeek,
        );
    }
}
