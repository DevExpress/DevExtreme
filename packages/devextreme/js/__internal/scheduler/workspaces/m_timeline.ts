import registerComponent from '@js/core/component_registrator';
import $ from '@js/core/renderer';
import { noop } from '@js/core/utils/common';
import dateUtils from '@js/core/utils/date';
import { extend } from '@js/core/utils/extend';
import { getBoundingRect } from '@js/core/utils/position';
import { getOuterHeight, getOuterWidth, setHeight } from '@js/core/utils/size';
import { hasWindow } from '@js/core/utils/window';

// NOTE: Renovation component import.
import { HeaderPanelTimelineComponent } from '../__migration/components/index';
import { formatWeekdayAndDay, timelineWeekUtils } from '../__migration/utils/index';
import {
  GROUP_HEADER_CONTENT_CLASS,
  GROUP_ROW_CLASS,
  HEADER_CURRENT_TIME_CELL_CLASS,
} from '../m_classes';
import tableCreatorModule from '../m_table_creator';
import timezoneUtils from '../m_utils_time_zone';
import HorizontalShader from '../shaders/m_current_time_shader_horizontal';
import SchedulerWorkSpace from './m_work_space_indicator';

const { tableCreator } = tableCreatorModule;

const TIMELINE_CLASS = 'dx-scheduler-timeline';
const GROUP_TABLE_CLASS = 'dx-scheduler-group-table';

const HORIZONTAL_GROUPED_WORKSPACE_CLASS = 'dx-scheduler-work-space-horizontal-grouped';

const HEADER_PANEL_CELL_CLASS = 'dx-scheduler-header-panel-cell';
const HEADER_PANEL_WEEK_CELL_CLASS = 'dx-scheduler-header-panel-week-cell';
const HEADER_ROW_CLASS = 'dx-scheduler-header-row';

const HORIZONTAL = 'horizontal';
const toMs = dateUtils.dateToMilliseconds;

class SchedulerTimeline extends SchedulerWorkSpace {
  _$sidebarTable: any;

  get verticalGroupTableClass() { return GROUP_TABLE_CLASS; }

  readonly viewDirection = 'horizontal';

  get renovatedHeaderPanelComponent() { return HeaderPanelTimelineComponent; }

  getGroupTableWidth() {
    return this._$sidebarTable ? getOuterWidth(this._$sidebarTable) : 0;
  }

  _getTotalRowCount(groupCount) {
    if (this._isHorizontalGroupedWorkSpace()) {
      return this._getRowCount();
    }
    groupCount = groupCount || 1;
    return this._getRowCount() * groupCount;
  }

  _getFormat(): any {
    return 'shorttime';
  }

  _getWorkSpaceHeight() {
    if (this.option('crossScrollingEnabled') && hasWindow()) {
      return getBoundingRect(this._$dateTable.get(0)).height;
    }

    return getBoundingRect((this.$element() as any).get(0)).height;
  }

  _dateTableScrollableConfig() {
    const config = super._dateTableScrollableConfig();
    const timelineConfig = {
      direction: HORIZONTAL,
    };

    return this.option('crossScrollingEnabled') ? config : extend(config, timelineConfig);
  }

  _needCreateCrossScrolling() {
    return true;
  }

  _headerScrollableConfig() {
    const config = super._headerScrollableConfig();

    return extend(config, {
      scrollByContent: true,
    });
  }

  supportAllDayRow() {
    return false;
  }

