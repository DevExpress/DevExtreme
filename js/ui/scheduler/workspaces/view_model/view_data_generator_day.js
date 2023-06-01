import { calculateStartViewDate } from '../../../../renovation/ui/scheduler/view_model/to_test/views/utils/day';
import { ViewDataGenerator } from './view_data_generator';

export class ViewDataGeneratorDay extends ViewDataGenerator {
    _calculateStartViewDate(options) {
        return calculateStartViewDate(
            options.currentDate,
            options.startDayHour,
            options.startDate,
            this._getIntervalDuration(options.intervalCount),
        );
    }
}
