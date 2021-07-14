import registerComponent from '../../../core/component_registrator';
import { VIEWS } from '../constants';
import SchedulerWorkSpaceVertical from './ui.scheduler.work_space_vertical';
import { calculateViewStartDate } from './utils/week';

const WEEK_CLASS = 'dx-scheduler-work-space-week';
class SchedulerWorkSpaceWeek extends SchedulerWorkSpaceVertical {
    get type() { return VIEWS.WEEK; }

    _getElementClass() {
        return WEEK_CLASS;
    }

    _getRowCount() {
        return this._getCellCountInDay();
    }

    _calculateViewStartDate() {
        return calculateViewStartDate(this.option('startDate'), this._firstDayOfWeek());
    }

    getPositionShift(timeShift, isAllDay) {
        if(!isAllDay && this.invoke('isAdaptive') && this.invoke('getMaxAppointmentCountPerCellByType') === 0) {
            return {
                top: 0,
                left: 0,
                cellPosition: 0
            };
        }
        return super.getPositionShift(timeShift, isAllDay);
    }

    _isApplyCompactAppointmentOffset() {
        if(this.invoke('isAdaptive') && this.invoke('getMaxAppointmentCountPerCellByType') === 0) {
            return false;
        }
        return super._isApplyCompactAppointmentOffset();
    }
}

registerComponent('dxSchedulerWorkSpaceWeek', SchedulerWorkSpaceWeek);

export default SchedulerWorkSpaceWeek;
