// import $ from "../../core/renderer";
// import fx from "../../animation/fx";
// import { Deferred, when } from "../../core/utils/deferred";
// import { camelize } from "../../core/utils/inflector";
import typeUtils from "../../../core/utils/type";

const DROP_DOWN_BUTTON_DEFAULT_WIDTH = 24;
const COMPACT_APPOINTMENT_DEFAULT_OFFSET = 3;
const COMPACT_THEME_APPOINTMENT_DEFAULT_OFFSET = 22;
const APPOINTMENT_MIN_COUNT = 1;

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

    getDynamicAppointmentCountPerCell() {
        let renderingStrategy = this.getRenderingStrategy();

        let cellHeight = renderingStrategy.instance.fire("getCellHeight");
        let allDayCount = Math.floor((cellHeight - renderingStrategy._getAppointmentDefaultOffset()) / renderingStrategy._getAppointmentDefaultHeight()) || renderingStrategy._getAppointmentMinCount();

        if(renderingStrategy.hasAllDayAppointments()) {
            return {
                allDay: renderingStrategy.instance._groupOrientation === "vertical" ? allDayCount : renderingStrategy.instance.option("_appointmentCountPerCell"),
                simple: renderingStrategy._calculateDynamicAppointmentCountPerCell() || renderingStrategy._getAppointmentMinCount()
            };
        } else {
            return allDayCount;
        }
    }

    // NOTE: implement this
    _getAppointmentMinCount() {
        return APPOINTMENT_MIN_COUNT;
    }
}

module.exports = AppointmentPositioningStrategy;
