import $ from '../../core/renderer';
import Widget from '../widget/ui.widget';
import Drawer from '../drawer';
import LoadIndicator from '../load_indicator';
import registerComponent from '../../core/component_registrator';
import { extend } from '../../core/utils/extend';
import typeUtils from '../../core/utils/type';
import dataCoreUtils from '../../core/utils/data';
import DiagramToolbar from './ui.diagram.toolbar';
import DiagramLeftPanel from './ui.diagram.leftpanel';
import DiagramRightPanel from './ui.diagram.rightpanel';
import DiagramContextMenu from './ui.diagram.contextmenu';
import DiagramDialog from './ui.diagram.dialogs';
import DiagramToolbox from './ui.diagram.toolbox';
import DiagramOptionsUpdateBar from './ui.diagram.optionsupdate';
import NodesOption from './ui.diagram.nodes';
import EdgesOptions from './ui.diagram.edges';
import Tooltip from '../tooltip';
import { getDiagram } from './diagram_importer';
import { hasWindow, getWindow } from '../../core/utils/window';
import eventsEngine from '../../events/core/events_engine';
import eventUtils from '../../events/utils';
import messageLocalization from '../../localization/message';
import numberLocalization from '../../localization/number';
import DiagramDialogManager from './ui.diagram.dialogmanager';

const DIAGRAM_CLASS = 'dx-diagram';
const DIAGRAM_FULLSCREEN_CLASS = 'dx-diagram-fullscreen';
const DIAGRAM_TOOLBAR_WRAPPER_CLASS = DIAGRAM_CLASS + '-toolbar-wrapper';
const DIAGRAM_CONTENT_WRAPPER_CLASS = DIAGRAM_CLASS + '-content-wrapper';
const DIAGRAM_DRAWER_WRAPPER_CLASS = DIAGRAM_CLASS + '-drawer-wrapper';
const DIAGRAM_CONTENT_CLASS = DIAGRAM_CLASS + '-content';
const DIAGRAM_LOADING_INDICATOR_CLASS = DIAGRAM_CLASS + '-loading-indicator';

const DIAGRAM_DEFAULT_UNIT = 'in';
const DIAGRAM_DEFAULT_ZOOMLEVEL = 1;
const DIAGRAM_DEFAULT_AUTOZOOM = 'disabled';
const DIAGRAM_DEFAULT_PAGE_ORIENTATION = 'portrait';
const DIAGRAM_DEFAULT_PAGE_COLOR = 'white';

const DIAGRAM_NAMESPACE = 'dxDiagramEvent';
const FULLSCREEN_CHANGE_EVENT_NAME = eventUtils.addNamespace('fullscreenchange', DIAGRAM_NAMESPACE);
const IE_FULLSCREEN_CHANGE_EVENT_NAME = eventUtils.addNamespace('msfullscreenchange', DIAGRAM_NAMESPACE);
const WEBKIT_FULLSCREEN_CHANGE_EVENT_NAME = eventUtils.addNamespace('webkitfullscreenchange', DIAGRAM_NAMESPACE);
const MOZ_FULLSCREEN_CHANGE_EVENT_NAME = eventUtils.addNamespace('mozfullscreenchange', DIAGRAM_NAMESPACE);

class Diagram extends Widget {
    _init() {
        this._updateDiagramLockCount = 0;

        super._init();
        this._initDiagram();

        this.optionsUpdateBar = new DiagramOptionsUpdateBar(this);
    }
    _initMarkup() {
        super._initMarkup();
        const isServerSide = !hasWindow();
        this.$element().addClass(DIAGRAM_CLASS);

        this._toolbarInstance = undefined;
        if(this.option('toolbar.visible')) {
            this._renderToolbar();
        }

        const $contentWrapper = $('<div>')
            .addClass(DIAGRAM_CONTENT_WRAPPER_CLASS)
            .appendTo(this.$element());

        this._leftPanel = undefined;
        if(this.option('toolbox.visible')) {
            this._renderLeftPanel($contentWrapper);
        }

        const $drawerWrapper = $('<div>')
            .addClass(DIAGRAM_DRAWER_WRAPPER_CLASS)
            .appendTo($contentWrapper);

        if(this.option('propertiesPanel.enabled')) {
            const $drawer = $('<div>')
                .appendTo($drawerWrapper);
            this._content = $('<div>')
                .addClass(DIAGRAM_CONTENT_CLASS)
                .appendTo($drawer);
            this._renderRightPanel($drawer);
        } else {
            this._content = $('<div>')
                .addClass(DIAGRAM_CONTENT_CLASS)
                .appendTo($drawerWrapper);
        }

        this._contextMenu = undefined;
        if(this.option('contextMenu.enabled')) {
            this._renderContextMenu(this._content);
        }

        this._renderDialog(this._content);

        !isServerSide && this._diagramInstance.createDocument(this._content[0]);

        if(this.option('zoomLevel') !== DIAGRAM_DEFAULT_ZOOMLEVEL) {
            this._updateZoomLevelState();
        }
        if(this.option('autoZoom') !== DIAGRAM_DEFAULT_AUTOZOOM) {
            this._updateAutoZoomState();
        }
        if(this.option('simpleView')) {
            this._updateSimpleViewState();
        }
        if(this.option('readOnly') || this.option('disabled')) {
            this._updateReadOnlyState();
        }
        if(this.option('fullScreen')) {
            this._updateFullscreenState();
        }

        this._diagramInstance.barManager.registerBar(this.optionsUpdateBar);
    }
    notifyBarCommandExecuted() {
        this._diagramInstance.captureFocus();
    }
    _registerBar(component) {
        component.bar.onChanged.add(this);
        this._diagramInstance.barManager.registerBar(component.bar);
    }
    _renderToolbar() {
        const $toolbarWrapper = $('<div>')
            .addClass(DIAGRAM_TOOLBAR_WRAPPER_CLASS)
            .appendTo(this.$element());
        var toolbarWidgetCommandNames = [];
        if(this.option('propertiesPanel.enabled') && this.option('propertiesPanel.collapsible')) {
            toolbarWidgetCommandNames.push('options');
        }
        this._toolbarInstance = this._createComponent($toolbarWrapper, DiagramToolbar, {
            commands: this.option('toolbar.commands'),
            onContentReady: (e) => this._registerBar(e.component),
            onPointerUp: this._onPanelPointerUp.bind(this),
            export: this.option('export'),
            widgetCommandNames: toolbarWidgetCommandNames
        });
    }
    _renderLeftPanel($parent) {
        const isServerSide = !hasWindow();

        const $leftPanel = $('<div>')
            .appendTo($parent);

        this._leftPanel = this._createComponent($leftPanel, DiagramLeftPanel, {
            toolboxGroups: this._getToolboxGroups(),
            disabled: this.option('readOnly'),
            onShapeCategoryRendered: (e) => {
                if(isServerSide) return;

                var $toolboxContainer = $(e.$element);
                this._diagramInstance.createToolbox($toolboxContainer[0], 40, 8,
                    { 'data-toggle': 'shape-toolbox-tooltip' },
                    e.shapes || e.category, e.displayMode === 'texts');
                this._createTooltips($parent, $toolboxContainer.find('[data-toggle="shape-toolbox-tooltip"]'));
            },
            onPointerUp: this._onPanelPointerUp.bind(this)
        });
    }
    _createTooltips($container, targets) {
        targets.each((index, element) => {
            var $target = $(element);
            const $tooltip = $('<div>')
                .html($target.attr('title'))
                .appendTo($container);
            this._createComponent($tooltip, Tooltip, {
                target: $target.get(0),
                showEvent: 'mouseenter',
                hideEvent: 'mouseleave',
                position: 'top',
                animation: {
                    show: { type: 'fade', from: 0, to: 1, delay: 500 },
                    hide: { type: 'fade', from: 1, to: 0, delay: 100 }
                }
            });
        });

    }
    _invalidateContextMenuCommands() {
        if(this._contextMenu) {
            this._contextMenu.option({
                commands: this.option('contextMenu.commands')
            });
        }
    }
    _invalidatePropertiesPanelGroups() {
        if(this._rightPanel) {
            this._rightPanel.option({
                propertyGroups: this.option('propertiesPanel.groups')
            });
        }
    }
    _invalidateToolbarCommands() {
        if(this._toolbarInstance) {
            this._toolbarInstance.option({
                commands: this.option('toolbar.commands')
            });
        }
    }
    _invalidateToolboxGroups() {
        if(this._leftPanel) {
            this._leftPanel.option({
                toolboxGroups: this._getToolboxGroups()
            });
        }
    }
    _setLeftPanelEnabled(enabled) {
        if(this._leftPanel) {
            this._leftPanel.option({
                disabled: !enabled
            });
        }
    }

