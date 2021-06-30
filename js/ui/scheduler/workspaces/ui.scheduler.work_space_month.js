import { noop } from '../../../core/utils/common';
import registerComponent from '../../../core/component_registrator';
import SchedulerWorkSpace from './ui.scheduler.work_space.indicator';
import dateUtils from '../../../core/utils/date';
import { getBoundingRect } from '../../../core/utils/position';
import dateLocalization from '../../../localization/date';

import dxrMonthDateTableLayout from '../../../renovation/ui/scheduler/workspaces/month/date_table/layout.j';
import {
    calculateStartViewDate,
    getViewStartByOptions,
    calculateCellIndex,
} from './utils/month';

const MONTH_CLASS = 'dx-scheduler-work-space-month';

const DATE_TABLE_CURRENT_DATE_CLASS = 'dx-scheduler-date-table-current-date';
const DATE_TABLE_CELL_TEXT_CLASS = 'dx-scheduler-date-table-cell-text';
const DATE_TABLE_FIRST_OF_MONTH_CLASS = 'dx-scheduler-date-table-first-of-month';
const DATE_TABLE_OTHER_MONTH_DATE_CLASS = 'dx-scheduler-date-table-other-month';
const DATE_TABLE_SCROLLABLE_FIXED_CLASS = 'dx-scheduler-scrollable-fixed-content';

const DAYS_IN_WEEK = 7;
const DAY_IN_MILLISECONDS = 86400000;

const toMs = dateUtils.dateToMilliseconds;

class SchedulerWorkSpaceMonth extends SchedulerWorkSpace {
    get isDateAndTimeView() {
        return false;
    }

    _getElementClass() {
        return MONTH_CLASS;
    }

    _getRowCount() {
        return this._isWorkSpaceWithCount() ? 4 * this.option('intervalCount') + 2 : 6;
    }

    _getCellCount() {
        return DAYS_IN_WEEK;
    }

    _getFormat() {
        return this._formatWeekday;
    }

    _getInterval() {
        return DAY_IN_MILLISECONDS;
    }

    _getIntervalBetween(currentDate) {
        const firstViewDate = this.getStartViewDate();
        const timeZoneOffset = dateUtils.getTimezonesDifference(firstViewDate, currentDate);

        return currentDate.getTime() - (firstViewDate.getTime() - this.option('startDayHour') * 3600000) - timeZoneOffset;
    }

    _getDateGenerationOptions() {
        return {
            ...super._getDateGenerationOptions(),
            columnsInDay: 1,
            cellCountInDay: 1,
            calculateCellIndex,
        };
    }

    // TODO: temporary fix, in the future, if we replace table layout on div layout, getCellWidth method need remove. Details in T712431
    // TODO: there is a test for this bug, when changing the layout, the test will also be useless
    getCellWidth() {
        return this.cache.get('cellWidth', () => {
            const DAYS_IN_WEEK = 7;

            let averageWidth = 0;
            const cells = this._getCells().slice(0, DAYS_IN_WEEK);
            cells.each((index, element) => {
                averageWidth += getBoundingRect(element).width;
            });

            return cells.length === 0 ? undefined : averageWidth / DAYS_IN_WEEK;
        });
    }

    _getHiddenInterval() {
        return 0;
    }


    _insertAllDayRowsIntoDateTable() {
        return false;
    }
    _getCellCoordinatesByIndex(index) {
        const rowIndex = Math.floor(index / this._getCellCount());
        const columnIndex = index - this._getCellCount() * rowIndex;

        return {
            rowIndex: rowIndex,
            columnIndex,
        };
    }

    _needCreateCrossScrolling() {
        return this.option('crossScrollingEnabled') || this._isVerticalGroupedWorkSpace();
    }

    _setVisibilityDates() {
        const date = this._getViewStartByOptions();
        this._minVisibleDate = new Date(date.setDate(1));
        this._maxVisibleDate = new Date(new Date(date.setMonth(date.getMonth() + this.option('intervalCount'))).setDate(0));
    }

    _calculateStartViewDate() {
        return calculateStartViewDate(
            this.option('currentDate'),
            this.option('startDayHour'),
            this.option('startDate'),
            this.option('intervalCount'),
            this.option('firstDayOfWeek'),
        );
    }

    _getViewStartByOptions() {
        return getViewStartByOptions(
            this.option('startDate'),
            this.option('currentDate'),
            this.option('intervalCount'),
            dateUtils.getFirstMonthDate(this.option('startDate')),
        );
    }

    _getCellText(rowIndex, columnIndex) {
        const date = this._getDate(rowIndex, columnIndex);

        if(this._isWorkSpaceWithCount() && this._isFirstDayOfMonth(date)) {
            return this._formatMonthAndDay(date);
        }
        return dateLocalization.format(date, 'dd');
    }

    _formatMonthAndDay(date) {
        const monthName = dateLocalization.getMonthNames('abbreviated')[date.getMonth()];
        return [monthName, dateLocalization.format(date, 'day')].join(' ');
    }

