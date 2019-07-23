import $ from "../../core/renderer";
import Widget from "../widget/ui.widget";
import registerComponent from "../../core/component_registrator";
import domAdapter from "../../core/dom_adapter";
import eventsEngine from "../../events/core/events_engine";
import pointerEvents from "../../events/pointer";
import { addNamespace } from "../../events/utils";
import { GanttView } from "./ui.gantt.view";
import dxTreeList from "../tree_list";
import { extend } from "../../core/utils/extend";

const GANTT_CLASS = "dx-gantt";
const GANTT_SPLITTER_CLASS = "dx-gantt-splitter";
const GANTT_SPLITTER_TRANSPARENT_CLASS = "dx-gantt-splitter-transparent";
const GANTT_SPLITTER_BORDER_CLASS = "dx-gantt-splitter-border";
const GANTT_VIEW_CLASS = "dx-gantt-view";

const GANTT_KEY_FIELD = "id";
const GANTT_DEFAULT_ROW_HEIGHT = 34;
const GANTT_SPLITTER_BORDER_WIDTH = 2;

const GANTT_MODULE_NAMESPACE = "dxGanttResizing";
const GANTT_POINTER_DOWN_EVENT_NAME = addNamespace(pointerEvents.down, GANTT_MODULE_NAMESPACE);
const GANTT_POINTER_MOVE_EVENT_NAME = addNamespace(pointerEvents.move, GANTT_MODULE_NAMESPACE);
const GANTT_POINTER_UP_EVENT_NAME = addNamespace(pointerEvents.up, GANTT_MODULE_NAMESPACE);

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
            .addClass(GANTT_SPLITTER_TRANSPARENT_CLASS)
            .css('left', this.option("treeListWidth"))
            .height(this.option("height"))
            .appendTo(this.$element());
        $("<div>")
            .addClass(GANTT_SPLITTER_BORDER_CLASS)
            .appendTo(this.$element());
        this._$ganttView = $("<div>")
            .addClass(GANTT_VIEW_CLASS)
            .appendTo(this.$element());
    }

    _render() {
        this._renderTreeList();
        this._renderSplitter();
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
    _renderSplitter() {
        const document = domAdapter.getDocument();
        eventsEngine.on(this._$splitter, GANTT_POINTER_DOWN_EVENT_NAME, this._startResizingHandler.bind(this));
        eventsEngine.on(document, GANTT_POINTER_MOVE_EVENT_NAME, this._moveSplitterHandler.bind(this));
        eventsEngine.on(document, GANTT_POINTER_UP_EVENT_NAME, this._endResizingHandler.bind(this));
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

    _startResizingHandler(e) {
        e.preventDefault();
        this._$splitter.removeClass(GANTT_SPLITTER_TRANSPARENT_CLASS);
        this._isSplitterMove = true;
        this._splitterLastLeftPos = e.clientX;
    }
    _moveSplitterHandler(e) {
        if(this._isSplitterMove) {
            let newLeftPos = this._$splitter.position().left - this._splitterLastLeftPos + e.clientX;
            newLeftPos = Math.max(0, newLeftPos);
            newLeftPos = Math.min(newLeftPos, this.$element().width());
            this._splitterLastLeftPos = e.clientX;
            this._updateWidth(newLeftPos);
        }
    }
    _endResizingHandler() {
        if(this._isSplitterMove) {
            this._$splitter.addClass(GANTT_SPLITTER_TRANSPARENT_CLASS);
            this._isSplitterMove = false;
            this.option("treeListWidth", this._$splitter.position().left);
        }
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
                treeListScrollable.scrollBy({ left: 0, top: diff });
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
            treeListScrollable.off("scroll");
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

    _updateWidth(treeListWidth) {
        this._$treeListWrapper.width(treeListWidth);
        this._$treeList.width(treeListWidth);
        this._$splitter.css('left', treeListWidth);
        this._ganttView._setWidth(this.$element().width() - treeListWidth - GANTT_SPLITTER_BORDER_WIDTH);
    }

    _dispose() {
        const document = domAdapter.getDocument();
        eventsEngine.off(this._$splitter, GANTT_POINTER_DOWN_EVENT_NAME);
        eventsEngine.off(document, GANTT_POINTER_MOVE_EVENT_NAME);
        eventsEngine.off(document, GANTT_POINTER_UP_EVENT_NAME);
        super._dispose();
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
                this._updateWidth(args.value);
                break;
            default:
                super._optionChanged(args);
        }
    }
}

registerComponent("dxGantt", Gantt);
module.exports = Gantt;
