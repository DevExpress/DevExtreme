import AppointmentPositioningStrategy from './m_appointments_positioning_strategy_base';

const COLLECTOR_ADAPTIVE_SIZE = 28;
const COLLECTOR_ADAPTIVE_BOTTOM_OFFSET = 40;

const ADAPTIVE_APPOINTMENT_DEFAULT_OFFSET = 35;
const ADAPTIVE_APPOINTMENT_DEFAULT_WIDTH = 30;

class AdaptivePositioningStrategy extends AppointmentPositioningStrategy {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getDropDownAppointmentWidth(intervalCount, isAllDay) {
    return this.getDropDownButtonAdaptiveSize();
  }

  getDropDownButtonAdaptiveSize() {
    return COLLECTOR_ADAPTIVE_SIZE;
  }

  getCollectorTopOffset(allDay) {
    const { renderingStrategy } = this;

    if (renderingStrategy.allDaySupported() && allDay) {
      return (renderingStrategy.allDayHeight - renderingStrategy.getDropDownButtonAdaptiveSize()) / 2;
    }
    return this.renderingStrategy.cellHeight - COLLECTOR_ADAPTIVE_BOTTOM_OFFSET;
  }

  getCollectorLeftOffset() {
    const collectorWidth = this.renderingStrategy.getDropDownAppointmentWidth();

    return (this.renderingStrategy.cellWidth - collectorWidth) / 2;
  }

  getAppointmentDefaultOffset() {
    return ADAPTIVE_APPOINTMENT_DEFAULT_OFFSET;
  }

  getDynamicAppointmentCountPerCell() {
    const { renderingStrategy } = this;

    if (renderingStrategy.allDaySupported()) {
      return {
        allDay: 0,
        simple: this.calculateDynamicAppointmentCountPerCell() || this.getAppointmentMinCount(),
      };
    }
    return 0;
  }

  getDropDownAppointmentHeight() {
    return COLLECTOR_ADAPTIVE_SIZE;
  }

  protected getAppointmentMinCount() {
    return 0;
  }

  protected getAppointmentDefaultWidth() {
    const { renderingStrategy } = this;

    if (renderingStrategy.allDaySupported()) {
      return ADAPTIVE_APPOINTMENT_DEFAULT_WIDTH;
    }

    return super.getAppointmentDefaultWidth();
  }

  protected calculateDynamicAppointmentCountPerCell() {
    return Math.floor(this.renderingStrategy._getAppointmentMaxWidth() / this.renderingStrategy._getAppointmentDefaultWidth());
  }
}

export default AdaptivePositioningStrategy;