    _getDate(week, day) {
        const result = new Date(this._startViewDate);
        const lastRowInDay = this._getRowCount();

        result.setDate(result.getDate() + (week % lastRowInDay) * DAYS_IN_WEEK + day);
        return result;
    }

    _updateIndex(index) {
        return index;
    }

    _isCurrentDate(cellDate) {
        return dateUtils.sameDate(cellDate, this._getToday());
    }

    _isFirstDayOfMonth(cellDate) {
        return this._isWorkSpaceWithCount() && cellDate.getDate() === 1;
    }

    _isOtherMonth(cellDate) {
        return !dateUtils.dateInRange(cellDate, this._minVisibleDate, this._maxVisibleDate, 'date');
    }

    isIndicationAvailable() {
        return false;
    }

    getCellDuration() {
        return this._calculateDayDuration() * 3600000;
    }

    getIntervalDuration() {
        return toMs('day');
    }

    getTimePanelWidth() {
        return 0;
    }

    getPositionShift(timeShift) {
        return {
            cellPosition: timeShift * this.getCellWidth(),
            top: 0,
            left: 0
        };
    }

    getCellCountToLastViewDate(date) {
        const firstDateTime = date.getTime();
        const lastDateTime = this.getEndViewDate().getTime();
        const dayDurationInMs = this.getCellDuration();

        return Math.ceil((lastDateTime - firstDateTime) / dayDurationInMs);
    }

    supportAllDayRow() {
        return false;
    }

    keepOriginalHours() {
        return true;
    }

    calculateEndDate(startDate) {
        const startDateCopy = new Date(startDate);
        return new Date(startDateCopy.setHours(this.option('endDayHour')));
    }

    getWorkSpaceLeftOffset() {
        return 0;
    }

    needApplyCollectorOffset() {
        return true;
    }

    _getHeaderDate() {
        return this._getViewStartByOptions();
    }

    _supportCompactDropDownAppointments() {
        return false;
    }

    scrollToTime() { return noop(); }

    _getRowCountWithAllDayRows() {
        return this._getRowCount();
    }

    renderRAllDayPanel() {}

    renderRTimeTable() {}

    renderRDateTable() {
        this.renderRComponent(
            this._$dateTable,
            dxrMonthDateTableLayout,
            'renovatedDateTable',
            this._getRDateTableProps(),
        );
    }

    generateRenderOptions() {
        const options = super.generateRenderOptions();
        options.cellDataGetters.push((_, rowIndex, columnIndex) => {
            return {
                value: {
                    text: this._getCellText(rowIndex, columnIndex),
                },
            };
        });

        const getCellMetaData = (_, rowIndex, columnIndex, groupIndex, startDate) => {
            return {
                value: {
                    today: this._isCurrentDate(startDate),
                    otherMonth: this._isOtherMonth(startDate),
                    firstDayOfMonth: this._isFirstDayOfMonth(startDate),
                },
            };
        };

        options.cellDataGetters.push(getCellMetaData);

        return options;
    }

    // -------------
    // We need these methods for now but they are useless for renovation
    // -------------

    _toggleFixedScrollableClass() {
        this._dateTableScrollable.$content().toggleClass(DATE_TABLE_SCROLLABLE_FIXED_CLASS, !this._isWorkSpaceWithCount() && !this._isVerticalGroupedWorkSpace());
    }

    _createWorkSpaceElements() {
        if(this._isVerticalGroupedWorkSpace()) {
            this._createWorkSpaceScrollableElements();
        } else {
            super._createWorkSpaceElements();
        }
    }

    _getTableAllDay() { return noop(); } //
    _toggleAllDayVisibility() { return noop(); }
    _changeAllDayVisibility() { return noop(); }

    // --------------
    // These methods should be deleted when we get rid of old render
    // --------------

    _renderTimePanel() { return noop(); }
    _renderAllDayPanel() { return noop(); }

    _setMonthClassesToCell($cell, data) {
        $cell
            .toggleClass(DATE_TABLE_CURRENT_DATE_CLASS, this._isCurrentDate(data.startDate))
            .toggleClass(DATE_TABLE_FIRST_OF_MONTH_CLASS, this._isFirstDayOfMonth(data.startDate))
            .toggleClass(DATE_TABLE_OTHER_MONTH_DATE_CLASS, this._isOtherMonth(data.startDate));

        return data;
    }

    _createAllDayPanelElements() {}

    _renderTableBody(options) {
        options.getCellText = (rowIndex, columnIndex) => {
            let validColumnIndex;
            if(this.isGroupedByDate()) {
                validColumnIndex = Math.floor(columnIndex / this._getGroupCount());
            } else {
                validColumnIndex = columnIndex % this._getCellCount();
            }

            return this._getCellText(rowIndex, validColumnIndex);
        };
        options.getCellTextClass = DATE_TABLE_CELL_TEXT_CLASS;
        options.setAdditionalClasses = this._setMonthClassesToCell.bind(this),

        super._renderTableBody(options);
    }
}

registerComponent('dxSchedulerWorkSpaceMonth', SchedulerWorkSpaceMonth);

export default SchedulerWorkSpaceMonth;
