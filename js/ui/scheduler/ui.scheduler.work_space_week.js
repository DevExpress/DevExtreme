"use strict";

var $ = require("../../core/renderer"),
    registerComponent = require("../../core/component_registrator"),
    dateUtils = require("../../core/utils/date"),
    dateLocalization = require("../../localization/date"),
    each = require("../../core/utils/iterator").each,
    SchedulerWorkSpace = require("./ui.scheduler.work_space");

var WEEK_CLASS = "dx-scheduler-work-space-week";
var DATE_TIME_INDICATOR_CLASS = "dx-scheduler-date-time-indicator",
    DATE_TIME_INDICATOR_TOP_CLASS = "dx-scheduler-date-time-indicator-top",
    DATE_TIME_INDICATOR_BOTTOM_CLASS = "dx-scheduler-date-time-indicator-bottom",
    DATE_TIME_INDICATOR_CONTENT_CLASS = "dx-scheduler-date-time-indicator-content";

var toMs = dateUtils.dateToMilliseconds;
var SchedulerWorkSpaceWeek = SchedulerWorkSpace.inherit({
    _getElementClass: function() {
        return WEEK_CLASS;
    },

    _getRowCount: function() {
        return this._getCellCountInDay();
    },

    _getCellCount: function() {
        return 7 * this.option("intervalCount");
    },

    _getDateByIndex: function(headerIndex) {
        var resultDate = new Date(this._firstViewDate);
        resultDate.setDate(this._firstViewDate.getDate() + headerIndex);
        return resultDate;
    },

    _getFormat: function() {
        return this._formatWeekdayAndDay;
    },

    _getStartViewDate: function() {
        return dateUtils.getFirstWeekDate(this.option("startDate"), this._firstDayOfWeek() || dateLocalization.firstDayOfWeekIndex());
    },

    _getIntervalDuration: function() {
        return toMs("day") * 7 * this.option("intervalCount");
    },

    _getCellsBetween: function($first, $last) {
        if(this._hasAllDayClass($last)) {
            return this.callBase($first, $last);
        }

        var $cells = this._getCells(),
            firstColumn = $first.index(),
            firstRow = $first.parent().index(),
            lastColumn = $last.index(),
            lastRow = $last.parent().index(),
            groupCount = this._getGroupCount(),
            cellCount = groupCount > 0 ? this._getTotalCellCount(groupCount) : this._getCellCount(),
            rowCount = this._getTotalRowCount(groupCount),
            result = [];

        for(var i = 0; i < cellCount; i++) {
            for(var j = 0; j < rowCount; j++) {
                var cell = $cells.get(cellCount * j + i);
                result.push(cell);
            }
        }

        var newFirstIndex = rowCount * firstColumn + firstRow,
            newLastIndex = rowCount * lastColumn + lastRow;

        if(newFirstIndex > newLastIndex) {
            var buffer = newFirstIndex;
            newFirstIndex = newLastIndex;
            newLastIndex = buffer;
        }

        $cells = $(result).slice(newFirstIndex, newLastIndex + 1);

        if(!!this._getGroupCount()) {
            var arr = [],
                focusedGroupIndex = this._getGroupIndexByCell($first);
            each($cells, (function(_, cell) {
                var groupIndex = this._getGroupIndexByCell($(cell));
                if(focusedGroupIndex === groupIndex) {
                    arr.push(cell);
                }
            }).bind(this));
            $cells = $(arr);
        }
        return $cells;
    },

    _getDateTimeIndicatorHeight: function() {
        var today = this.option("_currentDateTime") || new Date(),
            cellHeight = this.getCellHeight(),
            date = new Date(this._firstViewDate);

        date.setDate(today.getDate());

        var duration = today.getTime() - date.getTime(),
            cellCount = duration / this.getCellDuration();

        return cellCount * cellHeight;
    },

    _renderDateTimeIndicator: function() {
        if(this.option("showCurrentTimeIndicator") && this._needRenderDateTimeIndicator()) {
            var $container = this._dateTableScrollable.content(),
                indicatorHeight = this._getDateTimeIndicatorHeight(),
                maxHeight = $container.outerHeight(),
                renderIndicatorContent = true;

            if(indicatorHeight > maxHeight) {
                indicatorHeight = maxHeight;
                renderIndicatorContent = false;
            }

            if(indicatorHeight > 0) {
                this._$indicator = $("<div>").addClass(DATE_TIME_INDICATOR_CLASS);
                this._$indicator.height(indicatorHeight);

                this._$firstIndicator = $("<div>").addClass(DATE_TIME_INDICATOR_TOP_CLASS);
                var indicatorWidth = this._getDateTimeIndicatorWidth();
                indicatorWidth && this._$firstIndicator.width(indicatorWidth) && this._$firstIndicator.height(indicatorHeight);

                this._$secondIndicator = $("<div>").addClass(DATE_TIME_INDICATOR_BOTTOM_CLASS);
                this._$secondIndicator.width(indicatorWidth - this.getCellWidth()) && this._$secondIndicator.height(maxHeight - indicatorHeight);

                this._$indicator.append(this._$firstIndicator);
                this._$indicator.append(this._$secondIndicator);

                this._renderAllDayIndicator();

                this._$allDayIndicator && this._$allDayIndicator.width(indicatorWidth);

                if(renderIndicatorContent) {
                    var $content = $("<div>").addClass(DATE_TIME_INDICATOR_CONTENT_CLASS).addClass("dx-icon-spinright");
                    $content.css("top", indicatorHeight - 10);
                    this._$indicator.append($content);
                }
                $container.append(this._$indicator);
            }
        }
    },

    _getDateTimeIndicatorWidth: function() {
        var today = this.option("_currentDateTime") || new Date(),
            firstViewDate = new Date(this._firstViewDate);

        var timeDiff = today.getTime() - firstViewDate.getTime();
        var difference = Math.ceil(timeDiff / toMs("day"));

        return difference * this.getCellWidth();
    },

    _needRenderDateTimeIndicator: function() {
        var now = this.option("_currentDateTime") || new Date();

        return dateUtils.dateInRange(now, this.getStartViewDate(), this.getEndViewDate());
    },

    _isCurrentTime: function(date) {
        if(this.option("showCurrentTimeIndicator") && this._needRenderDateTimeIndicator()) {
            var now = this.option("_currentDateTime") || new Date(),
                result = false;
            date = new Date(date);

            date.setFullYear(now.getFullYear(), now.getMonth(), now.getDate());

            var startCellDate = new Date(date),
                endCellDate = new Date(date);

            if(dateUtils.sameDate(now, date)) {
                startCellDate = startCellDate.setMilliseconds(date.getMilliseconds() - this.getCellDuration());
                endCellDate = endCellDate.setMilliseconds(date.getMilliseconds() + this.getCellDuration());

                result = dateUtils.dateInRange(now, startCellDate, endCellDate);
            }
            return result;
        }
    },

    _getRightCell: function(isMultiSelection) {
        if(!isMultiSelection) {
            return this.callBase(isMultiSelection);
        }
        var $rightCell,
            $focusedCell = this._$focusedCell,
            groupCount = this._getGroupCount(),
            rowCellCount = isMultiSelection ? this._getCellCount() : this._getTotalCellCount(groupCount),
            edgeCellIndex = this._isRTL() ? 0 : rowCellCount - 1,
            direction = this._isRTL() ? "prev" : "next";

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
        var $leftCell,
            $focusedCell = this._$focusedCell,
            groupCount = this._getGroupCount(),
            rowCellCount = isMultiSelection ? this._getCellCount() : this._getTotalCellCount(groupCount),
            edgeCellIndex = this._isRTL() ? rowCellCount - 1 : 0,
            direction = this._isRTL() ? "next" : "prev";

        if($focusedCell.index() === edgeCellIndex || this._isGroupStartCell($focusedCell)) {
            $leftCell = $focusedCell;
        } else {
            $leftCell = $focusedCell[direction]();
            $leftCell = this._checkForViewBounds($leftCell);
        }

        return $leftCell;
    }
});

registerComponent("dxSchedulerWorkSpaceWeek", SchedulerWorkSpaceWeek);

module.exports = SchedulerWorkSpaceWeek;
