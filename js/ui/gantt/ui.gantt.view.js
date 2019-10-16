import Widget from "../widget/ui.widget";
import { getGanttViewCore } from "./gantt_importer";
import { TaskAreaContainer } from "./ui.gantt.task.area.container";

export class GanttView extends Widget {
    _init() {
        super._init();

        this._onSelectionChanged = this._createActionByOption("onSelectionChanged");
        this._onScroll = this._createActionByOption("onScroll");
        this._onDialogShowing = this._createActionByOption("onDialogShowing");
        this._onPopupMenuShowing = this._createActionByOption("onPopupMenuShowing");
    }
    _initMarkup() {
        const { GanttView } = getGanttViewCore();
        this._ganttViewCore = new GanttView(this.$element().get(0), this, {
            showResources: this.option("showResources"),
            taskTitlePosition: this._getTaskTitlePosition(this.option("taskTitlePosition")),
            allowSelectTask: this.option("allowSelection"),
            editing: this.option("editing"),
            areHorizontalBordersEnabled: this.option("showRowLines"),
            areAlternateRowsEnabled: false,
            viewType: this._getViewTypeByScaleType(this.option("scaleType"))
        });
        this._selectTask(this.option("selectedRowKey"));
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
    changeTaskExpanded(rowIndex, value) {
        const model = this._ganttViewCore.viewModel;
        model.beginUpdate();
        model.changeTaskExpanded(rowIndex, value);
        model.endUpdate();
    }
    updateView() {
        this._ganttViewCore.updateView();
    }
    setWidth(value) {
        this._ganttViewCore.setWidth(value);
    }

    _selectTask(id) {
        if(this.lastSelectedId !== undefined) {
            this._ganttViewCore.unselectTask(this.lastSelectedId);
        }
        this._ganttViewCore.selectTask(id);
        this.lastSelectedId = id;
    }
    _update() {
        this._ganttViewCore.loadOptionsFromGanttOwner();
        this._ganttViewCore.resetAndUpdate();
    }

    _getTaskTitlePosition(value) {
        switch(value) {
            case "outside":
                return 1;
            case "none":
                return 2;
            default:
                return 0;
        }
    }
    _getViewTypeByScaleType(scaleType) {
        switch(scaleType) {
            case "minutes":
                return 0;
            case "hours":
                return 1;
            case "days":
                return 3;
            case "weeks":
                return 4;
            case "months":
                return 5;
            default:
                return undefined;
        }
    }

    _optionChanged(args) {
        switch(args.name) {
            case "width":
                super._optionChanged(args);
                this._ganttViewCore.setWidth(args.value);
                break;
            case "tasks":
            case "dependencies":
            case "resources":
            case "resourceAssignments":
                this._update();
                break;
            case "showResources":
                this._ganttViewCore.setShowResources(args.value);
                break;
            case "taskTitlePosition":
                this._ganttViewCore.setTaskTitlePosition(this._getTaskTitlePosition(args.value));
                break;
            case "allowSelection":
                this._ganttViewCore.setAllowSelection(args.value);
                break;
            case "selectedRowKey":
                this._selectTask(args.value);
                break;
            case "editing":
                this._ganttViewCore.setEditingSettings(args.value);
                break;
            case "showRowLines":
                this._ganttViewCore.setRowLinesVisible(args.value);
                break;
            case "scaleType":
                this._ganttViewCore.setViewType(this._getViewTypeByScaleType(args.value));
                break;
            default:
                super._optionChanged(args);
        }
    }

    // IGanttOwner
    get bars() {
        return this.option("bars");
    }
    getRowHeight() {
        return this.option("rowHeight");
    }
    getGanttTasksData() {
        return this.option("tasks");
    }
    getGanttDependenciesData() {
        return this.option("dependencies");
    }
    getGanttResourcesData() {
        return this.option("resources");
    }
    getGanttResourceAssignmentsData() {
        return this.option("resourceAssignments");
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
    showDialog(name, parameters, callback) {
        this._onDialogShowing({
            name: name,
            parameters: parameters,
            callback: callback
        });
    }
    getModelChangesListener() {
        return this.option("modelChangesListener");
    }
    showPopupMenu(position) {
        this._onPopupMenuShowing({
            position: position
        });
    }
}
