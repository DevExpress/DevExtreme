import registerComponent from '../../../core/component_registrator';
import { VIEWS } from '../constants';
import SchedulerTimelineWeek from './ui.scheduler.timeline_week';
import {
    getWeekendsCount,
} from '../../../renovation/ui/scheduler/view_model/to_test/views/utils/work_week';
import { getBoundingRect } from '../../../core/utils/position';
import { setOuterHeight } from '../../../core/utils/size';

const TIMELINE_CLASS = 'dx-scheduler-timeline-work-week';
const LAST_DAY_WEEK_INDEX = 5;

class SchedulerTimelineWorkWeek extends SchedulerTimelineWeek {
    get type() { return VIEWS.TIMELINE_WORK_WEEK; }

    constructor(...args) {
        super(...args);

        this._getWeekendsCount = getWeekendsCount;
    }

    _getElementClass() {
        return TIMELINE_CLASS;
    }

    _setHorizontalGroupHeaderCellsHeight() {
        let height = getBoundingRect(this._$dateTable.get(0)).height;
        if(this.isAllDayPanelVisible) {
            height = height + Math.floor(this.getAllDayHeight());
        }

        setOuterHeight(this._$groupTable, height);
    }

    _incrementDate(date) {
        const day = date.getDay();
        if(day === LAST_DAY_WEEK_INDEX) {
            date.setDate(date.getDate() + 2);
        }
        super._incrementDate(date);
    }
}

registerComponent('dxSchedulerTimelineWorkWeek', SchedulerTimelineWorkWeek);

export default SchedulerTimelineWorkWeek;
