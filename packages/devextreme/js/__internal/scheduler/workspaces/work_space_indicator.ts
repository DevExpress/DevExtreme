import registerComponent from '@js/core/component_registrator';
import $, { type dxElementWrapper } from '@js/core/renderer';
import dateUtils from '@js/core/utils/date';
import { extend } from '@js/core/utils/extend';
import { getBoundingRect } from '@js/core/utils/position';
import { setWidth } from '@js/core/utils/size';
import { hasWindow } from '@js/core/utils/window';
import { dateUtilsTs } from '@ts/core/utils/date';
import type { OptionChanged } from '@ts/core/widget/types';
import { getToday } from '@ts/scheduler/r1/utils/index';

import { HEADER_CURRENT_TIME_CELL_CLASS } from '../classes';
import timezoneUtils from '../m_utils_time_zone';
import SchedulerWorkSpace, {
  type WorkspaceOptionsInternal,
} from './m_work_space';

const toMs = dateUtils.dateToMilliseconds;

const SCHEDULER_DATE_TIME_INDICATOR_CLASS = 'dx-scheduler-date-time-indicator';

class SchedulerWorkSpaceIndicator extends SchedulerWorkSpace {
  private indicatorInterval?: ReturnType<typeof setInterval>;

  protected getToday(): Date {
    const viewOffset = this.option('viewOffset');
    const today = getToday(this.option('indicatorTime'), this.timeZoneCalculator);
    return dateUtilsTs.addOffsets(today, -viewOffset);
  }

  isIndicationOnView(): boolean {
    if (this.option('showCurrentTimeIndicator')) {
      const today = this.getToday();
      const endViewDate = dateUtils.trimTime(this.getEndViewDate());

      return dateUtils.dateInRange(today, this.getStartViewDate(), new Date(endViewDate.getTime() + toMs('day')));
    }
    return false;
  }

  isIndicationAvailable(): boolean {
    if (!hasWindow()) {
      return false;
    }

    const today = this.getToday();

    return today >= dateUtils.trimTime(new Date(this.getStartViewDate()));
  }

