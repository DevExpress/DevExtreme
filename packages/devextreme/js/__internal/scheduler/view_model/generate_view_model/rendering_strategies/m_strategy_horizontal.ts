import dateUtils from '@js/core/utils/date';
import { getSkippedHoursInRange } from '@ts/scheduler/r1/utils/index';

import BaseAppointmentsStrategy from './m_strategy_base';

const DEFAULT_APPOINTMENT_HEIGHT = 60;
const MIN_APPOINTMENT_HEIGHT = 35;
const DROP_DOWN_BUTTON_OFFSET = 2;

const toMs = dateUtils.dateToMilliseconds;

class HorizontalRenderingStrategy extends BaseAppointmentsStrategy {
  protected needVerifyItemSize() {
    return true;
  }

  calculateAppointmentWidth(appointment, position) {
    const cellWidth = this.cellWidth || this.getAppointmentMinSize();
    const allDay = this.dataAccessors.get('allDay', appointment);
    const {
      startDate,
      endDate,
      normalizedEndDate,
    } = position.info.appointment;

    let duration = this.getAppointmentDurationInMs(startDate, normalizedEndDate, allDay);

    duration = this.adjustDurationByDaylightDiff(duration, startDate, normalizedEndDate);

    const cellDuration = this.cellDurationInMinutes * toMs('minute');
    const skippedHours = getSkippedHoursInRange(
      startDate,
      endDate,
      appointment.allDay,
      this.viewDataProvider,
    );
    const durationInCells = (duration - skippedHours * toMs('hour')) / cellDuration;
    const width = this.cropAppointmentWidth(durationInCells * cellWidth, cellWidth);

    return width;
  }

  protected needAdjustDuration(diff) {
    return diff < 0;
  }

  getAppointmentGeometry(coordinates) {
    const result = this.customizeAppointmentGeometry(coordinates);

    return super.getAppointmentGeometry(result);
  }

  protected customizeAppointmentGeometry(coordinates) {
    const config = this.calculateGeometryConfig(coordinates);

    return this.customizeCoordinates(coordinates, config.height, config.appointmentCountPerCell, config.offset);
  }

  protected getOffsets() {
    return {
      unlimited: 0,
      auto: 0,
    };
  }

  protected getCompactLeftCoordinate(itemLeft, index) {
    const cellWidth = this.cellWidth || this.getAppointmentMinSize();

    return itemLeft + cellWidth * index;
  }

  protected getMaxHeight() {
    return this.cellHeight || this.getAppointmentMinSize();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected getAppointmentCount(overlappingMode, coordinates) {
    return this.getMaxAppointmentCountPerCellByType(false);
  }

  protected getAppointmentDefaultHeight() {
    return DEFAULT_APPOINTMENT_HEIGHT;
  }

  protected getAppointmentMinHeight() {
    return MIN_APPOINTMENT_HEIGHT;
  }

  protected sortCondition(a, b) {
    return this.columnCondition(a, b);
  }

  protected getOrientation() {
    return ['left', 'right', 'top'];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getDropDownAppointmentWidth(intervalCount, isAllDay) {
    return this.cellWidth - DROP_DOWN_BUTTON_OFFSET * 2;
  }

  isAllDay(appointmentData) {
    return this.dataAccessors.get('allDay', appointmentData);
  }

  protected isItemsCross(firstItem, secondItem) {
    const orientation = this.getOrientation();

    return this.checkItemsCrossing(firstItem, secondItem, orientation);
  }

  getPositionShift(timeShift) {
    const positionShift = super.getPositionShift(timeShift);
    let left = this.cellWidth * timeShift;

    if (this.rtlEnabled) {
      left *= -1;
    }

    left += positionShift.left;

    return {
      top: 0,
      left,
      cellPosition: left,
    };
  }

  supportCompactDropDownAppointments() {
    return false;
  }
}

export default HorizontalRenderingStrategy;
