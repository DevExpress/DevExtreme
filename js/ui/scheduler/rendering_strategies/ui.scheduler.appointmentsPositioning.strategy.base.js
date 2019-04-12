// import $ from "../../core/renderer";
// import fx from "../../animation/fx";
// import { Deferred, when } from "../../core/utils/deferred";
// import { camelize } from "../../core/utils/inflector";
import typeUtils from "../../../core/utils/type";

const DROP_DOWN_BUTTON_DEFAULT_WIDTH = 24;
const COMPACT_APPOINTMENT_DEFAULT_OFFSET = 3;
const COMPACT_THEME_APPOINTMENT_DEFAULT_OFFSET = 22;

class AppointmentPositioningStrategy {

    constructor(renderingStrategy) {
        this._renderingStrategy = renderingStrategy;
    }

    getRenderingStrategy() {
        return this._renderingStrategy;
    }

    getDropDownAppointmentWidth(intervalCount, isAllDay) {
        if(isAllDay || !typeUtils.isDefined(isAllDay)) {
            var widthInPercents = 75;
            return widthInPercents * this.getRenderingStrategy().getDefaultCellWidth() / 100;
        } else {
            return DROP_DOWN_BUTTON_DEFAULT_WIDTH;
        }
    }

    getCompactAppointmentTopOffset() {
        return COMPACT_APPOINTMENT_DEFAULT_OFFSET;
    }

    getCompactAppointmentLeftOffset() {
        return COMPACT_APPOINTMENT_DEFAULT_OFFSET;
    }

    getAppointmentDefaultOffset() {
        if(this.getRenderingStrategy()._isCompactTheme()) {
            return COMPACT_THEME_APPOINTMENT_DEFAULT_OFFSET;
        }

        return this.getRenderingStrategy().instance.option("_appointmentOffset");
    }
}

module.exports = AppointmentPositioningStrategy;
