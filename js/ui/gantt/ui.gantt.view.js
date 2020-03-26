import Widget from '../widget/ui.widget';
import { getGanttViewCore } from './gantt_importer';
import { TaskAreaContainer } from './ui.gantt.task.area.container';
import dateLocalization from '../../localization/date';

export class GanttView extends Widget {
    _init() {
        super._init();

        this._onSelectionChanged = this._createActionByOption('onSelectionChanged');
        this._onScroll = this._createActionByOption('onScroll');
        this._onDialogShowing = this._createActionByOption('onDialogShowing');
        this._onPopupMenuShowing = this._createActionByOption('onPopupMenuShowing');
    }
    _initMarkup() {
        const { GanttView } = getGanttViewCore();
        this._ganttViewCore = new GanttView(this.$element().get(0), this, {
            showResources: this.option('showResources'),
            taskTitlePosition: this._getTaskTitlePosition(this.option('taskTitlePosition')),
            allowSelectTask: this.option('allowSelection'),
            editing: this.option('editing'),
            validation: this.option('validation'),
            stripLines: { stripLines: this.option('stripLines') },
            areHorizontalBordersEnabled: this.option('showRowLines'),
            areAlternateRowsEnabled: false,
            viewType: this._getViewTypeByScaleType(this.option('scaleType')),
            cultureInfo: this._getCultureInfo()
        });
        this._selectTask(this.option('selectedRowKey'));
        this.updateBarItemsState();
    }

    getTaskAreaContainer() {
        return this._ganttViewCore.taskAreaContainer;
    }
    getBarManager() {
        return this._ganttViewCore.barManager;
    }
    executeCoreCommand(id) {
        const command = this._ganttViewCore.commandManager.getCommand(id);
        if(command) {
            command.execute();
        }
    }
    changeTaskExpanded(id, value) {
        this._ganttViewCore.changeTaskExpanded(id, value);
    }
    updateView() {
        this._ganttViewCore.updateView();
    }
    updateBarItemsState() {
        this._ganttViewCore.barManager.updateItemsState([]);
    }
    setWidth(value) {
        this._ganttViewCore.setWidth(value);
    }

    _selectTask(id) {
        this._ganttViewCore.selectTaskById(id);
    }
    _update() {
        this._ganttViewCore.loadOptionsFromGanttOwner();
        this._ganttViewCore.resetAndUpdate();
    }

    _getCultureInfo() {
        return {
            monthNames: dateLocalization.getMonthNames('wide'),
            dayNames: dateLocalization.getDayNames('wide'),
            abbrMonthNames: dateLocalization.getMonthNames('abbreviated'),
            abbrDayNames: dateLocalization.getDayNames('abbreviated'),
            quarterNames: dateLocalization.getQuarterNames(),
            amText: dateLocalization.getPeriodNames()[0],
            pmText: dateLocalization.getPeriodNames()[1]
        };
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

    _optionChanged(args) {
        switch(args.name) {
            case 'width':
                super._optionChanged(args);
                this._ganttViewCore.setWidth(args.value);
                break;
            case 'tasks':
            case 'dependencies':
            case 'resources':
            case 'resourceAssignments':
                this._update();
                break;
            case 'showResources':
                this._ganttViewCore.setShowResources(args.value);
                break;
            case 'taskTitlePosition':
                this._ganttViewCore.setTaskTitlePosition(this._getTaskTitlePosition(args.value));
                break;
            case 'allowSelection':
                this._ganttViewCore.setAllowSelection(args.value);
                break;
            case 'selectedRowKey':
                this._selectTask(args.value);
                break;
            case 'editing':
                this._ganttViewCore.setEditingSettings(args.value);
                break;
            case 'validation':
                this._ganttViewCore.setValidationSettings(args.value);
                this._update();
                break;
            case 'showRowLines':
                this._ganttViewCore.setRowLinesVisible(args.value);
                break;
            case 'scaleType':
                this._ganttViewCore.setViewType(this._getViewTypeByScaleType(args.value));
                break;
            case 'stripLines':
                this._ganttViewCore.setStripLines({ stripLines: args.value });
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
        return this.option('tasks');
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
        return {};
    }
    getExternalTaskAreaContainer(element) {
        if(!this._taskAreaContainer) {
            this._taskAreaContainer = new TaskAreaContainer(element, this);
        }
        return this._taskAreaContainer;
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
    showPopupMenu(position) {
        this._onPopupMenuShowing({
            position: position
        });
    }
    getMainElement() {
        return this.option('mainElement').get(0);
    }
    adjustControl() {}
    getRequireFirstLoadParentAutoCalc() { return this.option('validation.autoUpdateParentTasks'); }
}
