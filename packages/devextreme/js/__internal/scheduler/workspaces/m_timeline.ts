import registerComponent from '@js/core/component_registrator';
import $, { type dxElementWrapper } from '@js/core/renderer';
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
import HorizontalShader from '../shaders/current_time_shader_horizontal';
import type { WorkspaceDateTableScrollableConfig, WorkspaceHeaderScrollableConfig } from './m_work_space';
import SchedulerWorkSpace, { type WorkSpaceIndicatorDefaultOptions } from './m_work_space_indicator';
import type { ViewDataProviderOptions } from './view_model/m_types';

const { tableCreator } = tableCreatorModule;

const TIMELINE_CLASS = 'dx-scheduler-timeline';
const GROUP_TABLE_CLASS = 'dx-scheduler-group-table';

const HORIZONTAL_GROUPED_WORKSPACE_CLASS = 'dx-scheduler-work-space-horizontal-grouped';

const HEADER_PANEL_CELL_CLASS = 'dx-scheduler-header-panel-cell';
const HEADER_PANEL_WEEK_CELL_CLASS = 'dx-scheduler-header-panel-week-cell';
const HEADER_ROW_CLASS = 'dx-scheduler-header-row';

const HORIZONTAL = 'horizontal';
const toMs = dateUtils.dateToMilliseconds;

interface TimelineDefaultOptions extends WorkSpaceIndicatorDefaultOptions {
  groupOrientation: 'vertical';
}

class SchedulerTimeline extends SchedulerWorkSpace {
  protected override $sidebarTable!: dxElementWrapper;

  get verticalGroupTableClass(): string { return GROUP_TABLE_CLASS; }

  readonly viewDirection = 'horizontal';

  get renovatedHeaderPanelComponent(): typeof HeaderPanelTimelineComponent {
    return HeaderPanelTimelineComponent;
  }

  getGroupTableWidth(): number {
    return this.$sidebarTable ? getOuterWidth(this.$sidebarTable) as number : 0;
  }

  protected override getTotalRowCount(
    groupCount: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    includeAllDayPanelRows?: unknown,
  ): number {
    if (this.isHorizontalGroupedWorkSpace()) {
      return this.getRowCount();
    }
    const totalGroupCount = groupCount || 1;
    return this.getRowCount() * totalGroupCount;
  }

  protected override getFormat(): string {
    return 'shorttime';
  }

  private getWorkSpaceHeight(): number {
    if (this.option('crossScrollingEnabled') && hasWindow()) {
      return getBoundingRect(this.$dateTable.get(0)).height as number;
    }

    return getBoundingRect(this.$element().get(0)).height as number;
  }

  protected override dateTableScrollableConfig(): WorkspaceDateTableScrollableConfig {
    const config = super.dateTableScrollableConfig();
    const timelineConfig = {
      direction: HORIZONTAL,
    };

    return this.option('crossScrollingEnabled') ? config : extend(config, timelineConfig) as WorkspaceDateTableScrollableConfig;
  }

  protected override needCreateCrossScrolling(): boolean {
    return true;
  }

  protected override headerScrollableConfig(): WorkspaceHeaderScrollableConfig {
    const config = super.headerScrollableConfig();

    return extend(config, {
      scrollByContent: true,
    }) as WorkspaceHeaderScrollableConfig;
  }

  supportAllDayRow(): boolean {
    return false;
  }

  protected override getGroupHeaderContainer(): dxElementWrapper {
    if (this.isHorizontalGroupedWorkSpace()) {
      return this.$thead as dxElementWrapper;
    }
    return this.$sidebarTable;
  }

  protected override insertAllDayRowsIntoDateTable(): boolean {
    return false;
  }

  protected needRenderWeekHeader(): boolean {
    return false;
  }

  protected incrementDate(date: Date): void {
    date.setDate(date.getDate() + 1);
  }

  getIndicationCellCount(): number {
    const timeDiff = this.getTimeDiff();
    return this.calculateDurationInCells(timeDiff);
  }

  private getTimeDiff(): number {
    let today = this.getToday();
    const date = this.getIndicationFirstViewDate();

    const startViewDate = this.getStartViewDate();
    const dayLightOffset = timezoneUtils.getDaylightOffsetInMs(startViewDate, today);

    if (dayLightOffset) {
      today = new Date(today.getTime() + dayLightOffset);
    }

    return today.getTime() - date.getTime();
  }

