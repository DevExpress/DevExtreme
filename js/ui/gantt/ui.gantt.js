import $ from "../../core/renderer";
import Widget from "../widget/ui.widget";
import registerComponent from "../../core/component_registrator";
import { GanttView } from "./ui.gantt.view";
import dxTreeList from "../tree_list";
import { extend } from "../../core/utils/extend";

const GANTT_CLASS = "dx-gantt";
const GANTT_SPLITTER_CLASS = "dx-gantt-splitter";
const GANTT_VIEW_CLASS = "dx-gantt-view";

const GANTT_KEY_FIELD = "id";

class Gantt extends Widget {
    _initMarkup() {
        super._initMarkup();
        this.$element().addClass(GANTT_CLASS);

        this._$treeList = $("<div>")
            .appendTo(this.$element());
        this._$splitter = $("<div>")
            .addClass(GANTT_SPLITTER_CLASS)
            .appendTo(this.$element());
    }

    _render() {
        this._treeList = this._createComponent(this._$treeList, dxTreeList, {
            dataSource: this.option("tasks.dataSource"),
            width: "100%",
            selection: { mode: "single" },
            sorting: { mode: "none" },
            scrolling: { showScrollbar: "never", mode: "standard" },
            allowColumnResizing: true,
            autoExpandAll: true,
            showRowLines: true,
            onContentReady: (e) => { this._onTreeListContentReady(e); },
            onSelectionChanged: (e) => this._ganttView._selectTask(e.currentSelectedRowKeys[0]),
            onRowCollapsed: () => this._updateGanttView(),
            onRowExpanded: () => this._updateGanttView()
        });
    }

    _initGanttView() {
        if(this._ganttView) {
            return;
        }
        const $ganttView = $("<div>")
            .addClass(GANTT_VIEW_CLASS)
            .appendTo(this.$element());

        this._ganttView = this._createComponent($ganttView, GanttView, {
            height: this._treeList._$element.get(0).offsetHeight,
            tasks: this._getTasks(),
            dependencies: this.option("dependencies.dataSource"),
            resources: this.option("resources.dataSource"),
            resourceAssignments: this.option("resourceAssignments.dataSource"),
            onSelectionChanged: (e) => { this._onGanttViewSelectionChanged(e); },
            onScroll: (e) => { this._onGanttViewScroll(e); }
        });
    }

    _onTreeListContentReady(e) {
        if(e.component.getDataSource()) {
            this._initGanttView();
            this._initScrollSync(e.component);
        }
    }
    _onGanttViewSelectionChanged(e) {
        this._treeList.option("selectedRowKeys", [e.id]);
    }
    _onGanttViewScroll(e) {
        const treeListScrollable = this._treeList.getScrollable();
        if(treeListScrollable) {
            const diff = e.scrollableElement.scrollTop - treeListScrollable.scrollTop();
            if(diff !== 0) {
                treeListScrollable.scrollBy(diff);
            }
        }
    }
    _onTreeListScroll(e) {
        const ganttViewScrollable = this._ganttView._getScrollable();
        if(ganttViewScrollable.scrollTop !== e.scrollOffset.top) {
            ganttViewScrollable.scrollTop = e.scrollOffset.top;
        }
    }

    _updateGanttView() {
        this._ganttView.option("tasks", this._getTasks());
        this._ganttView._update();
    }
    _getTasks() {
        return this._treeList.getVisibleRows().map(r => r.data);
    }
    _initScrollSync(treeList) {
        const scrollable = treeList.getScrollable();
        if(scrollable) {
            scrollable.off("scroll", (e) => { this._onTreeListScroll(e); });
            scrollable.on("scroll", (e) => { this._onTreeListScroll(e); });
        }
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            /**
            * @name dxGanttOptions.tasks
            * @type Object
            * @default null
            */
            tasks: {
                /**
                * @name dxGanttOptions.tasks.dataSource
                * @type Array<Object>|DataSource|DataSourceOptions
                * @default null
                */
                dataSource: null,
                /**
                * @name dxGanttOptions.tasks.keyExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default "id"
                */
                keyExpr: GANTT_KEY_FIELD
            },
            /**
            * @name dxGanttOptions.dependencies
            * @type Object
            * @default null
            */
            dependencies: {
                /**
                * @name dxGanttOptions.dependencies.dataSource
                * @type Array<Object>|DataSource|DataSourceOptions
                * @default null
                */
                dataSource: null,
                /**
                * @name dxGanttOptions.dependencies.keyExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default "id"
                */
                keyExpr: GANTT_KEY_FIELD
            },
            resources: {
                /**
                * @name dxGanttOptions.resources.dataSource
                * @type Array<Object>|DataSource|DataSourceOptions
                * @default null
                */
                dataSource: null,
                /**
                * @name dxGanttOptions.resources.keyExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default "id"
                */
                keyExpr: GANTT_KEY_FIELD
            },
            resourceAssignments: {
                /**
                * @name dxGanttOptions.resourceAssignments.dataSource
                * @type Array<Object>|DataSource|DataSourceOptions
                * @default null
                */
                dataSource: null,
                /**
                * @name dxGanttOptions.resourceAssignments.keyExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default "id"
                */
                keyExpr: GANTT_KEY_FIELD
            }
        });
    }

    _optionChanged(args) {
        switch(args.name) {
            case "tasks":
                // TODO
                break;
            case "dependencies":
                // TODO
                break;
            case "resources":
                // TODO
                break;
            case "resourceAssignments":
                // TODO
                break;
            default:
                super._optionChanged(args);
        }
    }
}

registerComponent("dxGantt", Gantt);
module.exports = Gantt;