  isIndicatorVisible(): boolean {
    const today = this.getToday();

    // Subtracts 1 ms from the real endViewDate instead of 1 minute
    const endViewDate = new Date(this.getEndViewDate().getTime() + toMs('minute') - 1);
    const firstViewDate = new Date(this.getStartViewDate());
    firstViewDate.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());
    endViewDate.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());

    return dateUtils.dateInRange(today, firstViewDate, endViewDate);
  }

  protected renderIndicator(
    height: number,
    rtlOffset: number,
    $container: dxElementWrapper,
    groupCount: number,
  ): void {
    const groupedByDate = this.isGroupedByDate();
    const repeatCount = groupedByDate ? 1 : groupCount;
    for (let i = 0; i < repeatCount; i += 1) {
      const $indicator = this.createIndicator($container);

      setWidth(
        $indicator,
        groupedByDate ? this.getCellWidth() * groupCount : this.getCellWidth(),
      );
      this.groupedStrategy.shiftIndicator($indicator, height, rtlOffset, i);
    }
  }

  protected createIndicator($container: dxElementWrapper): dxElementWrapper {
    const $indicator = $('<div>').addClass(SCHEDULER_DATE_TIME_INDICATOR_CLASS);
    $container.append($indicator);

    return $indicator;
  }

  private getRtlOffset(width: number): number {
    return this.option('rtlEnabled') ? getBoundingRect(this.$dateTableScrollable.$content().get(0)).width - this.getTimePanelWidth() - width : 0;
  }

  protected setIndicationUpdateInterval(): void {
    if (!this.option('showCurrentTimeIndicator') || this.option('indicatorUpdateInterval') === 0) {
      return;
    }

    this.clearIndicatorUpdateInterval();

    // eslint-disable-next-line no-restricted-globals
    this.indicatorInterval = setInterval(() => {
      this.renderCurrentDateTimeIndication();
    }, this.option('indicatorUpdateInterval'));
  }

  private clearIndicatorUpdateInterval(): void {
    if (this.indicatorInterval) {
      clearInterval(this.indicatorInterval);
      delete this.indicatorInterval;
    }
  }

  protected isVerticalShader(): boolean {
    return true;
  }

  getIndicationWidth(): number {
    const cellCount = this.getCellCount();
    const cellSpan = Math.min(this.getIndicatorDaysSpan(), cellCount);
    const width = cellSpan * this.getCellWidth();
    const maxWidth = this.getCellWidth() * cellCount;

    return Math.min(width, maxWidth);
  }

  getIndicatorOffset(): number {
    const cellSpan = this.getIndicatorDaysSpan() - 1;
    const offset = cellSpan * this.getCellWidth();

    return offset;
  }

  private getIndicatorDaysSpan(): number {
    const today = this.getToday();
    const viewStartTime = this.getStartViewDate().getTime();
    let timeDiff = today.getTime() - viewStartTime;

    if (((this.option('skippedDays')) ?? []).length > 0) {
      const skippedDaysDuration = this.getSkippedDaysCount(
        this.getStartViewDate(),
        Math.round(timeDiff / toMs('day')),
      ) * toMs('day');
      timeDiff -= skippedDaysDuration;
    }

    return Math.ceil((timeDiff + 1) / toMs('day'));
  }

  getIndicationHeight(): number {
    const today = timezoneUtils.getDateWithoutTimezoneChange(this.getToday());
    const cellHeight = this.getCellHeight();
    const date = new Date(this.getStartViewDate());

    if (this.isIndicationOnView()) {
      date.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());
    }

    const duration = today.getTime() - date.getTime();
    const cellCount = duration / this.getCellDuration();

    return cellCount * cellHeight;
  }

  _dispose(): void {
    this.clearIndicatorUpdateInterval();
    super._dispose();
  }

  renderCurrentDateTimeIndication(): void {
    this.renderCurrentDateTimeLineAndShader();

    this.renderWorkSpace({
      generateNewData: true,
      renderComponents: {
        header: true,
        timePanel: true,
      },
    });
  }

  renderCurrentDateTimeLineAndShader(): void {
    this.cleanDateTimeIndicator();
    this.shader?.clean();
    this.renderDateTimeIndication();
  }

  protected isCurrentTimeHeaderCell(headerIndex: number): boolean {
    if (this.isIndicationOnView()) {
      const { completeDateHeaderMap } = this.viewDataProvider;
      const date = completeDateHeaderMap[completeDateHeaderMap.length - 1][headerIndex].startDate;

      return dateUtils.sameDate(date, this.getToday());
    }

    return false;
  }

  protected override getHeaderPanelCellClass(i: number): string {
    const cellClass = super.getHeaderPanelCellClass(i);

    if (this.isCurrentTimeHeaderCell(i)) {
      return `${cellClass} ${HEADER_CURRENT_TIME_CELL_CLASS}`;
    }

    return cellClass;
  }

  protected override cleanView(): void {
    super.cleanView();

    this.cleanDateTimeIndicator();
  }

  _dimensionChanged(): void {
    super._dimensionChanged();

    this.renderCurrentDateTimeLineAndShader();
  }

  private cleanDateTimeIndicator(): void {
    this.$element().find(`.${SCHEDULER_DATE_TIME_INDICATOR_CLASS}`).remove();
  }

  protected override cleanWorkSpace(): void {
    super.cleanWorkSpace();

    this.renderDateTimeIndication();
    this.setIndicationUpdateInterval();
  }

  _optionChanged(args: OptionChanged<WorkspaceOptionsInternal>): void {
    switch (args.name) {
      case 'showCurrentTimeIndicator':
      case 'indicatorTime':
        this.cleanWorkSpace();
        break;
      case 'indicatorUpdateInterval':
        this.setIndicationUpdateInterval();
        break;
      case 'showAllDayPanel':
      case 'allDayExpanded':
      case 'crossScrollingEnabled':
        super._optionChanged(args);
        this.renderCurrentDateTimeIndication();
        break;
      case 'shadeUntilCurrentTime':
        this.renderCurrentDateTimeIndication();
        break;
      default:
        super._optionChanged(args);
    }
  }

  _getDefaultOptions(): WorkspaceOptionsInternal {
    return extend(super._getDefaultOptions(), {
      showCurrentTimeIndicator: true,
      indicatorTime: new Date(),
      indicatorUpdateInterval: 5 * toMs('minute'),
      shadeUntilCurrentTime: true,
    }) as WorkspaceOptionsInternal;
  }

  protected getCurrentTimePanelCellIndices(): number[] {
    const rowCountPerGroup = this.getTimePanelRowCount();
    const today = this.getToday();
    const index = this.getCellIndexByDate(today);
    const { rowIndex: currentTimeRowIndex } = this.getCellCoordinatesByIndex(index);

    if (currentTimeRowIndex === undefined) {
      return [];
    }

    let cellIndices: number[] = [currentTimeRowIndex];

    if (currentTimeRowIndex !== 0) {
      cellIndices = currentTimeRowIndex % 2 === 0
        ? [currentTimeRowIndex - 1, currentTimeRowIndex]
        : [currentTimeRowIndex, currentTimeRowIndex + 1];
    }

    const verticalGroupCount = this.isVerticalGroupedWorkSpace()
      ? this.getGroupCount()
      : 1;

    return [...new Array(verticalGroupCount)]
      .reduce<number[]>((currentIndices, _, groupIndex) => [
        ...currentIndices,
        ...cellIndices.map((cellIndex) => rowCountPerGroup * groupIndex + cellIndex),
      ], []);
  }

  protected renderDateTimeIndication(): void {
    if (!this.isIndicationAvailable()) {
      return;
    }

    if (this.option('shadeUntilCurrentTime')) {
      this.shader.render(
        this.isHorizontalGroupedWorkSpace(),
        this.getGroupCount() || 1,
        this.getCellCount(),
      );
    }

    if (!this.isIndicationOnView() || !this.isIndicatorVisible()) {
      return;
    }

    const groupCount = this.getGroupCount() || 1;
    const $container = this.$dateTableScrollable.$content();
    const height = this.getIndicationHeight();
    const rtlOffset = this.getRtlOffset(this.getCellWidth());

    this.renderIndicator(height, rtlOffset, $container, groupCount);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
registerComponent('dxSchedulerWorkSpace', SchedulerWorkSpaceIndicator as any);
export default SchedulerWorkSpaceIndicator;