  protected calculateDurationInCells(timeDiff: number): number {
    const today = this.getToday();
    const differenceInDays = Math.floor(timeDiff / toMs('day'));
    let duration = (timeDiff - differenceInDays * toMs('day') - this.option('startDayHour') * toMs('hour')) / this.getCellDuration();

    if (today.getHours() > this.option('endDayHour')) {
      duration = this.getCellCountInDay();
    }

    if (duration < 0) {
      duration = 0;
    }
    return differenceInDays * this.getCellCountInDay() + duration;
  }

  getIndicationWidth(): number {
    if (this.isGroupedByDate()) {
      const cellCount = this.getIndicationCellCount();
      const integerPart = Math.floor(cellCount);
      const fractionPart = cellCount - integerPart;

      return this.getCellWidth() * (integerPart * this.getGroupCount() + fractionPart);
    }
    return this.getIndicationCellCount() * this.getCellWidth();
  }

  protected override isVerticalShader(): boolean {
    return false;
  }

  protected override isCurrentTimeHeaderCell(): boolean {
    return false;
  }

  protected override setTableSizes(): void {
    super.setTableSizes();

    const minHeight = this.getWorkSpaceMinHeight();
    setHeight(this.$sidebarTable, minHeight);
    setHeight(this.$dateTable, minHeight);

    this.virtualScrollingDispatcher.updateDimensions();
  }

  private getWorkSpaceMinHeight(): number {
    let minHeight = this.getWorkSpaceHeight();

    const workspaceContainerHeight = getOuterHeight(this.$flexContainer, true);

    if (minHeight < workspaceContainerHeight) {
      minHeight = workspaceContainerHeight;
    }

    return minHeight;
  }

  protected override getCellCoordinatesByIndex(
    index: number,
  ): { columnIndex: number; rowIndex: number } {
    return {
      columnIndex: index % this.getCellCount(),
      rowIndex: 0,
    };
  }

  protected override getCellElementByPosition(
    cellCoordinates: { rowIndex: number; columnIndex: number },
    groupIndex: number,
  ): dxElementWrapper {
    const indexes = this.groupedStrategy.prepareCellIndexes(cellCoordinates, groupIndex);

    return this.$dateTable
      .find('tr')
      .eq(indexes.rowIndex)
      .find('td')
      .eq(indexes.columnIndex) as dxElementWrapper;
  }

  protected override getWorkSpaceWidth(): number {
    return getOuterWidth(this.$dateTable, true) as number;
  }

  private getIndicationFirstViewDate(): Date {
    return dateUtils.trimTime(new Date(this.getStartViewDate())) as Date;
  }

