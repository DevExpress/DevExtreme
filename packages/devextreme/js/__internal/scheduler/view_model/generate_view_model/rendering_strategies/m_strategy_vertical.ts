import dateUtils from '@js/core/utils/date';
import { extend } from '@js/core/utils/extend';
import { roundFloatPart } from '@js/core/utils/math';
import { isNumeric } from '@js/core/utils/type';
import { getSkippedHoursInRange, isAppointmentTakesAllDay } from '@ts/scheduler/r1/utils/index';

import timeZoneUtils from '../../../m_utils_time_zone';
import { AppointmentAdapter } from '../../../utils/appointment_adapter/appointment_adapter';
import BaseAppointmentsStrategy from './m_strategy_base';

const ALLDAY_APPOINTMENT_MIN_VERTICAL_OFFSET = 5;
const ALLDAY_APPOINTMENT_MAX_VERTICAL_OFFSET = 20;

const toMs = dateUtils.dateToMilliseconds;

class VerticalRenderingStrategy extends BaseAppointmentsStrategy {
  protected correctCollectorCoordinatesInAdaptive(coordinates, isAllDay) {
    if (isAllDay) {
      super.correctCollectorCoordinatesInAdaptive(coordinates, isAllDay);
    } else if (this.getMaxAppointmentCountPerCellByType() === 0) {
      const { cellHeight } = this;
      const { cellWidth } = this;

      coordinates.top += (cellHeight - this.getDropDownButtonAdaptiveSize()) / 2;
      coordinates.left += (cellWidth - this.getDropDownButtonAdaptiveSize()) / 2;
    }
  }

  getAppointmentGeometry(coordinates) {
    let geometry: any = null;
    if (coordinates.allDay) {
      geometry = this.getAllDayAppointmentGeometry(coordinates);
    } else {
      geometry = this.isAdaptive && coordinates.isCompact ? this.getAdaptiveGeometry(coordinates) : this.getVerticalAppointmentGeometry(coordinates);
    }

    return super.getAppointmentGeometry(geometry);
  }

  protected getAdaptiveGeometry(coordinates) {
    const config = this.calculateGeometryConfig(coordinates);
    return this.customizeCoordinates(coordinates, config.height, config.appointmentCountPerCell, config.offset);
  }

  protected getItemPosition(initialAppointment) {
    const allDay = this.isAllDay(initialAppointment);

    if (allDay) {
      return super.getItemPosition(initialAppointment);
    }

    const appointment = super.shiftAppointmentByViewOffset(initialAppointment);
    const adapter = new AppointmentAdapter(appointment, this.dataAccessors);
    const isRecurring = adapter.isRecurrent;

    const {
      startDate: appointmentStartDate,
      endDate: appointmentEndDate,
    } = adapter.getCalculatedDates(this.timeZoneCalculator, 'toGrid');
    const appointmentDuration = appointmentEndDate.getTime() - appointmentStartDate.getTime();

    const appointmentBeginInCurrentView = this.options.startViewDate < appointmentStartDate;
    const isAppointmentTakesSeveralDays = !timeZoneUtils.isSameAppointmentDates(appointmentStartDate, appointmentEndDate);

    const settings = this.generateAppointmentSettings(appointment);
    let result = [];

    for (let j = 0; j < settings.length; j++) {
      const currentSetting = settings[j];
      const height = this.calculateAppointmentHeight(appointment, currentSetting);
      const width = this.calculateAppointmentWidth(appointment, currentSetting);

      let resultHeight = height;
      let appointmentReduced: any = null;
      let multiDaysAppointmentParts = [];
      const currentMaxAllowedPosition = currentSetting.vMax;

      if (this.isMultiViewAppointment(currentSetting, height) || (isAppointmentTakesSeveralDays && !isRecurring)) {
        const trimmedStartDate = dateUtils.trimTime(appointmentStartDate);
        const trimmedSettingStartDate = dateUtils.trimTime(currentSetting.info.appointment.startDate);
        const reduceHead = (trimmedStartDate <= trimmedSettingStartDate) || isRecurring;
        if (reduceHead) {
          resultHeight = this.reduceMultiDayAppointment(height, {
            top: currentSetting.top,
            bottom: currentMaxAllowedPosition,
          });

          multiDaysAppointmentParts = this.getAppointmentParts({
            sourceAppointmentHeight: height,
            reducedHeight: resultHeight,
            width,
          }, currentSetting);
        }

        const {
          startDate: currentSettingStartDate,
          normalizedEndDate: currentSettingNormalizedEndDate,
        } = currentSetting.info.appointment;

        const currentSettingDuration = currentSettingNormalizedEndDate - currentSettingStartDate;
        const hasNextParts = currentSettingDuration < appointmentDuration;

        appointmentReduced = hasNextParts
          ? appointmentBeginInCurrentView ? 'head' : 'body'
          : appointmentBeginInCurrentView ? 'head' : 'tail';
      }

      extend(currentSetting, {
        height: resultHeight,
        width,
        allDay,
        appointmentReduced,
      });

      result = this.getAppointmentPartsPosition(
        multiDaysAppointmentParts,
        currentSetting,
        result,
      );
    }

    return result;
  }

