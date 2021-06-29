import registerComponent from '../../../core/component_registrator';
import {
    isDataOnWeekend,
    getWeekendsCount,
    getFirstDayOfWeek,
    calculateStartViewDate,
} from './utils/work_week';
import SchedulerWorkSpaceWeek from './ui.scheduler.work_space_week';

const WORK_WEEK_CLASS = 'dx-scheduler-work-space-work-week';
class SchedulerWorkSpaceWorkWeek extends SchedulerWorkSpaceWeek {
    get isWorkView() { return true; }

    constructor(...args) {
        super(...args);

        this._isSkippedData = isDataOnWeekend;
        this._getWeekendsCount = getWeekendsCount;
    }

    _getElementClass() {
        return WORK_WEEK_CLASS;
    }

    _getCellCount() {
        return 5 * this.option('intervalCount');
    }

    _firstDayOfWeek() {
        return getFirstDayOfWeek(this.option('firstDayOfWeek'));
    }

    _calculateStartViewDate() {
        return calculateStartViewDate(
            this.option('currentDate'),
            this.option('startDayHour'),
            this.option('startDate'),
            this._getIntervalDuration(),
            this.option('firstDayOfWeek'),
        );
    }
}

registerComponent('dxSchedulerWorkSpaceWorkWeek', SchedulerWorkSpaceWorkWeek);

export default SchedulerWorkSpaceWorkWeek;
