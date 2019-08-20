import $ from "../../core/renderer";
import Widget from "../widget/ui.widget";
import registerComponent from "../../core/component_registrator";
import dataCoreUtils from '../../core/utils/data';
import eventsEngine from "../../events/core/events_engine";
import { addNamespace } from "../../events/utils";
import { GanttView } from "./ui.gantt.view";
import dxTreeList from "../tree_list";
import { extend } from "../../core/utils/extend";
import { getWindow, hasWindow } from "../../core/utils/window";
import DataOption from "./ui.gantt.data.option";

const GANTT_CLASS = "dx-gantt";
const GANTT_VIEW_CLASS = "dx-gantt-view";
const GANTT_COLLAPSABLE_ROW = "dx-gantt-collapsable-row";
const GANTT_TREE_LIST_WRAPPER = "dx-gantt-treelist-wrapper";

import SplitterControl from "../splitter";

const GANTT_DEFAULT_ROW_HEIGHT = 34;

const GANTT_MODULE_NAMESPACE = "dxGanttResizing";
const GANTT_WINDOW_RESIZE_EVENT_NAME = addNamespace("resize", GANTT_MODULE_NAMESPACE);

class Gantt extends Widget {
    _init() {
        super._init();
        this._refreshDataSource("tasks");
        this._refreshDataSource("dependencies");
        this._refreshDataSource("resources");
        this._refreshDataSource("resourceAssignments");
    }

    _initMarkup() {
        super._initMarkup();
        this.$element().addClass(GANTT_CLASS);

        this._$treeListWrapper = $("<div>")
            .addClass(GANTT_TREE_LIST_WRAPPER)
            .appendTo(this.$element());
        this._$treeList = $("<div>")
            .appendTo(this._$treeListWrapper);
        this._$ganttView = $("<div>")
            .addClass(GANTT_VIEW_CLASS)
            .appendTo(this.$element());

        const leftElement = this._$treeListWrapper;
        const rightElement = this._$ganttView;
        const splitter = this._createComponent("<div>", SplitterControl, {
            container: this.$element(),
            leftElement: leftElement,
            rightElement: rightElement,
            onSplitterChanged: this._onSplitterChanged.bind(this)
        });
        splitter.$element().appendTo(leftElement);
        this._splitter = splitter;
    }

    _render() {
        this._renderTreeList();
        this._detachEventHandlers();
        this._attachEventHandlers();
    }
    _renderTreeList() {
        this._$treeListWrapper.width(this.option("treeListWidth"));
        this._$treeList.width(this.option("treeListWidth"));

        this._treeList = this._createComponent(this._$treeList, dxTreeList, {
            dataSource: this._tasks,
            columns: this.option("columns"),
            columnResizingMode: "widget",
            height: "100%",
            selection: { mode: this._getSelectionMode(this.option("allowSelection")) },
            sorting: { mode: "none" },
            scrolling: { showScrollbar: "onHover", mode: "standard" },
            allowColumnResizing: true,
            autoExpandAll: true,
            showRowLines: true,
            onContentReady: (e) => { this._onTreeListContentReady(e); },
            onSelectionChanged: (e) => { this._onTreeListSelectionChanged(e); },
            onRowCollapsed: (e) => this._ganttView.changeTaskExpanded(e.key, false),
            onRowExpanded: (e) => this._ganttView.changeTaskExpanded(e.key, true),
            onRowPrepared: (e) => { this._onTreeListRowPrepared(e); }
        });
    }

    _detachEventHandlers() {
        eventsEngine.off(getWindow(), GANTT_WINDOW_RESIZE_EVENT_NAME);
    }
    _attachEventHandlers() {
        eventsEngine.on(getWindow(), GANTT_WINDOW_RESIZE_EVENT_NAME, this._windowResizeHandler.bind(this));
    }

    _initGanttView() {
        if(this._ganttView) {
            return;
        }
        this._ganttView = this._createComponent(this._$ganttView, GanttView, {
            height: this._treeList._$element.get(0).offsetHeight,
            rowHeight: this._getTreeListRowHeight(),
            tasks: this._tasks,
            dependencies: this._dependencies,
            resources: this._resources,
            resourceAssignments: this._resourceAssignments,
            allowSelection: this.option("allowSelection"),
            showResources: this.option("showResources"),
            taskTitlePosition: this.option("taskTitlePosition"),
            onSelectionChanged: this._onGanttViewSelectionChanged.bind(this),
            onScroll: this._onGanttViewScroll.bind(this)
        });
    }

