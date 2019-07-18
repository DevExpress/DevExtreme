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
const GANTT_DEFAULT_ROW_HEIGHT = 34;

class Gantt extends Widget {
    _initMarkup() {
        super._initMarkup();
        this.$element().addClass(GANTT_CLASS);

        this._$treeListWrapper = $("<div>")
            .width(this.option("treeListWidth"))
            .appendTo(this.$element());
        this._$treeList = $("<div>")
            .width(this.option("treeListWidth"))
            .appendTo(this._$treeListWrapper);
        this._$splitter = $("<div>")
            .addClass(GANTT_SPLITTER_CLASS)
            .appendTo(this.$element());
        this._$ganttView = $("<div>")
            .addClass(GANTT_VIEW_CLASS)
            .appendTo(this.$element());
    }

    _render() {
        this._renderTreeList();
    }
    _renderTreeList() {
        this._treeList = this._createComponent(this._$treeList, dxTreeList, {
            dataSource: this.option("tasks.dataSource"),
            columns: this.option("columns"),
            columnResizingMode: "widget",
            height: "100%",
            selection: { mode: "single" },
            sorting: { mode: "none" },
            scrolling: { showScrollbar: "onHover", mode: "standard" },
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

        this._ganttView = this._createComponent(this._$ganttView, GanttView, {
            height: this._treeList._$element.get(0).offsetHeight,
            rowHeight: this._getTreeListRowHeight(),
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
            const diff = e.scrollTop - treeListScrollable.scrollTop();
            if(diff !== 0) {
                treeListScrollable.scrollBy({ top: diff });
            }
        }
    }
    _onTreeListScroll(treeListScrollView) {
        const ganttViewTaskAreaContainer = this._ganttView._getTaskAreaContainer();
        if(ganttViewTaskAreaContainer.scrollTop !== treeListScrollView.component.scrollTop()) {
            ganttViewTaskAreaContainer.scrollTop = treeListScrollView.component.scrollTop();
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
        const treeListScrollable = treeList.getScrollable();
        if(treeListScrollable) {
            treeListScrollable.off("scroll", (e) => { this._onTreeListScroll(e); });
            treeListScrollable.on("scroll", (e) => { this._onTreeListScroll(e); });
        }
    }
    _getTreeListRowHeight() {
        const rowElement = this._treeList._$element.find(".dx-row-lines")[0];
        if(rowElement) {
            const borderWidth = this._treeList.option("showRowLines") ? 1 : 0;
            return rowElement.offsetHeight + borderWidth;
        }
        return GANTT_DEFAULT_ROW_HEIGHT;
    }

    _updateWidth() {
        const treeListWidth = this.option("treeListWidth");
        this._$treeListWrapper.width(treeListWidth);
        this._$treeList.width(treeListWidth);
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
            /**
            * @name dxGanttOptions.resources
            * @type Object
            * @default null
            */
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
            /**
            * @name dxGanttOptions.resourceAssignments
            * @type Object
            * @default null
            */
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
            },
            /**
            * @name dxGanttOptions.treeListWidth
            * @type number
            * @default 300
            */
            treeListWidth: 300
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
            case "treeListWidth":
                this._updateWidth();
                break;
            default:
                super._optionChanged(args);
        }
    }
}

registerComponent("dxGantt", Gantt);
module.exports = Gantt;
