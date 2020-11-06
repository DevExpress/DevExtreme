import $ from '../../../core/renderer';
import { noop } from '../../../core/utils/common';
import { extend } from '../../../core/utils/extend';
import { getBoundingRect } from '../../../core/utils/position';
import registerComponent from '../../../core/component_registrator';
import SchedulerWorkSpace from './ui.scheduler.work_space.indicator';
import dateUtils from '../../../core/utils/date';
import tableCreatorModule from '../ui.scheduler.table_creator';
const { tableCreator } = tableCreatorModule;
import HorizontalShader from '../shaders/ui.scheduler.current_time_shader.horizontal';

import timeZoneUtils from '../utils.timeZone';

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

class SchedulerTimeline extends SchedulerWorkSpace {
    _init() {
        super._init();

        this.$element().addClass(TIMELINE_CLASS);
        this._$sidebarTable = $('<div>')
            .addClass(GROUP_TABLE_CLASS);
    }
    _getCellFromNextRow(direction, isMultiSelection) {
        if(!isMultiSelection) {
            return super._getCellFromNextRow(direction, isMultiSelection);
        }

        return this._$focusedCell;
    }

    _getDefaultGroupStrategy() {
        return 'vertical';
    }

    _toggleGroupingDirectionClass() {
        this.$element().toggleClass(HORIZONTAL_GROUPED_WORKSPACE_CLASS, this._isHorizontalGroupedWorkSpace());
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            groupOrientation: 'vertical'
        });
    }

    _getRowCount() {
        return 1;
    }

    _getCellCount() {
        return this._getCellCountInDay() * this.option('intervalCount');
    }

    getGroupTableWidth() {
        return this._$sidebarTable ? this._$sidebarTable.outerWidth() : 0;
    }

    _getTotalRowCount(groupCount) {
        if(this._isHorizontalGroupedWorkSpace()) {
            return this._getRowCount();
        } else {
            groupCount = groupCount || 1;
            return this._getRowCount() * groupCount;
        }
    }

    _getDateForHeaderText(index) {
        const newFirstViewDate = timeZoneUtils.getDateWithoutTimezoneChange(this._firstViewDate);
        return this._getDateByIndexCore(newFirstViewDate, index);
    }

    _getDateByIndexCore(date, index) {
        const result = new Date(date);
        const dayIndex = Math.floor(index / this._getCellCountInDay());
        result.setTime(date.getTime() + this._calculateCellIndex(0, index) * this._getInterval() + dayIndex * this._getHiddenInterval());

        return result;
    }

    _getDateByIndex(index) {
        const newFirstViewDate = timeZoneUtils.getDateWithoutTimezoneChange(this._firstViewDate);
        const result = this._getDateByIndexCore(newFirstViewDate, index);

        if(timeZoneUtils.isTimezoneChangeInDate(this._firstViewDate)) {
            result.setDate(result.getDate() - 1);
        }

        return result;
    }

    _getFormat() {
        return 'shorttime';
    }

    _needApplyLastGroupCellClass() {
        return true;
    }

    _calculateHiddenInterval(rowIndex, cellIndex) {
        const dayIndex = Math.floor(cellIndex / this._getCellCountInDay());
        return dayIndex * this._getHiddenInterval();
    }

    _getMillisecondsOffset(rowIndex, cellIndex) {
        cellIndex = this._calculateCellIndex(rowIndex, cellIndex);

        return this._getInterval() * cellIndex + this._calculateHiddenInterval(rowIndex, cellIndex);
    }

    _createWorkSpaceElements() {
        this._createWorkSpaceScrollableElements();
    }

    _getWorkSpaceHeight() {
        if(this.option('crossScrollingEnabled')) {
            return getBoundingRect(this._$dateTable.get(0)).height;
        }

        return getBoundingRect(this.$element().get(0)).height;
    }

    _dateTableScrollableConfig() {
        const config = super._dateTableScrollableConfig();
        const timelineConfig = {
            direction: HORIZONTAL
        };

        return this.option('crossScrollingEnabled') ? config : extend(config, timelineConfig);
    }

    _needCreateCrossScrolling() {
        return true;
    }

    _headerScrollableConfig() {
        const config = super._headerScrollableConfig();

        return extend(config, {
            scrollByContent: true
        });
    }

    _renderTimePanel() { return noop(); }
    _renderAllDayPanel() { return noop(); }
    _getTableAllDay() {
        return false;
    }
    _getDateHeaderTemplate() {
        return this.option('timeCellTemplate');
    }
    _toggleAllDayVisibility() { return noop(); }
    _changeAllDayVisibility() { return noop(); }

    supportAllDayRow() {
        return false;
    }

    _getGroupHeaderContainer() {
        if(this._isHorizontalGroupedWorkSpace()) {
            return this._$thead;
        }
        return this._$sidebarTable;
    }

    _insertAllDayRowsIntoDateTable() {
        return false;
    }

    _createAllDayPanelElements() { return noop(); }

    _renderDateHeader() {
        const $headerRow = super._renderDateHeader();
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
    }

    _needRenderWeekHeader() {
        return false;
    }

    _incrementDate(date) {
        date.setDate(date.getDate() + 1);
    }

    _getWeekDuration() {
        return 1;
    }

    _renderView() {
        this._setFirstViewDate();
        const groupCellTemplates = this._renderGroupHeader();
        this._renderDateHeader();

        this._renderAllDayPanel();
        this._renderTimePanel();
        this._renderDateTable();

        this._shader = new HorizontalShader(this);

        this._updateGroupTableHeight();

        this._$sidebarTable.appendTo(this._sidebarScrollable.$content());
        this._applyCellTemplates(groupCellTemplates);
    }

    _setHorizontalGroupHeaderCellsHeight() { return noop(); }

    getIndicationCellCount() {
        const timeDiff = this._getTimeDiff();
        return this._calculateDurationInCells(timeDiff);
    }

    _getTimeDiff() {
        const today = this._getToday();
        const date = this._getIndicationFirstViewDate();
        return today.getTime() - date.getTime();
    }

    _calculateDurationInCells(timeDiff) {
        const today = this._getToday();
        const differenceInDays = Math.floor(timeDiff / toMs('day'));
        let duration = (timeDiff - differenceInDays * toMs('day') - this.option('startDayHour') * toMs('hour')) / this.getCellDuration();

        if(today.getHours() > this.option('endDayHour')) {
            duration = this._getCellCountInDay();
        }

        if(duration < 0) {
            duration = 0;
        }
        return differenceInDays * this._getCellCountInDay() + duration;

    }

    getIndicationWidth() {
        if(this.isGroupedByDate()) {
            const cellCount = this.getIndicationCellCount();
            const integerPart = Math.floor(cellCount);
            const fractionPart = cellCount - integerPart;

            return this.getCellWidth() * (integerPart * this._getGroupCount() + fractionPart);
        } else {
            return this.getIndicationCellCount() * this.getCellWidth();
        }

    }

    _renderIndicator(height, rtlOffset, $container, groupCount) {
        let $indicator;
        const width = this.getIndicationWidth();

        if(this.option('groupOrientation') === 'vertical') {
            $indicator = this._createIndicator($container);
            $indicator.height(getBoundingRect($container.get(0)).height);
            $indicator.css('left', rtlOffset ? rtlOffset - width : width);
        } else {
            for(let i = 0; i < groupCount; i++) {
                const offset = this.isGroupedByDate() ? i * this.getCellWidth() : this._getCellCount() * this.getCellWidth() * i;
                $indicator = this._createIndicator($container);
                $indicator.height(getBoundingRect($container.get(0)).height);

                $indicator.css('left', rtlOffset ? rtlOffset - width - offset : width + offset);
            }
        }
    }

    _isVerticalShader() {
        return false;
    }

    _isCurrentTimeHeaderCell(headerIndex) {
        let result = false;

        if(this.isIndicationOnView()) {
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
    }

    _cleanView() {
        super._cleanView();
        this._$sidebarTable.empty();
    }

    _visibilityChanged(visible) {
        super._visibilityChanged(visible);
    }

    _setTableSizes() {
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

        super._setTableSizes();
    }

    _getWorkSpaceMinHeight() {
        let minHeight = this._getWorkSpaceHeight();
        const workspaceContainerHeight = this.$element().outerHeight(true) - this.getHeaderPanelHeight() - 2 * DATE_TABLE_CELL_BORDER - DATE_TABLE_HEADER_MARGIN;

        if(minHeight < workspaceContainerHeight) {
            minHeight = workspaceContainerHeight;
        }

        return minHeight;
    }

    _makeGroupRows(groups, groupByDate) {
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
    }

    _ensureGroupHeaderCellsHeight(cellHeight) {
        const minCellHeight = this._calculateMinCellHeight();

        if(cellHeight < minCellHeight) {
            return minCellHeight;
        }
        return cellHeight;
    }

    _calculateMinCellHeight() {
        const dateTable = this._getDateTable();
        const dateTableRowSelector = '.' + this._getDateTableRowClass();

        return (getBoundingRect(dateTable).height / dateTable.find(dateTableRowSelector).length) - DATE_TABLE_CELL_BORDER * 2;
    }

    _getCellCoordinatesByIndex(index) {
        return {
            cellIndex: index % this._getCellCount(),
            rowIndex: 0
        };
    }

    _getCellByCoordinates(cellCoordinates, groupIndex) {
        const indexes = this._groupedStrategy.prepareCellIndexes(cellCoordinates, groupIndex);

        return this._$dateTable
            .find('tr')
            .eq(indexes.rowIndex)
            .find('td')
            .eq(indexes.cellIndex);
    }

    _getWorkSpaceWidth() {
        return this._$dateTable.outerWidth(true);
    }

    _getIndicationFirstViewDate() {
        return dateUtils.trimTime(new Date(this._firstViewDate));
    }

    _getIntervalBetween(currentDate, allDay) {
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
    }

    _getWeekendsCount() {
        return 0;
    }

    getAllDayContainer() {
        return null;
    }

    getTimePanelWidth() {
        return 0;
    }

    getPositionShift(timeShift) {
        const positionShift = super.getPositionShift(timeShift);
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
    }

    getVisibleBounds() {
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
    }

    getIntervalDuration(allDay) {
        return this.getCellDuration();
    }

    _supportCompactDropDownAppointments() {
        return false;
    }

    getCellMinWidth() {
        return 0;
    }

    getWorkSpaceLeftOffset() {
        return 0;
    }

    scrollToTime(hours, minutes, date) {
        const coordinates = this._getScrollCoordinates(hours, minutes, date);
        const scrollable = this.getScrollable();
        const offset = this.option('rtlEnabled') ? getBoundingRect(this.getScrollableContainer().get(0)).width : 0;

        if(this.option('templatesRenderAsynchronously')) {
            setTimeout(function() {
                scrollable.scrollBy({ left: coordinates.left - scrollable.scrollLeft() - offset, top: 0 });
            });
        } else {
            scrollable.scrollBy({ left: coordinates.left - scrollable.scrollLeft() - offset, top: 0 });
        }
    }

    _getRowCountWithAllDayRows() {
        return this._getRowCount();
    }
}

registerComponent('dxSchedulerTimeline', SchedulerTimeline);
export default SchedulerTimeline;
