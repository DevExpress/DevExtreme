// import $ from "../../core/renderer";
// import fx from "../../animation/fx";
// import { Deferred, when } from "../../core/utils/deferred";
// import { camelize } from "../../core/utils/inflector";
import typeUtils from "../../../core/utils/type";

const DROP_DOWN_BUTTON_DEFAULT_WIDTH = 24;

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
            return widthInPercents * this.getDefaultCellWidth() / 100;
        } else {
            return DROP_DOWN_BUTTON_DEFAULT_WIDTH;
        }
    }
}

module.exports = AppointmentPositioningStrategy;
