import registerComponent from '../../../core/component_registrator';
import dateUtils from '../../../core/utils/date';
import dateLocalization from '../../../localization/date';
import SchedulerWorkSpaceVertical from './ui.scheduler.work_space_vertical';
import { getIntervalDuration } from './utils/week';

import dxrWeekTableLayout from '../../../renovation/ui/scheduler/workspaces/week/date_table/layout.j';

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

    _getDateByIndex(headerIndex) {
        const resultDate = new Date(this._firstViewDate);
        resultDate.setDate(this._firstViewDate.getDate() + headerIndex);
        return resultDate;
    }

    _getStartViewDate() {
        return dateUtils.getFirstWeekDate(this.option('startDate'), this._firstDayOfWeek() || dateLocalization.firstDayOfWeekIndex());
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

    renderRDateTable() {
        this.renderRComponent(
            this._$dateTable,
            dxrWeekTableLayout,
            'renovatedDateTable',
            {
                viewData: this.viewDataProvider.viewData,
                dataCellTemplate: this.option('dataCellTemplate'),
            }
        );
    }
}

registerComponent('dxSchedulerWorkSpaceWeek', SchedulerWorkSpaceWeek);

export default SchedulerWorkSpaceWeek;
