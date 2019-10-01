import $ from "../../core/renderer";
import Widget from "../widget/ui.widget";
import Drawer from "../drawer";
import registerComponent from "../../core/component_registrator";
import { extend } from "../../core/utils/extend";
import typeUtils from '../../core/utils/type';
import dataCoreUtils from '../../core/utils/data';
import DiagramToolbar from "./ui.diagram.toolbar";
import DiagramLeftPanel from "./ui.diagram.leftpanel";
import DiagramRightPanel from "./ui.diagram.rightpanel";
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

const DIAGRAM_KEY_FIELD = "id";
const DIAGRAM_TEXT_FIELD = "text";
const DIAGRAM_TYPE_FIELD = "type";
const DIAGRAM_PARENT_KEY_FIELD = "parentId";
const DIAGRAM_ITEMS_FIELD = "items";
const DIAGRAM_FROM_FIELD = "from";
const DIAGRAM_TO_FIELD = "to";

class Diagram extends Widget {
    _init() {
        this._updateDiagramLockCount = 0;

        super._init();
        this._initDiagram();
    }
    _initMarkup() {
        super._initMarkup();
        const isServerSide = !hasWindow();
        this.$element().addClass(DIAGRAM_CLASS);

        this._renderToolbar();

        const $contentWrapper = $("<div>")
            .addClass(DIAGRAM_CONTENT_WRAPPER_CLASS)
            .appendTo(this.$element());

        this._renderLeftPanel($contentWrapper);

        const $drawerWrapper = $("<div>")
            .addClass(DIAGRAM_DRAWER_WRAPPER_CLASS)
            .appendTo($contentWrapper);

        const $drawer = $("<div>")
            .appendTo($drawerWrapper);

        const $content = $("<div>")
            .addClass(DIAGRAM_CONTENT_CLASS)
            .appendTo($drawer);

        this._renderRightPanel($drawer);

        this._renderContextMenu($content);

        !isServerSide && this._diagramInstance.createDocument($content[0]);
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
    _renderLeftPanel($parent) {
        const isServerSide = !hasWindow();

        const $leftPanel = $("<div>")
            .appendTo($parent);

        this._leftPanel = this._createComponent($leftPanel, DiagramLeftPanel, {
            dataSources: this._getDataSources(),
            customShapes: this._getCustomShapes(),
            onShapeCategoryRendered: (e) => !isServerSide && this._diagramInstance.createToolbox(e.$element[0], 40, 8, {}, e.category),
            onDataToolboxRendered: (e) => !isServerSide && this._diagramInstance.createDataSourceToolbox(e.key, e.$element[0])
        });
    }
    _invalidateLeftPanel() {
        if(this._leftPanel) {
            this._leftPanel.option({
                dataSources: this._getDataSources(),
                customShapes: this._getCustomShapes(),
            });
        }
    }

    _renderRightPanel($parent) {
        const drawer = this._createComponent($parent, Drawer, {
            closeOnOutsideClick: true,
            openedStateMode: "overlap",
            position: "right",
            template: ($options) => {
                this._createComponent($options, DiagramRightPanel, {
                    onContentReady: (e) => this._diagramInstance.barManager.registerBar(e.component.bar)
                });
            }
        });

        this._toolbarInstance.option("onWidgetCommand", (e) => {
            if(e.name === "options") {
                drawer.toggle();
            }
        });
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
        this._diagramInstance.onToolboxDragStart = this._raiseToolboxDragStart.bind(this);
        this._diagramInstance.onToolboxDragEnd = this._raiseToolboxDragEnd.bind(this);

        this._updateCustomShapes(this._getCustomShapes());
        this._refreshDataSources();
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

    _getDataSources() {
        return this.option("dataSources") || {};
    }
    _createDiagramDataSource(parameters) {
        const key = parameters.key || "0";
        const title = parameters.title || "Data Source";
        const nodes = parameters.nodes || {};
        const edges = parameters.edges || {};

        const data = {
            key, title,
            nodeDataSource: nodes.dataSource,
            edgeDataSource: edges.dataSource,
            nodeDataImporter: {
                getKey: this._createGetter(nodes.keyExpr || DIAGRAM_KEY_FIELD),
                setKey: this._createSetter(nodes.keyExpr || DIAGRAM_KEY_FIELD),
                getText: this._createGetter(nodes.textExpr || DIAGRAM_TEXT_FIELD),
                setText: this._createSetter(nodes.textExpr || DIAGRAM_TEXT_FIELD),
                getType: this._createGetter(nodes.typeExpr || DIAGRAM_TYPE_FIELD),
                setType: this._createSetter(nodes.typeExpr || DIAGRAM_TYPE_FIELD),

                getParentKey: this._createGetter(nodes.parentKeyExpr || DIAGRAM_PARENT_KEY_FIELD),
                setParentKey: this._createSetter(nodes.parentKeyExpr || DIAGRAM_PARENT_KEY_FIELD),
                getItems: this._createGetter(nodes.itemsExpr || DIAGRAM_ITEMS_FIELD),
                setItems: this._createSetter(nodes.itemsExpr || DIAGRAM_ITEMS_FIELD)
            },
            edgeDataImporter: {
                getKey: this._createGetter(edges.keyExpr || DIAGRAM_KEY_FIELD),
                setKey: this._createSetter(edges.keyExpr || DIAGRAM_KEY_FIELD),
                getFrom: this._createGetter(edges.fromExpr || DIAGRAM_FROM_FIELD),
                setFrom: this._createSetter(edges.fromExpr || DIAGRAM_FROM_FIELD),
                getTo: this._createGetter(edges.toExpr || DIAGRAM_TO_FIELD),
                setTo: this._createSetter(edges.toExpr || DIAGRAM_TO_FIELD)
            },
            layoutType: this._getDataSourceLayoutType(parameters.layout)
        };
        const { DiagramCommand } = getDiagram();
        this._diagramInstance.commandManager.getCommand(DiagramCommand.ImportDataSource).execute(data);

        var dataSources = this._getDataSources();
        dataSources[key] = data;
        this.option("dataSources", dataSources);
    }
    _getDataSourceLayoutType(layout) {
        const { DataLayoutType } = getDiagram();
        switch(layout) {
            case "tree":
                return DataLayoutType.Tree;
            case "sugiyama":
                return DataLayoutType.Sugiyama;
        }
    }
    _deleteDiagramDataSource(key) {
        var dataSources = this._getDataSources();
        if(dataSources[key]) {
            const { DiagramCommand } = getDiagram();
            this._diagramInstance.commandManager.getCommand(DiagramCommand.CloseDataSource).execute(key);

            delete dataSources[key];
            this.option("dataSources", dataSources);
        }
    }

    _nodesDataSourceChanged(nodes) {
        this._nodes = nodes;
        this._bindDiagramData();
    }
    _edgesDataSourceChanged(edges) {
        this._edges = edges;
        this._bindDiagramData();
    }
    _createGetter(expr) {
        return dataCoreUtils.compileGetter(expr);
    }
    _createSetter(expr) {
        if(typeUtils.isFunction(expr)) {
            return expr;
        }
        return dataCoreUtils.compileSetter(expr);
    }
    _createOptionGetter(optionName) {
        var expr = this.option(optionName);
        return this._createGetter(expr);
    }
    _createOptionSetter(optionName) {
        var expr = this.option(optionName);
        return this._createSetter(expr);
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
            layoutType: this._getDataBindingLayoutType()
        };
        this._diagramInstance.commandManager.getCommand(DiagramCommand.BindDocument).execute(data);
    }
    _getDataBindingLayoutType() {
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

    _getCustomShapes() {
        return this.option("customShapes") || [];
    }
    _updateCustomShapes(customShapes, prevCustomShapes) {
        if(Array.isArray(prevCustomShapes)) {
            this._diagramInstance.removeCustomShapes(customShapes.map(
                function(s) {
                    return s.id;
                }
            ));
        }

        if(Array.isArray(customShapes)) {
            this._diagramInstance.addCustomShapes(customShapes.map(
                function(s) {
                    return {
                        id: s.id,
                        title: s.title,
                        svgUrl: s.svgUrl,
                        defaultWidth: s.defaultWidth,
                        defaultHeight: s.defaultHeight,
                        allowHasText: s.allowHasText,
                    };
                }
            ));
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
    * @publicName setData(data, keepExistingItems)
    * @param1 data:string
    * @param2 keepExistingItems:boolean
    */
    setData(data, keepExistingItems) {
        this._setDiagramData(data, keepExistingItems);
        this._raiseDataChangeAction();
    }

    /**
     * @name DiagramDataSourceParameters
     * @type object
     */
    /**
    * @name DiagramDataSourceParameters.key
    * @type string
    * @default null
    */
    /**
    * @name DiagramDataSourceParameters.title
    * @type string
    * @default null
    */
    /**
    * @name DiagramDataSourceParameters.nodes
    * @type object
    * @default null
    */
    /**
    * @name DiagramDataSourceParameters.nodes.dataSource
    * @type Array<Object>|DataSource|DataSourceOptions
    * @default null
    */
    /**
    * @name DiagramDataSourceParameters.nodes.keyExpr
    * @type string|function(data)
    * @type_function_param1 data:object
    * @default "id"
    */
    /**
    * @name DiagramDataSourceParameters.nodes.textExpr
    * @type string|function(data)
    * @type_function_param1 data:object
    * @default "text"
    */
    /**
    * @name DiagramDataSourceParameters.nodes.typeExpr
    * @type string|function(data)
    * @type_function_param1 data:object
    * @default "type"
    */
    /**
    * @name DiagramDataSourceParameters.nodes.parentKeyExpr
    * @type string|function(data)
    * @type_function_param1 data:object
    * @default "parentId"
    */
    /**
    * @name DiagramDataSourceParameters.nodes.itemsExpr
    * @type string|function(data)
    * @type_function_param1 data:object
    * @default "items"
    */
    /**
    * @name DiagramDataSourceParameters.edges
    * @type Object
    * @default null
    */
    /**
    * @name DiagramDataSourceParameters.edges.dataSource
    * @type Array<Object>|DataSource|DataSourceOptions
    * @default null
    */
    /**
    * @name DiagramDataSourceParameters.edges.keyExpr
    * @type string|function(data)
    * @type_function_param1 data:object
    * @default "id"
    */
    /**
    * @name DiagramDataSourceParameters.edges.fromExpr
    * @type string|function(data)
    * @type_function_param1 data:object
    * @default "from"
    */
    /**
    * @name DiagramDataSourceParameters.edges.toExpr
    * @type string|function(data)
    * @type_function_param1 data:object
    * @default "to"
    */
    /**
     * @name DiagramDataSourceParameters.layout
     * @type Enums.DiagramAutoLayout
     * @default undefined
     */
    /**
    * @name dxDiagramMethods.createDataSource
    * @publicName createDataSource(parameters)
    * @param1 parameters:DiagramDataSourceParameters
    */
    createDataSource(parameters) {
        this._createDiagramDataSource(parameters);
    }
    /**
    * @name dxDiagramMethods.deleteDataSource
    * @publicName deleteDataSource(key)
    * @param1 key:string
    */
    deleteDataSource(key) {
        this._deleteDiagramDataSource(key);
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
                keyExpr: DIAGRAM_KEY_FIELD,
                /**
                * @name dxDiagramOptions.nodes.textExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default "text"
                */
                textExpr: DIAGRAM_TEXT_FIELD,
                /**
                * @name dxDiagramOptions.nodes.typeExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default "type"
                */
                typeExpr: DIAGRAM_TYPE_FIELD,
                /**
                * @name dxDiagramOptions.nodes.parentKeyExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default "parentId"
                */
                parentKeyExpr: DIAGRAM_PARENT_KEY_FIELD,
                /**
                * @name dxDiagramOptions.nodes.itemsExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default "items"
                */
                itemsExpr: DIAGRAM_ITEMS_FIELD
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
                keyExpr: DIAGRAM_KEY_FIELD,
                /**
                * @name dxDiagramOptions.edges.fromExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default "from"
                */
                fromExpr: DIAGRAM_FROM_FIELD,
                /**
                * @name dxDiagramOptions.edges.toExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default "to"
                */
                toExpr: DIAGRAM_TO_FIELD
            },
            /**
             * @name dxDiagramOptions.layout
             * @type Enums.DiagramAutoLayout
             * @default "tree"
             */
            layout: "tree",

            /**
            * @name dxDiagramOptions.customShapes
            * @type Array<DiagramCustomShapeItem>
            * @default null
            */
            customShapes: [],
            /**
            * @name DiagramCustomShapeItem
            * @type object
            */
            /**
            * @name DiagramCustomShapeItem.id
            * @type Number
            */
            /**
            * @name DiagramCustomShapeItem.title
            * @type String
            */
            /**
            * @name DiagramCustomShapeItem.svgUrl
            * @type String
            */
            /**
            * @name DiagramCustomShapeItem.defaultWidth
            * @type Number
            */
            /**
            * @name DiagramCustomShapeItem.defaultHeight
            * @type Number
            */
            /**
            * @name DiagramCustomShapeItem.allowHasText
            * @type Boolean
            */

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
    _raiseToolboxDragStart() {
        if(this._leftPanel) {
            this._leftPanel.$element().addClass("dx-skip-gesture-event");
        }
    }
    _raiseToolboxDragEnd() {
        if(this._leftPanel) {
            this._leftPanel.$element().removeClass("dx-skip-gesture-event");
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
            case "customShapes":
                this._updateCustomShapes(args.value, args.previousValue);
                this._invalidateLeftPanel();
                break;
            case "onDataChanged":
                this._createDataChangeAction();
                break;
            case "dataSources":
                this._invalidateLeftPanel();
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