    _windowResizeHandler() {
        this._updateWidth(this.option("treeListWidth"));
    }

    _onSplitterChanged(newTreeListWidth) {
        this.option("treeListWidth", newTreeListWidth.actionValue);
    }

    _onTreeListContentReady(e) {
        if(e.component.getDataSource()) {
            this._initGanttView();
            this._initScrollSync(e.component);
        }
    }
    _onTreeListRowPrepared(e) {
        if(e.rowType === "data" && e.node.children.length > 0) {
            $(e.rowElement).addClass(GANTT_COLLAPSABLE_ROW);
        }
    }
    _onTreeListSelectionChanged(e) {
        const selectedRowKey = e.currentSelectedRowKeys[0];
        this._ganttView.selectTask(selectedRowKey);
        this.option("selectedRowKey", selectedRowKey);
        this._raiseSelectionChangedAction(selectedRowKey);
    }
    _onGanttViewSelectionChanged(e) {
        this._setTreeListOption("selectedRowKeys", [e.id]);
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
        const ganttViewTaskAreaContainer = this._ganttView.getTaskAreaContainer();
        if(ganttViewTaskAreaContainer.scrollTop !== treeListScrollView.component.scrollTop()) {
            ganttViewTaskAreaContainer.scrollTop = treeListScrollView.component.scrollTop();
        }
    }

    _initScrollSync(treeList) {
        const treeListScrollable = treeList.getScrollable();
        if(treeListScrollable) {
            treeListScrollable.off("scroll");
            treeListScrollable.on("scroll", (e) => { this._onTreeListScroll(e); });
        }
    }
    _getTreeListRowHeight() {
        const $row = this._treeList._$element.find(".dx-row-lines");
        return $row ? $row.last().outerHeight() : GANTT_DEFAULT_ROW_HEIGHT;
    }

    _updateWidth(treeListWidth) {
        if(!hasWindow()) {
            return;
        }
        let newGanttViewWidth = this._splitter.computeRightPanelWidth(treeListWidth);
        this._$treeList.width(treeListWidth);
        this._$treeListWrapper.width(treeListWidth);
        this._ganttView && this._ganttView.setWidth(newGanttViewWidth);
    }

    _setGanttViewOption(optionName, value) {
        this._ganttView && this._ganttView.option(optionName, value);
    }
    _setTreeListOption(optionName, value) {
        this._treeList && this._treeList.option(optionName, value);
    }

    _refreshDataSource(name) {
        let dataOption = this[`_${name}Option`];
        if(dataOption) {
            dataOption._disposeDataSource();
            delete this[`_${name}Option`];
            delete this[`_${name}`];
        }
        if(this.option(`${name}.dataSource`)) {
            dataOption = new DataOption(name, (name, data) => { this._dataSourceChanged(name, data); });
            dataOption.option("dataSource", this.option(`${name}.dataSource`));
            dataOption._refreshDataSource();
            this[`_${name}Option`] = dataOption;
        }
    }
    _compileGettersByOption(optionName) {
        const getters = {};
        const optionValue = this.option(optionName);
        for(let field in optionValue) {
            const exprMatches = field.match(/(\w*)Expr/);
            if(exprMatches) {
                getters[exprMatches[1]] = dataCoreUtils.compileGetter(optionValue[exprMatches[0]]);
            }
        }
        return getters;
    }
    _prepareMapHandler(getters) {
        return (data) => {
            return Object.keys(getters)
                .reduce((previous, key) => {
                    const resultKey = key === "key" ? "id" : key;
                    previous[resultKey] = getters[key](data);
                    return previous;
                }, {});
        };
    }
    _dataSourceChanged(dataSourceName, data) {
        const getters = this._compileGettersByOption(dataSourceName);
        const mappedData = data.map(this._prepareMapHandler(getters));

        this[`_${dataSourceName}`] = mappedData;
        this._setGanttViewOption(dataSourceName, mappedData);
        if(dataSourceName === "tasks") {
            this._setTreeListOption("dataSource", mappedData);
        }
    }

