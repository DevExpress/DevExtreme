import registerComponent from '../../../core/component_registrator';
import {
    isDataOnWeekend,
    getWeekendsCount,
    getFirstDayOfWeek,
    calculateStartViewDate,
} from './utils/work_week';
import SchedulerWorkSpaceWeek from './ui.scheduler.work_space_week';

const WORK_WEEK_CLASS = 'dx-scheduler-work-space-work-week';

const dayIndexes = [1, 2, 3, 4, 5];

let weekCounter = 0;

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

    _getDateByIndex(headerIndex) {
        const resultDate = new Date(this._startViewDate);

        if(headerIndex % this._getCellCount() === 0) {
            weekCounter = 0;
        }

        resultDate.setDate(this._startViewDate.getDate() + headerIndex + weekCounter);
        let index = resultDate.getDay();

        while(dayIndexes.indexOf(index) === -1) {
            resultDate.setDate(resultDate.getDate() + 1);
            index = resultDate.getDay();
            weekCounter++;
        }

        return resultDate;
    }

    _renderView() {
        weekCounter = 0;
        super._renderView();
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
