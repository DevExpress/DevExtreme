import { equalByValue } from '../../core/utils/common';
import {
    getModelProvider,
    getTimeZoneCalculator,
    getResourceManager,
    getAppointmentDataProvider
} from './instanceFactory';
import { AppointmentViewModel } from './appointments/viewModelGenerator';

class AppointmentLayoutManager {
    constructor(instance) {
        this.instance = instance;
        this.appointmentViewModel = new AppointmentViewModel();
    }

    get modelProvider() { return getModelProvider(this.instance.key); }
    get viewRenderingStrategyName() { return this.modelProvider.getViewRenderingStrategyName(); }

    getCellDimensions(options) {
        if(this.instance._workSpace) {
            return {
                width: this.instance._workSpace.getCellWidth(),
                height: this.instance._workSpace.getCellHeight(),
                allDayHeight: this.instance._workSpace.getAllDayHeight()
            };
        }
    }

    _getRenderingStrategyOptions() {
        const workspace = this.instance.getWorkSpace();
        const key = this.instance.key;
        const { virtualScrollingDispatcher } = this.instance.getWorkSpace();
        const {
            cellCountInsideLeftVirtualCell,
            cellCountInsideTopVirtualRow
        } = virtualScrollingDispatcher;

        return {
            instance: this.instance,
            key,
            isRenovatedAppointments: this.modelProvider.isRenovatedAppointments,
            viewRenderingStrategyName: this.viewRenderingStrategyName,
            adaptivityEnabled: this.modelProvider.adaptivityEnabled,
            rtlEnabled: this.modelProvider.rtlEnabled,
            startDayHour: this.modelProvider.startDayHour,
            endDayHour: this.modelProvider.endDayHour,
            maxAppointmentsPerCell: this.modelProvider.maxAppointmentsPerCell,
            agendaDuration: workspace.option('agendaDuration'),
            currentDate: this.modelProvider.currentDate,
            isVirtualScrolling: this.instance.isVirtualScrolling(),
            leftVirtualCellCount: cellCountInsideLeftVirtualCell,
            topVirtualCellCount: cellCountInsideTopVirtualRow,
            modelGroups: this.modelProvider.getCurrentViewOption('groups'),
            dateTableOffset: this.instance.getWorkSpaceDateTableOffset(),
            startViewDate: workspace.getStartViewDate(),
            groupOrientation: workspace._getRealGroupOrientation(),
            getIsGroupedByDate: () => workspace.isGroupedByDate(),
            getCellWidth: () => workspace.getCellWidth(),
            getCellHeight: () => workspace.getCellHeight(),
            getAllDayHeight: () => workspace.getAllDayHeight(),
            getResizableStep: () => workspace.positionHelper.getResizableStep(),
            getVisibleDayDuration: () => workspace.getVisibleDayDuration(),
            // appointment settings
            timeZoneCalculator: getTimeZoneCalculator(key),
            resourceManager: getResourceManager(key),
            appointmentDataProvider: getAppointmentDataProvider(key),
            timeZone: this.modelProvider.timeZone,
            firstDayOfWeek: this.instance.getFirstDayOfWeek(),
            viewStartDayHour: this.modelProvider.getCurrentViewOption('startDayHour'),
            viewEndDayHour: this.modelProvider.getCurrentViewOption('endDayHour'),
            viewType: workspace.type,
            endViewDate: workspace.getEndViewDate(),
            positionHelper: workspace.positionHelper,
            isGroupedByDate: workspace.isGroupedByDate(),
            cellDuration: workspace.getCellDuration(),
            viewDataProvider: workspace.viewDataProvider,
            supportAllDayRow: workspace.supportAllDayRow(),
            dateRange: workspace.getDateRange(),
            intervalDuration: workspace.getIntervalDuration(),
            isVerticalOrientation: workspace.isVerticalOrientation(),
            allDayIntervalDuration: workspace.getIntervalDuration(true),
            isSkippedDataCallback: workspace._isSkippedData.bind(workspace),
            getPositionShiftCallback: workspace.getPositionShift.bind(workspace),
            getGroupWidthCallback: workspace.getGroupWidth.bind(workspace),
            DOMMetaData: workspace.getDOMElementsMetaData(),
        };
    }

    createAppointmentsMap(items) {
        const renderingStrategyOptions = this._getRenderingStrategyOptions();

        const {
            viewModel,
            positionMap
        } = this.appointmentViewModel.generate({
            filteredItems: items,
            ...renderingStrategyOptions,
        });

        this._positionMap = positionMap; // TODO get rid of this after remove old render

        return viewModel;
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
                leftVirtualWidth: undefined,
                topVirtualHeight: undefined,
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
        if(sourceAppointments.length === 0 || this.viewRenderingStrategyName === 'agenda') {
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
        const renderingStrategy = this.appointmentViewModel.getRenderingStrategy();
        if(!renderingStrategy) {
            const options = this._getRenderingStrategyOptions();
            this.appointmentViewModel.initRenderingStrategy(options);
        }

        return this.appointmentViewModel.getRenderingStrategy();
    }
}

export default AppointmentLayoutManager;
