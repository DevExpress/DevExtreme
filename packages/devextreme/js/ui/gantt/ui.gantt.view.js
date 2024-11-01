import $ from '../../core/renderer';
import Widget from '../widget/ui.widget';
import { getGanttViewCore } from './gantt_importer';
import { TaskAreaContainer } from './ui.gantt.task.area.container';
import dateLocalization from '../../common/core/localization/date';
import { isDefined } from '../../core/utils/type';
import messageLocalization from '../../common/core/localization/message';
import { format } from '../../core/utils/string';
import coreLocalization from '../../common/core/localization/core';
import { requestAnimationFrame, cancelAnimationFrame } from '../../common/core/animation/frame';


const visualStateKey = 'visualState';
const fullScreenModeKey = 'fullScreen';

export class GanttView extends Widget {
    _init() {
        super._init();

        this._onSelectionChanged = this._createActionByOption('onSelectionChanged');
        this._onViewTypeChanged = this._createActionByOption('onViewTypeChanged');
        this._onScroll = this._createActionByOption('onScroll');
        this._onDialogShowing = this._createActionByOption('onDialogShowing');
        this._onPopupMenuShowing = this._createActionByOption('onPopupMenuShowing');
        this._onPopupMenuHiding = this._createActionByOption('onPopupMenuHiding');
        this._expandAll = this._createActionByOption('onExpandAll');
        this._collapseAll = this._createActionByOption('onCollapseAll');
        this._taskClick = this._createActionByOption('onTaskClick');
        this._taskDblClick = this._createActionByOption('onTaskDblClick');
        this._onAdjustControl = this._createActionByOption('onAdjustControl');
    }
    _initMarkup() {
        const GanttView = getGanttViewCore();
        this._ganttViewCore = new GanttView(this.$element().get(0), this, {
            showResources: this.option('showResources'),
            showDependencies: this.option('showDependencies'),
            taskTitlePosition: this._getTaskTitlePosition(this.option('taskTitlePosition')),
            firstDayOfWeek: this._getFirstDayOfWeek(this.option('firstDayOfWeek')),
            allowSelectTask: this.option('allowSelection'),
            startDateRange: this.option('startDateRange'),
            endDateRange: this.option('endDateRange'),
            editing: this._parseEditingSettings(this.option('editing')),
            validation: this.option('validation'),
            stripLines: { stripLines: this.option('stripLines') },
            areHorizontalBordersEnabled: this.option('showRowLines'),
            areAlternateRowsEnabled: false,
            viewType: this._getViewTypeByScaleType(this.option('scaleType')),
            viewTypeRange: this._parseViewTypeRangeSettings(this.option('scaleTypeRange')),
            cultureInfo: this._getCultureInfo(),
            taskTooltipContentTemplate: this.option('taskTooltipContentTemplate'),
            taskProgressTooltipContentTemplate: this.option('taskProgressTooltipContentTemplate'),
            taskTimeTooltipContentTemplate: this.option('taskTimeTooltipContentTemplate'),
            taskContentTemplate: this.option('taskContentTemplate'),
            sieve: this.option('sieve')
        });
        this._selectTask(this.option('selectedRowKey'));
        this.updateBarItemsState();

        const visualState = this.option(visualStateKey);
        if(visualState) {
            this._restoreStateFrameId = requestAnimationFrame(() => this._restoreVisualState(visualState));
        }
    }
    _dispose() {
        super._dispose();
        cancelAnimationFrame(this._restoreStateFrameId);
    }
    _restoreVisualState(state) {
        if(state[fullScreenModeKey]) {
            this._ganttViewCore.setFullScreenMode();
        }
    }
    _getFirstDayOfWeek(value) {
        return isDefined(value) ? value : dateLocalization.firstDayOfWeekIndex();
    }
    getTaskAreaContainer() {
        return this._ganttViewCore.getTaskAreaContainer();
    }
    getBarManager() {
        return this._ganttViewCore.barManager;
    }
    executeCoreCommand(id) {
        const command = this._ganttViewCore.getCommandByKey(id);
        if(command) {
            command.execute();
        }
    }
    changeTaskExpanded(id, value) {
        this._ganttViewCore.changeTaskExpanded(id, value);
    }
    updateView() {
        this._ganttViewCore?.updateView();
    }
    updateBarItemsState() {
        this._ganttViewCore.barManager.updateItemsState([]);
    }
    setWidth(value) {
        this._ganttViewCore.setWidth(value);
    }
    _onDimensionChanged() {
        this._ganttViewCore.onBrowserWindowResize();
    }

    _selectTask(id) {
        this._ganttViewCore.selectTaskById(id);
    }
    _update(keepExpandState) {
        this._ganttViewCore?.updateWithDataReload(keepExpandState);
    }

