import registerComponent from '../../../core/component_registrator';
import SchedulerTimeline from './ui.scheduler.timeline';
import dateUtils from '../../../core/utils/date';

import dxrDateHeader from '../../../renovation/ui/scheduler/workspaces/base/header_panel/layout.j';

const TIMELINE_CLASS = 'dx-scheduler-timeline-month';
const DAY_IN_MILLISECONDS = 86400000;

const toMs = dateUtils.dateToMilliseconds;

class SchedulerTimelineMonth extends SchedulerTimeline {
    get isDateAndTimeView() {
        return false;
    }

    get viewDirection() { return 'horizontal'; }

    get renovatedHeaderPanelComponent() { return dxrDateHeader; }

    _renderView() {
        super._renderView();

        this._updateScrollable();
    }

    _getElementClass() {
        return TIMELINE_CLASS;
    }

    _getDateHeaderTemplate() {
        return this.option('dateCellTemplate');
    }

    _getHiddenInterval() {
        return 0;
    }

    _calculateDurationInCells(timeDiff) {
        return timeDiff / this.getCellDuration();
    }

    getCellDuration() {
        return toMs('day');
    }

    calculateEndViewDate(dateOfLastViewCell) {
        return new Date(dateOfLastViewCell.getTime() + this._calculateDayDuration() * toMs('hour'));
    }

    isIndicatorVisible() {
        return true;
    }

    _getCellCount() {
        const currentDate = this.option('currentDate');
        let cellCount = 0;
        if(this._isWorkSpaceWithCount()) {
            const intervalCount = this.option('intervalCount');

            for(let i = 1; i <= intervalCount; i++) {
                cellCount += new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 0).getDate();
            }
        } else {
            cellCount = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        }

        return cellCount;
    }

    _setFirstViewDate() {
        this._firstViewDate = dateUtils.getFirstMonthDate(this._getViewStartByOptions());
        this._setStartDayHour(this._firstViewDate);
    }

    _getFormat() {
        return this._formatWeekdayAndDay;
    }

    _getDateByIndex(headerIndex) {
        const resultDate = new Date(this._firstViewDate);
        resultDate.setDate(this._firstViewDate.getDate() + headerIndex);

        return resultDate;
    }

    _getInterval() {
        return DAY_IN_MILLISECONDS;
    }

    _getIntervalBetween(currentDate) {
        const firstViewDate = this.getStartViewDate();
        const timeZoneOffset = dateUtils.getTimezonesDifference(firstViewDate, currentDate);

        return currentDate.getTime() - (firstViewDate.getTime() - this.option('startDayHour') * 3600000) - timeZoneOffset;
    }

    calculateEndDate(startDate) {
        const startDateCopy = new Date(startDate);
        return new Date(startDateCopy.setHours(this.option('endDayHour')));
    }

    _calculateHiddenInterval() {
        return 0;
    }

    _getDateByCellIndexes(rowIndex, cellIndex) {
        const date = super._getDateByCellIndexes(rowIndex, cellIndex);

        this._setStartDayHour(date);

        return date;
    }

    getPositionShift() {
        return {
            top: 0,
            left: 0,
            cellPosition: 0
        };
    }

    _getStartViewDate() {
        const firstMonthDate = dateUtils.getFirstMonthDate(this.option('startDate'));
        return firstMonthDate;
    }

    _getViewStartByOptions() {
        if(!this.option('startDate')) {
            return new Date(this.option('currentDate').getTime());
        } else {
            let startDate = this._getStartViewDate();
            const currentDate = this.option('currentDate');
            const diff = startDate.getTime() <= currentDate.getTime() ? 1 : -1;
            let endDate = new Date(new Date(this._getStartViewDate().setMonth(this._getStartViewDate().getMonth() + diff * this.option('intervalCount'))));

            while(!this._dateInRange(currentDate, startDate, endDate, diff)) {
                startDate = new Date(endDate);

                if(diff > 0) {
                    startDate.setDate(1);
                }

                endDate = new Date(new Date(endDate.setMonth(endDate.getMonth() + diff * this.option('intervalCount'))));
            }

            return diff > 0 ? startDate : endDate;
        }
    }
}

registerComponent('dxSchedulerTimelineMonth', SchedulerTimelineMonth);

export default SchedulerTimelineMonth;
