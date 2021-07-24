import { equalByValue } from '../../core/utils/common';
import VerticalAppointmentsStrategy from './appointments/rendering_strategies/strategy_vertical';
import HorizontalAppointmentsStrategy from './appointments/rendering_strategies/strategy_horizontal';
import HorizontalMonthLineAppointmentsStrategy from './appointments/rendering_strategies/strategy_horizontal_month_line';
import HorizontalMonthAppointmentsStrategy from './appointments/rendering_strategies/strategy_horizontal_month';
import AgendaAppointmentsStrategy from './appointments/rendering_strategies/strategy_agenda';
import { getModelProvider } from './instanceFactory';

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
        const modelProvider = getModelProvider(this.instance.key);
        this._renderingStrategyInstance = new Strategy({
            instance: this.instance,
            adaptivityEnabled: () => modelProvider.adaptivityEnabled,
            rtlEnabled: () => modelProvider.rtlEnabled,
            startDayHour: () => modelProvider.startDayHour,
            endDayHour: () => modelProvider.endDayHour,
            isVirtualScrolling: () => this.instance.isVirtualScrolling,
            getIsGroupedByDate: () => this.instance._workSpace ? this.instance._workSpace.isGroupedByDate() : false,
            getCellWidth: () => this.instance._workSpace ? this.instance._workSpace.getCellWidth() : 0,
            getCellHeight: () => this.instance._workSpace ? this.instance._workSpace.getCellHeight() : 0,
            getAllDayHeight: () => this.instance._workSpace ? this.instance._workSpace.getAllDayHeight() : 0,
            getResizableStep: () => this.instance._workSpace ? this.instance._workSpace.positionHelper.getResizableStep() : 0,
            getVisibleDayDuration: () => this.instance._workSpace ? this.instance._workSpace.getVisibleDayDuration() : 0,
        });
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
        const { virtualScrollingDispatcher } = this.instance.getWorkSpace();
        const {
            cellCountInsideLeftVirtualCell,
            cellCountInsideTopVirtualRow
        } = virtualScrollingDispatcher;

        return list.map((data, index) => {
            if(!this._renderingStrategyInstance.keepAppointmentSettings()) {
                delete data.settings;
            }

            const appointmentSettings = positionMap[index];
            appointmentSettings.forEach(settings => {
                settings.direction = this.renderingStrategy === 'vertical' && !settings.allDay ? 'vertical' : 'horizontal';
                settings.topVirtualCellCount = cellCountInsideTopVirtualRow;
                settings.leftVirtualCellCount = cellCountInsideLeftVirtualCell;
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
        const appointmentDataProvider = this.instance.fire('getAppointmentDataProvider');

        const updatedData = appointmentDataProvider.getUpdatedAppointment();
        return updatedData === data || appointmentDataProvider.getUpdatedAppointmentKeys().some(item => data[item.key] === item.value);
    }

    _isAppointmentShouldAppear(currentAppointment, sourceAppointment) {
        return currentAppointment.needRepaint && sourceAppointment.needRemove;
    }

    _isSettingChanged(settings, sourceSetting) {
        if(settings.length !== sourceSetting.length) {
            return true;
        }

        const createSettingsToCompare = (settings, index) => {
            const currentSetting = settings[index];
            const leftVirtualCellCount = currentSetting.leftVirtualCellCount || 0;
            const topVirtualCellCount = currentSetting.topVirtualCellCount || 0;
            const columnIndex = currentSetting.columnIndex + leftVirtualCellCount;
            const rowIndex = currentSetting.rowIndex + topVirtualCellCount;
            const hMax = currentSetting.reduced ? currentSetting.hMax : undefined;
            const vMax = currentSetting.reduced ? currentSetting.vMax : undefined;

            return {
                ...currentSetting,
                columnIndex,
                rowIndex,
                topVirtualCellCount: undefined,
                leftVirtualCellCount: undefined,
                hMax,
                vMax,
                info: {},
            };
        };

        for(let i = 0; i < settings.length; i++) {
            const newSettings = createSettingsToCompare(settings, i);
            const oldSettings = createSettingsToCompare(sourceSetting, i);

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
