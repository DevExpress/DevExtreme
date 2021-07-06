import registerComponent from '../../../core/component_registrator';
import { VIEWS } from '../constants';
import SchedulerTimelineWeek from './ui.scheduler.timeline_week';
import {
    getWeekendsCount,
    isDataOnWeekend,
    getFirstDayOfWeek,
    calculateStartViewDate,
} from './utils/work_week';

const TIMELINE_CLASS = 'dx-scheduler-timeline-work-week';
const LAST_DAY_WEEK_INDEX = 5;

class SchedulerTimelineWorkWeek extends SchedulerTimelineWeek {
    get type() { return VIEWS.TIMELINE_WORK_WEEK; }

    get isWorkView() { return true; }

    constructor(...args) {
        super(...args);

        this._getWeekendsCount = getWeekendsCount;
        this._isSkippedData = isDataOnWeekend;
    }

    _getElementClass() {
        return TIMELINE_CLASS;
    }

    _getWeekDuration() {
        return 5;
    }

    _firstDayOfWeek() {
        return getFirstDayOfWeek(this.option('firstDayOfWeek'));
    }

    _isSkippedData() { return isDataOnWeekend; }

    _incrementDate(date) {
        const day = date.getDay();
        if(day === LAST_DAY_WEEK_INDEX) {
            date.setDate(date.getDate() + 2);
        }
        super._incrementDate(date);
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

registerComponent('dxSchedulerTimelineWorkWeek', SchedulerTimelineWorkWeek);

export default SchedulerTimelineWorkWeek;
