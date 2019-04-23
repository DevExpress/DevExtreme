import $ from "../../core/renderer";
import Widget from "../widget/ui.widget";
import Drawer from "../drawer";
import registerComponent from "../../core/component_registrator";
import { extend } from "../../core/utils/extend";
import typeUtils from '../../core/utils/type';
import dataCoreUtils from '../../core/utils/data';
import DiagramToolbar from "./ui.diagram.toolbar";
import DiagramToolbox from "./ui.diagram.toolbox";
import DiagramOptions from "./ui.diagram.options";
import DiagramContextMenu from "./ui.diagram.contextmenu";
import NodesOption from "./ui.diagram.nodes";
import EdgesOptions from "./ui.diagram.edges";
import { getDiagram } from "./diagram_importer";
import { hasWindow } from "../../core/utils/window";

const DIAGRAM_CLASS = "dx-diagram";
const DIAGRAM_TOOLBAR_WRAPPER_CLASS = DIAGRAM_CLASS + "-toolbar-wrapper";
const DIAGRAM_CONTENT_WRAPPER_CLASS = DIAGRAM_CLASS + "-content-wrapper";
const DIAGRAM_DRAWER_WRAPPER_CLASS = DIAGRAM_CLASS + "-drawer-wrapper";
const DIAGRAM_CONTENT_CLASS = DIAGRAM_CLASS + "-content";

class Diagram extends Widget {
    _init() {
        this._updateDiagramLockCount = 0;

        super._init();
        this._initDiagram();
        this._refreshDataSources();
    }
    _initMarkup() {
        super._initMarkup();
        const isServerSide = !hasWindow();
        this.$element().addClass(DIAGRAM_CLASS);

        this._renderToolbar();

        const $contentWrapper = $("<div>")
            .addClass(DIAGRAM_CONTENT_WRAPPER_CLASS)
            .appendTo(this.$element());

        const $toolbox = $("<div>")
            .appendTo($contentWrapper);

        const $mainElement = this._renderMainElement($contentWrapper);

        this._createComponent($toolbox, DiagramToolbox, {
            onShapeCategoryRendered: (e) => !isServerSide && this._diagramInstance.createToolbox(e.$element[0], 40, 8, {}, e.category)
        });

        this._renderContextMenu($mainElement);

        !isServerSide && this._diagramInstance.createDocument($mainElement[0]);
    }

    _renderToolbar() {
        const $toolbarWrapper = $("<div>")
            .addClass(DIAGRAM_TOOLBAR_WRAPPER_CLASS)
            .appendTo(this.$element());
        this._toolbarInstance = this._createComponent($toolbarWrapper, DiagramToolbar, {
            onContentReady: (e) => this._diagramInstance.barManager.registerBar(e.component.bar),
            export: this.option("export")
        });
    }

    _renderMainElement($parent) {
        const $drawerWrapper = $("<div>")
            .addClass(DIAGRAM_DRAWER_WRAPPER_CLASS)
            .appendTo($parent);

        const $drawer = $("<div>")
            .appendTo($drawerWrapper);

        const $content = $("<div>")
            .addClass(DIAGRAM_CONTENT_CLASS)
            .appendTo($drawer);

        const drawer = this._createComponent($drawer, Drawer, {
            closeOnOutsideClick: true,
            openedStateMode: "overlap",
            position: "right",
            template: ($options) => {
                this._createComponent($options, DiagramOptions, {
                    onContentReady: (e) => this._diagramInstance.barManager.registerBar(e.component.bar)
                });
            }
        });

        this._toolbarInstance.option("onWidgetCommand", (e) => {
            if(e.name === "options") {
                drawer.toggle();
            }
        });

        return $content;
    }

    _renderContextMenu($mainElement) {
        const $contextMenu = $("<div>")
            .appendTo(this.$element());
        this._createComponent($contextMenu, DiagramContextMenu, {
            container: $mainElement,
            onContentReady: ({ component }) => this._diagramInstance.barManager.registerBar(component.bar),
            onVisibleChanged: ({ component }) => this._diagramInstance.barManager.updateBarItemsState(component.bar)
        });
    }

