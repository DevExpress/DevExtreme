
import BasePositioningStrategy from "./ui.scheduler.appointmentsPositioning.strategy.base";
// import $ from "../../core/renderer";

const DROP_DOWN_BUTTON_ADAPTIVE_SIZE = 28;
const DROP_DOWN_BUTTON_ADAPTIVE_BOTTOM_OFFSET = 40;
const ADAPTIVE_APPOINTMENT_DEFAULT_OFFSET = 35;
const ADAPTIVE_APPOINTMENT_DEFAULT_WIDTH = 30;

class AdaptivePositioningStrategy extends BasePositioningStrategy {
    getDropDownAppointmentWidth(intervalCount, isAllDay) {
        return this.getDropDownButtonAdaptiveSize();
    }

    getDropDownButtonAdaptiveSize() {
        return DROP_DOWN_BUTTON_ADAPTIVE_SIZE;
    }

    getCompactAppointmentTopOffset() {
        return this.getRenderingStrategy().getDefaultCellHeight() - DROP_DOWN_BUTTON_ADAPTIVE_BOTTOM_OFFSET;
    }

    getCompactAppointmentLeftOffset() {
        return (this.getRenderingStrategy().getDefaultCellWidth() - DROP_DOWN_BUTTON_ADAPTIVE_SIZE) / 2;
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
}

module.exports = AdaptivePositioningStrategy;
