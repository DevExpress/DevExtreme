import registerComponent from '../../../core/component_registrator';
import dateUtils from '../../../core/utils/date';
import dateLocalization from '../../../localization/date';
import SchedulerWorkSpaceVertical from './ui.scheduler.work_space_vertical';

const WEEK_CLASS = 'dx-scheduler-work-space-week';

const toMs = dateUtils.dateToMilliseconds;
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

    _getDateByIndex(headerIndex) {
        const resultDate = new Date(this._firstViewDate);
        resultDate.setDate(this._firstViewDate.getDate() + headerIndex);
        return resultDate;
    }

    _getStartViewDate() {
        return dateUtils.getFirstWeekDate(this.option('startDate'), this._firstDayOfWeek() || dateLocalization.firstDayOfWeekIndex());
    }

    _getIntervalDuration() {
        return toMs('day') * 7 * this.option('intervalCount');
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