    _initDiagram() {
        const { DiagramControl } = getDiagram();
        this._diagramInstance = new DiagramControl();
        this._diagramInstance.onChanged = this._raiseDataChangeAction.bind(this);
        this._diagramInstance.onEdgeInserted = this._raiseEdgeInsertedAction.bind(this);
        this._diagramInstance.onEdgeUpdated = this._raiseEdgeUpdatedAction.bind(this);
        this._diagramInstance.onEdgeRemoved = this._raiseEdgeRemovedAction.bind(this);
        this._diagramInstance.onNodeInserted = this._raiseNodeInsertedAction.bind(this);
        this._diagramInstance.onNodeUpdated = this._raiseNodeUpdatedAction.bind(this);
        this._diagramInstance.onNodeRemoved = this._raiseNodeRemovedAction.bind(this);
    }
    _refreshDataSources() {
        this._beginUpdateDiagram();
        this._refreshNodesDataSource();
        this._refreshEdgesDataSource();
        this._endUpdateDiagram();
    }
    _refreshNodesDataSource() {
        if(this._nodesOption) {
            this._nodesOption._disposeDataSource();
            delete this._nodesOption;
            delete this._nodes;
        }
        if(this.option("nodes.dataSource")) {
            this._nodesOption = new NodesOption(this);
            this._nodesOption.option("dataSource", this.option("nodes.dataSource"));
            this._nodesOption._refreshDataSource();
        }
    }
    _refreshEdgesDataSource() {
        if(this._edgesOption) {
            this._edgesOption._disposeDataSource();
            delete this._edgesOption;
            delete this._edges;
        }
        if(this.option("edges.dataSource")) {
            this._edgesOption = new EdgesOptions(this);
            this._edgesOption.option("dataSource", this.option("edges.dataSource"));
            this._edgesOption._refreshDataSource();
        }
    }
    _getDiagramData() {
        let value;
        const { DiagramCommand } = getDiagram();
        this._diagramInstance.commandManager.getCommand(DiagramCommand.Export).execute(function(data) { value = data; });
        return value;
    }
    _setDiagramData(data, keepExistingItems) {
        const { DiagramCommand } = getDiagram();
        this._diagramInstance.commandManager.getCommand(DiagramCommand.Import).execute({
            data,
            keepExistingItems
        });
    }
    _nodesDataSourceChanged(nodes) {
        this._nodes = nodes;
        this._bindDiagramData();
    }
    _edgesDataSourceChanged(edges) {
        this._edges = edges;
        this._bindDiagramData();
    }
    _createOptionGetter(optionName) {
        var expr = this.option(optionName);

        return dataCoreUtils.compileGetter(expr);
    }
    _createOptionSetter(optionName) {
        var expr = this.option(optionName);

        if(typeUtils.isFunction(expr)) {
            return expr;
        }

        return dataCoreUtils.compileSetter(expr);
    }
    _bindDiagramData() {
        if(this._updateDiagramLockCount || !this._isBindingMode()) return;

        const { DiagramCommand } = getDiagram();
        const data = {
            nodeDataSource: this._nodes,
            edgeDataSource: this._edges,
            nodeDataImporter: {
                getKey: this._createOptionGetter("nodes.keyExpr"),
                setKey: this._createOptionSetter("nodes.keyExpr"),
                getText: this._createOptionGetter("nodes.textExpr"),
                setText: this._createOptionSetter("nodes.textExpr"),
                getType: this._createOptionGetter("nodes.typeExpr"),
                setType: this._createOptionSetter("nodes.typeExpr"),

                getParentKey: this._createOptionGetter("nodes.parentKeyExpr"),
                getItems: this._createOptionGetter("nodes.itemsExpr")
            },
            edgeDataImporter: {
                getKey: this._createOptionGetter("edges.keyExpr"),
                setKey: this._createOptionSetter("edges.keyExpr"),
                getFrom: this._createOptionGetter("edges.fromExpr"),
                setFrom: this._createOptionSetter("edges.fromExpr"),
                getTo: this._createOptionGetter("edges.toExpr"),
                setTo: this._createOptionSetter("edges.toExpr")
            },
            layoutType: this._getDataLayoutType()
        };
        this._diagramInstance.commandManager.getCommand(DiagramCommand.BindDocument).execute(data);
    }
    _getDataLayoutType() {
        const { DataLayoutType } = getDiagram();
        switch(this.option("layout")) {
            case "sugiyama":
                return DataLayoutType.Sugiyama;
            default:
                return DataLayoutType.Tree;
        }
    }
    _isBindingMode() {
        return this._nodes || this._edges;
    }
    _beginUpdateDiagram() {
        this._updateDiagramLockCount++;
    }
    _endUpdateDiagram() {
        this._updateDiagramLockCount = Math.max(this._updateDiagramLockCount - 1, 0);
        if(!this._updateDiagramLockCount) {
            this._bindDiagramData();
        }
    }