  _getGroupHeaderContainer() {
    if (this._isHorizontalGroupedWorkSpace()) {
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

  getIndicationCellCount() {
    const timeDiff = this._getTimeDiff();
    return this._calculateDurationInCells(timeDiff);
  }

  _getTimeDiff() {
    let today = this._getToday();
    const date = this._getIndicationFirstViewDate();

    const startViewDate = this.getStartViewDate();
    const dayLightOffset = timezoneUtils.getDaylightOffsetInMs(startViewDate, today);

    if (dayLightOffset) {
      today = new Date(today.getTime() + dayLightOffset);
    }

    return today.getTime() - date.getTime();
  }

  _calculateDurationInCells(timeDiff) {
    const today = this._getToday();
    const differenceInDays = Math.floor(timeDiff / toMs('day'));
    let duration = (timeDiff - differenceInDays * toMs('day') - (this.option('startDayHour') as any) * toMs('hour')) / this.getCellDuration();

    if (today.getHours() > (this.option('endDayHour') as any)) {
      duration = this._getCellCountInDay();
    }

    if (duration < 0) {
      duration = 0;
    }
    return differenceInDays * this._getCellCountInDay() + duration;
  }

  getIndicationWidth() {
    if (this.isGroupedByDate()) {
      const cellCount = this.getIndicationCellCount();
      const integerPart = Math.floor(cellCount);
      const fractionPart = cellCount - integerPart;

      return this.getCellWidth() * (integerPart * this._getGroupCount() + fractionPart);
    }
    return this.getIndicationCellCount() * this.getCellWidth();
  }

  _isVerticalShader() {
    return false;
  }

  _isCurrentTimeHeaderCell() {
    return false;
  }

  _setTableSizes() {
    super._setTableSizes();

    const minHeight = this._getWorkSpaceMinHeight();
    setHeight(this._$sidebarTable, minHeight);
    setHeight(this._$dateTable, minHeight);

    this.virtualScrollingDispatcher.updateDimensions();
  }

  _getWorkSpaceMinHeight() {
    let minHeight = this._getWorkSpaceHeight();

    const workspaceContainerHeight = getOuterHeight(this._$flexContainer, true);

    if (minHeight < workspaceContainerHeight) {
      minHeight = workspaceContainerHeight;
    }

    return minHeight;
  }

  _getCellCoordinatesByIndex(index) {
    return {
      columnIndex: index % this._getCellCount(),
      rowIndex: 0,
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
    return getOuterWidth(this._$dateTable, true);
  }

  _getIndicationFirstViewDate() {
    return dateUtils.trimTime(new Date(this.getStartViewDate()));
  }

  _getIntervalBetween(currentDate, allDay) {
    const startDayHour = this.option('startDayHour')!;
    const endDayHour = this.option('endDayHour')!;
    const firstViewDate = this.getStartViewDate();
    const firstViewDateTime = firstViewDate.getTime();
    const hiddenInterval = (24 - endDayHour + startDayHour) * toMs('hour');
    const timeZoneOffset = dateUtils.getTimezonesDifference(firstViewDate, currentDate);
    const apptStart = currentDate.getTime();
    const fullInterval = apptStart - firstViewDateTime - timeZoneOffset;
    const fullDays = Math.floor(fullInterval / toMs('day'));
    const tailDuration = fullInterval - (fullDays * toMs('day'));
    let tailDelta = 0;
    const cellCount = this._getCellCountInDay() * (fullDays - this._getWeekendsCount(fullDays));
    const gapBeforeAppt = apptStart - dateUtils.trimTime(new Date(currentDate)).getTime();
    let result = cellCount * (this.option('hoursInterval') as any) * toMs('hour');

    if (!allDay) {
      if (currentDate.getHours() < startDayHour) {
        tailDelta = tailDuration - hiddenInterval + gapBeforeAppt;
      } else if (currentDate.getHours() >= startDayHour && currentDate.getHours() < endDayHour) {
        tailDelta = tailDuration;
      } else if (currentDate.getHours() >= startDayHour && currentDate.getHours() >= endDayHour) {
        tailDelta = tailDuration - (gapBeforeAppt - endDayHour * toMs('hour'));
      } else if (!fullDays) {
        result = fullInterval;
      }

      result += tailDelta;
    }

    return result;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _getWeekendsCount(argument?: any) {
    return 0;
  }

  getAllDayContainer() {
    return null;
  }

  getTimePanelWidth() {
    return 0;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getIntervalDuration(allDay) {
    return this.getCellDuration();
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

    if (this.option('templatesRenderAsynchronously')) {
      setTimeout(() => {
        scrollable.scrollBy({ left: coordinates.left - scrollable.scrollLeft() - offset, top: 0 });
      });
    } else {
      scrollable.scrollBy({ left: coordinates.left - scrollable.scrollLeft() - offset, top: 0 });
    }
  }

  renderRAllDayPanel() {}

  renderRTimeTable() {}

  _renderGroupAllDayPanel() {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  generateRenderOptions(argument?: any) {
    const options = super.generateRenderOptions(true);

    return {
      ...options,
      isGenerateWeekDaysHeaderData: this._needRenderWeekHeader(),
      getDateForHeaderText: timelineWeekUtils.getDateForHeaderText,
    };
  }

  // -------------
  // We need these methods for now but they are useless for renovation
  // -------------

  _init() {
    super._init();

    (this.$element() as any).addClass(TIMELINE_CLASS);
    this._$sidebarTable = $('<div>')
      .addClass(GROUP_TABLE_CLASS);
  }

  _getDefaultGroupStrategy() {
    return 'vertical';
  }

  _toggleGroupingDirectionClass() {
    (this.$element() as any).toggleClass(HORIZONTAL_GROUPED_WORKSPACE_CLASS, this._isHorizontalGroupedWorkSpace());
  }

  _getDefaultOptions() {
    return extend(super._getDefaultOptions(), {
      groupOrientation: 'vertical',
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
    let groupCellTemplates;
    if (!this.isRenovatedRender()) {
      groupCellTemplates = this._renderGroupHeader();
    }

    this.renderWorkSpace();

    if (this.isRenovatedRender()) {
      this.virtualScrollingDispatcher.updateDimensions();
    }

    this._shader = new HorizontalShader(this);

    this._$sidebarTable.appendTo(this._sidebarScrollable.$content());

    if (this.isRenovatedRender() && this._isVerticalGroupedWorkSpace()) {
      this.renderRGroupPanel();
    }

    this.updateHeaderEmptyCellWidth();

    this._applyCellTemplates(groupCellTemplates);
  }

  _setHorizontalGroupHeaderCellsHeight() { return noop(); }

  _getTimePanelCells() {
    return (this.$element() as any)
      .find(`.${HEADER_PANEL_CELL_CLASS}:not(.${HEADER_PANEL_WEEK_CELL_CLASS})`);
  }

  _getCurrentTimePanelCellIndices() {
    const columnCountPerGroup = this._getCellCount();
    const today = this._getToday();
    const index = this.getCellIndexByDate(today);
    const { columnIndex: currentTimeColumnIndex } = this._getCellCoordinatesByIndex(index);

    if (currentTimeColumnIndex === undefined) {
      return [];
    }

    const horizontalGroupCount = this._isHorizontalGroupedWorkSpace() && !this.isGroupedByDate()
      ? this._getGroupCount()
      : 1;

    return [...new Array(horizontalGroupCount)]
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
    if (this._needRenderWeekHeader()) {
      const firstViewDate = new Date(this.getStartViewDate());
      let currentDate = new Date(firstViewDate);

      const $cells: any[] = [];
      const groupCount = this._getGroupCount();
      const cellCountInDay = this._getCellCountInDay();
      const colSpan = this.isGroupedByDate()
        ? cellCountInDay * groupCount
        : cellCountInDay;
      const cellTemplate: any = this.option('dateCellTemplate');

      const horizontalGroupCount = this._isHorizontalGroupedWorkSpace() && !this.isGroupedByDate()
        ? groupCount
        : 1;
      const cellsInGroup = this.viewDataProvider.viewDataGenerator.daysInInterval * (this.option('intervalCount') as any);

      const cellsCount = cellsInGroup * horizontalGroupCount;

      for (let templateIndex = 0; templateIndex < cellsCount; templateIndex++) {
        const $th = $('<th>');
        const text = formatWeekdayAndDay(currentDate);

        if (cellTemplate) {
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

        if ((templateIndex % cellsInGroup) === (cellsInGroup - 1)) {
          currentDate = new Date(firstViewDate);
        } else {
          this._incrementDate(currentDate);
        }
      }

      const $row = $('<tr>').addClass(HEADER_ROW_CLASS).append($cells as any);
      $headerRow.before($row);
    }
  }

  _renderIndicator(height, rtlOffset, $container, groupCount) {
    let $indicator;
    const width = this.getIndicationWidth();

    if (this.option('groupOrientation') === 'vertical') {
      $indicator = this._createIndicator($container);
      setHeight($indicator, getBoundingRect($container.get(0)).height);
      $indicator.css('left', rtlOffset ? rtlOffset - width : width);
    } else {
      for (let i = 0; i < groupCount; i++) {
        const offset = this.isGroupedByDate() ? i * this.getCellWidth() : this._getCellCount() * this.getCellWidth() * i;
        $indicator = this._createIndicator($container);
        setHeight($indicator, getBoundingRect($container.get(0)).height);

        $indicator.css('left', rtlOffset ? rtlOffset - width - offset : width + offset);
      }
    }
  }

  _makeGroupRows(groups, groupByDate) {
    const tableCreatorStrategy = this.option('groupOrientation') === 'vertical' ? tableCreator.VERTICAL : tableCreator.HORIZONTAL;

    return tableCreator.makeGroupedTable(
      tableCreatorStrategy,
      groups,
      {
        groupRowClass: GROUP_ROW_CLASS,
        groupHeaderRowClass: GROUP_ROW_CLASS,
        groupHeaderClass: this._getGroupHeaderClass.bind(this),
        groupHeaderContentClass: GROUP_HEADER_CONTENT_CLASS,
      },
      this._getCellCount() || 1,
      this.option('resourceCellTemplate'),
      this._getTotalRowCount(this._getGroupCount()),
      groupByDate,
    );
  }

  // Old render methods.
  // TODO Old render: delete these methods with the old render.

  _setCurrentTimeCells(): void {
    const timePanelCells = this._getTimePanelCells();
    const currentTimeCellIndices = this._getCurrentTimePanelCellIndices();
    currentTimeCellIndices.forEach((timePanelCellIndex) => {
      timePanelCells.eq(timePanelCellIndex)
        .addClass(HEADER_CURRENT_TIME_CELL_CLASS);
    });
  }

  _cleanCurrentTimeCells(): void {
    (this.$element() as any)
      .find(`.${HEADER_CURRENT_TIME_CELL_CLASS}`)
      .removeClass(HEADER_CURRENT_TIME_CELL_CLASS);
  }
}

registerComponent('dxSchedulerTimeline', SchedulerTimeline as any);
export default SchedulerTimeline;
