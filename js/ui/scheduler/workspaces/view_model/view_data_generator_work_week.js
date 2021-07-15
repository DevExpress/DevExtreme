import { calculateStartViewDate } from '../utils/work_week';
import { ViewDataGeneratorWeek } from './view_data_generator_week';

export class ViewDataGeneratorWorkWeek extends ViewDataGeneratorWeek {
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