    _createSelectionChangedAction() {
        this._selectionChangedAction = this._createActionByOption("onSelectionChanged");
    }
    _raiseSelectionChangedAction(selectedRowKey) {
        if(!this._selectionChangedAction) {
            this._createSelectionChangedAction();
        }
        this._selectionChangedAction({ selectedRowKey: selectedRowKey });
    }
    _getSelectionMode(allowSelection) {
        return allowSelection ? "single" : "none";
    }

    _clean() {
        delete this._ganttView;
        this._detachEventHandlers();
        super._clean();
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
                keyExpr: "id",
                /**
                * @name dxGanttOptions.tasks.parentIdExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default "parentId"
                */
                parentIdExpr: "parentId",
                /**
                * @name dxGanttOptions.tasks.startExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default "start"
                */
                startExpr: "start",
                /**
                * @name dxGanttOptions.tasks.endExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default "end"
                */
                endExpr: "end",
                /**
                * @name dxGanttOptions.tasks.progressExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default "progress"
                */
                progressExpr: "progress",
                /**
                * @name dxGanttOptions.tasks.titleExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default "title"
                */
                titleExpr: "title"
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
                keyExpr: "id",
                /**
                * @name dxGanttOptions.dependencies.predecessorIdExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default "predecessorId"
                */
                predecessorIdExpr: "predecessorId",
                /**
                * @name dxGanttOptions.dependencies.successorIdExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default "successorId"
                */
                successorIdExpr: "successorId",
                /**
                * @name dxGanttOptions.dependencies.typeExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default "type"
                */
                typeExpr: "type"
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
                keyExpr: "id",
                /**
                * @name dxGanttOptions.resources.textExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default "text"
                */
                textExpr: "text"
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
                keyExpr: "id",
                /**
                * @name dxGanttOptions.resourceAssignments.taskIdExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default "taskId"
                */
                taskIdExpr: "taskId",
                /**
                * @name dxGanttOptions.resourceAssignments.resourceIdExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default "resourceId"
                */
                resourceIdExpr: "resourceId"
            },
            /**
            * @name dxGanttOptions.treeListWidth
            * @type number
            * @default 300
            */
            treeListWidth: 300,
            /**
            * @name dxGanttOptions.showResources
            * @type boolean
            * @default true
            */
            showResources: true,
            /**
            * @name dxGanttOptions.taskTitlePosition
            * @type Enums.GanttTaskTitlePosition
            * @default "inside"
            */
            taskTitlePosition: "inside",
            /**
            * @name dxGanttOptions.selectedRowKey
            * @type any
            * @default undefined
            */
            selectedRowKey: undefined,
            /**
            * @name dxGanttOptions.onSelectionChanged
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 selectedRowKey:any
            * @action
            */
            onSelectionChanged: null,
            /**
            * @name dxGanttOptions.allowSelection
            * @type boolean
            * @default true
            */
            allowSelection: true,
        });
    }

    _optionChanged(args) {
        switch(args.name) {
            case "tasks":
                this._refreshDataSource("tasks");
                break;
            case "dependencies":
                this._refreshDataSource("dependencies");
                break;
            case "resources":
                this._refreshDataSource("resources");
                break;
            case "resourceAssignments":
                this._refreshDataSource("resourceAssignments");
                break;
            case "treeListWidth":
                this._updateWidth(args.value);
                break;
            case "showResources":
                this._setGanttViewOption("showResources", args.value);
                break;
            case "taskTitlePosition":
                this._setGanttViewOption("taskTitlePosition", args.value);
                break;
            case "selectedRowKey":
                this._setTreeListOption("selectedRowKeys", [args.value]);
                break;
            case "onSelectionChanged":
                this._createSelectionChangedAction();
                break;
            case "allowSelection":
                this._setTreeListOption("selection.mode", this._getSelectionMode(args.value));
                this._setGanttViewOption("allowSelection", args.value);
                break;
            default:
                super._optionChanged(args);
        }
    }
}

registerComponent("dxGantt", Gantt);
module.exports = Gantt;