    _renderRightPanel($parent) {
        const isCollapsible = this.option('propertiesPanel.collapsible');
        var drawer = this._createComponent($parent, Drawer, {
            closeOnOutsideClick: isCollapsible,
            opened: !isCollapsible,
            openedStateMode: isCollapsible ? 'overlap' : 'shrink',
            position: 'right',
            template: ($options) => {
                this._rightPanel = this._createComponent($options, DiagramRightPanel, {
                    propertyGroups: this.option('propertiesPanel.groups'),
                    onContentReady: (e) => this._registerBar(e.component),
                    onPointerUp: this._onPanelPointerUp.bind(this)
                });
            }
        });
        if(this._toolbarInstance) {
            this._toolbarInstance.option('onWidgetCommand', (e) => {
                if(e.name === 'options') {
                    drawer.toggle();
                }
            });
        }
    }

    _onPanelPointerUp() {
        this._diagramInstance.captureFocus();
    }

    _renderContextMenu($mainElement) {
        const $contextMenu = $('<div>')
            .appendTo(this.$element());
        this._contextMenu = this._createComponent($contextMenu, DiagramContextMenu, {
            commands: this.option('contextMenu.commands'),
            container: $mainElement,
            onContentReady: ({ component }) => this._registerBar(component),
            onVisibleChanged: ({ component }) => this._diagramInstance.barManager.updateBarItemsState(component.bar),
            onItemClick: (itemData) => { return this._onBeforeCommandExecuted(itemData.command); }
        });
    }

    _onBeforeCommandExecuted(command) {
        var dialogParameters = DiagramDialogManager.getDialogParameters(command);
        if(dialogParameters) {
            this._showDialog(dialogParameters);
        }
        return !!dialogParameters;
    }

    _renderDialog($mainElement) {
        const $dialogElement = $('<div>').appendTo($mainElement);
        this._dialogInstance = this._createComponent($dialogElement, DiagramDialog, { });
    }

    _showDialog(dialogParameters) {
        if(this._dialogInstance) {
            this._dialogInstance.option('onGetContent', dialogParameters.onGetContent);
            this._dialogInstance.option('onHidden', function() { this._diagramInstance.captureFocus(); }.bind(this));
            this._dialogInstance.option('command', this._diagramInstance.commandManager.getCommand(dialogParameters.command));
            this._dialogInstance.option('title', dialogParameters.title);
            this._dialogInstance._show();
        }
    }