    _getCultureInfo() {
        return {
            monthNames: dateLocalization.getMonthNames('wide'),
            dayNames: dateLocalization.getDayNames('wide'),
            abbrMonthNames: dateLocalization.getMonthNames('abbreviated'),
            abbrDayNames: dateLocalization.getDayNames('abbreviated'),
            quarterNames: this._getQuarterNames(),
            amText: this._getAmText(),
            pmText: this._getPmText(),
            start: messageLocalization.format('dxGantt-dialogStartTitle'),
            end: messageLocalization.format('dxGantt-dialogEndTitle'),
            progress: messageLocalization.format('dxGantt-dialogProgressTitle')
        };
    }
    _getAmText() {
        return this._hasAmPM() ? dateLocalization.getPeriodNames()[0] : '';
    }
    _getPmText() {
        return this._hasAmPM() ? dateLocalization.getPeriodNames()[1] : '';
    }
    _hasAmPM() {
        const date = new Date(Date.UTC(2012, 11, 12, 3, 0, 0));
        const dateString = date.toLocaleTimeString(coreLocalization.locale());
        return dateString.match(/am|pm/i) || date.toString().match(/am|pm/i);
    }
    _getQuarterNames() {
        const quarterFormat = messageLocalization.format('dxGantt-quarter');
        if(!quarterFormat) {
            return dateLocalization.getQuarterNames();
        }
        return [
            format(quarterFormat, 1),
            format(quarterFormat, 2),
            format(quarterFormat, 3),
            format(quarterFormat, 4)
        ];
    }
    _getTaskTitlePosition(value) {
        switch(value) {
            case 'outside':
                return 1;
            case 'none':
                return 2;
            default:
                return 0;
        }
    }
    _getViewTypeByScaleType(scaleType) {
        switch(scaleType) {
            case 'minutes':
                return 0;
            case 'hours':
                return 1;
            case 'sixHours':
                return 2;
            case 'days':
                return 3;
            case 'weeks':
                return 4;
            case 'months':
                return 5;
            case 'quarters':
                return 6;
            case 'years':
                return 7;
            default:
                return undefined;
        }
    }
    _parseEditingSettings(value) {
        return {
            enabled: value.enabled,
            allowDependencyDelete: value.allowDependencyDeleting,
            allowDependencyInsert: value.allowDependencyAdding,
            allowTaskDelete: value.allowTaskDeleting,
            allowTaskInsert: value.allowTaskAdding,
            allowTaskUpdate: value.allowTaskUpdating,
            allowResourceDelete: value.allowResourceDeleting,
            allowResourceInsert: value.allowResourceAdding,
            allowResourceUpdate: value.allowResourceUpdating,
            allowTaskResourceUpdate: value.allowTaskResourceUpdating
        };
    }

    _parseViewTypeRangeSettings(value) {
        return {
            min: this._getViewTypeByScaleType(value.min),
            max: this._getViewTypeByScaleType(value.max)
        };
    }

    _optionChanged(args) {
        switch(args.name) {
            case 'width':
                super._optionChanged(args);
                this._ganttViewCore.setWidth(args.value);
                break;
            case 'height':
                this._ganttViewCore.setHeight(args.value);
                break;
            case 'tasks':
            case 'dependencies':
            case 'resources':
            case 'resourceAssignments':
                this._sieveOptions = undefined;
                this._update(true);
                break;
            case 'showResources':
                this._ganttViewCore.setShowResources(args.value);
                break;
            case 'showDependencies':
                this._ganttViewCore.setShowDependencies(args.value);
                break;
            case 'taskTitlePosition':
                this._ganttViewCore.setTaskTitlePosition(this._getTaskTitlePosition(args.value));
                break;
            case 'firstDayOfWeek':
                this._ganttViewCore.setFirstDayOfWeek(this._getFirstDayOfWeek(args.value));
                break;
            case 'startDateRange':
                this._ganttViewCore.setStartDateRange(args.value);
                break;
            case 'endDateRange':
                this._ganttViewCore.setEndDateRange(args.value);
                break;
            case 'allowSelection':
                this._ganttViewCore.setAllowSelection(args.value);
                break;
            case 'selectedRowKey':
                this._selectTask(args.value);
                break;
            case 'editing':
                this._ganttViewCore.setEditingSettings(this._parseEditingSettings(args.value));
                break;
            case 'validation':
                this._ganttViewCore.setValidationSettings(args.value);
                this._update(true);
                break;
            case 'showRowLines':
                this._ganttViewCore.setRowLinesVisible(args.value);
                break;
            case 'scaleType':
                this._ganttViewCore.setViewType(this._getViewTypeByScaleType(args.value));
                break;
            case 'scaleTypeRange':
                this._ganttViewCore.setViewTypeRange(this._getViewTypeByScaleType(args.value.min), this._getViewTypeByScaleType(args.value.max));
                break;
            case 'stripLines':
                this._ganttViewCore.setStripLines({ stripLines: args.value });
                break;
            case 'taskTooltipContentTemplate':
                this._ganttViewCore.setTaskTooltipContentTemplate(args.value);
                break;
            case 'taskProgressTooltipContentTemplate':
                this._ganttViewCore.setTaskProgressTooltipContentTemplate(args.value);
                break;
            case 'taskTimeTooltipContentTemplate':
                this._ganttViewCore.setTaskTimeTooltipContentTemplate(args.value);
                break;
            case 'taskContentTemplate':
                this._ganttViewCore.setTaskContentTemplate(args.value);
                break;
            case 'sieve':
                this._sortAndFilter(args.value);
                break;
            default:
                super._optionChanged(args);
        }
    }