  protected isMultiViewAppointment({ vMax, top }, height) {
    // NOTE: we round these numbers, because in js 100 - 33.3333 = 66.66669999
    const fullAppointmentHeight = roundFloatPart(height, 2);
    const remainingHeight = roundFloatPart(vMax - top, 2);

    return fullAppointmentHeight > remainingHeight;
  }

  protected reduceMultiDayAppointment(sourceAppointmentHeight, bound) {
    return Math.min(sourceAppointmentHeight, bound.bottom - Math.floor(bound.top));
  }

  protected getGroupHeight() {
    return this.cellHeight * this.rowCount;
  }

  protected getGroupTopOffset(appointmentSettings) {
    const { groupIndex } = appointmentSettings;
    const groupTop = Math.max(0, this.positionHelper.getGroupTop({
      groupIndex,
      showAllDayPanel: this.showAllDayPanel,
      isGroupedAllDayPanel: this.isGroupedAllDayPanel,
    }));
    const allDayPanelOffset = this.positionHelper.getOffsetByAllDayPanel({
      groupIndex,
      supportAllDayRow: this.allDaySupported(),
      showAllDayPanel: this.showAllDayPanel,
    });
    const appointmentGroupTopOffset = appointmentSettings.top - groupTop - allDayPanelOffset;

    return appointmentGroupTopOffset;
  }

  protected getTailHeight(appointmentGeometry, appointmentSettings) {
    if (!this.isVirtualScrolling) {
      return appointmentGeometry.sourceAppointmentHeight - appointmentGeometry.reducedHeight;
    }

    const appointmentGroupTopOffset = this.getGroupTopOffset(appointmentSettings);
    const { sourceAppointmentHeight } = appointmentGeometry;

    const groupHeight = this.getGroupHeight();
    const tailHeight = appointmentGroupTopOffset + sourceAppointmentHeight - groupHeight;

    return tailHeight;
  }

