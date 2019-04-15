// import $ from "../../core/renderer";
// import fx from "../../animation/fx";
// import { Deferred, when } from "../../core/utils/deferred";
// import { camelize } from "../../core/utils/inflector";
import typeUtils from "../../../core/utils/type";

const COLLECTOR_DEFAULT_WIDTH = 24;

const COMPACT_APPOINTMENT_DEFAULT_OFFSET = 3;
const COMPACT_THEME_APPOINTMENT_DEFAULT_OFFSET = 22;

const APPOINTMENT_MIN_COUNT = 1;
const APPOINTMENT_DEFAULT_WIDTH = 40;

const COLLECTOR_WIDTH_IN_PERCENTS = 75;

class AppointmentPositioningStrategy {

    constructor(renderingStrategy) {
        this._renderingStrategy = renderingStrategy;
    }

    getRenderingStrategy() {
        return this._renderingStrategy;
    }

    getDropDownAppointmentWidth(intervalCount, isAllDay) {
        if(isAllDay || !typeUtils.isDefined(isAllDay)) {
            return COLLECTOR_WIDTH_IN_PERCENTS * this.getRenderingStrategy().getDefaultCellWidth() / 100;
        } else {
            return COLLECTOR_DEFAULT_WIDTH;
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
        let allDayCount = Math.floor((cellHeight - renderingStrategy._getAppointmentDefaultOffset()) / renderingStrategy._getAppointmentDefaultHeight()) || this._getAppointmentMinCount();

        if(renderingStrategy.hasAllDayAppointments()) {
            return {
                allDay: renderingStrategy.instance._groupOrientation === "vertical" ? allDayCount : renderingStrategy.instance.option("_appointmentCountPerCell"),
                simple: this._calculateDynamicAppointmentCountPerCell() || this._getAppointmentMinCount()
            };
        } else {
            return allDayCount;
        }
    }

    _getAppointmentMinCount() {
        return APPOINTMENT_MIN_COUNT;
    }

    _calculateDynamicAppointmentCountPerCell() {
        return Math.floor(this.getRenderingStrategy()._getAppointmentMaxWidth() / this.getRenderingStrategy()._getAppointmentDefaultWidth());
    }

    // base
    _getAppointmentDefaultWidth() {
        return APPOINTMENT_DEFAULT_WIDTH;
    }
}

module.exports = AppointmentPositioningStrategy;
