import registerComponent from '../../../core/component_registrator';
import SchedulerWorkSpaceVertical from './ui.scheduler.work_space_vertical';
import { getIntervalDuration, calculateViewStartDate } from './utils/week';

const WEEK_CLASS = 'dx-scheduler-work-space-week';
class SchedulerWorkSpaceWeek extends SchedulerWorkSpaceVertical {
    _getElementClass() {
        return WEEK_CLASS;
    }

    _getRowCount() {
        return this._getCellCountInDay();
    }

    _getCellCount() {
        return 7 * this.option('intervalCount');
    }

    _calculateViewStartDate() {
        return calculateViewStartDate(this.option('startDate'), this._firstDayOfWeek());
    }

    _getIntervalDuration() {
        return getIntervalDuration(this.option('intervalCount'));
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
