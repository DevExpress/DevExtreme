import Widget from "../widget/ui.widget";
import { getGanttViewCore } from "./gantt_importer";
import { TaskAreaContainer } from "./ui.gantt.task.area.container";

export class GanttView extends Widget {
    _init() {
        super._init();

        this._onSelectionChanged = this._createActionByOption("onSelectionChanged");
        this._onScroll = this._createActionByOption("onScroll");
    }
    _initMarkup() {
        const { GanttView } = getGanttViewCore();
        this._ganttViewCore = new GanttView(this.$element().get(0), this, {
            showResources: this.option("showResources"),
            taskTitlePosition: this._getTaskTitlePosition(this.option("taskTitlePosition")),
            allowSelectTask: this.option("allowSelection"),
            areAlternateRowsEnabled: false
        });
        this._ganttViewCore.setViewType(3);
    }

    getTaskAreaContainer() {
        return this._ganttViewCore.taskAreaContainer;
    }
    selectTask(id) {
        if(this.lastSelectedId !== undefined) {
            this._ganttViewCore.unselectTask(parseInt(this.lastSelectedId));
        }
        this._ganttViewCore.selectTask(id);
        this.lastSelectedId = id;
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

    _update() {
        this._ganttViewCore.loadOptionsFromGanttOwner();
        this._ganttViewCore.resetAndUpdate();
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

    _optionChanged(args) {
        switch(args.name) {
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
            default:
                super._optionChanged(args);
        }
    }

    // IGanttOwner
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
    getModelChangesListener() {
        return null;
    }
}
