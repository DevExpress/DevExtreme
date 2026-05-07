import dateUtils from '@js/core/utils/date';
import type { SafeAppointment } from '@ts/scheduler/types';

import { getGroupWidth } from '../../../workspaces/helpers/m_position_helper';
import HorizontalMonthLineRenderingStrategy from './m_strategy_horizontal_month_line';

const MONTH_APPOINTMENT_HEIGHT_RATIO = 0.6;
const MONTH_APPOINTMENT_MIN_OFFSET = 26;
const MONTH_APPOINTMENT_MAX_OFFSET = 30;
const MONTH_DROPDOWN_APPOINTMENT_MIN_RIGHT_OFFSET = 36;
const MONTH_DROPDOWN_APPOINTMENT_MAX_RIGHT_OFFSET = 60;

const toMs = dateUtils.dateToMilliseconds;

class HorizontalMonthRenderingStrategy extends HorizontalMonthLineRenderingStrategy {
  get endViewDate() { return this.options.endViewDate; }

  get adaptivityEnabled() { return this.options.adaptivityEnabled; }

  get DOMMetaData() { return this.options.DOMMetaData; }

  protected getLeftPosition(settings) {
    const fullWeekAppointmentWidth = this.getGroupWidth(settings.groupIndex);

    return this.calculateMultiWeekAppointmentLeftOffset(settings.hMax, fullWeekAppointmentWidth);
  }

  protected getChunkCount(
    fullChunksWidth,
    firstChunkWidth,
    weekWidth,
    settings,
  ) {
    const { groupIndex, info: { appointment: { startDate } } } = settings;
    const rawFullChunksWidth = fullChunksWidth - firstChunkWidth + weekWidth;
    const allChunksCount = Math.ceil(rawFullChunksWidth / weekWidth);

    const viewRowIndex = this.tryGetRowIndexInView(startDate);

    if (viewRowIndex !== undefined) {
      const viewChunksCount = this.viewDataProvider.getRowCountInGroup(groupIndex);
      const allowedChunksCount = viewChunksCount - viewRowIndex;
      return allChunksCount <= allowedChunksCount ? allChunksCount : allowedChunksCount;
    }

    return allChunksCount;
  }

  // NOTE: This method tries to get real row index inside appointment's group view.
  // We cannot use settings.rowIndex, because this row index for all date table and not for special group.
  protected tryGetRowIndexInView(positionStartDate) {
    const columnsCount = this.viewDataProvider.getColumnsCount();

    if (this.options.dataRange?.length < 1 || !columnsCount) {
      return undefined;
    }

    const [startViewDate] = this.options.dateRange;
    // NOTE: We cannot take cellDuration from options,
    // because startDayHour/endDayHour takes affect in renovation scheduler.
    const dayDurationMs = toMs('day');
    const timeFromStart = positionStartDate.getTime() - startViewDate.getTime();

    return Math.floor(timeFromStart / dayDurationMs / columnsCount);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected getChunkWidths(geometry, settings, weekWidth) {
    const firstChunkWidth = geometry.reducedWidth;
    const fullChunksWidth = Math.floor(geometry.sourceAppointmentWidth);
    const widthWithoutFirstChunk = fullChunksWidth - firstChunkWidth;

    return [firstChunkWidth, fullChunksWidth, widthWithoutFirstChunk];
  }

  protected getTailChunkSettings(withoutFirstChunkWidth, weekWidth, leftPosition) {
    const tailChunkWidth = withoutFirstChunkWidth % weekWidth || weekWidth;
    const rtlPosition = leftPosition + (weekWidth - tailChunkWidth);
    const tailChunkLeftPosition = this.rtlEnabled ? rtlPosition : leftPosition;

    return [tailChunkWidth, tailChunkLeftPosition];
  }

  protected getAppointmentParts(geometry, settings) {
    const result: any = [];

    const weekWidth = Math.round(this.getGroupWidth(settings.groupIndex));
    const [firstChunkWidth, fullChunksWidth, withoutFirstChunkWidth] = this.getChunkWidths(geometry, settings, weekWidth);
    const leftPosition = this.getLeftPosition(settings);

    const { endDate } = settings.info.appointment;
    const hasTailChunk = this.endViewDate > endDate;
    const chunkCount = this.getChunkCount(fullChunksWidth, firstChunkWidth, weekWidth, settings);

    const [tailChunkWidth, tailChunkLeftPosition] = this.getTailChunkSettings(withoutFirstChunkWidth, weekWidth, leftPosition);

    for (let chunkIndex = 1; chunkIndex < chunkCount; chunkIndex++) {
      const topPosition = settings.top + this.cellHeight * chunkIndex;
      const isTailChunk = hasTailChunk && (chunkIndex === chunkCount - 1);

      result.push({
        ...settings,
        ...{
          top: topPosition,
          left: isTailChunk ? tailChunkLeftPosition : leftPosition,
          height: geometry.height,
          width: isTailChunk ? tailChunkWidth : weekWidth,
          appointmentReduced: isTailChunk ? 'tail' : 'body',
          rowIndex: ++settings.rowIndex,
          columnIndex: 0,
        },
      });
    }

    return result;
  }

  protected calculateMultiWeekAppointmentLeftOffset(max, width) {
    return this.rtlEnabled
      ? max
      : max - width;
  }

  getGroupWidth(groupIndex) {
    return getGroupWidth(
      groupIndex,
      this.viewDataProvider,
      {
        intervalCount: this.options.intervalCount,
        currentDate: this.options.currentDate,
        viewType: this.options.viewType,
        hoursInterval: this.options.hoursInterval,
        startDayHour: this.options.startDayHour,
        endDayHour: this.options.endDayHour,
        isVirtualScrolling: this.isVirtualScrolling,
        rtlEnabled: this.rtlEnabled,
        DOMMetaData: this.DOMMetaData,
      },
    );
  }

  protected getAppointmentDefaultHeight() {
    return this.getAppointmentHeightByTheme();
  }

  protected getAppointmentMinHeight() {
    return this.getAppointmentDefaultHeight();
  }

  createTaskPositionMap(items: SafeAppointment[]) {
    return super.createTaskPositionMap(items, true);
  }

  protected getSortedPositions(map) {
    return super.getSortedPositions(map, true);
  }

  protected getDefaultRatio() {
    return MONTH_APPOINTMENT_HEIGHT_RATIO;
  }

  protected getOffsets() {
    return {
      unlimited: MONTH_APPOINTMENT_MIN_OFFSET,
      auto: MONTH_APPOINTMENT_MAX_OFFSET,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getDropDownAppointmentWidth(intervalCount, isAllDay) {
    if (this.adaptivityEnabled) {
      return this.getDropDownButtonAdaptiveSize();
    }
    const offset = intervalCount > 1 ? MONTH_DROPDOWN_APPOINTMENT_MAX_RIGHT_OFFSET : MONTH_DROPDOWN_APPOINTMENT_MIN_RIGHT_OFFSET;
    return this.cellWidth - offset;
  }
}

export default HorizontalMonthRenderingStrategy;
