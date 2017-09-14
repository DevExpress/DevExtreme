"use strict";

var $ = require("../../core/renderer"),
    noop = require("../../core/utils/common").noop,
    extend = require("../../core/utils/extend").extend,
    registerComponent = require("../../core/component_registrator"),
    SchedulerWorkSpace = require("./ui.scheduler.work_space"),
    dateUtils = require("../../core/utils/date"),
    tableCreator = require("./ui.scheduler.table_creator");

var TIMELINE_CLASS = "dx-scheduler-timeline",
    GROUP_TABLE_CLASS = "dx-scheduler-group-table",

    TIMELINE_GROUPED_ATTR = "dx-group-column-count";

var HORIZONTAL = "horizontal",
    DATE_TABLE_CELL_HEIGHT = 75,
    DATE_TABLE_CELL_BORDER = 1,
    toMs = dateUtils.dateToMilliseconds;

var DATE_TIME_INDICATOR_CLASS = "dx-scheduler-date-time-indicator",
    DATE_TIME_INDICATOR_CONTENT_CLASS = "dx-scheduler-date-time-indicator-content";

var SchedulerTimeline = SchedulerWorkSpace.inherit({
    _init: function() {
        this.callBase();
        this.$element().addClass(TIMELINE_CLASS);
        this._$sidebarTable = $("<table>")
            .addClass(GROUP_TABLE_CLASS);
    },
    _getCellFromNextRow: function(direction, isMultiSelection) {
        if(!isMultiSelection) {
            return this.callBase(direction, isMultiSelection);
        }

        return this._$focusedCell;
    },

    _getRightCell: function() {
        var $rightCell,
            $focusedCell = this._$focusedCell,
            rowCellCount = this._getCellCount(),
            edgeCellIndex = this._isRTL() ? 0 : rowCellCount - 1,
            direction = this._isRTL() ? "prev" : "next";

        if($focusedCell.index() === edgeCellIndex) {
            $rightCell = $focusedCell;
        } else {
            $rightCell = $focusedCell[direction]();
            $rightCell = this._checkForViewBounds($rightCell);
        }
        return $rightCell;
    },

    _getLeftCell: function() {
        var $leftCell,
            $focusedCell = this._$focusedCell,
            rowCellCount = this._getCellCount(),
            edgeCellIndex = this._isRTL() ? rowCellCount - 1 : 0,
            direction = this._isRTL() ? "next" : "prev";

        if($focusedCell.index() === edgeCellIndex) {
            $leftCell = $focusedCell;
        } else {
            $leftCell = $focusedCell[direction]();
            $leftCell = this._checkForViewBounds($leftCell);
        }

        return $leftCell;
    },

    _getRowCount: function() {
        return 1;
    },

    _getCellCount: function() {
        return this._getCellCountInDay() * this.option("intervalCount");
    },

    _getTotalCellCount: function() {
        return this._getCellCount();
    },

    _getTotalRowCount: function(groupCount) {
        groupCount = groupCount || 1;
        return this._getRowCount() * groupCount;
    },

    _getDateByIndex: function(index) {
        var resultDate = new Date(this._firstViewDate),
            dayIndex = Math.floor(index / this._getCellCountInDay());
        resultDate.setTime(this._firstViewDate.getTime() + this._calculateCellIndex(0, index) * this._getInterval() + dayIndex * this._getHiddenInterval());
        return resultDate;
    },

    _getFormat: function() {
        return "shorttime";
    },

    _calculateHiddenInterval: function(rowIndex, cellIndex) {
        var dayIndex = Math.floor(cellIndex / this._getCellCountInDay());
        return dayIndex * this._getHiddenInterval();
    },

    _createWorkSpaceElements: function() {
        this._createWorkSpaceScrollableElements();
    },

    _getWorkSpaceHeight: function() {
        if(this.option("crossScrollingEnabled")) {
            return this._$dateTable.outerHeight();
        }

        return this.$element().outerHeight();
    },

    _dateTableScrollableConfig: function() {
        var that = this,
            config = this.callBase(),
            timelineConfig = {
                direction: HORIZONTAL,
                onScroll: function(e) {
                    if(!that._dateTableScrollWasHandled) {
                        that._headerScrollWasHandled = true;
                        that._headerScrollable.scrollTo({
                            left: e.scrollOffset.left
                        });
                    } else {
                        that._dateTableScrollWasHandled = false;
                    }
                }
            };

        return this.option("crossScrollingEnabled") ? config : extend(config, timelineConfig);
    },

    _renderTimePanel: noop,
    _renderAllDayPanel: noop,
    _getTableAllDay: function() {
        return false;
    },
    _getDateHeaderTemplate: function() {
        return this.option("timeCellTemplate");
    },
    _toggleAllDayVisibility: noop,
    _changeAllDayVisibility: noop,

    supportAllDayRow: function() {
        return false;
    },

    _getGroupHeaderContainer: function() {
        return this._$sidebarTable;
    },

    _renderView: function() {
        this._setFirstViewDate();
        var groupCellTemplates = this._renderGroupHeader();
        this._renderDateHeader();

        this._renderAllDayPanel();
        this._renderTimePanel();
        this._renderDateTable();
        this._renderDateTimeIndicator();

        this._$sidebarTable.appendTo(this._sidebarScrollable.content());

        this._setGroupHeaderCellsHeight();
        this._applyCellTemplates(groupCellTemplates);
    },

    _renderDateTimeIndicator: function() {
        if(this.option("showCurrentTimeIndicator") && this._needRenderDateTimeIndicator()) {
            var $container = this._dateTableScrollable.content(),
                indicatorWidth = this._getDateTimeIndicatorWidth(),
                maxWidth = $container.outerWidth(),
                renderIndicatorContent = true;

            if(indicatorWidth > maxWidth) {
                indicatorWidth = maxWidth;
                renderIndicatorContent = false;
            }

            if(indicatorWidth > 0) {
                this._$indicator = $("<div>").addClass(DATE_TIME_INDICATOR_CLASS);
                this._$indicator.width(indicatorWidth);

                if(renderIndicatorContent) {
                    var $content = $("<div>").addClass(DATE_TIME_INDICATOR_CONTENT_CLASS).addClass("dx-icon-spindown");
                    $content.css("left", indicatorWidth - 16);
                    this._$indicator.append($content);
                }
                $container.append(this._$indicator);
            }
        }
    },

    _getDateTimeIndicatorWidth: function() {
        var today = this._getToday(),
            cellWidth = this.getCellWidth(),
            date = new Date(this._firstViewDate),
            hiddenInterval = (24 - this.option("endDayHour") + this.option("startDayHour")) * toMs("hour"),
            timeDiff = today.getTime() - date.getTime();

        var differenceInDays = Math.ceil(timeDiff / toMs("day")) - 1,
            duration = timeDiff - differenceInDays * hiddenInterval,
            cellCount = duration / this.getCellDuration();

        return cellCount * cellWidth;
    },

    _isCurrentTimeHeaderCell: function(headerIndex) {
        var result = false;

        if(this.option("showCurrentTimeIndicator") && this._needRenderDateTimeIndicator()) {
            var date = this._getDateByIndex(headerIndex);

            var now = this._getToday();
            date = new Date(date);

            if(dateUtils.sameDate(now, date)) {
                var startCellDate = new Date(date),
                    endCellDate = new Date(date);
                endCellDate = endCellDate.setMilliseconds(date.getMilliseconds() + this.getCellDuration());

                result = dateUtils.dateInRange(now, startCellDate, endCellDate);
            }
        }

        return result;
    },

    _cleanView: function() {
        this.callBase();
        this._$sidebarTable.empty();
    },

    _visibilityChanged: function(visible) {
        this._setGroupHeaderCellsHeight();
        this.callBase(visible);
    },

    _setTableSizes: function() {
        this.callBase();
        var cellHeight = DATE_TABLE_CELL_HEIGHT,
            minHeight = this._getWorkSpaceMinHeight(),
            $groupCells = this._$sidebarTable
                .find("tr");

        var height = cellHeight * $groupCells.length;
        if(height < minHeight) {
            height = minHeight;
        }

        this._$sidebarTable.height(height);
        this._$dateTable.height(height);
    },

    _getWorkSpaceMinHeight: function() {
        var minHeight = this._getWorkSpaceHeight(),
            workspaceContainerHeight = this.$element().outerHeight(true) - this.getHeaderPanelHeight();

        if(minHeight < workspaceContainerHeight) {
            minHeight = workspaceContainerHeight;
        }

        return minHeight;
    },

    _makeGroupRows: function(groups) {
        return tableCreator.makeGroupedTable(tableCreator.VERTICAL, groups, {
            groupHeaderRowClass: this._getGroupRowClass(),
            groupHeaderClass: this._getGroupHeaderClass(),
            groupHeaderContentClass: this._getGroupHeaderContentClass()
        }, undefined, this.option("resourceCellTemplate"));
    },

    _setGroupHeaderCellsHeight: function() {
        var cellHeight = this.getCellHeight() - DATE_TABLE_CELL_BORDER * 2;
        cellHeight = this._ensureGroupHeaderCellsHeight(cellHeight);

        this._getGroupHeaderCellsContent().css("height", cellHeight);
    },

    _ensureGroupHeaderCellsHeight: function(cellHeight) {
        var minCellHeight = this._calculateMinCellHeight();

        if(cellHeight < minCellHeight) {
            return minCellHeight;
        }
        return cellHeight;
    },

    _calculateMinCellHeight: function() {
        var dateTable = this._getDateTable(),
            dateTableRowSelector = "." + this._getDateTableRowClass();

        return (dateTable.outerHeight() / dateTable.find(dateTableRowSelector).length) - DATE_TABLE_CELL_BORDER * 2;
    },

    _detachGroupCountAttr: function() {
        this.$element().removeAttr(TIMELINE_GROUPED_ATTR);
    },

    _attachGroupCountAttr: function() {
        this.$element().attr(TIMELINE_GROUPED_ATTR, this.option("groups").length);
    },

    _getCellCoordinatesByIndex: function(index) {
        return {
            cellIndex: index % this._getCellCount(),
            rowIndex: 0
        };
    },

    _getCellByCoordinates: function(cellCoordinates, groupIndex) {
        return this._$dateTable
            .find("tr")
            .eq(cellCoordinates.rowIndex + groupIndex)
            .find("td")
            .eq(cellCoordinates.cellIndex);
    },

    _calculateCellIndex: function(rowIndex, cellIndex) {
        return cellIndex;
    },

    _getGroupIndex: function(rowIndex) {
        return rowIndex;
    },

    _getWorkSpaceWidth: function() {
        return this._$dateTable.outerWidth(true);
    },

    _calculateHeaderCellRepeatCount: function() {
        return 1;
    },

    _getGroupIndexByCell: function($cell) {
        return $cell.parent().index();
    },

    _getIntervalBetween: function(currentDate, allDay) {
        var startDayHour = this.option("startDayHour"),
            endDayHour = this.option("endDayHour"),
            firstViewDate = this.getStartViewDate(),
            firstViewDateTime = firstViewDate.getTime(),
            hiddenInterval = (24 - endDayHour + startDayHour) * toMs("hour"),
            timeZoneOffset = dateUtils.getTimezonesDifference(firstViewDate, currentDate),
            apptStart = currentDate.getTime(),
            fullInterval = apptStart - firstViewDateTime - timeZoneOffset,
            fullDays = Math.floor(fullInterval / (toMs("day"))),
            tailDuration = fullInterval - (fullDays * toMs("day")),
            tailDelta = 0,
            cellCount = this._getCellCountInDay() * (fullDays - this._getWeekendsCount(fullDays)),
            gapBeforeAppt = apptStart - dateUtils.trimTime(new Date(currentDate)).getTime(),
            result = cellCount * this.option("hoursInterval") * toMs("hour");

        if(!allDay) {
            if(currentDate.getHours() < startDayHour) {
                tailDelta = tailDuration - hiddenInterval + gapBeforeAppt;
            } else if(currentDate.getHours() >= startDayHour && currentDate.getHours() < endDayHour) {
                tailDelta = tailDuration;
            } else if(currentDate.getHours() >= startDayHour && currentDate.getHours() >= endDayHour) {
                tailDelta = tailDuration - (gapBeforeAppt - endDayHour * toMs("hour"));
            } else if(!fullDays) {
                result = fullInterval;
            }

            result += tailDelta;
        }

        return result;
    },

    _getWeekendsCount: function() {
        return 0;
    },

    getAllDayContainer: function() {
        return null;
    },

    getTimePanelWidth: function() {
        return 0;
    },

    getPositionShift: function(timeShift) {
        var positionShift = this.callBase(timeShift),
            left = this.getCellWidth() * timeShift;

        if(this.option("rtlEnabled")) {
            left *= -1;
        }

        left += positionShift.left;

        return {
            top: 0,
            left: left
        };
    },

    getVisibleBounds: function() {
        var isRtl = this.option("rtlEnabled");

        var result = {},
            $scrollable = this.getScrollable().$element(),
            cellWidth = this.getCellWidth(),
            scrollableOffset = isRtl ? (this.getScrollableOuterWidth() - this.getScrollableScrollLeft()) : this.getScrollableScrollLeft(),
            scrolledCellCount = scrollableOffset / cellWidth,
            visibleCellCount = $scrollable.width() / cellWidth,
            totalCellCount = isRtl ? scrolledCellCount - visibleCellCount : scrolledCellCount + visibleCellCount,
            leftDate = this._getDateByIndex(scrolledCellCount),
            rightDate = this._getDateByIndex(totalCellCount);

        if(isRtl) {
            leftDate = this._getDateByIndex(totalCellCount);
            rightDate = this._getDateByIndex(scrolledCellCount);
        }

        result.left = {
            hours: leftDate.getHours(),
            minutes: leftDate.getMinutes() >= 30 ? 30 : 0,
            date: dateUtils.trimTime(leftDate)
        };

        result.right = {
            hours: rightDate.getHours(),
            minutes: rightDate.getMinutes() >= 30 ? 30 : 0,
            date: dateUtils.trimTime(rightDate)
        };

        return result;
    },

    needUpdateScrollPosition: function(hours, minutes, bounds, date) {
        var isUpdateNeeded = false;

        isUpdateNeeded = this._dateWithinBounds(bounds, date);

        if(hours < bounds.left.hours || hours > bounds.right.hours) {
            isUpdateNeeded = true;
        }

        if(hours === bounds.left.hours && minutes < bounds.left.minutes) {
            isUpdateNeeded = true;
        }

        if(hours === bounds.right.hours && minutes > bounds.right.minutes) {
            isUpdateNeeded = true;
        }

        return isUpdateNeeded;
    },

    _dateWithinBounds: function(bounds, date) {
        var trimmedDate = dateUtils.trimTime(new Date(date)),
            isUpdateNeeded = false;

        if(trimmedDate < bounds.left.date || trimmedDate > bounds.right.date) {
            isUpdateNeeded = true;
        }

        return isUpdateNeeded;
    },

    scrollToTime: function(hours, minutes, date) {
        var coordinates = this._getScrollCoordinates(hours, minutes, date),
            scrollable = this.getScrollable(),
            offset = this.option("rtlEnabled") ? this.getScrollableContainer().outerWidth() : 0;

        scrollable.scrollBy({ left: coordinates.left - scrollable.scrollLeft() - offset, top: 0 });
    }
});

registerComponent("dxSchedulerTimeline", SchedulerTimeline);

module.exports = SchedulerTimeline;
