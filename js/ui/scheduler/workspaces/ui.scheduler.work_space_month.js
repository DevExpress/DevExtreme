import $ from '../../../core/renderer';
import { noop } from '../../../core/utils/common';
import registerComponent from '../../../core/component_registrator';
import SchedulerWorkSpace from './ui.scheduler.work_space.indicator';
import dateUtils from '../../../core/utils/date';
import { getBoundingRect } from '../../../core/utils/position';
import dateLocalization from '../../../localization/date';

const MONTH_CLASS = 'dx-scheduler-work-space-month';

const DATE_TABLE_CURRENT_DATE_CLASS = 'dx-scheduler-date-table-current-date';
const DATE_TABLE_FIRST_OF_MONTH_CLASS = 'dx-scheduler-date-table-first-of-month';
const DATE_TABLE_OTHER_MONTH_DATE_CLASS = 'dx-scheduler-date-table-other-month';
const DATE_TABLE_SCROLLABLE_FIXED_CLASS = 'dx-scheduler-scrollable-fixed-content';

const DAYS_IN_WEEK = 7;
const DAY_IN_MILLISECONDS = 86400000;

const toMs = dateUtils.dateToMilliseconds;

class SchedulerWorkSpaceMonth extends SchedulerWorkSpace {
    _toggleFixedScrollableClass() {
        this._dateTableScrollable.$content().toggleClass(DATE_TABLE_SCROLLABLE_FIXED_CLASS, !this._isWorkSpaceWithCount() && !this._isVerticalGroupedWorkSpace());
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

    _getDateByIndex(headerIndex) {
        const resultDate = new Date(this._firstViewDate);
        resultDate.setDate(this._firstViewDate.getDate() + headerIndex);

        return resultDate;
    }

    _getFormat() {
        return this._formatWeekday;
    }

    _calculateCellIndex(rowIndex, cellIndex) {
        if(this._isVerticalGroupedWorkSpace()) {
            rowIndex = rowIndex % this._getRowCount();
        } else {
            cellIndex = cellIndex % this._getCellCount();
        }

        return rowIndex * this._getCellCount() + cellIndex;
    }

    _getInterval() {
        return DAY_IN_MILLISECONDS;
    }

    _getIntervalBetween(currentDate) {
        const firstViewDate = this.getStartViewDate();
        const timeZoneOffset = dateUtils.getTimezonesDifference(firstViewDate, currentDate);

        return currentDate.getTime() - (firstViewDate.getTime() - this.option('startDayHour') * 3600000) - timeZoneOffset;
    }

    _getDateByCellIndexes(rowIndex, cellIndex) {
        const date = super._getDateByCellIndexes(rowIndex, cellIndex);

        this._setStartDayHour(date);

        return date;
    }

    // TODO: temporary fix, in the future, if we replace table layout on div layout, getCellWidth method need remove. Details in T712431
    // TODO: there is a test for this bug, when changing the layout, the test will also be useless
    getCellWidth() {
        return this.cache.get('cellWidth', () => {
            const DAYS_IN_WEEK = 7;

            let averageWidth = 0;
            this._getCells().slice(0, DAYS_IN_WEEK).each((index, element) => averageWidth += getBoundingRect(element).width);

            return averageWidth / DAYS_IN_WEEK;
        });
    }

    _calculateHiddenInterval() {
        return 0;
    }

    _insertAllDayRowsIntoDateTable() {
        return false;
    }
    _getCellCoordinatesByIndex(index) {
        const rowIndex = Math.floor(index / this._getCellCount());
        const cellIndex = index - this._getCellCount() * rowIndex;

        return {
            rowIndex: rowIndex,
            cellIndex: cellIndex
        };
    }

    _createWorkSpaceElements() {
        if(this._isVerticalGroupedWorkSpace()) {
            this._createWorkSpaceScrollableElements();
        } else {
            super._createWorkSpaceElements();
        }
    }

    _needCreateCrossScrolling() {
        return this.option('crossScrollingEnabled') || this._isVerticalGroupedWorkSpace();
    }

    _renderTimePanel() { return noop(); }
    _renderAllDayPanel() { return noop(); }
    _getTableAllDay() { return noop(); }
    _toggleAllDayVisibility() { return noop(); }
    _changeAllDayVisibility() { return noop(); }

    _setFirstViewDate() {
        const firstMonthDate = dateUtils.getFirstMonthDate(this._getViewStartByOptions());
        this._firstViewDate = dateUtils.getFirstWeekDate(firstMonthDate, this.option('firstDayOfWeek') || dateLocalization.firstDayOfWeekIndex());
        this._setStartDayHour(this._firstViewDate);

        const date = this._getViewStartByOptions();
        this._minVisibleDate = new Date(date.setDate(1));
        this._maxVisibleDate = new Date(new Date(date.setMonth(date.getMonth() + this.option('intervalCount'))).setDate(0));
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

    _getStartViewDate() {
        const firstMonthDate = dateUtils.getFirstMonthDate(this.option('startDate'));
        return firstMonthDate;
    }

    _renderTableBody(options) {
        options.getCellText = this._getCellText.bind(this);
        super._renderTableBody(options);
    }

    _getCellText(rowIndex, cellIndex) {
        if(this.isGroupedByDate()) {
            cellIndex = Math.floor(cellIndex / this._getGroupCount());
        } else {
            cellIndex = cellIndex % this._getCellCount();
        }

        const date = this._getDate(rowIndex, cellIndex);

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
        const result = new Date(this._firstViewDate);
        const lastRowInDay = this._getRowCount();

        result.setDate(result.getDate() + (week % lastRowInDay) * DAYS_IN_WEEK + day);
        return result;
    }

    _updateIndex(index) {
        return index;
    }

    _prepareCellData(rowIndex, cellIndex, cell) {
        const data = super._prepareCellData(rowIndex, cellIndex, cell);
        const $cell = $(cell);

        $cell
            .toggleClass(DATE_TABLE_CURRENT_DATE_CLASS, this._isCurrentDate(data.startDate))
            .toggleClass(DATE_TABLE_FIRST_OF_MONTH_CLASS, this._isFirstDayOfMonth(data.startDate))
            .toggleClass(DATE_TABLE_OTHER_MONTH_DATE_CLASS, this._isOtherMonth(data.startDate));

        return data;
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

    _getDateTableBorderOffset() {
        return this._getDateTableBorder();
    }

    _getCellPositionByIndex(index, groupIndex) {
        const position = super._getCellPositionByIndex(index, groupIndex);
        const rowIndex = this._getCellCoordinatesByIndex(index).rowIndex;
        let calculatedTopOffset;
        if(!this._isVerticalGroupedWorkSpace()) {
            calculatedTopOffset = this.getCellHeight() * rowIndex;
        } else {
            calculatedTopOffset = this.getCellHeight() * (rowIndex + groupIndex * this._getRowCount());
        }

        if(calculatedTopOffset) {
            position.top = calculatedTopOffset;
        }
        return position;
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
}

registerComponent('dxSchedulerWorkSpaceMonth', SchedulerWorkSpaceMonth);

export default SchedulerWorkSpaceMonth;
