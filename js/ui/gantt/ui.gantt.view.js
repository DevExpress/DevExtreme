import Widget from "../widget/ui.widget";
import { getGanttViewCore } from "./gantt_importer";

const GANTT_VIEW_HEADER_HEIGHT = 48;

export class GanttView extends Widget {
    _init() {
        super._init();

        this._onSelectionChanged = this._createActionByOption("onSelectionChanged");
        this._onScroll = this._createActionByOption("onScroll");
    }
    _initMarkup() {
        const { GanttView } = getGanttViewCore();
        this._ganttViewCore = new GanttView(this);
        this._ganttViewCore.createView();
        this._ganttViewCore.setViewType(2);
    }

    _getScrollable() {
        return this._ganttViewCore.taskAreaContainer;
    }
    _selectTask(id) {
        if(this.lastSelectedId !== undefined) {
            this._ganttViewCore.unselectTask(parseInt(this.lastSelectedId));
        }
        this._ganttViewCore.selectTask(id);
        this.lastSelectedId = id;
    }
    _update() {
        this._ganttViewCore.loadOptionsFromTreeList();
        this._ganttViewCore.resetAndUpdate();
    }

    // IGanttView
    getGanttSize() {
        let height = this.option("height") - GANTT_VIEW_HEADER_HEIGHT;
        return { width: 700, height: height };
    }
    getGanttTickSize() {
        return { width: 100, height: 34 };
    }
    getGanttContainer() {
        return this.$element().get(0);
    }
    getGanttViewStartDate() {
        const tasks = this.getGanttTasksData();
        return tasks.reduce((min, t) => t.start < min ? t.start : min, tasks[0].start);
    }
    getGanttViewEndDate() {
        const tasks = this.getGanttTasksData();
        return tasks.reduce((max, t) => t.end > max ? t.end : max, tasks[0].end);
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
    getGanttViewSettings() {
        return {};
    }
    changeGanttTaskSelection(id, selected) {
        this._onSelectionChanged({ id: id, selected: selected });
    }
    onGanttScroll(scrollableElement) {
        this._onScroll({ scrollableElement: scrollableElement });
    }
    areAlternateRowsEnabled() {
        return true;
    }
    areVerticalBordersEnabled() {
        return true;
    }
    areHorizontalBordersEnabled() {
        return true;
    }
    allowSelectTask() {
        return true;
    }
}
