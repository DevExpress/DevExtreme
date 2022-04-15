import { equalByValue } from '../../core/utils/common';
import { AppointmentViewModelGenerator } from './appointments/viewModelGenerator';
import { getGroupCount } from './resources/utils';
import { getCellWidth, getCellHeight, getAllDayHeight } from './workspaces/helpers/positionHelper';
import { getCellDuration } from '../../renovation/ui/scheduler/view_model/to_test/views/utils/base';
import { getAppointmentRenderingStrategyName } from '../../renovation/ui/scheduler/model/appointments';

class AppointmentLayoutManager {
    constructor(instance) {
        this.instance = instance;
        this.appointmentViewModel = new AppointmentViewModelGenerator();
    }

    get appointmentRenderingStrategyName() {
        return getAppointmentRenderingStrategyName(this.instance.currentViewType);
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

    _getRenderingStrategyOptions() {
        const workspace = this.instance.getWorkSpace();
        const { virtualScrollingDispatcher } = this.instance.getWorkSpace();
        const {
            cellCountInsideLeftVirtualCell,
            cellCountInsideTopVirtualRow
        } = virtualScrollingDispatcher;
        const groupCount = getGroupCount(this.instance.option('loadedResources'));
        const DOMMetaData = workspace.getDOMElementsMetaData();
        const allDayHeight = getAllDayHeight(
            workspace.option('showAllDayPanel'),
            workspace._isVerticalGroupedWorkSpace(),
            DOMMetaData
        );
        const rowCount = workspace._getRowCount();
        const { positionHelper, viewDataProvider } = workspace;
        const visibleDayDuration = viewDataProvider.getVisibleDayDuration(
            workspace.option('startDayHour'),
            workspace.option('endDayHour'),
            workspace.option('hoursInterval')
        );

        const cellDuration = getCellDuration(
            workspace.type,
            workspace.option('startDayHour'),
            workspace.option('endDayHour'),
            workspace.option('hoursInterval')
        );
        return {
            resources: this.instance.option('resources'),
            loadedResources: this.instance.option('loadedResources'),
            getAppointmentColor: this.instance.createGetAppointmentColor(),
            dataAccessors: this.instance._dataAccessors,
            isRenovatedAppointments: this.instance.option('isRenovatedAppointments'),
            appointmentRenderingStrategyName: this.appointmentRenderingStrategyName,
            adaptivityEnabled: this.instance.option('adaptivityEnabled'),
            rtlEnabled: this.instance.option('rtlEnabled'),
            startDayHour: this.instance._getCurrentViewOption('startDayHour'),
            endDayHour: this.instance._getCurrentViewOption('endDayHour'),
            maxAppointmentsPerCell: this.instance._getCurrentViewOption('maxAppointmentsPerCell'),
            currentDate: this.instance.option('currentDate'),
            isVirtualScrolling: this.instance.isVirtualScrolling(),
            leftVirtualCellCount: cellCountInsideLeftVirtualCell,
            topVirtualCellCount: cellCountInsideTopVirtualRow,
            intervalCount: workspace.option('intervalCount'),
            hoursInterval: workspace.option('hoursInterval'),
            showAllDayPanel: workspace.option('showAllDayPanel'),
            isGroupedAllDayPanel: workspace.isGroupedAllDayPanel(),
            groups: this.instance._getCurrentViewOption('groups'),
            groupCount,
            rowCount,
            appointmentCountPerCell: this.instance.option('_appointmentCountPerCell'),
            appointmentOffset: this.instance.option('_appointmentOffset'),
            allowResizing: this.instance._allowResizing(),
            allowAllDayResizing: this.instance._allowAllDayResizing(),
            startViewDate: workspace.getStartViewDate(),
            groupOrientation: workspace._getRealGroupOrientation(),
            cellWidth: getCellWidth(DOMMetaData),
            cellHeight: getCellHeight(DOMMetaData),
            allDayHeight: allDayHeight,
            resizableStep: positionHelper.getResizableStep(),
            visibleDayDuration,
            allDayPanelMode: this.instance._getCurrentViewOption('allDayPanelMode'),
            // appointment settings
            timeZoneCalculator: this.instance.timeZoneCalculator,
            timeZone: this.instance.option('timeZone'),
            firstDayOfWeek: this.instance.getFirstDayOfWeek(),
            viewStartDayHour: this.instance._getCurrentViewOption('startDayHour'),
            viewEndDayHour: this.instance._getCurrentViewOption('endDayHour'),
            viewType: workspace.type,
            endViewDate: workspace.getEndViewDate(),
            positionHelper,
            isGroupedByDate: workspace.isGroupedByDate(),
            cellDuration,
            cellDurationInMinutes: workspace.option('cellDuration'),
            viewDataProvider: workspace.viewDataProvider,
            supportAllDayRow: workspace.supportAllDayRow(),
            dateRange: workspace.getDateRange(),
            intervalDuration: workspace.getIntervalDuration(),
            allDayIntervalDuration: workspace.getIntervalDuration(true),
            isVerticalGroupOrientation: workspace.isVerticalOrientation(),
            DOMMetaData,
            // agenda only
            instance: this.instance,
            agendaDuration: workspace.option('agendaDuration'),
        };
    }

    createAppointmentsMap(items) {
        const renderingStrategyOptions = this._getRenderingStrategyOptions();

        const {
            viewModel,
            positionMap
        } = this.appointmentViewModel.generate(items, renderingStrategyOptions);

        this._positionMap = positionMap; // TODO get rid of this after remove old render

        return viewModel;
    }

    _isDataChanged(data) {
        const appointmentDataProvider = this.instance.appointmentDataProvider;
        const updatedData = appointmentDataProvider.getUpdatedAppointment();

        return updatedData === data || appointmentDataProvider
            .getUpdatedAppointmentKeys()
            .some((item) => {
                return data[item.key] === item.value;
            });
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
                positionByMap: undefined,
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
        if(sourceAppointments.length === 0 || this.appointmentRenderingStrategyName === 'agenda') {
            return currentAppointments;
        }

        currentAppointments.forEach(appointment => {
            const sourceAppointment = this._getAssociatedSourceAppointment(appointment, sourceAppointments);
            if(sourceAppointment) {
                const isDataChanged = this._isDataChanged(appointment.itemData);
                const isSettingChanged = this._isSettingChanged(appointment.settings, sourceAppointment.settings);
                const isAppointmentShouldAppear = this._isAppointmentShouldAppear(appointment, sourceAppointment);

                appointment.needRepaint = isDataChanged || isSettingChanged || isAppointmentShouldAppear;
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
