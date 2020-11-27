import { equalByValue } from '../../core/utils/common';
import VerticalAppointmentsStrategy from './rendering_strategies/ui.scheduler.appointments.strategy.vertical';
import HorizontalAppointmentsStrategy from './rendering_strategies/ui.scheduler.appointments.strategy.horizontal';
import HorizontalMonthLineAppointmentsStrategy from './rendering_strategies/ui.scheduler.appointments.strategy.horizontal_month_line';
import HorizontalMonthAppointmentsStrategy from './rendering_strategies/ui.scheduler.appointments.strategy.horizontal_month';
import AgendaAppointmentsStrategy from './rendering_strategies/ui.scheduler.appointments.strategy.agenda';

const RENDERING_STRATEGIES = {
    'horizontal': HorizontalAppointmentsStrategy,
    'horizontalMonth': HorizontalMonthAppointmentsStrategy,
    'horizontalMonthLine': HorizontalMonthLineAppointmentsStrategy,
    'vertical': VerticalAppointmentsStrategy,
    'agenda': AgendaAppointmentsStrategy
};

class AppointmentLayoutManager {
    constructor(instance, renderingStrategy) {
        this.instance = instance;
        renderingStrategy && this.initRenderingStrategy(renderingStrategy);
    }

    getCellDimensions(options) {
        if(this.instance._workSpace) {
            return {
                width: this.instance._workSpace.getCellWidth(),
                height: this.instance._workSpace.getCellHeight(),
                allDayHeight: this.instance._workSpace.getAllDayHeight()
            };
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
        const { allDayHeight } = this.getCellDimensions();
        this.instance._allDayCellHeight = allDayHeight;
        this.getGroupOrientation({
            callback: groupOrientation => this.instance._groupOrientation = groupOrientation
        });

        const appointments = items
            ? items.slice()
            : [];

        this._positionMap = this._renderingStrategyInstance.createTaskPositionMap(appointments);

        return this._createAppointmentsMapCore(appointments, this._positionMap);
    }

    _createAppointmentsMapCore(list, positionMap) {
        return list.map((data, index) => {
            if(!this._renderingStrategyInstance.keepAppointmentSettings()) {
                delete data.settings;
            }

            const appointmentSettings = positionMap[index];
            appointmentSettings.forEach(settings => {
                settings.direction = this.renderingStrategy === 'vertical' && !settings.allDay ? 'vertical' : 'horizontal';
            });

            return {
                itemData: data,
                settings: appointmentSettings,
                needRepaint: true,
                needRemove: false
            };
        });
    }

    _isDataChanged(data) {
        const updatedData = this.instance.getUpdatedAppointment();
        return updatedData === data || this.instance.getUpdatedAppointmentKeys().some(item => data[item.key] === item.value);
    }

    _isAppointmentShouldAppear(currentAppointment, sourceAppointment) {
        return currentAppointment.needRepaint && sourceAppointment.needRemove;
    }

    _isSettingChanged(settings, sourceSetting) {
        if(settings.length !== sourceSetting.length) {
            return true;
        }

        for(let i = 0; i < settings.length; i++) {
            const newSettings = settings[i];
            const oldSettings = sourceSetting[i];

            if(oldSettings) { // exclude sortedIndex property for comparison in commonUtils.equalByValue
                oldSettings.sortedIndex = newSettings.sortedIndex;
            }

            if(!equalByValue(newSettings, oldSettings)) {
                return true;
            }
        }

        return false;
    }

    _getAssociatedSourceAppointment(currentAppointment, sourceAppointments) {
        for(let i = 0; i < sourceAppointments.length; i++) {
            const item = sourceAppointments[i];
            if(item.itemData === currentAppointment.itemData) {
                return item;
            }
        }
        return null;
    }

    _getDeletedAppointments(currentAppointments, sourceAppointments) {
        const result = [];

        for(let i = 0; i < sourceAppointments.length; i++) {
            const sourceAppointment = sourceAppointments[i];
            const currentAppointment = this._getAssociatedSourceAppointment(sourceAppointment, currentAppointments);
            if(!currentAppointment) {
                sourceAppointment.needRemove = true;
                result.push(sourceAppointment);
            }
        }

        return result;
    }

    getRepaintedAppointments(currentAppointments, sourceAppointments) {
        if(sourceAppointments.length === 0 || this.renderingStrategy === 'agenda') {
            return currentAppointments;
        }

        currentAppointments.forEach(appointment => {
            const sourceAppointment = this._getAssociatedSourceAppointment(appointment, sourceAppointments);
            if(sourceAppointment) {
                appointment.needRepaint = this._isDataChanged(appointment.itemData) ||
                    this._isSettingChanged(appointment.settings, sourceAppointment.settings) ||
                    this._isAppointmentShouldAppear(appointment, sourceAppointment);
            }
        });

        return currentAppointments.concat(this._getDeletedAppointments(currentAppointments, sourceAppointments));
    }

    getRenderingStrategyInstance() {
        return this._renderingStrategyInstance;
    }
}

export default AppointmentLayoutManager;
