const $ = require('../../../core/renderer');
const noop = require('../../../core/utils/common').noop;
const extend = require('../../../core/utils/extend').extend;
const registerComponent = require('../../../core/component_registrator');
const SchedulerWorkSpace = require('./ui.scheduler.work_space.indicator');
const dateUtils = require('../../../core/utils/date');
const tableCreator = require('../ui.scheduler.table_creator');
const HorizontalShader = require('../shaders/ui.scheduler.current_time_shader.horizontal');

const TIMELINE_CLASS = 'dx-scheduler-timeline';
const GROUP_TABLE_CLASS = 'dx-scheduler-group-table';

const HORIZONTAL_GROUPED_WORKSPACE_CLASS = 'dx-scheduler-work-space-horizontal-grouped';

const HEADER_PANEL_CELL_CLASS = 'dx-scheduler-header-panel-cell';
const HEADER_PANEL_WEEK_CELL_CLASS = 'dx-scheduler-header-panel-week-cell';
const HEADER_ROW_CLASS = 'dx-scheduler-header-row';

const HORIZONTAL = 'horizontal';
const DATE_TABLE_CELL_BORDER = 1;
const DATE_TABLE_HEADER_MARGIN = 10;
const toMs = dateUtils.dateToMilliseconds;

const SchedulerTimeline = SchedulerWorkSpace.inherit({
    _init: function() {
        this.callBase();
        this.$element().addClass(TIMELINE_CLASS);
        this._$sidebarTable = $('<div>')
            .addClass(GROUP_TABLE_CLASS);
    },
    _getCellFromNextRow: function(direction, isMultiSelection) {
        if(!isMultiSelection) {
            return this.callBase(direction, isMultiSelection);
        }

        return this._$focusedCell;
    },

    _getDefaultGroupStrategy: function() {
        return 'vertical';
    },

    _toggleGroupingDirectionClass: function() {
        this.$element().toggleClass(HORIZONTAL_GROUPED_WORKSPACE_CLASS, this._isHorizontalGroupedWorkSpace());
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            groupOrientation: 'vertical'
        });
    },

    _getRightCell: function() {
        let $rightCell;
        const $focusedCell = this._$focusedCell;
        const rowCellCount = this._getCellCount();
        const edgeCellIndex = this._isRTL() ? 0 : rowCellCount - 1;
        const direction = this._isRTL() ? 'prev' : 'next';

        if($focusedCell.index() === edgeCellIndex) {
            $rightCell = $focusedCell;
        } else {
            $rightCell = $focusedCell[direction]();
            $rightCell = this._checkForViewBounds($rightCell);
        }
        return $rightCell;
    },

    _getLeftCell: function() {
        let $leftCell;
        const $focusedCell = this._$focusedCell;
        const rowCellCount = this._getCellCount();
        const edgeCellIndex = this._isRTL() ? rowCellCount - 1 : 0;
        const direction = this._isRTL() ? 'next' : 'prev';

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
        return this._getCellCountInDay() * this.option('intervalCount');
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
        const resultDate = new Date(this._firstViewDate);
        const dayIndex = Math.floor(index / this._getCellCountInDay());
        resultDate.setTime(this._firstViewDate.getTime() + this._calculateCellIndex(0, index) * this._getInterval() + dayIndex * this._getHiddenInterval());
        return resultDate;
    },

    _getFormat: function() {
        return 'shorttime';
    },

    _needApplyLastGroupCellClass: function() {
        return true;
    },

    _calculateHiddenInterval: function(rowIndex, cellIndex) {
        const dayIndex = Math.floor(cellIndex / this._getCellCountInDay());
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
        if(this.option('crossScrollingEnabled')) {
            return this._$dateTable.get(0).getBoundingClientRect().height;
        }

        return this.$element().get(0).getBoundingClientRect().height;
    },

    _dateTableScrollableConfig: function() {
        let headerScrollableOnScroll;

        const config = this.callBase();
        const timelineConfig = {
            direction: HORIZONTAL,
            onStart: (function() {
                if(this._headerScrollable) {
                    headerScrollableOnScroll = this._headerScrollable.option('onScroll');
                    this._headerScrollable.option('onScroll', undefined);
                }
            }).bind(this),
            onScroll: (function(e) {
                this._headerScrollable && this._headerScrollable.scrollTo({
                    left: e.scrollOffset.left
                });
            }).bind(this),
            onEnd: (function(e) {
                this._headerScrollable && this._headerScrollable.option('onScroll', headerScrollableOnScroll);
            }).bind(this)
        };

        return this.option('crossScrollingEnabled') ? config : extend(config, timelineConfig);
    },

    _headerScrollableConfig: function() {
        const config = this.callBase();

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
        return this.option('timeCellTemplate');
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
        const $headerRow = this.callBase();

        if(this._needRenderWeekHeader()) {
            const firstViewDate = new Date(this._firstViewDate);
            const $cells = [];
            const colspan = this._getCellCountInDay();
            const cellTemplate = this.option('dateCellTemplate');

            for(let i = 0; i < this._getWeekDuration() * this.option('intervalCount'); i++) {
                const $th = $('<th>');
                const text = this._formatWeekdayAndDay(firstViewDate);

                if(cellTemplate) {
                    const templateOptions = {
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

                $th.addClass(HEADER_PANEL_CELL_CLASS).addClass(HEADER_PANEL_WEEK_CELL_CLASS).attr('colSpan', colspan);
                $cells.push($th);

                this._incrementDate(firstViewDate);
            }

            const $row = $('<tr>').addClass(HEADER_ROW_CLASS).append($cells);
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
        const groupCellTemplates = this._renderGroupHeader();
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
        const today = this._getToday();
        const cellWidth = this.getCellWidth();
        const date = this._getIndicationFirstViewDate();
        const hiddenInterval = this._getHiddenInterval();
        const timeDiff = today.getTime() - date.getTime();

        const differenceInDays = Math.ceil(timeDiff / toMs('day')) - 1;
        const duration = timeDiff - differenceInDays * hiddenInterval;
        const cellCount = duration / this.getCellDuration();

        return cellCount * cellWidth;
    },

    _renderIndicator: function(height, rtlOffset, $container, groupCount) {
        let $indicator;
        const width = this.getIndicationWidth();

        if(this.option('groupOrientation') === 'vertical') {
            $indicator = this._createIndicator($container);
            $indicator.height($container.get(0).getBoundingClientRect().height);
            $indicator.css('left', rtlOffset ? rtlOffset - width : width);
        } else {
            for(let i = 0; i < groupCount; i++) {
                const offset = this._getCellCount() * this.getCellWidth() * i;
                $indicator = this._createIndicator($container);
                $indicator.height($container.get(0).getBoundingClientRect().height);

                $indicator.css('left', rtlOffset ? rtlOffset - width - offset : width + offset);
            }
        }
    },

    _isVerticalShader: function() {
        return false;
    },

    _isCurrentTimeHeaderCell: function(headerIndex) {
        let result = false;

        if(this.option('showCurrentTimeIndicator') && this._needRenderDateTimeIndicator()) {
            let date = this._getDateByIndex(headerIndex);

            const now = this._getToday();
            date = new Date(date);

            if(dateUtils.sameDate(now, date)) {
                const startCellDate = new Date(date);
                let endCellDate = new Date(date);
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
        const cellHeight = this.getCellHeight();
        const minHeight = this._getWorkSpaceMinHeight();
        const $groupCells = this._$sidebarTable
            .find('tr');

        let height = cellHeight * $groupCells.length;
        if(height < minHeight) {
            height = minHeight;
        }

        this._$sidebarTable.height(height);
        this._$dateTable.height(height);

        this.callBase();
    },

    _getWorkSpaceMinHeight: function() {
        let minHeight = this._getWorkSpaceHeight();
        const workspaceContainerHeight = this.$element().outerHeight(true) - this.getHeaderPanelHeight() - 2 * DATE_TABLE_CELL_BORDER - DATE_TABLE_HEADER_MARGIN;

        if(minHeight < workspaceContainerHeight) {
            minHeight = workspaceContainerHeight;
        }

        return minHeight;
    },

    _makeGroupRows: function(groups, groupByDate) {
        const tableCreatorStrategy = this.option('groupOrientation') === 'vertical' ? tableCreator.VERTICAL : tableCreator.HORIZONTAL;

        return tableCreator.makeGroupedTable(tableCreatorStrategy,
            groups, {
                groupRowClass: this._getGroupRowClass(),
                groupHeaderRowClass: this._getGroupRowClass(),
                groupHeaderClass: this._getGroupHeaderClass.bind(this),
                groupHeaderContentClass: this._getGroupHeaderContentClass()
            },
            this._getCellCount() || 1,
            this.option('resourceCellTemplate'),
            this._getTotalRowCount(this._getGroupCount()),
            groupByDate);
    },

    _ensureGroupHeaderCellsHeight: function(cellHeight) {
        const minCellHeight = this._calculateMinCellHeight();

        if(cellHeight < minCellHeight) {
            return minCellHeight;
        }
        return cellHeight;
    },

    _calculateMinCellHeight: function() {
        const dateTable = this._getDateTable();
        const dateTableRowSelector = '.' + this._getDateTableRowClass();

        return (dateTable.get(0).getBoundingClientRect().height / dateTable.find(dateTableRowSelector).length) - DATE_TABLE_CELL_BORDER * 2;
    },

    _getCellCoordinatesByIndex: function(index) {
        return {
            cellIndex: index % this._getCellCount(),
            rowIndex: 0
        };
    },

    _getCellByCoordinates: function(cellCoordinates, groupIndex) {
        const indexes = this._groupedStrategy.prepareCellIndexes(cellCoordinates, groupIndex);

        return this._$dateTable
            .find('tr')
            .eq(indexes.rowIndex)
            .find('td')
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
        const startDayHour = this.option('startDayHour');
        const endDayHour = this.option('endDayHour');
        const firstViewDate = this.getStartViewDate();
        const firstViewDateTime = firstViewDate.getTime();
        const hiddenInterval = (24 - endDayHour + startDayHour) * toMs('hour');
        const timeZoneOffset = dateUtils.getTimezonesDifference(firstViewDate, currentDate);
        const apptStart = currentDate.getTime();
        const fullInterval = apptStart - firstViewDateTime - timeZoneOffset;
        const fullDays = Math.floor(fullInterval / (toMs('day')));
        const tailDuration = fullInterval - (fullDays * toMs('day'));
        let tailDelta = 0;
        const cellCount = this._getCellCountInDay() * (fullDays - this._getWeekendsCount(fullDays));
        const gapBeforeAppt = apptStart - dateUtils.trimTime(new Date(currentDate)).getTime();
        let result = cellCount * this.option('hoursInterval') * toMs('hour');

        if(!allDay) {
            if(currentDate.getHours() < startDayHour) {
                tailDelta = tailDuration - hiddenInterval + gapBeforeAppt;
            } else if(currentDate.getHours() >= startDayHour && currentDate.getHours() < endDayHour) {
                tailDelta = tailDuration;
            } else if(currentDate.getHours() >= startDayHour && currentDate.getHours() >= endDayHour) {
                tailDelta = tailDuration - (gapBeforeAppt - endDayHour * toMs('hour'));
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
        const positionShift = this.callBase(timeShift);
        let left = this.getCellWidth() * timeShift;

        if(this.option('rtlEnabled')) {
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
        const isRtl = this.option('rtlEnabled');

        const result = {};
        const $scrollable = this.getScrollable().$element();
        const cellWidth = this.getCellWidth();
        const scrollableOffset = isRtl ? (this.getScrollableOuterWidth() - this.getScrollableScrollLeft()) : this.getScrollableScrollLeft();
        const scrolledCellCount = scrollableOffset / cellWidth;
        const visibleCellCount = $scrollable.width() / cellWidth;
        const totalCellCount = isRtl ? scrolledCellCount - visibleCellCount : scrolledCellCount + visibleCellCount;
        let leftDate = this._getDateByIndex(scrolledCellCount);
        let rightDate = this._getDateByIndex(totalCellCount);

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
        let isUpdateNeeded = false;

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
        const trimmedDate = dateUtils.trimTime(new Date(date));
        let isUpdateNeeded = false;

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
        const coordinates = this._getScrollCoordinates(hours, minutes, date);
        const scrollable = this.getScrollable();
        const offset = this.option('rtlEnabled') ? this.getScrollableContainer().get(0).getBoundingClientRect().width : 0;

        if(this.option('templatesRenderAsynchronously')) {
            setTimeout(function() {
                scrollable.scrollBy({ left: coordinates.left - scrollable.scrollLeft() - offset, top: 0 });
            });
        } else {
            scrollable.scrollBy({ left: coordinates.left - scrollable.scrollLeft() - offset, top: 0 });
        }
    }
});

registerComponent('dxSchedulerTimeline', SchedulerTimeline);

module.exports = SchedulerTimeline;
