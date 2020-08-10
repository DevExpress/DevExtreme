import registerComponent from '../../../core/component_registrator';
import SchedulerWorkSpaceVertical from './ui.scheduler.work_space_vertical';
import dateLocalization from '../../../localization/date';

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

    renovateRenderSupported() { return true; }

    generateRenderOptions() {
        const startViewDate = this._getDateWithSkippedDST();
        const _getTimeText = (i) => {
            // T410490: incorrectly displaying time slots on Linux
            const index = i % this._getRowCount();
            if(index % 2 === 0) {
                return dateLocalization.format(this._getTimeCellDateCore(startViewDate, i), 'shorttime');
            }
            return '';
        };

        const options = super.generateRenderOptions();
        options.cellDataGetters.push((_, rowIndex, cellIndex) => {
            return {
                value: {
                    startDate: this._getTimeCellDate(rowIndex, cellIndex),
                    text: _getTimeText(rowIndex, cellIndex)
                }
            };
        });

        return options;
    }

    renderRDateTable() {
        this.renderRComponent(this._$dateTable, dxrDayDateTableLayout, 'renovatedDateTable', { viewData: this.viewData });
    }
}

registerComponent('dxSchedulerWorkSpaceDay', SchedulerWorkSpaceDay);

export default SchedulerWorkSpaceDay;
