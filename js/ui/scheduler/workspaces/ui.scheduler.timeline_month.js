import registerComponent from '../../../core/component_registrator';
import SchedulerTimeline from './ui.scheduler.timeline';
import dateUtils from '../../../core/utils/date';

import dxrDateHeader from '../../../renovation/ui/scheduler/workspaces/base/header_panel/layout.j';
import { calculateCellIndex, getViewStartByOptions } from './utils/month';
import { calculateStartViewDate } from './utils/timeline_month';

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

    _calculateStartViewDate() {
        return calculateStartViewDate(
            this.option('currentDate'),
            this.option('startDayHour'),
            this.option('startDate'),
            this.option('intervalCount'),
        );
    }

    _getFormat() {
        return this._formatWeekdayAndDay;
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

    _getDateGenerationOptions() {
        return {
            ...super._getDateGenerationOptions(),
            columnsInDay: 1,
            calculateCellIndex,
        };
    }

    getPositionShift() {
        return {
            top: 0,
            left: 0,
            cellPosition: 0
        };
    }

    _getViewStartByOptions() {
        return getViewStartByOptions(
            this.option('startDate'),
            this.option('currentDate'),
            this.option('intervalCount'),
            dateUtils.getFirstMonthDate(this.option('startDate')),
        );
    }
}

registerComponent('dxSchedulerTimelineMonth', SchedulerTimelineMonth);

export default SchedulerTimelineMonth;
