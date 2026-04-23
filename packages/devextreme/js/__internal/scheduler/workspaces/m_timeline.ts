import registerComponent from '@js/core/component_registrator';
import $ from '@js/core/renderer';
import { noop } from '@js/core/utils/common';
import dateUtils from '@js/core/utils/date';
import { extend } from '@js/core/utils/extend';
import { getBoundingRect } from '@js/core/utils/position';
import { getOuterHeight, getOuterWidth, setHeight } from '@js/core/utils/size';
import { hasWindow } from '@js/core/utils/window';
// NOTE: Renovation component import.
import { HeaderPanelTimelineComponent } from '@ts/scheduler/r1/components/index';
import { formatWeekdayAndDay, timelineWeekUtils } from '@ts/scheduler/r1/utils/index';

import {
  GROUP_HEADER_CONTENT_CLASS,
  GROUP_ROW_CLASS,
  HEADER_CURRENT_TIME_CELL_CLASS,
} from '../m_classes';
import tableCreatorModule from '../m_table_creator';
import timezoneUtils from '../m_utils_time_zone';
import SchedulerWorkSpace from './m_work_space_indicator';
import HorizontalShader from './shaders/current_time_shader_horizontal';

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
  protected override $sidebarTable: any;

  get verticalGroupTableClass() { return GROUP_TABLE_CLASS; }

  readonly viewDirection = 'horizontal';

  get renovatedHeaderPanelComponent() { return HeaderPanelTimelineComponent; }

  getGroupTableWidth() {
    return this.$sidebarTable ? getOuterWidth(this.$sidebarTable) : 0;
  }

  protected override getTotalRowCount(groupCount) {
    if (this._isHorizontalGroupedWorkSpace()) {
      return this.getRowCount();
    }
    groupCount = groupCount || 1;
    return this.getRowCount() * groupCount;
  }

  protected override getFormat(): any {
    return 'shorttime';
  }

  private getWorkSpaceHeight() {
    if (this.option('crossScrollingEnabled') && hasWindow()) {
      return getBoundingRect(this._$dateTable.get(0)).height;
    }

    return getBoundingRect((this.$element() as any).get(0)).height;
  }

  protected override dateTableScrollableConfig() {
    const config = super.dateTableScrollableConfig();
    const timelineConfig = {
      direction: HORIZONTAL,
    };

    return this.option('crossScrollingEnabled') ? config : extend(config, timelineConfig);
  }

  protected override needCreateCrossScrolling() {
    return true;
  }

  protected override headerScrollableConfig() {
    const config = super.headerScrollableConfig();

    return extend(config, {
      scrollByContent: true,
    });
  }

  supportAllDayRow() {
    return false;
  }

  protected override getGroupHeaderContainer() {
    if (this._isHorizontalGroupedWorkSpace()) {
      return this._$thead;
    }
    return this.$sidebarTable;
  }

  protected override insertAllDayRowsIntoDateTable() {
    return false;
  }

  protected needRenderWeekHeader() {
    return false;
  }

  protected incrementDate(date) {
    date.setDate(date.getDate() + 1);
  }

  getIndicationCellCount() {
    const timeDiff = this.getTimeDiff();
    return this.calculateDurationInCells(timeDiff);
  }

  private getTimeDiff() {
    let today = this.getToday();
    const date = this.getIndicationFirstViewDate();

    const startViewDate = this.getStartViewDate();
    const dayLightOffset = timezoneUtils.getDaylightOffsetInMs(startViewDate, today);

    if (dayLightOffset) {
      today = new Date(today.getTime() + dayLightOffset);
    }

    return today.getTime() - date.getTime();
  }

  protected calculateDurationInCells(timeDiff) {
    const today = this.getToday();
    const differenceInDays = Math.floor(timeDiff / toMs('day'));
    let duration = (timeDiff - differenceInDays * toMs('day') - (this.option('startDayHour') as any) * toMs('hour')) / this.getCellDuration();

    if (today.getHours() > (this.option('endDayHour') as any)) {
      duration = this.getCellCountInDay();
    }

    if (duration < 0) {
      duration = 0;
    }
    return differenceInDays * this.getCellCountInDay() + duration;
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

  protected override isVerticalShader() {
    return false;
  }

  protected override isCurrentTimeHeaderCell() {
    return false;
  }

  protected override setTableSizes() {
    super.setTableSizes();

    const minHeight = this.getWorkSpaceMinHeight();
    setHeight(this.$sidebarTable, minHeight);
    setHeight(this._$dateTable, minHeight);

    this.virtualScrollingDispatcher.updateDimensions();
  }

  private getWorkSpaceMinHeight() {
    let minHeight = this.getWorkSpaceHeight();

    const workspaceContainerHeight = getOuterHeight(this._$flexContainer, true);

    if (minHeight < workspaceContainerHeight) {
      minHeight = workspaceContainerHeight;
    }

    return minHeight;
  }

  protected override getCellCoordinatesByIndex(index) {
    return {
      columnIndex: index % this._getCellCount(),
      rowIndex: 0,
    };
  }

  protected override getCellElementByPosition(cellCoordinates, groupIndex) {
    const indexes = this._groupedStrategy.prepareCellIndexes(cellCoordinates, groupIndex);

    return this._$dateTable
      .find('tr')
      .eq(indexes.rowIndex)
      .find('td')
      .eq(indexes.columnIndex);
  }

  protected override getWorkSpaceWidth() {
    return getOuterWidth(this._$dateTable, true);
  }

  private getIndicationFirstViewDate() {
    return dateUtils.trimTime(new Date(this.getStartViewDate()));
  }

  protected override getIntervalBetween(currentDate, allDay) {
    const startDayHour = this.option('startDayHour');
    const endDayHour = this.option('endDayHour');
    const firstViewDate = this.getStartViewDate();
    const firstViewDateTime = firstViewDate.getTime();
    const hiddenInterval = (24 - endDayHour + startDayHour) * toMs('hour');
    const timeZoneOffset = dateUtils.getTimezonesDifference(firstViewDate, currentDate);
    const apptStart = currentDate.getTime();
    const fullInterval = apptStart - firstViewDateTime - timeZoneOffset;
    const fullDays = Math.floor(fullInterval / toMs('day'));
    const tailDuration = fullInterval - (fullDays * toMs('day'));
    let tailDelta = 0;
    const cellCount = this.getCellCountInDay() * (fullDays - this.getWeekendsCount(fullDays));
    const gapBeforeAppt = apptStart - dateUtils.trimTime(new Date(currentDate)).getTime();
    let result = cellCount * (this.option('hoursInterval') as any) * toMs('hour');

    if (!allDay) {
      const hour = currentDate.getHours();

      switch (true) {
        case hour < startDayHour:
          tailDelta = tailDuration - hiddenInterval + gapBeforeAppt;
          break;
        case hour >= startDayHour && hour < endDayHour:
          tailDelta = tailDuration;
          break;
        case hour >= startDayHour && hour >= endDayHour:
          tailDelta = tailDuration - (gapBeforeAppt - endDayHour * toMs('hour'));
          break;
        case !fullDays:
          result = fullInterval;
          break;
        default:
          break;
      }

      result += tailDelta;
    }

    return result;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected override getWeekendsCount(argument?: any) {
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
    date = date || new Date(this.option('currentDate'));
    date.setHours(hours, minutes, 0, 0);

    const coordinates = this.getScrollCoordinates(date);
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

  protected override renderGroupAllDayPanel() {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  generateRenderOptions(argument?: any) {
    const options = super.generateRenderOptions(true);

    return {
      ...options,
      isGenerateWeekDaysHeaderData: this.needRenderWeekHeader(),
      getDateForHeaderText: timelineWeekUtils.getDateForHeaderText,
    };
  }

  // -------------
  // We need these methods for now but they are useless for renovation
  // -------------

  _init() {
    super._init();

    (this.$element() as any).addClass(TIMELINE_CLASS);
    this.$sidebarTable = $('<div>')
      .addClass(GROUP_TABLE_CLASS);
  }

  protected override getDefaultGroupStrategy() {
    return 'vertical';
  }

  protected override toggleGroupingDirectionClass() {
    (this.$element() as any).toggleClass(HORIZONTAL_GROUPED_WORKSPACE_CLASS, this._isHorizontalGroupedWorkSpace());
  }

  _getDefaultOptions() {
    return extend(super._getDefaultOptions(), {
      groupOrientation: 'vertical',
    });
  }

  protected override createWorkSpaceElements() {
    this.createWorkSpaceScrollableElements();
  }

  protected override updateAllDayVisibility() { return noop(); }

  protected override getDateHeaderTemplate() {
    return this.option('timeCellTemplate');
  }

  protected override renderView() {
    let groupCellTemplates;
    if (!this.isRenovatedRender()) {
      groupCellTemplates = this.renderGroupHeader();
    }

    this.renderWorkSpace();

    if (this.isRenovatedRender()) {
      this.virtualScrollingDispatcher.updateDimensions();
    }

    this._shader = new HorizontalShader(this);

    this.$sidebarTable.appendTo(this._sidebarScrollable.$content());

    if (this.isRenovatedRender() && this.isVerticalGroupedWorkSpace()) {
      this.renderRGroupPanel();
    }

    this.updateHeaderEmptyCellWidth();

    this.applyCellTemplates(groupCellTemplates);
  }

  protected override setHorizontalGroupHeaderCellsHeight() { return noop(); }

  protected override getTimePanelCells() {
    return (this.$element() as any)
      .find(`.${HEADER_PANEL_CELL_CLASS}:not(.${HEADER_PANEL_WEEK_CELL_CLASS})`);
  }

  getCurrentTimePanelCellIndices() {
    const columnCountPerGroup = this._getCellCount();
    const today = this.getToday();
    const index = this.getCellIndexByDate(today);
    const { columnIndex: currentTimeColumnIndex } = this.getCellCoordinatesByIndex(index);

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

  protected override renderTimePanel() { return noop(); }

  protected override renderAllDayPanel() { return noop(); }

  protected override createAllDayPanelElements() { return noop(); }

  protected override renderDateHeader() {
    const $headerRow = super.renderDateHeader();
    if (this.needRenderWeekHeader()) {
      const firstViewDate = new Date(this.getStartViewDate());
      let currentDate = new Date(firstViewDate);

      const $cells: any[] = [];
      const groupCount = this._getGroupCount();
      const cellCountInDay = this.getCellCountInDay();
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
              ...this.getGroupsForDateHeaderTemplate(templateIndex, colSpan),
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
          this.incrementDate(currentDate);
        }
      }

      const $row = $('<tr>').addClass(HEADER_ROW_CLASS).append($cells as any);
      $headerRow.before($row);
    }
  }

  protected override renderIndicator(height, rtlOffset, $container, groupCount) {
    let $indicator;
    const width = this.getIndicationWidth();

    if (this.option('groupOrientation') === 'vertical') {
      $indicator = this.createIndicator($container);
      setHeight($indicator, getBoundingRect($container.get(0)).height);
      $indicator.css('left', rtlOffset ? rtlOffset - width : width);
    } else {
      for (let i = 0; i < groupCount; i++) {
        const offset = this.isGroupedByDate() ? i * this.getCellWidth() : this._getCellCount() * this.getCellWidth() * i;
        $indicator = this.createIndicator($container);
        setHeight($indicator, getBoundingRect($container.get(0)).height);

        $indicator.css('left', rtlOffset ? rtlOffset - width - offset : width + offset);
      }
    }
  }

  protected override makeGroupRows(groups, groupByDate) {
    const tableCreatorStrategy = this.option('groupOrientation') === 'vertical' ? tableCreator.VERTICAL : tableCreator.HORIZONTAL;

    return tableCreator.makeGroupedTable(
      tableCreatorStrategy,
      groups,
      {
        groupRowClass: GROUP_ROW_CLASS,
        groupHeaderRowClass: GROUP_ROW_CLASS,
        groupHeaderClass: this.getGroupHeaderClass.bind(this),
        groupHeaderContentClass: GROUP_HEADER_CONTENT_CLASS,
      },
      this._getCellCount() || 1,
      this.option('resourceCellTemplate'),
      this.getTotalRowCount(this._getGroupCount()),
      groupByDate,
    );
  }

  // Old render methods.
  // TODO Old render: delete these methods with the old render.

  protected override setCurrentTimeCells(): void {
    const timePanelCells = this.getTimePanelCells();
    const currentTimeCellIndices = this.getCurrentTimePanelCellIndices();
    currentTimeCellIndices.forEach((timePanelCellIndex) => {
      timePanelCells.eq(timePanelCellIndex)
        .addClass(HEADER_CURRENT_TIME_CELL_CLASS);
    });
  }
}

registerComponent('dxSchedulerTimeline', SchedulerTimeline as any);
export default SchedulerTimeline;
