import registerComponent from '../../../core/component_registrator';
import {
    getWeekendsCount,
} from '../../../renovation/ui/scheduler/view_model/to_test/views/utils/work_week';
import SchedulerWorkSpaceWeek from './ui.scheduler.work_space_week';
import { VIEWS } from '../constants';
import { getBoundingRect } from '../../../core/utils/position';
import { setOuterHeight } from '../../../core/utils/size';

const WORK_WEEK_CLASS = 'dx-scheduler-work-space-work-week';
class SchedulerWorkSpaceWorkWeek extends SchedulerWorkSpaceWeek {
    get type() { return VIEWS.WORK_WEEK; }

    constructor(...args) {
        super(...args);

        this._getWeekendsCount = getWeekendsCount;
    }

    _getElementClass() {
        return WORK_WEEK_CLASS;
    }

    _setHorizontalGroupHeaderCellsHeight() {
        let height = getBoundingRect(this._$dateTable.get(0)).height;
        if(this.isAllDayPanelVisible) {
            height = height + Math.floor(this.getAllDayHeight());
        }

        setOuterHeight(this._$groupTable, height);
    }
}

registerComponent('dxSchedulerWorkSpaceWorkWeek', SchedulerWorkSpaceWorkWeek);

export default SchedulerWorkSpaceWorkWeek;
