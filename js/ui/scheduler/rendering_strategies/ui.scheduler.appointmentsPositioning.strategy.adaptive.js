
import BasePositioningStrategy from "./ui.scheduler.appointmentsPositioning.strategy.base";
// import $ from "../../core/renderer";

const DROP_DOWN_BUTTON_ADAPTIVE_SIZE = 28;
const DROP_DOWN_BUTTON_ADAPTIVE_BOTTOM_OFFSET = 40;

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
}

module.exports = AdaptivePositioningStrategy;
