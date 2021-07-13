import registerComponent from '../../../core/component_registrator';
import {
    isDataOnWeekend,
    getWeekendsCount,
    getFirstDayOfWeek,
} from './utils/work_week';
import SchedulerWorkSpaceWeek from './ui.scheduler.work_space_week';
import { VIEWS } from '../constants';

const WORK_WEEK_CLASS = 'dx-scheduler-work-space-work-week';
class SchedulerWorkSpaceWorkWeek extends SchedulerWorkSpaceWeek {
    get type() { return VIEWS.WORK_WEEK; }

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
}

registerComponent('dxSchedulerWorkSpaceWorkWeek', SchedulerWorkSpaceWorkWeek);

export default SchedulerWorkSpaceWorkWeek;
