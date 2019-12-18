
import BasePositioningStrategy from './ui.scheduler.appointmentsPositioning.strategy.base';

const COLLECTOR_ADAPTIVE_SIZE = 28;
const COLLECTOR_ADAPTIVE_BOTTOM_OFFSET = 40;

const ADAPTIVE_APPOINTMENT_DEFAULT_OFFSET = 35;
const ADAPTIVE_APPOINTMENT_DEFAULT_WIDTH = 30;

class AdaptivePositioningStrategy extends BasePositioningStrategy {
    getDropDownAppointmentWidth(intervalCount, isAllDay) {
        return this.getDropDownButtonAdaptiveSize();
    }

    getDropDownButtonAdaptiveSize() {
        return COLLECTOR_ADAPTIVE_SIZE;
    }

    getCompactAppointmentTopOffset(allDay) {
        let renderingStrategy = this.getRenderingStrategy();

        if(renderingStrategy.hasAllDayAppointments() && allDay) {
            return (renderingStrategy.getDefaultAllDayCellHeight() - renderingStrategy.getDropDownButtonAdaptiveSize()) / 2;
        } else {
            return this.getRenderingStrategy().getDefaultCellHeight() - COLLECTOR_ADAPTIVE_BOTTOM_OFFSET;
        }
    }

    getCompactAppointmentLeftOffset() {
        return (this.getRenderingStrategy().getDefaultCellWidth() - COLLECTOR_ADAPTIVE_SIZE) / 2;
    }

    getAppointmentDefaultOffset() {
        return ADAPTIVE_APPOINTMENT_DEFAULT_OFFSET;
    }

    getDynamicAppointmentCountPerCell() {
        let renderingStrategy = this.getRenderingStrategy();

        if(renderingStrategy.hasAllDayAppointments()) {
            return {
                allDay: 0,
                simple: this._calculateDynamicAppointmentCountPerCell() || this._getAppointmentMinCount()
            };
        } else {
            return 0;
        }
    }

    getDropDownAppointmentHeight() {
        return COLLECTOR_ADAPTIVE_SIZE;
    }

    _getAppointmentMinCount() {
        return 0;
    }

    _getAppointmentDefaultWidth() {
        let renderingStrategy = this.getRenderingStrategy();

        if(renderingStrategy.hasAllDayAppointments()) {
            return ADAPTIVE_APPOINTMENT_DEFAULT_WIDTH;
        }

        return super._getAppointmentDefaultWidth();
    }

    _calculateDynamicAppointmentCountPerCell() {
        return Math.floor(this.getRenderingStrategy()._getAppointmentMaxWidth() / this.getRenderingStrategy()._getAppointmentDefaultWidth());
    }

}

module.exports = AdaptivePositioningStrategy;
