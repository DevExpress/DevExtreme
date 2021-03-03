import registerComponent from '../../../core/component_registrator';
import SchedulerWorkSpaceVertical from './ui.scheduler.work_space_vertical';

import dxrDayDateTableLayout from '../../../renovation/ui/scheduler/workspaces/day/date_table/layout.j';

const DAY_CLASS = 'dx-scheduler-work-space-day';

class SchedulerWorkSpaceDay extends SchedulerWorkSpaceVertical {
    _getElementClass() {
        return DAY_CLASS;
    }

    _getRowCount() {
        return this._getCellCountInDay();
    }

    _getCellCount() {
        return this.option('intervalCount');
    }

    _setFirstViewDate() {
        this._firstViewDate = this._getViewStartByOptions();
        this._setStartDayHour(this._firstViewDate);
    }

    _getDateByIndex(headerIndex) {
        if(this.option('intervalCount') === 1) {
            return this._firstViewDate;
        }

        const resultDate = new Date(this._firstViewDate);
        resultDate.setDate(this._firstViewDate.getDate() + headerIndex);
        return resultDate;
    }

    _renderDateHeader() {
        return this.option('intervalCount') === 1 ? null : super._renderDateHeader();
    }

    renderRDateTable() {
        this.renderRComponent(
            this._$dateTable,
            dxrDayDateTableLayout,
            'renovatedDateTable',
            this._getRDateTableProps(),
        );
    }

    renderRHeaderPanel() {
        if(this.option('intervalCount') === 1) {
            super.renderRHeaderPanel(false);
        } else {
            super.renderRHeaderPanel(true);
        }
    }
}

registerComponent('dxSchedulerWorkSpaceDay', SchedulerWorkSpaceDay);

export default SchedulerWorkSpaceDay;
