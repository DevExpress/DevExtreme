import $ from "../../core/renderer";
import Widget from "../widget/ui.widget";
import Drawer from "../drawer";
import registerComponent from "../../core/component_registrator";
import { extend } from "../../core/utils/extend";
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
    _bindDiagramData() {
        if(this._updateDiagramLockCount || !this._isBindingMode()) return;

        const { DiagramCommand } = getDiagram();
        const data = {
            nodeDataSource: this._nodes,
            edgeDataSource: this._edges,
            nodeMapping: {
                idField: this.option("nodes.idExpr"),
                textField: this.option("nodes.textExpr"),
                typeField: this.option("nodes.typeExpr")
            },
            edgeMapping: {
                idField: this.option("edges.idExpr"),
                fromField: this.option("edges.fromExpr"),
                toField: this.option("edges.toExpr")
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
            /**
            * @name dxDiagramOptions.nodes.dataSource
            * @type Array<Object>|DataSource|DataSourceOptions
            * @default null
            */
            /**
            * @name dxDiagramOptions.nodes.idExpr
            * @type string
            * @default undefined
            */
            /**
            * @name dxDiagramOptions.nodes.textExpr
            * @type string
            * @default undefined
            */
            /**
            * @name dxDiagramOptions.nodes.typeExpr
            * @type string
            * @default undefined
            */
            /**
            * @name dxDiagramOptions.edges
            * @type Object
            * @default null
            */
            /**
            * @name dxDiagramOptions.edges.dataSource
            * @type Array<Object>|DataSource|DataSourceOptions
            * @default null
            */
            /**
            * @name dxDiagramOptions.edges.idExpr
            * @type string
            * @default undefined
            */
            /**
            * @name dxDiagramOptions.edges.fromExpr
            * @type string
            * @default undefined
            */
            /**
            * @name dxDiagramOptions.edges.toExpr
            * @type string
            * @default undefined
            */

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