    /**
    * @name dxDiagramMethods.getData
    * @publicName getData()
    * @return string
    */
    getData() {
        return this._getDiagramData();
    }
    /**
    * @name dxDiagramMethods.setData
    * @publicName setData(value)
    * @param1 data:string
    * @param2 keepExistingItems:boolean
    */
    setData(data, keepExistingItems) {
        this._setDiagramData(data, keepExistingItems);
        this._raiseDataChangeAction();
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            /**
            * @name dxDiagramOptions.onDataChanged
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 data:string
            * @action
            */
            onDataChanged: null,
            /**
            * @name dxDiagramOptions.nodes
            * @type Object
            * @default null
            */
            nodes: {
                /**
                * @name dxDiagramOptions.nodes.dataSource
                * @type Array<Object>|DataSource|DataSourceOptions
                * @default null
                */
                dataSource: null,
                /**
                * @name dxDiagramOptions.nodes.keyExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default "id"
                */
                keyExpr: "id",
                /**
                * @name dxDiagramOptions.nodes.textExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default "text"
                */
                textExpr: "text",
                /**
                * @name dxDiagramOptions.nodes.typeExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default "type"
                */
                typeExpr: "type",
                /**
                * @name dxDiagramOptions.nodes.parentKeyExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default "parentId"
                */
                parentKeyExpr: "parentId",
                /**
                * @name dxDiagramOptions.nodes.itemsExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default "items"
                */
                itemsExpr: "items"
            },
            /**
            * @name dxDiagramOptions.edges
            * @type Object
            * @default null
            */
            edges: {
                /**
                * @name dxDiagramOptions.edges.dataSource
                * @type Array<Object>|DataSource|DataSourceOptions
                * @default null
                */
                dataSource: null,
                /**
                * @name dxDiagramOptions.edges.keyExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default "id"
                */
                keyExpr: "id",
                /**
                * @name dxDiagramOptions.edges.fromExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default "from"
                */
                fromExpr: "from",
                /**
                * @name dxDiagramOptions.edges.toExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default "to"
                */
                toExpr: "to"
            },
            /**
             * @name dxDiagramOptions.layout
             * @type Enums.DiagramAutoLayout
             * @default 0
             */
            layout: "tree",

            /**
             * @name dxDiagramOptions.export
             * @type object
             */
            "export": {
                /**
                 * @name dxDiagramOptions.export.fileName
                 * @type string
                 * @default "Diagram"
                 */
                fileName: "Diagram",
                /**
                 * @name dxDiagramOptions.export.proxyUrl
                 * @type string
                 * @default undefined
                 */
                proxyUrl: undefined
            }
        });
    }

    _createDataChangeAction() {
        this._dataChangeAction = this._createActionByOption("onDataChanged");
    }
    _raiseDataChangeAction() {
        if(!this.option("onDataChanged")) return;

        if(!this._dataChangeAction) {
            this._createDataChangeAction();
        }
        this._dataChangeAction({
            data: this.getData()
        });
    }
    _raiseEdgeInsertedAction(data, callback) {
        if(this._edgesOption) {
            this._edgesOption.insert(data, callback);
        }
    }
    _raiseEdgeUpdatedAction(key, data, callback) {
        if(this._edgesOption) {
            this._edgesOption.update(key, data, callback);
        }
    }
    _raiseEdgeRemovedAction(key, callback) {
        if(this._edgesOption) {
            this._edgesOption.remove(key, callback);
        }
    }
    _raiseNodeInsertedAction(data, callback) {
        if(this._nodesOption) {
            this._nodesOption.insert(data, callback);
        }
    }
    _raiseNodeUpdatedAction(key, data, callback) {
        if(this._nodesOption) {
            this._nodesOption.update(key, data, callback);
        }
    }
    _raiseNodeRemovedAction(key, callback) {
        if(this._nodesOption) {
            this._nodesOption.remove(key, callback);
        }
    }


    _optionChanged(args) {
        switch(args.name) {
            case "nodes":
                this._refreshNodesDataSource();
                break;
            case "edges":
                this._refreshEdgesDataSource();
                break;
            case "layout":
                this._refreshDataSources();
                break;
            case "onDataChanged":
                this._createDataChangeAction();
                break;
            case "export":
                this._toolbarInstance.option("export", this.option("export"));
                break;
            default:
                super._optionChanged(args);
        }
    }
}

registerComponent("dxDiagram", Diagram);
module.exports = Diagram;
