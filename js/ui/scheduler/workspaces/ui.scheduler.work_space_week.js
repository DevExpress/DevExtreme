const $ = require('../../../core/renderer');
const registerComponent = require('../../../core/component_registrator');
const dateUtils = require('../../../core/utils/date');
const dateLocalization = require('../../../localization/date');
const each = require('../../../core/utils/iterator').each;
const SchedulerWorkSpace = require('./ui.scheduler.work_space.indicator');

const WEEK_CLASS = 'dx-scheduler-work-space-week';

const toMs = dateUtils.dateToMilliseconds;
const SchedulerWorkSpaceWeek = SchedulerWorkSpace.inherit({
    _getElementClass: function() {
        return WEEK_CLASS;
    },

    _getRowCount: function() {
        return this._getCellCountInDay();
    },

    _getCellCount: function() {
        return 7 * this.option('intervalCount');
    },

    _getDateByIndex: function(headerIndex) {
        const resultDate = new Date(this._firstViewDate);
        resultDate.setDate(this._firstViewDate.getDate() + headerIndex);
        return resultDate;
    },

    _getFormat: function() {
        return this._formatWeekdayAndDay;
    },

    _getStartViewDate: function() {
        return dateUtils.getFirstWeekDate(this.option('startDate'), this._firstDayOfWeek() || dateLocalization.firstDayOfWeekIndex());
    },

    _getIntervalDuration: function() {
        return toMs('day') * 7 * this.option('intervalCount');
    },

    _getCellsBetween: function($first, $last) {
        if(this._hasAllDayClass($last)) {
            return this.callBase($first, $last);
        }

        let $cells = this._getCells();
        const firstColumn = $first.index();
        const firstRow = $first.parent().index();
        const lastColumn = $last.index();
        const lastRow = $last.parent().index();
        const groupCount = this._getGroupCount();
        const cellCount = groupCount > 0 ? this._getTotalCellCount(groupCount) : this._getCellCount();
        const rowCount = this._getTotalRowCount(groupCount);
        const result = [];

        for(let i = 0; i < cellCount; i++) {
            for(let j = 0; j < rowCount; j++) {
                const cell = $cells.get(cellCount * j + i);
                result.push(cell);
            }
        }

        const lastCellGroup = this.getCellData($last).groups;
        const indexesDifference = this.option('showAllDayPanel') && this._isVerticalGroupedWorkSpace() ? this._getGroupIndexByResourceId(lastCellGroup) + 1 : 0;

        let newFirstIndex = rowCount * firstColumn + firstRow - indexesDifference;
        let newLastIndex = rowCount * lastColumn + lastRow - indexesDifference;

        if(newFirstIndex > newLastIndex) {
            const buffer = newFirstIndex;
            newFirstIndex = newLastIndex;
            newLastIndex = buffer;
        }

        $cells = $(result).slice(newFirstIndex, newLastIndex + 1);

        if(this._getGroupCount()) {
            const arr = [];
            const focusedGroupIndex = this._getGroupIndexByCell($first);
            each($cells, (function(_, cell) {
                const groupIndex = this._getGroupIndexByCell($(cell));
                if(focusedGroupIndex === groupIndex) {
                    arr.push(cell);
                }
            }).bind(this));
            $cells = $(arr);
        }
        return $cells;
    },

    _getRightCell: function(isMultiSelection) {
        if(!isMultiSelection) {
            return this.callBase(isMultiSelection);
        }
        let $rightCell;
        const $focusedCell = this._$focusedCell;
        const groupCount = this._getGroupCount();
        const rowCellCount = isMultiSelection ? this._getCellCount() : this._getTotalCellCount(groupCount);
        const edgeCellIndex = this._isRTL() ? 0 : rowCellCount - 1;
        const direction = this._isRTL() ? 'prev' : 'next';

        if($focusedCell.index() === edgeCellIndex || this._isGroupEndCell($focusedCell)) {
            $rightCell = $focusedCell;
        } else {
            $rightCell = $focusedCell[direction]();
            $rightCell = this._checkForViewBounds($rightCell);
        }
        return $rightCell;
    },

    _getLeftCell: function(isMultiSelection) {
        if(!isMultiSelection) {
            return this.callBase(isMultiSelection);
        }
        let $leftCell;
        const $focusedCell = this._$focusedCell;
        const groupCount = this._getGroupCount();
        const rowCellCount = isMultiSelection ? this._getCellCount() : this._getTotalCellCount(groupCount);
        const edgeCellIndex = this._isRTL() ? rowCellCount - 1 : 0;
        const direction = this._isRTL() ? 'next' : 'prev';

        if($focusedCell.index() === edgeCellIndex || this._isGroupStartCell($focusedCell)) {
            $leftCell = $focusedCell;
        } else {
            $leftCell = $focusedCell[direction]();
            $leftCell = this._checkForViewBounds($leftCell);
        }

        return $leftCell;
    },

    getPositionShift: function(timeShift, isAllDay) {
        if(!isAllDay && this.invoke('isAdaptive') && this.invoke('getMaxAppointmentCountPerCellByType') === 0) {
            return {
                top: 0,
                left: 0,
                cellPosition: 0
            };
        }
        return this.callBase(timeShift, isAllDay);
    },

    _isApplyCompactAppointmentOffset: function() {
        if(this.invoke('isAdaptive') && this.invoke('getMaxAppointmentCountPerCellByType') === 0) {
            return false;
        }
        return this.callBase();
    },
});

registerComponent('dxSchedulerWorkSpaceWeek', SchedulerWorkSpaceWeek);

module.exports = SchedulerWorkSpaceWeek;