  protected getAppointmentParts(appointmentGeometry, appointmentSettings) {
    const { width } = appointmentGeometry;
    const result: any = [];
    let currentPartTop = Math.max(0, this.positionHelper.getGroupTop({
      groupIndex: appointmentSettings.groupIndex,
      showAllDayPanel: this.showAllDayPanel,
      isGroupedAllDayPanel: this.isGroupedAllDayPanel,
    }));
    const cellsDiff = this.isGroupedByDate
      ? this.groupCount
      : 1;
    const offset = this.cellWidth * cellsDiff;

    const allDayPanelOffset = this.positionHelper.getOffsetByAllDayPanel({
      groupIndex: appointmentSettings.groupIndex,
      supportAllDayRow: this.allDaySupported(),
      showAllDayPanel: this.showAllDayPanel,
    });

    currentPartTop += allDayPanelOffset;

    const minHeight = this.getAppointmentMinSize();
    const {
      hMax,
      vMax,
      vMin,
    } = appointmentSettings;
    const { bottomVirtualRowHeight = 0 } = this.viewDataProvider.getViewOptions();
    const maxHeight = this.isVirtualScrolling ? vMax + bottomVirtualRowHeight : vMax - vMin;

    const hasTailPart = this.options.endViewDate > appointmentSettings.info.appointment.endDate;
    let left = Math.round(appointmentSettings.left + offset);
    let tailHeight = this.getTailHeight(appointmentGeometry, appointmentSettings);
    let { columnIndex } = appointmentSettings;

    while (tailHeight > 0 && left < Math.round(hMax)) {
      tailHeight = Math.max(minHeight, tailHeight);
      columnIndex += cellsDiff;
      const height = Math.min(tailHeight, maxHeight);

      result.push({
        ...appointmentSettings,
        top: currentPartTop,
        left,
        height,
        width,
        appointmentReduced: 'body',
        rowIndex: 0,
        columnIndex,
      });

      left += offset;
      tailHeight -= maxHeight;
    }

    if (hasTailPart && result.length > 0) {
      result[result.length - 1].appointmentReduced = 'tail';
    }

    return result;
  }

  protected getMinuteHeight() {
    return this.cellHeight / this.cellDurationInMinutes;
  }

  protected getCompactLeftCoordinate(itemLeft, index) {
    const cellBorderSize = 1;
    const cellWidth = this.cellWidth || this.getAppointmentMinSize();

    return itemLeft + (cellBorderSize + cellWidth) * index;
  }

  protected getVerticalAppointmentGeometry(coordinates) {
    const config = this.calculateVerticalGeometryConfig(coordinates);

    return this.customizeVerticalCoordinates(coordinates, config.width, config.appointmentCountPerCell, config.offset);
  }

  protected customizeVerticalCoordinates(coordinates, width, appointmentCountPerCell, topOffset, isAllDay?) {
    const appointmentWidth = Math.max(width / appointmentCountPerCell, width / coordinates.count);
    const { height } = coordinates;
    const appointmentLeft = coordinates.left + (coordinates.index * appointmentWidth);
    const { top } = coordinates;

    if (coordinates.isCompact) {
      this.markAppointmentAsVirtual(coordinates, isAllDay);
    }

    return {
      height,
      width: appointmentWidth,
      top,
      left: appointmentLeft,
      empty: this.isAppointmentEmpty(height, width),
    };
  }

  protected calculateVerticalGeometryConfig(coordinates) {
    const overlappingMode = this.maxAppointmentsPerCell;
    const offsets = this.getOffsets();
    const appointmentDefaultOffset = this.getAppointmentDefaultOffset();

    let appointmentCountPerCell = this.getAppointmentCount(overlappingMode, coordinates);
    let ratio = this.getDefaultRatio(coordinates, appointmentCountPerCell);
    let maxWidth = this.getMaxWidth();

    if (!appointmentCountPerCell) {
      appointmentCountPerCell = coordinates.count;
      ratio = (maxWidth - offsets.unlimited) / maxWidth;
    }

    let topOffset = (1 - ratio) * maxWidth;
    if (overlappingMode === 'auto' || isNumeric(overlappingMode)) {
      ratio = 1;
      maxWidth -= appointmentDefaultOffset;
      topOffset = 0;
    }

    return {
      width: ratio * maxWidth,
      appointmentCountPerCell,
      offset: topOffset,
    };
  }

  protected getMaxWidth() {
    return this.cellWidth;
  }

  isAllDay(appointmentData) {
    return isAppointmentTakesAllDay(
      new AppointmentAdapter(appointmentData, this.dataAccessors),
      this.allDayPanelMode,
    );
  }

  protected getAppointmentMaxWidth() {
    return this.cellWidth - this.getAppointmentDefaultOffset();
  }

