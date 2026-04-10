import { isDefined } from '@js/core/utils/type';

const COLLECTOR_DEFAULT_WIDTH = 24;
const COLLECTOR_DEFAULT_OFFSET = 3;

const COMPACT_THEME_APPOINTMENT_DEFAULT_OFFSET = 22;

const APPOINTMENT_MIN_COUNT = 1;
const APPOINTMENT_DEFAULT_WIDTH = 40;

const COLLECTOR_WIDTH_IN_PERCENTS = 75;
const APPOINTMENT_INCREASED_WIDTH = 50;

class AppointmentPositioningStrategy {
  protected renderingStrategy: any;

  constructor(renderingStrategy) {
    this.renderingStrategy = renderingStrategy;
  }

  getDropDownAppointmentWidth(intervalCount, isAllDay) {
    if (isAllDay || !isDefined(isAllDay)) {
      return COLLECTOR_WIDTH_IN_PERCENTS * this.renderingStrategy.cellWidth / 100;
    }
    return COLLECTOR_DEFAULT_WIDTH;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getCollectorTopOffset(allDay) {
    return COLLECTOR_DEFAULT_OFFSET;
  }

  getCollectorLeftOffset() {
    return COLLECTOR_DEFAULT_OFFSET;
  }

  getAppointmentDefaultOffset() {
    if (this.renderingStrategy.isCompactTheme()) {
      return COMPACT_THEME_APPOINTMENT_DEFAULT_OFFSET;
    }

    return this.renderingStrategy.appointmentOffset;
  }

  getDynamicAppointmentCountPerCell() {
    const { renderingStrategy } = this;

    const { cellHeight } = renderingStrategy;
    const allDayCount = Math.floor((cellHeight - renderingStrategy.getAppointmentDefaultOffset()) / renderingStrategy.getAppointmentDefaultHeight()) || this.getAppointmentMinCount();

    // NOTE: Simplify using only object
    if (renderingStrategy.allDaySupported()) {
      return {
        allDay: renderingStrategy.groupOrientation === 'vertical' ? allDayCount : this.renderingStrategy.appointmentCountPerCell,
        simple: this.calculateDynamicAppointmentCountPerCell() || this.getAppointmentMinCount(),
      };
    }
    return allDayCount;
  }

  getDropDownAppointmentHeight(): undefined | number {
    return undefined;
  }

  protected getAppointmentMinCount() {
    return APPOINTMENT_MIN_COUNT;
  }

  protected calculateDynamicAppointmentCountPerCell() {
    return Math.floor(this.renderingStrategy.getAppointmentMaxWidth() / APPOINTMENT_INCREASED_WIDTH);
  }

  protected getAppointmentDefaultWidth() {
    return APPOINTMENT_DEFAULT_WIDTH;
  }
}

export default AppointmentPositioningStrategy;
