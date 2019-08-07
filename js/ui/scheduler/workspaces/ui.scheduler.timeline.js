var $ = require("../../../core/renderer"),
    noop = require("../../../core/utils/common").noop,
    extend = require("../../../core/utils/extend").extend,
    registerComponent = require("../../../core/component_registrator"),
    SchedulerWorkSpace = require("./ui.scheduler.work_space.indicator"),
    dateUtils = require("../../../core/utils/date"),
    tableCreator = require("../ui.scheduler.table_creator"),
    HorizontalShader = require("../shaders/ui.scheduler.current_time_shader.horizontal");

var TIMELINE_CLASS = "dx-scheduler-timeline",
    GROUP_TABLE_CLASS = "dx-scheduler-group-table",

    HORIZONTAL_GROUPED_WORKSPACE_CLASS = "dx-scheduler-work-space-horizontal-grouped",

    HEADER_PANEL_CELL_CLASS = "dx-scheduler-header-panel-cell",
    HEADER_PANEL_WEEK_CELL_CLASS = "dx-scheduler-header-panel-week-cell",
    HEADER_ROW_CLASS = "dx-scheduler-header-row";

var HORIZONTAL = "horizontal",
    DATE_TABLE_CELL_BORDER = 1,
    toMs = dateUtils.dateToMilliseconds;

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

    _getDefaultGroupStrategy: function() {
        return "vertical";
    },

    _toggleGroupingDirectionClass: function() {
        this.$element().toggleClass(HORIZONTAL_GROUPED_WORKSPACE_CLASS, this._isHorizontalGroupedWorkSpace());
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            groupOrientation: "vertical"
        });
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

    getGroupTableWidth: function() {
        return this._$sidebarTable ? this._$sidebarTable.outerWidth() : 0;
    },

    _getTotalRowCount: function(groupCount) {
        if(this._isHorizontalGroupedWorkSpace()) {
            return this._getRowCount();
        } else {
            groupCount = groupCount || 1;
            return this._getRowCount() * groupCount;
        }
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

    _needApplyLastGroupCellClass: function() {
        return true;
    },

    _calculateHiddenInterval: function(rowIndex, cellIndex) {
        var dayIndex = Math.floor(cellIndex / this._getCellCountInDay());
        return dayIndex * this._getHiddenInterval();
    },

    _getMillisecondsOffset: function(rowIndex, cellIndex) {
        cellIndex = this._calculateCellIndex(rowIndex, cellIndex);

        return this._getInterval() * cellIndex + this._calculateHiddenInterval(rowIndex, cellIndex);
    },

    _createWorkSpaceElements: function() {
        this._createWorkSpaceScrollableElements();
    },

    _getWorkSpaceHeight: function() {
        if(this.option("crossScrollingEnabled")) {
            return this._$dateTable.get(0).getBoundingClientRect().height;
        }

        return this.$element().get(0).getBoundingClientRect().height;
    },

    _dateTableScrollableConfig: function() {
        var headerScrollableOnScroll;

        var config = this.callBase(),
            timelineConfig = {
                direction: HORIZONTAL,
                onStart: (function() {
                    if(this._headerScrollable) {
                        headerScrollableOnScroll = this._headerScrollable.option("onScroll");
                        this._headerScrollable.option("onScroll", undefined);
                    }
                }).bind(this),
                onScroll: (function(e) {
                    this._headerScrollable && this._headerScrollable.scrollTo({
                        left: e.scrollOffset.left
                    });
                }).bind(this),
                onEnd: (function(e) {
                    this._headerScrollable && this._headerScrollable.option("onScroll", headerScrollableOnScroll);
                }).bind(this)
            };

        return this.option("crossScrollingEnabled") ? config : extend(config, timelineConfig);
    },

    _headerScrollableConfig: function() {
        var config = this.callBase();

        return extend(config, {
            scrollByContent: true
        });
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
        if(this._isHorizontalGroupedWorkSpace()) {
            return this._$thead;
        }
        return this._$sidebarTable;
    },

    _insertAllDayRowsIntoDateTable: function() {
        return false;
    },

    _createAllDayPanelElements: noop,

    _renderDateHeader: function() {
        var $headerRow = this.callBase();

        if(this._needRenderWeekHeader()) {
            var firstViewDate = new Date(this._firstViewDate),
                $cells = [],
                colspan = this._getCellCountInDay(),
                cellTemplate = this.option("dateCellTemplate");

            for(var i = 0; i < this._getWeekDuration() * this.option("intervalCount"); i++) {
                var $th = $("<th>"),
                    text = this._formatWeekdayAndDay(firstViewDate);

                if(cellTemplate) {
                    var templateOptions = {
                        model: {
                            text: text,
                            date: new Date(firstViewDate)
                        },
                        container: $th,
                        index: i
                    };

                    cellTemplate.render(templateOptions);
                } else {
                    $th.text(text);
                }

                $th.addClass(HEADER_PANEL_CELL_CLASS).addClass(HEADER_PANEL_WEEK_CELL_CLASS).attr("colSpan", colspan);
                $cells.push($th);

                this._incrementDate(firstViewDate);
            }

            var $row = $("<tr>").addClass(HEADER_ROW_CLASS).append($cells);
            $headerRow.before($row);
        }
    },

    _needRenderWeekHeader: function() {
        return false;
    },

    _incrementDate: function(date) {
        date.setDate(date.getDate() + 1);
    },

    _getWeekDuration: function() {
        return 1;
    },

    _renderView: function() {
        this._setFirstViewDate();
        var groupCellTemplates = this._renderGroupHeader();
        this._renderDateHeader();

        this._renderAllDayPanel();
        this._renderTimePanel();
        this._renderDateTable();

        this._shader = new HorizontalShader();

        this._updateGroupTableHeight();

        this._$sidebarTable.appendTo(this._sidebarScrollable.$content());
        this._applyCellTemplates(groupCellTemplates);
    },

    _setHorizontalGroupHeaderCellsHeight: noop,

    getIndicationWidth: function() {
        var today = this._getToday(),
            cellWidth = this.getCellWidth(),
            date = this._getIndicationFirstViewDate(),
            hiddenInterval = this._getHiddenInterval(),
            timeDiff = today.getTime() - date.getTime();

        var differenceInDays = Math.ceil(timeDiff / toMs("day")) - 1,
            duration = timeDiff - differenceInDays * hiddenInterval,
            cellCount = duration / this.getCellDuration();

        return cellCount * cellWidth;
    },

    _renderIndicator: function(height, rtlOffset, $container, groupCount) {
        var $indicator,
            width = this.getIndicationWidth();

        if(this.option("groupOrientation") === "vertical") {
            $indicator = this._createIndicator($container);
            $indicator.height($container.get(0).getBoundingClientRect().height);
            $indicator.css("left", rtlOffset ? rtlOffset - width : width);
        } else {
            for(var i = 0; i < groupCount; i++) {
                var offset = this._getCellCount() * this.getCellWidth() * i;
                $indicator = this._createIndicator($container);
                $indicator.height($container.get(0).getBoundingClientRect().height);

                $indicator.css("left", rtlOffset ? rtlOffset - width - offset : width + offset);
            }
        }
    },

    _isVerticalShader: function() {
        return false;
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
        this.callBase(visible);
    },

    _setTableSizes: function() {
        var cellHeight = this.getCellHeight(),
            minHeight = this._getWorkSpaceMinHeight(),
            $groupCells = this._$sidebarTable
                .find("tr");

        var height = cellHeight * $groupCells.length;
        if(height < minHeight) {
            height = minHeight;
        }

        this._$sidebarTable.height(height);
        this._$dateTable.height(height);

        this.callBase();
    },

    _getWorkSpaceMinHeight: function() {
        var minHeight = this._getWorkSpaceHeight(),
            workspaceContainerHeight = this.$element().outerHeight(true) - this.getHeaderPanelHeight() - 2 * DATE_TABLE_CELL_BORDER - 1;

        if(minHeight < workspaceContainerHeight) {
            minHeight = workspaceContainerHeight;
        }

        return minHeight;
    },

    _makeGroupRows: function(groups, groupByDate) {
        var tableCreatorStrategy = this.option("groupOrientation") === "vertical" ? tableCreator.VERTICAL : tableCreator.HORIZONTAL;

        return tableCreator.makeGroupedTable(tableCreatorStrategy,
            groups, {
                groupRowClass: this._getGroupRowClass(),
                groupHeaderRowClass: this._getGroupRowClass(),
                groupHeaderClass: this._getGroupHeaderClass.bind(this),
                groupHeaderContentClass: this._getGroupHeaderContentClass()
            },
            this._getCellCount() || 1,
            this.option("resourceCellTemplate"),
            this._getTotalRowCount(this._getGroupCount()),
            groupByDate);
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

        return (dateTable.get(0).getBoundingClientRect().height / dateTable.find(dateTableRowSelector).length) - DATE_TABLE_CELL_BORDER * 2;
    },

    _getCellCoordinatesByIndex: function(index) {
        return {
            cellIndex: index % this._getCellCount(),
            rowIndex: 0
        };
    },

    _getCellByCoordinates: function(cellCoordinates, groupIndex) {
        var indexes = this._groupedStrategy.prepareCellIndexes(cellCoordinates, groupIndex);

        return this._$dateTable
            .find("tr")
            .eq(indexes.rowIndex)
            .find("td")
            .eq(indexes.cellIndex);
    },

    _getWorkSpaceWidth: function() {
        return this._$dateTable.outerWidth(true);
    },

    _getGroupIndexByCell: function($cell) {
        return $cell.parent().index();
    },

    _getIndicationFirstViewDate: function() {
        return new Date(this._firstViewDate);
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
            left: left,
            cellPosition: left
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

    getIntervalDuration: function(allDay) {
        return this.getCellDuration();
    },

    _dateWithinBounds: function(bounds, date) {
        var trimmedDate = dateUtils.trimTime(new Date(date)),
            isUpdateNeeded = false;

        if(trimmedDate < bounds.left.date || trimmedDate > bounds.right.date) {
            isUpdateNeeded = true;
        }

        return isUpdateNeeded;
    },

    _supportCompactDropDownAppointments: function() {
        return false;
    },

    getCellMinWidth: function() {
        return 0;
    },

    getWorkSpaceLeftOffset: function() {
        return 0;
    },

    scrollToTime: function(hours, minutes, date) {
        var coordinates = this._getScrollCoordinates(hours, minutes, date),
            scrollable = this.getScrollable(),
            offset = this.option("rtlEnabled") ? this.getScrollableContainer().get(0).getBoundingClientRect().width : 0;

        if(this.option("templatesRenderAsynchronously")) {
            setTimeout(function() {
                scrollable.scrollBy({ left: coordinates.left - scrollable.scrollLeft() - offset, top: 0 });
            });
        } else {
            scrollable.scrollBy({ left: coordinates.left - scrollable.scrollLeft() - offset, top: 0 });
        }
    }
});

registerComponent("dxSchedulerTimeline", SchedulerTimeline);

module.exports = SchedulerTimeline;
