
import BasePositioningStrategy from "./ui.scheduler.appointmentsPositioning.strategy.base";
// import $ from "../../core/renderer";

const DROP_DOWN_BUTTON_ADAPTIVE_SIZE = 28;

class AdaptivePositioningStrategy extends BasePositioningStrategy {
    getDropDownAppointmentWidth(intervalCount, isAllDay) {
        return this.getDropDownButtonAdaptiveSize();
    }

    getDropDownButtonAdaptiveSize() {
        return DROP_DOWN_BUTTON_ADAPTIVE_SIZE;
    }
}

module.exports = AdaptivePositioningStrategy;