    _showLoadingIndicator() {
        this._loadingIndicator = $('<div>').addClass(DIAGRAM_LOADING_INDICATOR_CLASS);
        this._createComponent(this._loadingIndicator, LoadIndicator, {});
        var $parent = this._content || this.$element();
        $parent.append(this._loadingIndicator);
    }
    _hideLoadingIndicator() {
        if(!this._loadingIndicator) return;

        this._loadingIndicator.remove();
        this._loadingIndicator = null;
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
        this._diagramInstance.onToggleFullscreen = this._onToggleFullScreen.bind(this);
        this._diagramInstance.onShowContextMenu = this._onShowContextMenu.bind(this);
        this._diagramInstance.onHideContextMenu = this._onHideContextMenu.bind(this);
        this._diagramInstance.onNativeAction.add({
            notifyItemClick: this._raiseItemClickAction.bind(this),
            notifyItemDblClick: this._raiseItemDblClickAction.bind(this),
            notifySelectionChanged: this._raiseSelectionChanged.bind(this)
        });

        this._updateUnitItems();
        this._updateFormatUnitsMethod();

        if(this.option('units') !== DIAGRAM_DEFAULT_UNIT) {
            this._updateUnitsState();
        }
        if(this.option('pageSize')) {
            if(this.option('pageSize.items')) {
                this._updatePageSizeItemsState();
            }
            if(this.option('pageSize.width') && this.option('pageSize.height')) {
                this._updatePageSizeState();
            }
        }
        if(this.option('pageOrientation') !== DIAGRAM_DEFAULT_PAGE_ORIENTATION) {
            this._updatePageOrientationState();
        }
        if(this.option('pageColor') !== DIAGRAM_DEFAULT_PAGE_COLOR) {
            this._updatePageColorState();
        }
        if(this.option('viewUnits') !== DIAGRAM_DEFAULT_UNIT) {
            this._updateViewUnitsState();
        }
        if(!this.option('showGrid')) {
            this._updateShowGridState();
        }
        if(!this.option('snapToGrid')) {
            this._updateSnapToGridState();
        }
        if(this.option('gridSize')) {
            if(this.option('gridSize.items')) {
                this._updateGridSizeItemsState();
            }
            this._updateGridSizeState();
        }
        if(this.option('zoomLevel.items')) {
            this._updateZoomLevelItemsState();
        }

        this._updateCustomShapes(this._getCustomShapes());
        this._refreshDataSources();
    }
    _dispose() {
        if(this._diagramInstance) {
            this._diagramInstance.dispose();
            this._diagramInstance = undefined;
        }
        super._dispose();
    }
    _executeDiagramCommand(command, parameter) {
        this._diagramInstance.commandManager.getCommand(command).execute(parameter);
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
        }
        if(this.option('nodes.dataSource')) {
            this._nodesOption = new NodesOption(this);
            this._nodesOption.option('dataSource', this.option('nodes.dataSource'));
            this._nodesOption._refreshDataSource();
        }
    }
    _refreshEdgesDataSource() {
        if(this._edgesOption) {
            this._edgesOption._disposeDataSource();
            delete this._edgesOption;
        }
        if(this.option('edges.dataSource')) {
            this._edgesOption = new EdgesOptions(this);
            this._edgesOption.option('dataSource', this.option('edges.dataSource'));
            this._edgesOption._refreshDataSource();
        }
    }
    _getDiagramData() {
        let value;
        const { DiagramCommand } = getDiagram();
        this._executeDiagramCommand(DiagramCommand.Export, function(data) { value = data; });
        return value;
    }
    _setDiagramData(data, keepExistingItems) {
        const { DiagramCommand } = getDiagram();
        this._executeDiagramCommand(DiagramCommand.Import, { data, keepExistingItems });
    }

    _onDataSourceChanged() {
        this._bindDiagramData();
    }
    _createOptionGetter(optionName) {
        var expr = this.option(optionName);
        return expr && dataCoreUtils.compileGetter(expr);
    }
    _createOptionSetter(optionName) {
        var expr = this.option(optionName);
        if(typeUtils.isFunction(expr)) {
            return expr;
        }
        return expr && dataCoreUtils.compileSetter(expr);
    }
    _bindDiagramData() {
        if(this._updateDiagramLockCount || !this._isBindingMode()) return;

        const { DiagramCommand, ConnectorLineOption, ConnectorLineEnding } = getDiagram();
        let lineOptionGetter, lineOptionSetter, startLineEndingGetter, startLineEndingSetter, endLineEndingGetter, endLineEndingSetter;
        const data = {
            nodeDataSource: this._nodesOption && this._nodesOption.getItems(),
            edgeDataSource: this._edgesOption && this._edgesOption.getItems(),
            nodeDataImporter: {
                getKey: this._createOptionGetter('nodes.keyExpr'),
                setKey: this._createOptionSetter('nodes.keyExpr'),

                getLocked: this._createOptionGetter('nodes.lockedExpr'),
                setLocked: this._createOptionSetter('nodes.lockedExpr'),

                getStyle: this._createOptionGetter('nodes.styleExpr'),
                setStyle: this._createOptionSetter('nodes.styleExpr'),
                getStyleText: this._createOptionGetter('nodes.textStyleExpr'),
                setStyleText: this._createOptionSetter('nodes.textStyleExpr'),
                getZIndex: this._createOptionGetter('nodes.zIndexExpr'),
                setZIndex: this._createOptionSetter('nodes.zIndexExpr'),

                getType: this._createOptionGetter('nodes.typeExpr'),
                setType: this._createOptionSetter('nodes.typeExpr'),
                getText: this._createOptionGetter('nodes.textExpr'),
                setText: this._createOptionSetter('nodes.textExpr'),
                getImage: this._createOptionGetter('nodes.imageUrlExpr'),
                setImage: this._createOptionSetter('nodes.imageUrlExpr'),

                getLeft: this._createOptionGetter('nodes.leftExpr'),
                setLeft: this._createOptionSetter('nodes.leftExpr'),
                getTop: this._createOptionGetter('nodes.topExpr'),
                setTop: this._createOptionSetter('nodes.topExpr'),
                getWidth: this._createOptionGetter('nodes.widthExpr'),
                setWidth: this._createOptionSetter('nodes.widthExpr'),
                getHeight: this._createOptionGetter('nodes.heightExpr'),
                setHeight: this._createOptionSetter('nodes.heightExpr'),

                getParentKey: this._createOptionGetter('nodes.parentKeyExpr'),
                setParentKey: this._createOptionSetter('nodes.parentKeyExpr'),
                getItems: this._createOptionGetter('nodes.itemsExpr'),
                setItems: this._createOptionSetter('nodes.itemsExpr'),

                getContainerKey: this._createOptionGetter('nodes.containerKeyExpr'),
                setContainerKey: this._createOptionSetter('nodes.containerKeyExpr'),
                getChildren: this._createOptionGetter('nodes.childrenExpr'),
                setChildren: this._createOptionSetter('nodes.childrenExpr')
            },
            edgeDataImporter: {
                getKey: this._createOptionGetter('edges.keyExpr'),
                setKey: this._createOptionSetter('edges.keyExpr'),

                getLocked: this._createOptionGetter('edges.lockedExpr'),
                setLocked: this._createOptionSetter('edges.lockedExpr'),

                getStyle: this._createOptionGetter('edges.styleExpr'),
                setStyle: this._createOptionSetter('edges.styleExpr'),
                getStyleText: this._createOptionGetter('edges.textStyleExpr'),
                setStyleText: this._createOptionSetter('edges.textStyleExpr'),
                getZIndex: this._createOptionGetter('edges.zIndexExpr'),
                setZIndex: this._createOptionSetter('edges.zIndexExpr'),

                getFrom: this._createOptionGetter('edges.fromExpr'),
                setFrom: this._createOptionSetter('edges.fromExpr'),
                getFromPointIndex: this._createOptionGetter('edges.fromPointIndexExpr'),
                setFromPointIndex: this._createOptionSetter('edges.fromPointIndexExpr'),
                getTo: this._createOptionGetter('edges.toExpr'),
                setTo: this._createOptionSetter('edges.toExpr'),
                getToPointIndex: this._createOptionGetter('edges.toPointIndexExpr'),
                setToPointIndex: this._createOptionSetter('edges.toPointIndexExpr'),
                getPoints: this._createOptionGetter('edges.pointsExpr'),
                setPoints: this._createOptionSetter('edges.pointsExpr'),

                getText: this._createOptionGetter('edges.textExpr'),
                setText: this._createOptionSetter('edges.textExpr'),
                getLineOption: (lineOptionGetter = this._createOptionGetter('edges.lineTypeExpr')) && function(obj) {
                    var lineType = lineOptionGetter(obj);
                    switch(lineType) {
                        case 'straight':
                            return ConnectorLineOption.Straight;
                        default:
                            return ConnectorLineOption.Orthogonal;
                    }
                }.bind(this),
                setLineOption: (lineOptionSetter = this._createOptionSetter('edges.lineTypeExpr')) && function(obj, value) {
                    switch(value) {
                        case ConnectorLineOption.Straight:
                            value = 'straight';
                            break;
                        case ConnectorLineOption.Orthogonal:
                            value = 'orthogonal';
                            break;
                    }
                    lineOptionSetter(obj, value);
                }.bind(this),
                getStartLineEnding: (startLineEndingGetter = this._createOptionGetter('edges.fromLineEndExpr')) && function(obj) {
                    var lineType = startLineEndingGetter(obj);
                    switch(lineType) {
                        case 'arrow':
                            return ConnectorLineEnding.Arrow;
                        default:
                            return ConnectorLineEnding.None;
                    }
                }.bind(this),
                setStartLineEnding: (startLineEndingSetter = this._createOptionSetter('edges.fromLineEndExpr')) && function(obj, value) {
                    switch(value) {
                        case ConnectorLineEnding.Arrow:
                            value = 'arrow';
                            break;
                        case ConnectorLineEnding.None:
                            value = 'none';
                            break;
                    }
                    startLineEndingSetter(obj, value);
                }.bind(this),
                getEndLineEnding: (endLineEndingGetter = this._createOptionGetter('edges.toLineEndExpr')) && function(obj) {
                    var lineType = endLineEndingGetter(obj);
                    switch(lineType) {
                        case 'none':
                            return ConnectorLineEnding.None;
                        default:
                            return ConnectorLineEnding.Arrow;
                    }
                }.bind(this),
                setEndLineEnding: (endLineEndingSetter = this._createOptionSetter('edges.toLineEndExpr')) && function(obj, value) {
                    switch(value) {
                        case ConnectorLineEnding.Arrow:
                            value = 'arrow';
                            break;
                        case ConnectorLineEnding.None:
                            value = 'none';
                            break;
                    }
                    endLineEndingSetter(obj, value);
                }.bind(this)
            },
            layoutParameters: this._getDataBindingLayoutParameters()
        };
        this._executeDiagramCommand(DiagramCommand.BindDocument, data);
    }
    _getDataBindingLayoutParameters() {
        const { DataLayoutType, DataLayoutOrientation } = getDiagram();
        let layoutParametersOption = this.option('nodes.autoLayout');
        if(!layoutParametersOption || layoutParametersOption === 'off' || layoutParametersOption.type === 'off') return undefined;
        let parameters = {};
        let layoutType = layoutParametersOption.type || layoutParametersOption;
        if(layoutType === 'tree') {
            parameters.type = DataLayoutType.Tree;
        } else if(layoutType === 'layered') {
            parameters.type = DataLayoutType.Sugiyama;
        }
        if(layoutParametersOption.orientation === 'vertical') {
            parameters.orientation = DataLayoutOrientation.Vertical;
        } else if(layoutParametersOption.orientation === 'horizontal') {
            parameters.orientation = DataLayoutOrientation.Horizontal;
        }
        return parameters;
    }
    _getAutoZoomValue(option) {
        const { AutoZoomMode } = getDiagram();
        switch(option) {
            case 'fitContent':
                return AutoZoomMode.FitContent;
            case 'fitWidth':
                return AutoZoomMode.FitToWidth;
            default:
                return AutoZoomMode.Disabled;
        }
    }
    _isBindingMode() {
        return (this._nodesOption && this._nodesOption.hasItems()) ||
            (this._edgesOption && this._nodesOption.hasItems());
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
        return this.option('customShapes') || [];
    }
    _getToolboxGroups() {
        return DiagramToolbox.getGroups(this.option('toolbox.groups'));
    }
    _updateCustomShapes(customShapes, prevCustomShapes) {
        if(Array.isArray(prevCustomShapes)) {
            this._diagramInstance.removeCustomShapes(prevCustomShapes.map(
                function(s) {
                    return s.type;
                }
            ));
        }

        if(Array.isArray(customShapes)) {
            this._diagramInstance.addCustomShapes(customShapes.map(
                function(s) {
                    return {
                        category: s.category,
                        type: s.type,
                        baseType: s.baseType,
                        title: s.title,
                        svgUrl: s.backgroundImageUrl,
                        svgLeft: s.backgroundImageLeft,
                        svgTop: s.backgroundImageTop,
                        svgWidth: s.backgroundImageWidth,
                        svgHeight: s.backgroundImageHeight,
                        defaultWidth: s.defaultWidth,
                        defaultHeight: s.defaultHeight,
                        defaultText: s.defaultText,
                        allowEditText: s.allowEditText,
                        textLeft: s.textLeft,
                        textTop: s.textTop,
                        textWidth: s.textWidth,
                        textHeight: s.textHeight,
                        defaultImageUrl: s.defaultImageUrl,
                        allowEditImage: s.allowEditImage,
                        imageLeft: s.imageLeft,
                        imageTop: s.imageTop,
                        imageWidth: s.imageWidth,
                        imageHeight: s.imageHeight,
                        connectionPoints: s.connectionPoints && s.connectionPoints.map(pt => {
                            return { 'x': pt.x, 'y': pt.y };
                        })
                    };
                }
            ));
        }
    }
    _onToggleFullScreen(fullScreen) {
        this._changeNativeFullscreen(fullScreen);
        this.$element().toggleClass(DIAGRAM_FULLSCREEN_CLASS, fullScreen);
        this._diagramInstance.updateLayout();
    }
    _changeNativeFullscreen(setModeOn) {
        let window = getWindow();
        if(window.self === window.top || setModeOn === this._inNativeFullscreen()) return;

        if(setModeOn) {
            this._subscribeFullscreenNativeChanged();
        } else {
            this._unsubscribeFullscreenNativeChanged();
        }
        this._setNativeFullscreen(setModeOn);
    }
    _setNativeFullscreen(on) {
        let window = getWindow(),
            document = window.self.document,
            body = window.self.document.body;
        if(on) {
            if(body.requestFullscreen) {
                body.requestFullscreen();
            } else if(body.mozRequestFullscreen) {
                body.mozRequestFullscreen();
            } else if(body.webkitRequestFullscreen) {
                body.webkitRequestFullscreen();
            } else if(body.msRequestFullscreen) {
                body.msRequestFullscreen();
            }
        } else {
            if(document.exitFullscreen) {
                document.exitFullscreen();
            } else if(document.mozCancelFullscreen) {
                document.mozCancelFullscreen();
            } else if(document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if(document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }
    _inNativeFullscreen() {
        let document = getWindow().document,
            fullscreenElement = document.fullscreenElement || document.msFullscreenElement || document.webkitFullscreenElement,
            isInFullscreen = fullscreenElement === document.body || document.webkitIsFullscreen;
        return !!isInFullscreen;
    }
    _subscribeFullscreenNativeChanged() {
        let document = getWindow().document,
            handler = this._onNativeFullscreenChangeHandler.bind(this);
        eventsEngine.on(document, FULLSCREEN_CHANGE_EVENT_NAME, handler);
        eventsEngine.on(document, IE_FULLSCREEN_CHANGE_EVENT_NAME, handler);
        eventsEngine.on(document, WEBKIT_FULLSCREEN_CHANGE_EVENT_NAME, handler);
        eventsEngine.on(document, MOZ_FULLSCREEN_CHANGE_EVENT_NAME, handler);
    }
    _unsubscribeFullscreenNativeChanged() {
        let document = getWindow().document;
        eventsEngine.off(document, FULLSCREEN_CHANGE_EVENT_NAME);
        eventsEngine.off(document, IE_FULLSCREEN_CHANGE_EVENT_NAME);
        eventsEngine.off(document, WEBKIT_FULLSCREEN_CHANGE_EVENT_NAME);
        eventsEngine.off(document, MOZ_FULLSCREEN_CHANGE_EVENT_NAME);
    }
    _onNativeFullscreenChangeHandler() {
        if(!this._inNativeFullscreen()) {
            this._unsubscribeFullscreenNativeChanged();
            this._onToggleFullScreen(false);
        }
    }
    _onShowContextMenu(x, y, selection) {
        this._contextMenu._show(x, y, selection);
    }
    _onHideContextMenu() {
        this._contextMenu._hide();
    }

    _getDiagramUnitValue(value) {
        const { DiagramUnit } = getDiagram();
        switch(value) {
            case 'in':
                return DiagramUnit.In;
            case 'cm':
                return DiagramUnit.Cm;
            case 'px':
                return DiagramUnit.Px;
            default:
                return DiagramUnit.In;
        }
    }
    _updateReadOnlyState() {
        const { DiagramCommand } = getDiagram();
        var readOnly = this.option('readOnly') || this.option('disabled');
        this._executeDiagramCommand(DiagramCommand.ToggleReadOnly, readOnly);
        this._setLeftPanelEnabled(!readOnly);
    }
    _updateZoomLevelState() {
        var zoomLevel = this.option('zoomLevel.value');
        if(!zoomLevel) {
            zoomLevel = this.option('zoomLevel');
        }

        const { DiagramCommand } = getDiagram();
        this._executeDiagramCommand(DiagramCommand.ZoomLevel, zoomLevel);
    }
    _updateZoomLevelItemsState() {
        var zoomLevelItems = this.option('zoomLevel.items');
        if(!Array.isArray(zoomLevelItems)) return;

        const { DiagramCommand } = getDiagram();
        this._executeDiagramCommand(DiagramCommand.ZoomLevelItems, zoomLevelItems);
    }
    _updateAutoZoomState() {
        const { DiagramCommand } = getDiagram();
        this._executeDiagramCommand(DiagramCommand.SwitchAutoZoom, this._getAutoZoomValue(this.option('autoZoom')));
    }
    _updateSimpleViewState() {
        const { DiagramCommand } = getDiagram();
        this._executeDiagramCommand(DiagramCommand.ToggleSimpleView, this.option('simpleView'));
    }
    _updateFullscreenState() {
        const { DiagramCommand } = getDiagram();
        var fullScreen = this.option('fullScreen');
        this._executeDiagramCommand(DiagramCommand.Fullscreen, fullScreen);
        this._onToggleFullScreen(fullScreen);
    }
    _updateShowGridState() {
        const { DiagramCommand } = getDiagram();
        this._executeDiagramCommand(DiagramCommand.ShowGrid, this.option('showGrid'));
    }
    _updateSnapToGridState() {
        const { DiagramCommand } = getDiagram();
        this._executeDiagramCommand(DiagramCommand.SnapToGrid, this.option('snapToGrid'));
    }
    _updateGridSizeState() {
        var gridSize = this.option('gridSize.value');
        if(!gridSize) {
            gridSize = this.option('gridSize');
        }

        const { DiagramCommand } = getDiagram();
        this._executeDiagramCommand(DiagramCommand.GridSize, gridSize);
    }
    _updateGridSizeItemsState() {
        var gridSizeItems = this.option('gridSize.items');
        if(!Array.isArray(gridSizeItems)) return;

        const { DiagramCommand } = getDiagram();
        this._executeDiagramCommand(DiagramCommand.GridSizeItems, gridSizeItems);
    }
    _updateUnitItems() {
        const { DiagramUnit } = getDiagram();
        var items = {};
        items[DiagramUnit.In] = messageLocalization.format('dxDiagram-unitIn');
        items[DiagramUnit.Cm] = messageLocalization.format('dxDiagram-unitCm');
        items[DiagramUnit.Px] = messageLocalization.format('dxDiagram-unitPx');
        this._diagramInstance.settings.unitItems = items;
    }
    _updateFormatUnitsMethod() {
        this._diagramInstance.settings.formatUnit = function(value) {
            return numberLocalization.format(value);
        };
    }
    _updateViewUnitsState() {
        const { DiagramCommand } = getDiagram();
        this._executeDiagramCommand(DiagramCommand.ViewUnits, this._getDiagramUnitValue(this.option('viewUnits')));
    }
    _updateUnitsState() {
        const { DiagramCommand } = getDiagram();
        this._executeDiagramCommand(DiagramCommand.Units, this._getDiagramUnitValue(this.option('units')));
    }
    _updatePageSizeState() {
        var pageSize = this.option('pageSize');
        if(!pageSize || !pageSize.width || !pageSize.height) return;

        const { DiagramCommand } = getDiagram();
        this._executeDiagramCommand(DiagramCommand.PageSize, pageSize);
    }
    _updatePageSizeItemsState() {
        var pageSizeItems = this.option('pageSize.items');
        if(!Array.isArray(pageSizeItems)) return;

        const { DiagramCommand } = getDiagram();
        this._executeDiagramCommand(DiagramCommand.PageSizeItems, pageSizeItems);
    }
    _updatePageOrientationState() {
        const { DiagramCommand } = getDiagram();
        this._executeDiagramCommand(DiagramCommand.PageLandscape, this.option('pageOrientation') === 'landscape');
    }
    _updatePageColorState() {
        const { DiagramCommand } = getDiagram();
        this._executeDiagramCommand(DiagramCommand.PageColor, this.option('pageColor'));
    }


    export() {
        return this._getDiagramData();
    }
    exportTo(format, callback) {
        var command = this._getDiagramExportToCommand(format);
        this._executeDiagramCommand(command, callback);
    }
    _getDiagramExportToCommand(format) {
        const { DiagramCommand } = getDiagram();
        switch(format) {
            case 'png':
                return DiagramCommand.ExportPng;
            case 'jpg':
                return DiagramCommand.ExportJpg;
            default:
                return DiagramCommand.ExportSvg;
        }
    }
    import(data, updateExistingItemsOnly) {
        this._setDiagramData(data, updateExistingItemsOnly);
        this._raiseDataChangeAction();
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            readOnly: false,
            /**
            * @name dxDiagramOptions.zoomLevel.value
            * @type Number
            * @default undefined
            */
            /**
            * @name dxDiagramOptions.zoomLevel.items
            * @type Array<Number>
            * @default undefined
            */
            zoomLevel: DIAGRAM_DEFAULT_ZOOMLEVEL,
            simpleView: false,
            autoZoom: DIAGRAM_DEFAULT_AUTOZOOM,
            fullScreen: false,
            showGrid: true,
            snapToGrid: true,
            /**
            * @name dxDiagramOptions.gridSize.value
            * @type Number
            */
            /**
            * @name dxDiagramOptions.gridSize.items
            * @type Array<Number>
            */

            units: DIAGRAM_DEFAULT_UNIT,
            viewUnits: DIAGRAM_DEFAULT_UNIT,

            /**
            * @name dxDiagramOptions.pageSize.width
            * @type Number
            */
            /**
            * @name dxDiagramOptions.pageSize.height
            * @type Number
            */
            /**
            * @name dxDiagramOptions.pageSize.items
            * @type Array<Object>
            */
            /**
            * @name dxDiagramOptions.pageSize.items.width
            * @type Number
            */
            /**
            * @name dxDiagramOptions.pageSize.items.height
            * @type Number
            */
            /**
            * @name dxDiagramOptions.pageSize.items.text
            * @type String
            */
            pageOrientation: DIAGRAM_DEFAULT_PAGE_ORIENTATION,
            pageColor: DIAGRAM_DEFAULT_PAGE_COLOR,

            onDataChanged: null,
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
                keyExpr: 'id',
                /**
                * @name dxDiagramOptions.nodes.lockedExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default undefined
                */
                lockedExpr: undefined,
                /**
                * @name dxDiagramOptions.nodes.styleExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default undefined
                */
                styleExpr: undefined,
                /**
                * @name dxDiagramOptions.nodes.textStyleExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default undefined
                */
                textStyleExpr: undefined,
                /**
                * @name dxDiagramOptions.nodes.zIndexExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default undefined
                */
                zIndexExpr: undefined,
                /**
                * @name dxDiagramOptions.nodes.typeExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default "type"
                */
                typeExpr: 'type',
                /**
                * @name dxDiagramOptions.nodes.textExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default "text"
                */
                textExpr: 'text',
                /**
                * @name dxDiagramOptions.nodes.imageUrlExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default undefined
                */
                imageUrlExpr: undefined,
                /**
                * @name dxDiagramOptions.nodes.parentKeyExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default undefined
                */
                parentKeyExpr: undefined,
                /**
                * @name dxDiagramOptions.nodes.itemsExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default undefined
                */
                itemsExpr: undefined,
                /**
                * @name dxDiagramOptions.nodes.leftExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default undefined
                */
                leftExpr: undefined,
                /**
                * @name dxDiagramOptions.nodes.topExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default undefined
                */
                topExpr: undefined,
                /**
                * @name dxDiagramOptions.nodes.widthExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default undefined
                */
                widthExpr: undefined,
                /**
                * @name dxDiagramOptions.nodes.heightExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default undefined
                */
                heightExpr: undefined,
                /**
                * @name dxDiagramOptions.nodes.containerKeyExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default undefined
                */
                containerKeyExpr: undefined,
                /**
                * @name dxDiagramOptions.nodes.childrenExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default "children"
                */
                childrenExpr: 'children',
                /**
                 * @name dxDiagramOptions.nodes.autoLayout
                 * @type Enums.DiagramDataLayoutType|Object
                 * @default "tree"
                 */
                /**
                 * @name dxDiagramOptions.nodes.autoLayout.type
                 * @type Enums.DiagramDataLayoutType
                 */
                /**
                 * @name dxDiagramOptions.nodes.autoLayout.orientation
                 * @type Enums.DiagramDataLayoutOrientation
                 */
                autoLayout: 'tree'
            },
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
                keyExpr: 'id',
                /**
                * @name dxDiagramOptions.edges.lockedExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default undefined
                */
                lockedExpr: undefined,
                /**
                * @name dxDiagramOptions.edges.styleExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default undefined
                */
                styleExpr: undefined,
                /**
                * @name dxDiagramOptions.edges.textStyleExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default undefined
                */
                textStyleExpr: undefined,
                /**
                * @name dxDiagramOptions.edges.zIndexExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default undefined
                */
                zIndexExpr: undefined,
                /**
                * @name dxDiagramOptions.edges.fromExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default "from"
                */
                fromExpr: 'from',
                /**
                * @name dxDiagramOptions.edges.fromPointIndexExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default undefined
                */
                fromPointIndexExpr: undefined,
                /**
                * @name dxDiagramOptions.edges.toExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default "to"
                */
                toExpr: 'to',
                /**
                * @name dxDiagramOptions.edges.toPointIndexExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default undefined
                */
                toPointIndexExpr: undefined,
                /**
                * @name dxDiagramOptions.edges.pointsExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default undefined
                */
                pointsExpr: undefined,
                /**
                * @name dxDiagramOptions.edges.textExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default undefined
                */
                textExpr: undefined,
                /**
                * @name dxDiagramOptions.edges.lineTypeExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default undefined
                */
                lineTypeExpr: undefined,
                /**
                * @name dxDiagramOptions.edges.fromLineEndExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default undefined
                */
                fromLineEndExpr: undefined,
                /**
                * @name dxDiagramOptions.edges.toLineEndExpr
                * @type string|function(data)
                * @type_function_param1 data:object
                * @default undefined
                */
                toLineEndExpr: undefined
            },

            customShapes: [
                /**
                * @name dxDiagramOptions.customShapes.category
                * @type String
                */
                /**
                * @name dxDiagramOptions.customShapes.type
                * @type String
                */
                /**
                * @name dxDiagramOptions.customShapes.baseType
                * @type Enums.DiagramShapeType|String
                */
                /**
                * @name dxDiagramOptions.customShapes.title
                * @type String
                */
                /**
                * @name dxDiagramOptions.customShapes.backgroundImageUrl
                * @type String
                */
                /**
                * @name dxDiagramOptions.customShapes.backgroundImageLeft
                * @type Number
                */
                /**
                * @name dxDiagramOptions.customShapes.backgroundImageTop
                * @type Number
                */
                /**
                * @name dxDiagramOptions.customShapes.backgroundImageWidth
                * @type Number
                */
                /**
                * @name dxDiagramOptions.customShapes.backgroundImageHeight
                * @type Number
                */
                /**
                * @name dxDiagramOptions.customShapes.defaultWidth
                * @type Number
                */
                /**
                * @name dxDiagramOptions.customShapes.defaultHeight
                * @type Number
                */
                /**
                * @name dxDiagramOptions.customShapes.defaultText
                * @type String
                */
                /**
                * @name dxDiagramOptions.customShapes.allowEditText
                * @type Boolean
                */
                /**
                * @name dxDiagramOptions.customShapes.textLeft
                * @type Number
                */
                /**
                * @name dxDiagramOptions.customShapes.textTop
                * @type Number
                */
                /**
                * @name dxDiagramOptions.customShapes.textWidth
                * @type Number
                */
                /**
                * @name dxDiagramOptions.customShapes.textHeight
                * @type Number
                */
                /**
                * @name dxDiagramOptions.customShapes.defaultImageUrl
                * @type String
                */
                /**
                * @name dxDiagramOptions.customShapes.allowEditImage
                * @type Boolean
                */
                /**
                * @name dxDiagramOptions.customShapes.imageLeft
                * @type Number
                */
                /**
                * @name dxDiagramOptions.customShapes.imageTop
                * @type Number
                */
                /**
                * @name dxDiagramOptions.customShapes.imageWidth
                * @type Number
                */
                /**
                * @name dxDiagramOptions.customShapes.imageHeight
                * @type Number
                */
                /**
                * @name dxDiagramOptions.customShapes.connectionPoints
                * @type Array<Object>
                */
                /**
                * @name dxDiagramOptions.customShapes.connectionPoints.x
                * @type Number
                */
                /**
                * @name dxDiagramOptions.customShapes.connectionPoints.y
                * @type Number
                */
            ],
            toolbox: {
                /**
                * @name dxDiagramOptions.toolbox.visible
                * @type boolean
                * @default true
                */
                visible: true,
                /**
                * @name dxDiagramOptions.toolbox.groups
                * @type Array<Object>|Array<Enums.DiagramShapeCategory>
                * @default undefined
                */
                /**
                * @name dxDiagramOptions.toolbox.groups.category
                * @type Enums.DiagramShapeCategory|String
                */
                /**
                * @name dxDiagramOptions.toolbox.groups.title
                * @type String
                */
                /**
                * @name dxDiagramOptions.toolbox.groups.displayMode
                * @type Enums.DiagramToolboxDisplayMode
                */
                /**
                * @name dxDiagramOptions.toolbox.groups.expanded
                * @type Boolean
                */
                /**
                * @name dxDiagramOptions.toolbox.groups.shapes
                * @type Array<Enums.DiagramShapeType>|Array<String>
                */
            },
            toolbar: {
                /**
                * @name dxDiagramOptions.toolbar.visible
                * @type boolean
                * @default true
                */
                visible: true,
                /**
                * @name dxDiagramOptions.toolbar.commands
                * @type Array<Enums.DiagramToolbarCommand>
                * @default undefined
                */
            },
            contextMenu: {
                /**
                * @name dxDiagramOptions.contextMenu.enabled
                * @type boolean
                * @default true
                */
                enabled: true,
                /**
                * @name dxDiagramOptions.contextMenu.commands
                * @type Array<Enums.DiagramContextMenuCommand>
                * @default undefined
                */
            },
            propertiesPanel: {
                /**
                * @name dxDiagramOptions.propertiesPanel.enabled
                * @type Boolean
                * @default true
                */
                enabled: true,
                /**
                * @name dxDiagramOptions.propertiesPanel.collapsible
                * @type Boolean
                * @default true
                */
                collapsible: true,
                /**
                * @name dxDiagramOptions.propertiesPanel.groups
                * @type Array<Object>
                * @default undefined
                */
                /**
                * @name dxDiagramOptions.propertiesPanel.groups.commands
                * @type Array<Enums.DiagramPropertiesPanelCommand>
                */
            },

            export: {
                /**
                 * @name dxDiagramOptions.export.fileName
                 * @type string
                 * @default "Diagram"
                 */
                fileName: 'Diagram',
                /**
                 * @name dxDiagramOptions.export.proxyUrl
                 * @type string
                 * @default undefined
                 * @deprecated
                 */
                proxyUrl: undefined
            },

            onItemClick: null,

            onItemDblClick: null,

            onSelectionChanged: null
        });
    }

    _createDataChangeAction() {
        this._dataChangeAction = this._createActionByOption('onDataChanged');
    }
    _raiseDataChangeAction() {
        if(!this._dataChangeAction) {
            this._createDataChangeAction();
        }
        this._dataChangeAction();
    }
    _raiseEdgeInsertedAction(data, callback, errorCallback) {
        if(this._edgesOption) {
            this._edgesOption.insert(data, callback, errorCallback);
        }
    }
    _raiseEdgeUpdatedAction(key, data, callback, errorCallback) {
        if(this._edgesOption) {
            this._edgesOption.update(key, data, callback, errorCallback);
        }
    }
    _raiseEdgeRemovedAction(key, data, callback, errorCallback) {
        if(this._edgesOption) {
            this._edgesOption.remove(key, data, callback, errorCallback);
        }
    }
    _raiseNodeInsertedAction(data, callback, errorCallback) {
        if(this._nodesOption) {
            this._nodesOption.insert(data, callback, errorCallback);
        }
    }
    _raiseNodeUpdatedAction(key, data, callback, errorCallback) {
        if(this._nodesOption) {
            this._nodesOption.update(key, data, callback, errorCallback);
        }
    }
    _raiseNodeRemovedAction(key, data, callback, errorCallback) {
        if(this._nodesOption) {
            this._nodesOption.remove(key, data, callback, errorCallback);
        }
    }
    _raiseToolboxDragStart() {
        if(this._leftPanel) {
            this._leftPanel.$element().addClass('dx-skip-gesture-event');
        }
    }
    _raiseToolboxDragEnd() {
        if(this._leftPanel) {
            this._leftPanel.$element().removeClass('dx-skip-gesture-event');
        }
    }

    _createItemClickAction() {
        this._itemClickAction = this._createActionByOption('onItemClick');
    }
    _createItemDblClickAction() {
        this._itemDblClickAction = this._createActionByOption('onItemDblClick');
    }
    _createSelectionChangedAction() {
        this._selectionChangedAction = this._createActionByOption('onSelectionChanged');
    }
    _raiseItemClickAction(nativeItem) {
        if(!this._itemClickAction) {
            this._createItemClickAction();
        }
        this._itemClickAction({ item: this._nativeItemToDiagramItem(nativeItem) });
    }
    _raiseItemDblClickAction(nativeItem) {
        if(!this._itemDblClickAction) {
            this._createItemDblClickAction();
        }
        this._itemDblClickAction({ item: this._nativeItemToDiagramItem(nativeItem) });
    }
    _raiseSelectionChanged(nativeItems) {
        if(!this._selectionChangedAction) {
            this._createSelectionChangedAction();
        }
        this._selectionChangedAction({ items: nativeItems.map(this._nativeItemToDiagramItem.bind(this)) });
    }
    _nativeItemToDiagramItem(nativeItem) {
        const { NativeShape } = getDiagram();
        const createMethod = nativeItem instanceof NativeShape ?
            this._nativeShapeToDiagramShape.bind(this) :
            this._nativeConnectorToDiagramConnector.bind(this);
        return extend({
            id: nativeItem.id
        }, createMethod(nativeItem));
    }
    _nativeShapeToDiagramShape(nativeShape) {
        return {
            dataItem: this._nodesOption && this._nodesOption.findItem(nativeShape.key),
            text: nativeShape.text,
            type: nativeShape.type
        };
    }
    _nativeConnectorToDiagramConnector(nativeConnector) {
        return {
            dataItem: this._edgesOption && this._edgesOption.findItem(nativeConnector.key),
            texts: nativeConnector.texts,
            fromKey: nativeConnector.fromKey,
            toKey: nativeConnector.toKey
        };
    }
    _optionChanged(args) {
        if(this.optionsUpdateBar.isUpdateLocked()) return;

        this.optionsUpdateBar.beginUpdate();
        try {
            this._optionChangedCore(args);
        } finally {
            this.optionsUpdateBar.endUpdate();
        }
    }
    _optionChangedCore(args) {
        switch(args.name) {
            case 'readOnly':
            case 'disabled':
                this._updateReadOnlyState();
                break;
            case 'zoomLevel':
                if(args.fullName === 'zoomLevel' || args.fullName === 'zoomLevel.items') {
                    this._updateZoomLevelItemsState();
                }
                if(args.fullName === 'zoomLevel' || args.fullName === 'zoomLevel.value') {
                    this._updateZoomLevelState();
                }
                break;
            case 'autoZoom':
                this._updateAutoZoomState();
                break;
            case 'simpleView':
                this._updateSimpleViewState();
                break;
            case 'fullScreen':
                this._updateFullscreenState();
                break;
            case 'showGrid':
                this._updateShowGridState();
                break;
            case 'snapToGrid':
                this._updateSnapToGridState();
                break;
            case 'gridSize':
                if(args.fullName === 'gridSize' || args.fullName === 'gridSize.items') {
                    this._updateGridSizeItemsState();
                }
                if(args.fullName === 'gridSize' || args.fullName === 'gridSize.value') {
                    this._updateGridSizeState();
                }
                break;
            case 'viewUnits':
                this._updateViewUnitsState();
                break;
            case 'units':
                this._updateUnitsState();
                break;
            case 'pageSize':
                if(args.fullName === 'pageSize' || args.fullName === 'pageSize.items') {
                    this._updatePageSizeItemsState();
                }
                if(args.fullName === 'pageSize' || args.fullName === 'pageSize.width' || args.fullName === 'pageSize.height') {
                    this._updatePageSizeState();
                }
                break;
            case 'pageOrientation':
                this._updatePageOrientationState();
                break;
            case 'pageColor':
                this._updatePageColorState();
                break;
            case 'nodes':
                if(args.fullName === 'nodes.autoLayout') {
                    this._refreshDataSources();
                } else {
                    this._refreshNodesDataSource();
                }
                break;
            case 'edges':
                this._refreshEdgesDataSource();
                break;
            case 'customShapes':
                this._updateCustomShapes(args.value, args.previousValue);
                this._invalidate();
                break;
            case 'contextMenu':
                if(args.fullName === 'contextMenu.commands') {
                    this._invalidateContextMenuCommands();
                } else {
                    this._invalidate();
                }
                break;
            case 'propertiesPanel':
                if(args.name === 'propertiesPanel.groups') {
                    this._invalidatePropertiesPanelGroups();
                } else {
                    this._invalidate();
                }
                break;
            case 'toolbox':
                if(args.fullName === 'toolbox.groups') {
                    this._invalidateToolboxGroups();
                } else {
                    this._invalidate();
                }
                break;
            case 'toolbar':
                if(args.fullName === 'toolbar.commands') {
                    this._invalidateToolbarCommands();
                } else {
                    this._invalidate();
                }
                break;
            case 'onDataChanged':
                this._createDataChangeAction();
                break;
            case 'onItemClick':
                this._createItemClickAction();
                break;
            case 'onItemDblClick':
                this._createItemDblClickAction();
                break;
            case 'onSelectionChanged':
                this._createSelectionChangedAction();
                break;
            case 'export':
                if(this._toolbarInstance) {
                    this._toolbarInstance.option('export', args.value);
                }
                break;
            default:
                super._optionChanged(args);
        }
    }
}

registerComponent('dxDiagram', Diagram);
module.exports = Diagram;
