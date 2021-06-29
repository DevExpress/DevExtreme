import $ from '../../../core/renderer';
import { noop } from '../../../core/utils/common';
import { extend } from '../../../core/utils/extend';
import { getBoundingRect } from '../../../core/utils/position';
import registerComponent from '../../../core/component_registrator';
import SchedulerWorkSpace from './ui.scheduler.work_space.indicator';
import dateUtils from '../../../core/utils/date';
import tableCreatorModule from '../table_creator';
const { tableCreator } = tableCreatorModule;
import HorizontalShader from '../shaders/ui.scheduler.current_time_shader.horizontal';
import {
    HEADER_CURRENT_TIME_CELL_CLASS,
    GROUP_ROW_CLASS,
    GROUP_HEADER_CONTENT_CLASS,
} from '../classes';
import { getDateForHeaderText } from './utils/timeline_week';

import dxrTimelineDateHeader from '../../../renovation/ui/scheduler/workspaces/timeline/header_panel/layout.j';

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
    get verticalGroupTableClass() { return GROUP_TABLE_CLASS; }

    get viewDirection() { return 'horizontal'; }

    get renovatedHeaderPanelComponent() { return dxrTimelineDateHeader; }

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

    _getFormat() {
        return 'shorttime';
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

    _needRenderWeekHeader() {
        return false;
    }

    _incrementDate(date) {
        date.setDate(date.getDate() + 1);
    }

    _getWeekDuration() {
        return 1;
    }

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

    _isVerticalShader() {
        return false;
    }

    _isCurrentTimeHeaderCell() {
        return false;
    }

    _setTableSizes() {
        const minHeight = this._getWorkSpaceMinHeight();

        this._$sidebarTable.height(minHeight);
        this._$dateTable.height(minHeight);

        super._setTableSizes();

        this.virtualScrollingDispatcher.updateDimensions();
    }

    _getWorkSpaceMinHeight() {
        let minHeight = this._getWorkSpaceHeight();
        const workspaceContainerHeight = this.$element().outerHeight(true) - this.getHeaderPanelHeight() - 2 * DATE_TABLE_CELL_BORDER - DATE_TABLE_HEADER_MARGIN;

        if(minHeight < workspaceContainerHeight) {
            minHeight = workspaceContainerHeight;
        }

        return minHeight;
    }

    _getCellCoordinatesByIndex(index) {
        return {
            columnIndex: index % this._getCellCount(),
            rowIndex: 0
        };
    }

    _getCellByCoordinates(cellCoordinates, groupIndex) {
        const indexes = this._groupedStrategy.prepareCellIndexes(cellCoordinates, groupIndex);

        return this._$dateTable
            .find('tr')
            .eq(indexes.rowIndex)
            .find('td')
            .eq(indexes.columnIndex);
    }

    _getWorkSpaceWidth() {
        return this._$dateTable.outerWidth(true);
    }

    _getIndicationFirstViewDate() {
        return dateUtils.trimTime(new Date(this._startViewDate));
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

    renderRAllDayPanel() {}

    renderRTimeTable() {}

    _renderGroupAllDayPanel() {}

    generateRenderOptions() {
        const options = super.generateRenderOptions(true);

        const groupCount = this._getGroupCount();
        const horizontalGroupCount = this._isHorizontalGroupedWorkSpace() && !this.isGroupedByDate()
            ? groupCount
            : 1;

        const cellsInGroup = this._getWeekDuration() * this.option('intervalCount');
        const daysInView = cellsInGroup * horizontalGroupCount;

        return {
            ...options,
            isGenerateWeekDaysHeaderData: this._needRenderWeekHeader(),
            getWeekDaysHeaderText: this._formatWeekdayAndDay.bind(this),
            daysInView,
            cellCountInDay: this._getCellCountInDay(),
            getDateForHeaderText,
        };
    }

    _getDateGenerationOptions() {
        return {
            ...super._getDateGenerationOptions(),
            columnsInDay: this._getCellCountInDay(),
        };
    }

    // -------------
    // We need these methods for now but they are useless for renovation
    // -------------

    _init() {
        super._init();

        this.$element().addClass(TIMELINE_CLASS);
        this._$sidebarTable = $('<div>')
            .addClass(GROUP_TABLE_CLASS);
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

    _createWorkSpaceElements() {
        this._createWorkSpaceScrollableElements();
    }

    _toggleAllDayVisibility() { return noop(); }
    _changeAllDayVisibility() { return noop(); }

    _getDateHeaderTemplate() {
        return this.option('timeCellTemplate');
    }

    _renderView() {
        this._startViewDate = this._calculateStartViewDate();
        this._hiddenInterval = this._getHiddenInterval();
        let groupCellTemplates;
        if(!this.isRenovatedRender()) {
            groupCellTemplates = this._renderGroupHeader();
        }

        this.renderWorkSpace();

        this._shader = new HorizontalShader(this);

        this._$sidebarTable.appendTo(this._sidebarScrollable.$content());

        if(this.isRenovatedRender() && this._isVerticalGroupedWorkSpace()) {
            this.renderRGroupPanel();
        }

        this._applyCellTemplates(groupCellTemplates);
    }

    _setHorizontalGroupHeaderCellsHeight() { return noop(); }

    _setCurrentTimeCells() {
        const timePanelCells = this._getTimePanelCells();
        const currentTimeCellIndices = this._getCurrentTimePanelCellIndices();
        currentTimeCellIndices.forEach((timePanelCellIndex) => {
            timePanelCells.eq(timePanelCellIndex)
                .addClass(HEADER_CURRENT_TIME_CELL_CLASS);
        });
    }

    _cleanCurrentTimeCells() {
        this.$element()
            .find(`.${HEADER_CURRENT_TIME_CELL_CLASS}`)
            .removeClass(HEADER_CURRENT_TIME_CELL_CLASS);
    }

    _getTimePanelCells() {
        return this.$element()
            .find(`.${HEADER_PANEL_CELL_CLASS}:not(.${HEADER_PANEL_WEEK_CELL_CLASS})`);
    }

    _getCurrentTimePanelCellIndices() {
        const columnCountPerGroup = this._getCellCount();
        const today = this._getToday();
        const index = this.getCellIndexByDate(today);
        const { columnIndex: currentTimeColumnIndex } = this._getCellCoordinatesByIndex(index);

        if(currentTimeColumnIndex === undefined) {
            return [];
        }

        const horizontalGroupCount = this._isHorizontalGroupedWorkSpace() && !this.isGroupedByDate()
            ? this._getGroupCount()
            : 1;

        return [...(new Array(horizontalGroupCount))]
            .map((_, groupIndex) => columnCountPerGroup * groupIndex + currentTimeColumnIndex);
    }

    // --------------
    // These methods should be deleted when we get rid of old render
    // --------------

    _renderTimePanel() { return noop(); }
    _renderAllDayPanel() { return noop(); }

    _createAllDayPanelElements() { return noop(); }

    _renderDateHeader() {
        const $headerRow = super._renderDateHeader();
        if(this._needRenderWeekHeader()) {
            const firstViewDate = new Date(this._startViewDate);
            let currentDate = new Date(firstViewDate);

            const $cells = [];
            const groupCount = this._getGroupCount();
            const cellCountInDay = this._getCellCountInDay();
            const colSpan = this.isGroupedByDate()
                ? cellCountInDay * groupCount
                : cellCountInDay;
            const cellTemplate = this.option('dateCellTemplate');

            const horizontalGroupCount = this._isHorizontalGroupedWorkSpace() && !this.isGroupedByDate()
                ? groupCount
                : 1;
            const cellsInGroup = this._getWeekDuration() * this.option('intervalCount');

            const cellsCount = cellsInGroup * horizontalGroupCount;

            for(let templateIndex = 0; templateIndex < cellsCount; templateIndex++) {
                const $th = $('<th>');
                const text = this._formatWeekdayAndDay(currentDate);

                if(cellTemplate) {
                    const templateOptions = {
                        model: {
                            text,
                            date: new Date(currentDate),
                            ...this._getGroupsForDateHeaderTemplate(templateIndex, colSpan),
                        },
                        container: $th,
                        index: templateIndex,
                    };

                    cellTemplate.render(templateOptions);
                } else {
                    $th.text(text);
                }

                $th
                    .addClass(HEADER_PANEL_CELL_CLASS)
                    .addClass(HEADER_PANEL_WEEK_CELL_CLASS)
                    .attr('colSpan', colSpan);

                $cells.push($th);

                if((templateIndex % cellsInGroup) === (cellsInGroup - 1)) {
                    currentDate = new Date(firstViewDate);
                } else {
                    this._incrementDate(currentDate);
                }
            }

            const $row = $('<tr>').addClass(HEADER_ROW_CLASS).append($cells);
            $headerRow.before($row);
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

    _makeGroupRows(groups, groupByDate) {
        const tableCreatorStrategy = this.option('groupOrientation') === 'vertical' ? tableCreator.VERTICAL : tableCreator.HORIZONTAL;

        return tableCreator.makeGroupedTable(tableCreatorStrategy,
            groups, {
                groupRowClass: GROUP_ROW_CLASS,
                groupHeaderRowClass: GROUP_ROW_CLASS,
                groupHeaderClass: this._getGroupHeaderClass.bind(this),
                groupHeaderContentClass: GROUP_HEADER_CONTENT_CLASS,
            },
            this._getCellCount() || 1,
            this.option('resourceCellTemplate'),
            this._getTotalRowCount(this._getGroupCount()),
            groupByDate);
    }
}

registerComponent('dxSchedulerTimeline', SchedulerTimeline);
export default SchedulerTimeline;
