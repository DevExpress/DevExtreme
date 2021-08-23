import registerComponent from '../../../core/component_registrator';
import {
    isDataOnWeekend,
    getWeekendsCount,
} from '../../../renovation/ui/scheduler/view_model/to_test/views/utils/work_week';
import SchedulerWorkSpaceWeek from './ui.scheduler.work_space_week';
import { VIEWS } from '../constants';

const WORK_WEEK_CLASS = 'dx-scheduler-work-space-work-week';
class SchedulerWorkSpaceWorkWeek extends SchedulerWorkSpaceWeek {
    get type() { return VIEWS.WORK_WEEK; }

    constructor(...args) {
        super(...args);

        this._getWeekendsCount = getWeekendsCount;
    }

    _isSkippedData(date) {
        return isDataOnWeekend(date);
    }

    _getElementClass() {
        return WORK_WEEK_CLASS;
    }
}

registerComponent('dxSchedulerWorkSpaceWorkWeek', SchedulerWorkSpaceWorkWeek);

export default SchedulerWorkSpaceWorkWeek;
