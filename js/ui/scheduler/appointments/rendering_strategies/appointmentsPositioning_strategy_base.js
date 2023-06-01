import { isDefined } from '../../../../core/utils/type';

const COLLECTOR_DEFAULT_WIDTH = 24;
const COLLECTOR_DEFAULT_OFFSET = 3;

const COMPACT_THEME_APPOINTMENT_DEFAULT_OFFSET = 22;

const APPOINTMENT_MIN_COUNT = 1;
const APPOINTMENT_DEFAULT_WIDTH = 40;

const COLLECTOR_WIDTH_IN_PERCENTS = 75;
const APPOINTMENT_INCREASED_WIDTH = 50;

class AppointmentPositioningStrategy {

    constructor(renderingStrategy) {
        this._renderingStrategy = renderingStrategy;
    }

    getDropDownAppointmentWidth(intervalCount, isAllDay) {
        if(isAllDay || !isDefined(isAllDay)) {
            return COLLECTOR_WIDTH_IN_PERCENTS * this._renderingStrategy.cellWidth / 100;
        } else {
            return COLLECTOR_DEFAULT_WIDTH;
        }
    }

    getCollectorTopOffset() {
        return COLLECTOR_DEFAULT_OFFSET;
    }

    getCollectorLeftOffset() {
        return COLLECTOR_DEFAULT_OFFSET;
    }

    getAppointmentDefaultOffset() {
        if(this._renderingStrategy._isCompactTheme()) {
            return COMPACT_THEME_APPOINTMENT_DEFAULT_OFFSET;
        }

        return this._renderingStrategy.appointmentOffset;
    }

    getDynamicAppointmentCountPerCell() {
        const renderingStrategy = this._renderingStrategy;

        const cellHeight = renderingStrategy.cellHeight;
        const allDayCount = Math.floor((cellHeight - renderingStrategy._getAppointmentDefaultOffset()) / renderingStrategy._getAppointmentDefaultHeight()) || this._getAppointmentMinCount();

        // NOTE: Simplify using only object
        if(renderingStrategy.allDaySupported()) {
            return {
                allDay: renderingStrategy.groupOrientation === 'vertical' ? allDayCount : this._renderingStrategy.appointmentCountPerCell,
                simple: this._calculateDynamicAppointmentCountPerCell() || this._getAppointmentMinCount()
            };
        } else {
            return allDayCount;
        }
    }

    getDropDownAppointmentHeight() {
        return undefined;
    }

    _getAppointmentMinCount() {
        return APPOINTMENT_MIN_COUNT;
    }

    _calculateDynamicAppointmentCountPerCell() {
        return Math.floor(this._renderingStrategy._getAppointmentMaxWidth() / APPOINTMENT_INCREASED_WIDTH);
    }

    _getAppointmentDefaultWidth() {
        return APPOINTMENT_DEFAULT_WIDTH;
    }
}

export default AppointmentPositioningStrategy;
