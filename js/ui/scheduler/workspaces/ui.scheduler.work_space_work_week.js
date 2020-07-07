import registerComponent from '../../../core/component_registrator';
import dateUtils from '../../../core/utils/date';
import workWeekUtils from './utils.work_week';
import SchedulerWorkSpaceWeek from './ui.scheduler.work_space_week';

const toMs = dateUtils.dateToMilliseconds;

const WORK_WEEK_CLASS = 'dx-scheduler-work-space-work-week';

const dayIndexes = [1, 2, 3, 4, 5];

let weekCounter = 0;

class SchedulerWorkSpaceWorkWeek extends SchedulerWorkSpaceWeek {
    constructor(...args) {
        super(...args);

        this._isSkippedData = workWeekUtils.isDataOnWeekend;
        this._getWeekendsCount = workWeekUtils.getWeekendsCount;
    }

    _getElementClass() {
        return WORK_WEEK_CLASS;
    }

    _getCellCount() {
        return 5 * this.option('intervalCount');
    }

    _firstDayOfWeek() {
        return workWeekUtils.getFirstDayOfWeek(this.option('firstDayOfWeek'));
    }

    _getDateByIndex(headerIndex) {
        const resultDate = new Date(this._firstViewDate);

        if(headerIndex % this._getCellCount() === 0) {
            weekCounter = 0;
        }

        resultDate.setDate(this._firstViewDate.getDate() + headerIndex + weekCounter);
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

    _setFirstViewDate() {
        this._firstViewDate = workWeekUtils.getFirstViewDate(this._getViewStartByOptions(), this._firstDayOfWeek());
        this._setStartDayHour(this._firstViewDate);
    }

    _getOffsetByCount(cellIndex) {
        const cellsInGroup = this._getCellCount();
        const inGroup = Math.floor(cellIndex / cellsInGroup);

        cellIndex = cellIndex - cellsInGroup * inGroup;

        const weekendCount = Math.floor(cellIndex / 5);

        return toMs('day') * weekendCount * 2;
    }
}

registerComponent('dxSchedulerWorkSpaceWorkWeek', SchedulerWorkSpaceWorkWeek);

module.exports = SchedulerWorkSpaceWorkWeek;