    // IGanttOwner
    get bars() {
        return this.option('bars');
    }
    getRowHeight() {
        return this.option('rowHeight');
    }
    getHeaderHeight() {
        return this.option('headerHeight');
    }
    getGanttTasksData() {
        const tasks = this.option('tasks');
        const sieveOptions = this.getSieveOptions();
        if(sieveOptions?.sievedItems && sieveOptions?.sieveColumn) {
            return sieveOptions.sievedItems;
        }
        return tasks;
    }
    _sortAndFilter(args) {
        this._sieveOptions = args;
        this._update(!args?.expandTasks);
        const selectedRowKey = this.option('selectedRowKey');
        this._selectTask(selectedRowKey);
    }

    getSieveOptions() {
        return this._sieveOptions;
    }
    getGanttDependenciesData() {
        return this.option('dependencies');
    }
    getGanttResourcesData() {
        return this.option('resources');
    }
    getGanttResourceAssignmentsData() {
        return this.option('resourceAssignments');
    }
    getGanttWorkTimeRules() {
        return null;
    }
    getExternalTaskAreaContainer(element) {
        if(!this._taskAreaContainer) {
            this._taskAreaContainer = new TaskAreaContainer(element, this);
        }
        return this._taskAreaContainer;
    }
    prepareExternalTaskAreaContainer(element, info) {
        if(info?.height) {
            this._taskAreaContainer._scrollView.option('height', info.height);
        }
    }
    changeGanttTaskSelection(id, selected) {
        this._onSelectionChanged({ id: id, selected: selected });
    }
    onGanttScroll(scrollTop) {
        this._onScroll({ scrollTop: scrollTop });
    }
    showDialog(name, parameters, callback, afterClosing) {
        this._onDialogShowing({
            name: name,
            parameters: parameters,
            callback: callback,
            afterClosing: afterClosing
        });
    }
    getModelChangesListener() {
        return this.option('modelChangesListener');
    }
    getExportInfo() {
        return this.option('exportInfo');
    }
    showPopupMenu(info) {
        this._onPopupMenuShowing(info);
    }
    hidePopupMenu(info) {
        this._onPopupMenuHiding(info);
    }
    getMainElement() {
        return this.option('mainElement').get(0);
    }
    adjustControl() {
        this._onAdjustControl();
    }
    getRequireFirstLoadParentAutoCalc() {
        return this.option('validation.autoUpdateParentTasks');
    }
    collapseAll() {
        this._collapseAll();
    }
    expandAll() {
        this._expandAll();
    }
    onTaskClick(key, event) {
        this._taskClick({ key: key, event: event });
        return true;
    }
    onTaskDblClick(key, event) {
        return this._taskDblClick({ key: key, event: event });
    }
    onGanttViewContextMenu(event, key, type) {
        return true;
    }
    getFormattedDateText(date) {
        let result = '';
        if(date) {
            const datePart = dateLocalization.format(date, 'shortDate');
            const timeFormat = this._hasAmPM() ? 'hh:mm a' : 'HH:mm';
            const timePart = dateLocalization.format(date, timeFormat);
            result = datePart + ' ' + timePart;
        }
        return result;
    }
    destroyTemplate(container) {
        $(container).empty();
    }
    onTaskAreaSizeChanged(info) {
        const scrollView = this._taskAreaContainer._scrollView;
        if(isDefined(info?.height)) {
            const direction = info?.height > this._taskAreaContainer.getHeight() ? 'both' : 'horizontal';
            scrollView.option('direction', direction);
        }
    }
    updateGanttViewType(type) {
        this._onViewTypeChanged({ type: type });
    }
    // export
    getTreeListTableStyle() {
        return this.callExportHelperMethod('getTreeListTableStyle');
    }
    getTreeListColCount() {
        return this.callExportHelperMethod('getTreeListColCount');
    }
    getTreeListHeaderInfo(colIndex) {
        return this.callExportHelperMethod('getTreeListHeaderInfo', colIndex);
    }
    getTreeListCellInfo(rowIndex, colIndex, key) {
        return this.callExportHelperMethod('getTreeListCellInfo', key, colIndex);
    }
    getTreeListEmptyDataCellInfo() {
        return this.callExportHelperMethod('getTreeListEmptyDataCellInfo');
    }
    callExportHelperMethod(methodName, ...args) {
        const helper = this.option('exportHelper');
        return helper[methodName](...args);
    }
    applyTasksExpandedState(state) {
        this._ganttViewCore?.applyTasksExpandedState(state);
    }

    getVisualStateToRestore() {
        return {
            [fullScreenModeKey]: this._ganttViewCore?.isInFullScreenMode?.()
        };
    }
}
