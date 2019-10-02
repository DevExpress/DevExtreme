import { equalByComplexValue } from "../../core/utils/data";
import VerticalAppointmentsStrategy from "./rendering_strategies/ui.scheduler.appointments.strategy.vertical";
import HorizontalAppointmentsStrategy from "./rendering_strategies/ui.scheduler.appointments.strategy.horizontal";
import HorizontalMonthLineAppointmentsStrategy from "./rendering_strategies/ui.scheduler.appointments.strategy.horizontal_month_line";
import HorizontalMonthAppointmentsStrategy from "./rendering_strategies/ui.scheduler.appointments.strategy.horizontal_month";
import AgendaAppointmentsStrategy from "./rendering_strategies/ui.scheduler.appointments.strategy.agenda";

const RENDERING_STRATEGIES = {
    "horizontal": HorizontalAppointmentsStrategy,
    "horizontalMonth": HorizontalMonthAppointmentsStrategy,
    "horizontalMonthLine": HorizontalMonthLineAppointmentsStrategy,
    "vertical": VerticalAppointmentsStrategy,
    "agenda": AgendaAppointmentsStrategy
};

class AppointmentLayoutManager {
    constructor(instance, renderingStrategy) {
        this.instance = instance;
        renderingStrategy && this.initRenderingStrategy(renderingStrategy);
    }

    getCellDimensions(options) {
        if(this.instance._workSpace) {
            options.callback(this.instance._workSpace.getCellWidth(), this.instance._workSpace.getCellHeight(), this.instance._workSpace.getAllDayHeight());
        }
    }

    getGroupOrientation(options) {
        if(this.instance._workSpace) {
            options.callback(this.instance._workSpace._getRealGroupOrientation());
        }
    }

    initRenderingStrategy(renderingStrategy) {
        const Strategy = RENDERING_STRATEGIES[renderingStrategy];
        this._renderingStrategyInstance = new Strategy(this.instance);
        this.renderingStrategy = renderingStrategy;
    }

    createAppointmentsMap(items) {
        this.getCellDimensions({
            callback: (width, height, allDayHeight) => {
                this.instance._cellWidth = width;
                this.instance._cellHeight = height;
                this.instance._allDayCellHeight = allDayHeight;
            }
        });
        this.getGroupOrientation({
            callback: groupOrientation => this.instance._groupOrientation = groupOrientation
        });

        this._positionMap = this._renderingStrategyInstance.createTaskPositionMap(items);

        return this._createAppointmentsMapCore(items || [], this._positionMap);
    }

    _createAppointmentsMapCore(list, positionMap) {
        return list.map((data, index) => {
            if(!this._renderingStrategyInstance.keepAppointmentSettings()) {
                delete data.settings;
            }

            const appointmentSettings = positionMap[index];
            appointmentSettings.forEach(settings => {
                settings.direction = this.renderingStrategy === "vertical" && !settings.allDay ? "vertical" : "horizontal";
            });

            return {
                itemData: data,
                settings: appointmentSettings,
                needRepaint: true,
                needRemove: false
            };
        });
    }

    _hasChangesInData(data) {
        const updatedData = this.instance.getUpdatedAppointment();
        return updatedData === data || this.instance.getUpdatedAppointmentKeys().some(item => data[item.key] === item.value);
    }

    _hasChangesInSettings(settingList, oldSettingList) {
        if(settingList.length !== oldSettingList.length) {
            return true;
        }

        for(let i = 0; i < settingList.length; i++) {
            const newSettings = settingList[i],
                oldSettings = oldSettingList[i];

            if(oldSettings) { // exclude sortedIndex property for comparison in commonUtils.equalByValue
                oldSettings.sortedIndex = newSettings.sortedIndex;
            }

            if(!equalByComplexValue(newSettings, oldSettings)) {
                return true;
            }
        }

        return false;
    }

    _getEqualAppointmentFromList(appointment, list) {
        for(let i = 0; i < list.length; i++) {
            const item = list[i];
            if(item.itemData === appointment.itemData) {
                return item;
            }
        }
        return null;
    }

    _getDeletedAppointments(appointmentList, oldAppointmentList) {
        const result = [];

        for(let i = 0; i < oldAppointmentList.length; i++) {
            const oldAppointment = oldAppointmentList[i];
            const appointment = this._getEqualAppointmentFromList(oldAppointment, appointmentList);
            if(!appointment) {
                oldAppointment.needRemove = true;
                result.push(oldAppointment);
            }
        }

        return result;
    }

    getRepaintedAppointments(appointmentList, oldAppointmentList) {
        if(oldAppointmentList.length === 0 || this.renderingStrategy === "agenda") {
            return appointmentList;
        }

        for(let i = 0; i < appointmentList.length; i++) {
            const appointment = appointmentList[i];
            const oldAppointment = this._getEqualAppointmentFromList(appointment, oldAppointmentList);
            if(oldAppointment) {
                appointment.needRepaint = this._hasChangesInData(appointment.itemData) || this._hasChangesInSettings(appointment.settings, oldAppointment.settings);
            }
        }
        return appointmentList.concat(this._getDeletedAppointments(appointmentList, oldAppointmentList));
    }

    getRenderingStrategyInstance() {
        return this._renderingStrategyInstance;
    }
}

module.exports = AppointmentLayoutManager;
