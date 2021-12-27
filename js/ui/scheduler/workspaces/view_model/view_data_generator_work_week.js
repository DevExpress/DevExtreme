import {
    calculateStartViewDate,
    isDataOnWeekend,
} from '../../../../renovation/ui/scheduler/view_model/to_test/views/utils/work_week';
import { ViewDataGeneratorWeek } from './view_data_generator_week';

export class ViewDataGeneratorWorkWeek extends ViewDataGeneratorWeek {
    get daysInInterval() { return 5; }

    get isWorkView() { return true; }

    isSkippedDate(date) {
        return isDataOnWeekend(date);
    }

    _calculateStartViewDate(options) {
        return calculateStartViewDate(
            options.currentDate,
            options.startDayHour,
            options.startDate,
            this._getIntervalDuration(options.intervalCount),
            this.getFirstDayOfWeek(options.firstDayOfWeek),
        );
    }

    getFirstDayOfWeek(firstDayOfWeekOption) {
        return firstDayOfWeekOption || 0;
    }
}
