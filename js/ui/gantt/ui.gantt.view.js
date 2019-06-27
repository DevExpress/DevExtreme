import Widget from '../widget/ui.widget';
import { getGanttViewCore } from './gantt_importer';

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
        let height = this.option('height') - GANTT_VIEW_HEADER_HEIGHT;
        return { width: 700, height: height };
    }
    getGanttTickSize() {
        return { width: 100, height: 34 };
    }
    getGanttContainer() {
        return this.$element().get(0);
    }
    getGanttViewStartDate() {
        let min = new Date();
        const tasks = this.getGanttTasksData();
        tasks.forEach(t => {
            if(t.start < min) {
                min = t.start;
            }
        });
        return min;
    }
    getGanttViewEndDate() {
        let max = new Date();
        const tasks = this.getGanttTasksData();
        tasks.forEach(t => {
            if(t.end > max) {
                max = t.end;
            }
        });
        return max;
    }
    getGanttTasksData() {
        return this.option('tasks');
    }
    getGanttDependenciesData() {
        return this.option('dependenciesDataSource');
    }
    getGanttResourcesData() {
        return this.option('resourcesDataSource');
    }
    getGanttResourceAssignmentsData() {
        return this.option('resourceAssignmentsDataSource');
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