  calculateAppointmentWidth(appointment, position) {
    if (!this.isAllDay(appointment)) {
      return 0;
    }

    const {
      startDate: startDateWithTime,
      endDate,
      normalizedEndDate,
    } = position.info.appointment;
    const startDate = dateUtils.trimTime(startDateWithTime);

    const cellWidth = this.cellWidth || this.getAppointmentMinSize();
    const durationInHours = (normalizedEndDate.getTime() - startDate.getTime()) / toMs('hour');

    const skippedHours = getSkippedHoursInRange(
      startDate,
      endDate,
      appointment.allDay,
      this.viewDataProvider,
    );

    let width = Math.ceil((durationInHours - skippedHours) / 24) * cellWidth;

    width = this.cropAppointmentWidth(width, cellWidth);
    return width;
  }

  calculateAppointmentHeight(appointment, position) {
    if (this.isAllDay(appointment)) {
      return 0;
    }

    const {
      startDate,
      normalizedEndDate,
    } = position.info.appointment;
    const allDay = this.dataAccessors.get('allDay', appointment);
    const duration = this.getAppointmentDurationInMs(startDate, normalizedEndDate, allDay);
    const skippedMinutes = getSkippedHoursInRange(
      startDate,
      normalizedEndDate,
      appointment.allDay,
      this.viewDataProvider,
    ) * 60;

    const durationInMinutes = this.adjustDurationByDaylightDiff(duration, startDate, normalizedEndDate) / toMs('minute') - skippedMinutes;

    const height = durationInMinutes * this.getMinuteHeight();

    return height;
  }

  getDirection() {
    return 'vertical';
  }

  protected sortCondition(a, b) {
    if (Boolean(a.allDay) !== Boolean(b.allDay)) {
      return a.allDay ? 1 : -1;
    }

    const isAllDay = a.allDay && b.allDay;
    return this.groupOrientation === 'vertical' && isAllDay
      ? this.columnCondition(a, b)
      : this.rowCondition(a, b);
  }

  allDaySupported() {
    return true;
  }

  protected getAllDayAppointmentGeometry(coordinates) {
    const config = this.calculateGeometryConfig(coordinates);

    return this.customizeCoordinates(coordinates, config.height, config.appointmentCountPerCell, config.offset, true);
  }

  protected calculateGeometryConfig(coordinates) {
    if (!this.allowResizing || !this.allowAllDayResizing) {
      coordinates.skipResizing = true;
    }

    const config: any = super.calculateGeometryConfig(coordinates);
    const minAppointmentCountPerCell = Math.min(config.appointmentCountPerCell, this.getDynamicAppointmentCountPerCell().allDay);

    if (coordinates.allDay && coordinates.count <= minAppointmentCountPerCell) {
      config.offset = 0;
    }

    return config;
  }

  protected getAppointmentCount(overlappingMode, coordinates) {
    return overlappingMode !== 'auto' && (coordinates.count === 1 && !isNumeric(overlappingMode)) ? coordinates.count : this.getMaxAppointmentCountPerCellByType(coordinates.allDay);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected getDefaultRatio(coordinates, appointmentCountPerCell) {
    return coordinates.count > this.appointmentCountPerCell ? 0.65 : 1;
  }

  protected getOffsets() {
    return {
      unlimited: ALLDAY_APPOINTMENT_MIN_VERTICAL_OFFSET,
      auto: ALLDAY_APPOINTMENT_MAX_VERTICAL_OFFSET,
    };
  }

  protected getMaxHeight() {
    return this.allDayHeight || this.getAppointmentMinSize();
  }

  getPositionShift(timeShift, isAllDay) {
    if (!isAllDay && this.isAdaptive && this.getMaxAppointmentCountPerCellByType(isAllDay) === 0) {
      return {
        top: 0,
        left: 0,
        cellPosition: 0,
      };
    }

    return super.getPositionShift(timeShift, isAllDay);
  }
}

export default VerticalRenderingStrategy;
