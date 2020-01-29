const $ = require('../../../core/renderer');
const noop = require('../../../core/utils/common').noop;
const registerComponent = require('../../../core/component_registrator');
const SchedulerWorkSpace = require('./ui.scheduler.work_space.indicator');
const dateUtils = require('../../../core/utils/date');
const dateLocalization = require('../../../localization/date');

const MONTH_CLASS = 'dx-scheduler-work-space-month';

const DATE_TABLE_CURRENT_DATE_CLASS = 'dx-scheduler-date-table-current-date';
const DATE_TABLE_FIRST_OF_MONTH_CLASS = 'dx-scheduler-date-table-first-of-month';
const DATE_TABLE_OTHER_MONTH_DATE_CLASS = 'dx-scheduler-date-table-other-month';
const DATE_TABLE_SCROLLABLE_FIXED_CLASS = 'dx-scheduler-scrollable-fixed-content';

const DAYS_IN_WEEK = 7;
const DAY_IN_MILLISECONDS = 86400000;

const toMs = dateUtils.dateToMilliseconds;

const SchedulerWorkSpaceMonth = SchedulerWorkSpace.inherit({
    _toggleFixedScrollableClass: function() {
        this._dateTableScrollable.$content().toggleClass(DATE_TABLE_SCROLLABLE_FIXED_CLASS, !this._isWorkSpaceWithCount() && !this._isVerticalGroupedWorkSpace());
    },

    _getElementClass: function() {
        return MONTH_CLASS;
    },

    _getRowCount: function() {
        return this._isWorkSpaceWithCount() ? 4 * this.option('intervalCount') + 2 : 6;
    },

    _getCellCount: function() {
        return DAYS_IN_WEEK;
    },

    _getDateByIndex: function(headerIndex) {
        const resultDate = new Date(this._firstViewDate);
        resultDate.setDate(this._firstViewDate.getDate() + headerIndex);

        return resultDate;
    },

    _getFormat: function() {
        return this._formatWeekday;
    },

    _calculateCellIndex: function(rowIndex, cellIndex) {
        if(this._isVerticalGroupedWorkSpace()) {
            rowIndex = rowIndex % this._getRowCount();
        } else {
            cellIndex = cellIndex % this._getCellCount();
        }

        return rowIndex * this._getCellCount() + cellIndex;
    },

    _getInterval: function() {
        return DAY_IN_MILLISECONDS;
    },

    _getIntervalBetween: function(currentDate) {
        const firstViewDate = this.getStartViewDate();
        const timeZoneOffset = dateUtils.getTimezonesDifference(firstViewDate, currentDate);

        return currentDate.getTime() - (firstViewDate.getTime() - this.option('startDayHour') * 3600000) - timeZoneOffset;
    },

    _getDateByCellIndexes: function(rowIndex, cellIndex) {
        const date = this.callBase(rowIndex, cellIndex);

        this._setStartDayHour(date);

        return date;
    },

    // TODO: temporary fix, in the future, if we replace table layout on div layout, getCellWidth method need remove. Details in T712431
    // TODO: there is a test for this bug, when changing the layout, the test will also be useless
    getCellWidth: function() {
        const DAYS_IN_WEEK = 7;

        let averageWidth = 0;
        this._getCells().slice(0, DAYS_IN_WEEK).each((index, element) => averageWidth += element.getBoundingClientRect().width);

        return averageWidth / DAYS_IN_WEEK;
    },

    _calculateHiddenInterval: function() {
        return 0;
    },

    _insertAllDayRowsIntoDateTable: function() {
        return false;
    },
    _getCellCoordinatesByIndex: function(index) {
        const rowIndex = Math.floor(index / this._getCellCount());
        const cellIndex = index - this._getCellCount() * rowIndex;

        return {
            rowIndex: rowIndex,
            cellIndex: cellIndex
        };
    },

    _createWorkSpaceElements: function() {
        if(this._isVerticalGroupedWorkSpace()) {
            this._createWorkSpaceScrollableElements();
        } else {
            this.callBase();
        }
    },

    _needCreateCrossScrolling: function() {
        return this.option('crossScrollingEnabled') || this._isVerticalGroupedWorkSpace();
    },

    _renderTimePanel: noop,
    _renderAllDayPanel: noop,
    _getTableAllDay: noop,
    _toggleAllDayVisibility: noop,
    _changeAllDayVisibility: noop,

    _setFirstViewDate: function() {
        const firstMonthDate = dateUtils.getFirstMonthDate(this._getViewStartByOptions());
        this._firstViewDate = dateUtils.getFirstWeekDate(firstMonthDate, this.option('firstDayOfWeek') || dateLocalization.firstDayOfWeekIndex());
        this._setStartDayHour(this._firstViewDate);

        const date = this._getViewStartByOptions();
        this._minVisibleDate = new Date(date.setDate(1));
        this._maxVisibleDate = new Date(new Date(date.setMonth(date.getMonth() + this.option('intervalCount'))).setDate(0));
    },

    _getViewStartByOptions: function() {
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
    },

    _getStartViewDate: function() {
        const firstMonthDate = dateUtils.getFirstMonthDate(this.option('startDate'));
        return firstMonthDate;
    },

    _renderTableBody: function(options) {
        options.getCellText = this._getCellText.bind(this);
        this.callBase(options);
    },

    _getCellText: function(rowIndex, cellIndex) {
        if(this.option('groupByDate') && this._getGroupCount()) {
            cellIndex = Math.floor(cellIndex / this._getGroupCount());
        } else {
            cellIndex = cellIndex % this._getCellCount();
        }

        const date = this._getDate(rowIndex, cellIndex);

        if(this._isWorkSpaceWithCount() && this._isFirstDayOfMonth(date)) {
            return this._formatMonthAndDay(date);
        }
        return dateLocalization.format(date, 'dd');
    },

    _formatMonthAndDay: function(date) {
        const monthName = dateLocalization.getMonthNames('abbreviated')[date.getMonth()];
        return [monthName, dateLocalization.format(date, 'day')].join(' ');
    },

    _getDate: function(week, day) {
        const result = new Date(this._firstViewDate);
        const lastRowInDay = this._getRowCount();

        result.setDate(result.getDate() + (week % lastRowInDay) * DAYS_IN_WEEK + day);
        return result;
    },

    _updateIndex: function(index) {
        return index;
    },

    _prepareCellData: function(rowIndex, cellIndex, cell) {
        const data = this.callBase(rowIndex, cellIndex, cell);
        const $cell = $(cell);

        $cell
            .toggleClass(DATE_TABLE_CURRENT_DATE_CLASS, this._isCurrentDate(data.startDate))
            .toggleClass(DATE_TABLE_FIRST_OF_MONTH_CLASS, this._isFirstDayOfMonth(data.startDate))
            .toggleClass(DATE_TABLE_OTHER_MONTH_DATE_CLASS, this._isOtherMonth(data.startDate));

        return data;
    },

    _isCurrentDate: function(cellDate) {
        const today = new Date();

        return dateUtils.sameDate(cellDate, today);
    },

    _isFirstDayOfMonth: function(cellDate) {
        return this._isWorkSpaceWithCount() && cellDate.getDate() === 1;
    },

    _isOtherMonth: function(cellDate) {
        return !dateUtils.dateInRange(cellDate, this._minVisibleDate, this._maxVisibleDate, 'date');
    },

    needRenderDateTimeIndication: function() {
        return false;
    },

    getCellDuration: function() {
        return this._calculateDayDuration() * 3600000;
    },

    getIntervalDuration: function() {
        return toMs('day');
    },

    getTimePanelWidth: function() {
        return 0;
    },

    getPositionShift: function(timeShift) {
        return {
            cellPosition: timeShift * this.getCellWidth(),
            top: 0,
            left: 0
        };
    },

    getCellCountToLastViewDate: function(date) {
        const firstDateTime = date.getTime();
        const lastDateTime = this.getEndViewDate().getTime();
        const dayDurationInMs = this.getCellDuration();

        return Math.ceil((lastDateTime - firstDateTime) / dayDurationInMs);
    },

    supportAllDayRow: function() {
        return false;
    },

    keepOriginalHours: function() {
        return true;
    },

    calculateEndDate: function(startDate) {
        const startDateCopy = new Date(startDate);
        return new Date(startDateCopy.setHours(this.option('endDayHour')));
    },

    getWorkSpaceLeftOffset: function() {
        return 0;
    },

    needApplyCollectorOffset: function() {
        return true;
    },

    _getDateTableBorderOffset: function() {
        return this._getDateTableBorder();
    },

    _getCellPositionByIndex: function(index, groupIndex) {
        const position = this.callBase(index, groupIndex);
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
    },

    _getHeaderDate: function() {
        return this._getViewStartByOptions();
    },

    _supportCompactDropDownAppointments: function() {
        return false;
    },

    scrollToTime: noop
});

registerComponent('dxSchedulerWorkSpaceMonth', SchedulerWorkSpaceMonth);

module.exports = SchedulerWorkSpaceMonth;