  protected override getIntervalBetween(currentDate: Date, allDay?: boolean): number {
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
    let result = cellCount * this.option('hoursInterval') * toMs('hour');

    if (!allDay) {
      const hour = currentDate.getHours();

      switch (true) {
        case hour < startDayHour:
          tailDelta = tailDuration - hiddenInterval + gapBeforeAppt;
          break;
        case hour >= startDayHour && hour < endDayHour:
          tailDelta = tailDuration;
          break;
        case hour >= endDayHour:
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

  getAllDayContainer(): null {
    return null;
  }

  getTimePanelWidth(): number {
    return 0;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getIntervalDuration(allDay: boolean): number {
    return this.getCellDuration();
  }

  getCellMinWidth(): number {
    return 0;
  }

  getWorkSpaceLeftOffset(): number {
    return 0;
  }

  renderRAllDayPanel(): void {}

  renderRTimeTable(): void {}

  protected override renderGroupAllDayPanel() {}

  generateRenderOptions(isProvideVirtualCellsWidth?: boolean): ViewDataProviderOptions {
    const options = super.generateRenderOptions(isProvideVirtualCellsWidth ?? true);

    return {
      ...options,
      isGenerateWeekDaysHeaderData: this.needRenderWeekHeader(),
      getDateForHeaderText: timelineWeekUtils.getDateForHeaderText,
    };
  }

  // -------------
  // We need these methods for now but they are useless for renovation
  // -------------

  _init(): void {
    super._init();

    this.$element().addClass(TIMELINE_CLASS);
    this.$sidebarTable = $('<div>')
      .addClass(GROUP_TABLE_CLASS);
  }

  protected override getDefaultGroupStrategy(): 'vertical' {
    return 'vertical';
  }

  protected override toggleGroupingDirectionClass(): void {
    this.$element().toggleClass(
      HORIZONTAL_GROUPED_WORKSPACE_CLASS,
      this.isHorizontalGroupedWorkSpace(),
    );
  }

  _getDefaultOptions(): TimelineDefaultOptions {
    return extend(super._getDefaultOptions(), {
      groupOrientation: 'vertical',
    }) as TimelineDefaultOptions;
  }

  protected override createWorkSpaceElements(): void {
    this.createWorkSpaceScrollableElements();
  }

  protected override updateAllDayVisibility(): void { return noop(); }

  protected override getDateHeaderTemplate(): dxSchedulerOptions['timeCellTemplate'] {
    return this.option('timeCellTemplate');
  }

  protected override renderView(): void {
    let groupCellTemplates;
    if (!this.isRenovatedRender()) {
      groupCellTemplates = this.renderGroupHeader();
    }
    this.renderWorkSpace();

    if (this.isRenovatedRender()) {
      this.virtualScrollingDispatcher.updateDimensions();
    }

    this.shader = new HorizontalShader(this);

    this.$sidebarTable.appendTo(this.$sidebarScrollable.$content());

    if (this.isRenovatedRender() && this.isVerticalGroupedWorkSpace()) {
      this.renderRGroupPanel();
    }

    this.updateHeaderEmptyCellWidth();

    this.applyCellTemplates(groupCellTemplates);
  }

  protected override setHorizontalGroupHeaderCellsHeight(): void { return noop(); }

  protected override getTimePanelCells(): dxElementWrapper {
    return this.$element()
      .find(`.${HEADER_PANEL_CELL_CLASS}:not(.${HEADER_PANEL_WEEK_CELL_CLASS})`);
  }

  getCurrentTimePanelCellIndices(): number[] {
    const columnCountPerGroup = this.getCellCount();
    const today = this.getToday();
    const index = this.getCellIndexByDate(today);
    const { columnIndex: currentTimeColumnIndex } = this.getCellCoordinatesByIndex(index);

    if (currentTimeColumnIndex === undefined) {
      return [];
    }

    const horizontalGroupCount = this.isHorizontalGroupedWorkSpace() && !this.isGroupedByDate()
      ? this.getGroupCount()
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
      const groupCount = this.getGroupCount();
      const cellCountInDay = this.getCellCountInDay();
      const colSpan = this.isGroupedByDate()
        ? cellCountInDay * groupCount
        : cellCountInDay;
      const cellTemplate: any = this.option('dateCellTemplate');

      const horizontalGroupCount = this.isHorizontalGroupedWorkSpace() && !this.isGroupedByDate()
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

  protected override renderIndicator(
    height: number,
    rtlOffset: number,
    $container: dxElementWrapper,
    groupCount: number,
  ): void {
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let $indicator: dxElementWrapper | undefined;
    const width = this.getIndicationWidth();

    if (this.option('groupOrientation') === 'vertical') {
      $indicator = this.createIndicator($container);
      setHeight($indicator, getBoundingRect($container.get(0)).height);
      $indicator.css('left', rtlOffset ? rtlOffset - width : width);
    } else {
      for (let i = 0; i < groupCount; i += 1) {
        const offset = this.isGroupedByDate() ? i * this.getCellWidth()
          : this.getCellCount() * this.getCellWidth() * i;
        $indicator = this.createIndicator($container);
        setHeight($indicator, getBoundingRect($container.get(0)).height);

        $indicator.css('left', rtlOffset ? rtlOffset - width - offset : width + offset);
      }
    }
  }

  protected override makeGroupRows(groups: unknown[], groupByDate: boolean): unknown {
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
      this.getCellCount() || 1,
      this.option('resourceCellTemplate'),
      this.getTotalRowCount(this.getGroupCount()),
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
registerComponent('dxSchedulerTimeline', SchedulerTimeline as any);
export default SchedulerTimeline;
