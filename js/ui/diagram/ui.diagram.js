import $ from '../../core/renderer';
import Widget from '../widget/ui.widget';
import LoadIndicator from '../load_indicator';
import registerComponent from '../../core/component_registrator';
import { extend } from '../../core/utils/extend';
import typeUtils from '../../core/utils/type';
import dataCoreUtils from '../../core/utils/data';
import positionUtils from '../../animation/position';
import resizeCallbacks from '../../core/utils/resize_callbacks';
import { getDiagram } from './diagram.importer';
import { hasWindow, getWindow } from '../../core/utils/window';
import domUtils from '../../core/utils/dom';
import eventsEngine from '../../events/core/events_engine';
import * as eventUtils from '../../events/utils';
import messageLocalization from '../../localization/message';
import numberLocalization from '../../localization/number';
import * as zIndexPool from '../overlay/z_index';
import Overlay from '../overlay/ui.overlay';

import DiagramToolbar from './ui.diagram.toolbar';
import DiagramMainToolbar from './ui.diagram.main_toolbar';
import DiagramHistoryToolbar from './ui.diagram.history_toolbar';
import DiagramViewToolbar from './ui.diagram.view_toolbar';
import DiagramPropertiesPanelToolbar from './ui.diagram.properties_panel_toolbar';
import DiagramContextMenu from './ui.diagram.context_menu';
import DiagramContextToolbox from './ui.diagram.context_toolbox';
import DiagramDialog from './ui.diagram.dialogs';
import DiagramToolboxManager from './diagram.toolbox_manager';
import DiagramToolbox from './ui.diagram.toolbox';
import DiagramPropertiesPanel from './ui.diagram.properties_panel';
import DiagramOptionsUpdateBar from './diagram.options_update';
import DiagramDialogManager from './ui.diagram.dialog_manager';
import DiagramCommandsManager from './diagram.commands_manager';
import NodesOption from './diagram.nodes_option';
import EdgesOption from './diagram.edges_option';

const DIAGRAM_CLASS = 'dx-diagram';
const DIAGRAM_FULLSCREEN_CLASS = 'dx-diagram-fullscreen';
const DIAGRAM_TOOLBAR_WRAPPER_CLASS = DIAGRAM_CLASS + '-toolbar-wrapper';
const DIAGRAM_CONTENT_WRAPPER_CLASS = DIAGRAM_CLASS + '-content-wrapper';
const DIAGRAM_CONTENT_CLASS = DIAGRAM_CLASS + '-content';
const DIAGRAM_FLOATING_TOOLBAR_CONTAINER_CLASS = DIAGRAM_CLASS + '-floating-toolbar-container';
const DIAGRAM_PROPERTIES_PANEL_TOOLBAR_CONTAINER_CLASS = DIAGRAM_CLASS + '-properties-panel-toolbar-container';
const DIAGRAM_LOADING_INDICATOR_CLASS = DIAGRAM_CLASS + '-loading-indicator';
const DIAGRAM_FLOATING_PANEL_OFFSET = 12;

const DIAGRAM_DEFAULT_UNIT = 'in';
const DIAGRAM_DEFAULT_ZOOMLEVEL = 1;
const DIAGRAM_DEFAULT_AUTOZOOM_MODE = 'disabled';
const DIAGRAM_DEFAULT_PAGE_ORIENTATION = 'portrait';
const DIAGRAM_DEFAULT_PAGE_COLOR = 'white';

const DIAGRAM_MAX_MOBILE_WINDOW_WIDTH = 576;
const DIAGRAM_TOOLBOX_ITEM_SPACING = 12;
const DIAGRAM_TOOLBOX_ITEM_COUNT_IN_ROW = 3;
const DIAGRAM_CONTEXT_TOOLBOX_ITEM_COUNT_IN_ROW = 4;

const DIAGRAM_NAMESPACE = 'dxDiagramEvent';
const FULLSCREEN_CHANGE_EVENT_NAME = eventUtils.addNamespace('fullscreenchange', DIAGRAM_NAMESPACE);
const IE_FULLSCREEN_CHANGE_EVENT_NAME = eventUtils.addNamespace('msfullscreenchange', DIAGRAM_NAMESPACE);
const WEBKIT_FULLSCREEN_CHANGE_EVENT_NAME = eventUtils.addNamespace('webkitfullscreenchange', DIAGRAM_NAMESPACE);
const MOZ_FULLSCREEN_CHANGE_EVENT_NAME = eventUtils.addNamespace('mozfullscreenchange', DIAGRAM_NAMESPACE);

class Diagram extends Widget {
    _init() {
        this._updateDiagramLockCount = 0;
        this._browserResizeTimer = -1;

        super._init();
        this._initDiagram();

        this._createCustomCommandExecuted();

        this.optionsUpdateBar = new DiagramOptionsUpdateBar(this);
    }
    _initMarkup() {
        super._initMarkup();
        const isServerSide = !hasWindow();
        this.$element().addClass(DIAGRAM_CLASS);

        delete this._mainToolbar;
        if(this.option('mainToolbar.visible')) {
            this._renderMainToolbar();
        }

        const $contentWrapper = $('<div>')
            .addClass(DIAGRAM_CONTENT_WRAPPER_CLASS)
            .appendTo(this.$element());

        delete this._historyToolbar;
        delete this._historyToolbarResizeCallback;
        if(this._isHistoryToolbarVisible()) {
            this._renderHistoryToolbar($contentWrapper);
        }

        delete this._viewToolbar;
        delete this._viewToolbarResizeCallback;
        if(this.option('viewToolbar.visible')) {
            this._renderViewToolbar($contentWrapper);
        }

        delete this._toolbox;
        delete this._toolboxResizeCallback;
        if(this._isToolboxEnabled()) {
            this._renderToolbox($contentWrapper);
        }

        delete this._propertiesPanel;
        delete this._propertiesPanelResizeCallback;
        delete this._propertiesPanelToolbar;
        delete this._propertiesPanelToolbarResizeCallback;
        if(this._isPropertiesPanelEnabled()) {
            this._renderPropertiesPanelToolbar($contentWrapper);
            this._renderPropertiesPanel($contentWrapper);
        }

        this._content = $('<div>')
            .addClass(DIAGRAM_CONTENT_CLASS)
            .appendTo($contentWrapper);

        delete this._contextMenu;
        if(this.option('contextMenu.enabled')) {
            this._renderContextMenu(this._content);
        }

        delete this._contextToolbox;
        if(this.option('contextToolbox.enabled')) {
            this._renderContextToolbox(this._content);
        }

        this._renderDialog(this._content);

        !isServerSide && this._diagramInstance.createDocument(this._content[0]);

        if(this.option('zoomLevel') !== DIAGRAM_DEFAULT_ZOOMLEVEL) {
            this._updateZoomLevelState();
        }
        if(this.option('autoZoomMode') !== DIAGRAM_DEFAULT_AUTOZOOM_MODE) {
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

        if(hasWindow()) {
            resizeCallbacks.add(() => {
                this._killBrowserResizeTimer();
                this._browserResizeTimer = setTimeout(() => this._processBrowserResize(), 100);
            });
        }
    }
    _processBrowserResize() {
        this._isMobileScreenSize = undefined;

        this._historyToolbarResizeCallback.call(this);
        this._propertiesPanelToolbarResizeCallback.call(this);
        this._propertiesPanelResizeCallback.call(this);
        this._viewToolbarResizeCallback.call(this);
        this._toolboxResizeCallback.call(this);

        this._killBrowserResizeTimer();
    }
    _killBrowserResizeTimer() {
        if(this._browserResizeTimer > -1) {
            clearTimeout(this._browserResizeTimer);
        }
        this._browserResizeTimer = -1;
    }
    isMobileScreenSize() {
        if(this._isMobileScreenSize !== undefined) {
            return this._isMobileScreenSize;
        }
        return (this._isMobileScreenSize = hasWindow() && getWindow().innerWidth < DIAGRAM_MAX_MOBILE_WINDOW_WIDTH);
    }
    notifyBarCommandExecuted() {
        this._diagramInstance.captureFocus();
    }
    _registerBar(component) {
        component.bar.onChanged.add(this);
        this._diagramInstance.barManager.registerBar(component.bar);
    }
    _getExcludeCommands() {
        const excludeCommands = [];
        if(!this._isToolboxEnabled()) {
            excludeCommands.push(DiagramCommandsManager.SHOW_TOOLBOX_COMMAND_NAME);
        }
        if(!this._isPropertiesPanelEnabled()) {
            excludeCommands.push(DiagramCommandsManager.SHOW_PROPERTIES_PANEL_COMMAND_NAME);
        }
        return excludeCommands;
    }
    _getToolbarBaseOptions() {
        return {
            onContentReady: ({ component }) => this._registerBar(component),
            onSubMenuVisibilityChanging: ({ component }) => this._diagramInstance.barManager.updateBarItemsState(component.bar),
            onPointerUp: this._onPanelPointerUp.bind(this),
            export: this.option('export'),
            excludeCommands: this._getExcludeCommands(),
            onCustomCommandExecuted: this._onCustomCommandExecuted.bind(this)
        };
    }
    _onCustomCommandExecuted(e) {
        switch(e.command) {
            case DiagramCommandsManager.SHOW_TOOLBOX_COMMAND_NAME:
                if(this._toolbox) {
                    this._toolbox.toggle();
                }
                break;
            case DiagramCommandsManager.SHOW_PROPERTIES_PANEL_COMMAND_NAME:
                if(this._propertiesPanel) {
                    this._propertiesPanel.toggle();
                }
                break;
            default:
                this._customCommandExecutedAction({ name: e.command });
        }
    }
    _renderMainToolbar() {
        const $toolbarWrapper = $('<div>')
            .addClass(DIAGRAM_TOOLBAR_WRAPPER_CLASS)
            .appendTo(this.$element());
        this._mainToolbar = this._createComponent($toolbarWrapper, DiagramMainToolbar,
            extend(this._getToolbarBaseOptions(), {
                commands: this.option('mainToolbar.commands')
            })
        );
    }
    _isHistoryToolbarVisible() {
        return this.option('historyToolbar.visible') && !this.option('readOnly') && !this.option('disabled');
    }
    _renderHistoryToolbar($parent) {
        const isServerSide = !hasWindow();
        const $container = $('<div>')
            .addClass(DIAGRAM_FLOATING_TOOLBAR_CONTAINER_CLASS)
            .appendTo($parent);
        this._historyToolbar = this._createComponent($container, DiagramHistoryToolbar,
            extend(this._getToolbarBaseOptions(), {
                commands: this.option('historyToolbar.commands'),
                isMobileView: this.isMobileScreenSize(),
                isToolboxVisible: this._isToolboxVisible(),
                needAdjustSize: true
            })
        );
        this._updateHistoryToolbarPosition($container, $parent, isServerSide);
        this._historyToolbarResizeCallback = () => {
            this._historyToolbar.option('isMobileView', this.isMobileScreenSize());
        };
    }
    _updateHistoryToolbarPosition($container, $parent, isServerSide) {
        if(isServerSide) return;

        positionUtils.setup($container, {
            my: 'left top',
            at: 'left top',
            of: $parent,
            offset: DIAGRAM_FLOATING_PANEL_OFFSET + ' ' + DIAGRAM_FLOATING_PANEL_OFFSET
        });
    }
    _isToolboxEnabled() {
        return this.option('toolbox.visibility') !== 'disabled' && !this.option('readOnly') && !this.option('disabled');
    }
    _isToolboxVisible() {
        return this.option('toolbox.visibility') === 'visible' || (this.option('toolbox.visibility') === 'auto' && !this.isMobileScreenSize());
    }
    _renderToolbox($parent) {
        const isServerSide = !hasWindow();
        const $toolBox = $('<div>')
            .appendTo($parent);
        const bounds = this._getToolboxBounds($parent, isServerSide);
        this._toolbox = this._createComponent($toolBox, DiagramToolbox, {
            isMobileView: this.isMobileScreenSize(),
            isVisible: this._isToolboxVisible(),
            height: bounds.height,
            offsetParent: $parent,
            offsetX: bounds.offsetX,
            offsetY: bounds.offsetY,
            toolboxGroups: this._getToolboxGroups(),
            onShapeCategoryRendered: (e) => {
                if(isServerSide) return;

                this._diagramInstance.createToolbox(e.$element[0],
                    e.displayMode === 'texts', e.shapes || e.category,
                    {
                        shapeIconSpacing: DIAGRAM_TOOLBOX_ITEM_SPACING,
                        shapeIconCountInRow: DIAGRAM_TOOLBOX_ITEM_COUNT_IN_ROW,
                        shapeIconAttributes: { 'data-toggle': e.dataToggle }
                    }
                );
            },
            onFilterChanged: (e) => {
                if(isServerSide) return;

                this._diagramInstance.applyToolboxFilter(e.text, e.filteringToolboxes);
            },
            onVisibilityChanging: (e) => {
                if(isServerSide) return;

                if(this._propertiesPanel) {
                    if(e.visible && this.isMobileScreenSize()) {
                        this._propertiesPanel.hide();
                    }
                }

                if(this._historyToolbar) {
                    if(e.visible && this.isMobileScreenSize()) {
                        this._historyToolbarZIndex = zIndexPool.create(Overlay.baseZIndex());
                        this._historyToolbar.$element().css('zIndex', this._historyToolbarZIndex);
                        this._historyToolbar.$element().css('boxShadow', 'none');
                    }
                }
            },
            onVisibilityChanged: (e) => {
                if(isServerSide) return;

                if(this._viewToolbar) {
                    this._viewToolbar.setCommandChecked(DiagramCommandsManager.SHOW_TOOLBOX_COMMAND_NAME, e.visible);
                }
                if(this._historyToolbar) {
                    this._historyToolbar.option('isToolboxVisible', e.visible);

                    if(!e.visible && this.isMobileScreenSize() && this._historyToolbarZIndex) {
                        zIndexPool.remove(this._historyToolbarZIndex);
                        this._historyToolbar.$element().css('zIndex', '');
                        this._historyToolbar.$element().css('boxShadow', '');
                        this._historyToolbarZIndex = undefined;
                    }
                }
            },
            onPointerUp: this._onPanelPointerUp.bind(this)
        });
        this._toolboxResizeCallback = () => {
            const bounds = this._getToolboxBounds($parent, isServerSide);
            this._toolbox.option('height', bounds.height);
            const prevIsMobileView = this._toolbox.option('isMobileView');
            if(prevIsMobileView !== this.isMobileScreenSize()) {
                if(this._toolbox) {
                    this._toolbox.option({
                        isMobileView: this.isMobileScreenSize(),
                        isVisible: this._isToolboxVisible()
                    });
                }
                if(this._historyToolbar) {
                    this._historyToolbar.option('isToolboxVisible', this._isToolboxVisible());
                }
            }
        };
    }
    _getToolboxBounds($parent, isServerSide) {
        const result = {
            offsetX: DIAGRAM_FLOATING_PANEL_OFFSET,
            offsetY: DIAGRAM_FLOATING_PANEL_OFFSET,
            height: !isServerSide ? $parent.height() - 2 * DIAGRAM_FLOATING_PANEL_OFFSET : 0
        };
        if(this._historyToolbar && !isServerSide) {
            result.offsetY += this._historyToolbar.$element().height() + DIAGRAM_FLOATING_PANEL_OFFSET;
            result.height -= this._historyToolbar.$element().height() + DIAGRAM_FLOATING_PANEL_OFFSET;
        }
        if(this._viewToolbar && !isServerSide) {
            result.height -= this._viewToolbar.$element().height() + DIAGRAM_FLOATING_PANEL_OFFSET;
        }
        return result;
    }
    _renderViewToolbar($parent) {
        const isServerSide = !hasWindow();
        const $container = $('<div>')
            .addClass(DIAGRAM_FLOATING_TOOLBAR_CONTAINER_CLASS)
            .appendTo($parent);
        this._viewToolbar = this._createComponent($container, DiagramViewToolbar,
            extend(this._getToolbarBaseOptions(), {
                commands: this.option('viewToolbar.commands'),
                needAdjustSize: true
            })
        );
        this._updateViewToolbarPosition($container, $parent, isServerSide);
        this._viewToolbarResizeCallback = () => {
            this._updateViewToolbarPosition($container, $parent, isServerSide);
        };
    }
    _updateViewToolbarPosition($container, $parent, isServerSide) {
        if(isServerSide) return;

        positionUtils.setup($container, {
            my: 'left bottom',
            at: 'left bottom',
            of: $parent,
            offset: DIAGRAM_FLOATING_PANEL_OFFSET + ' -' + DIAGRAM_FLOATING_PANEL_OFFSET
        });
    }
    _isPropertiesPanelEnabled() {
        return this.option('propertiesPanel.visibility') !== 'disabled' && !this.option('readOnly') && !this.option('disabled');
    }
    _isPropertiesPanelVisible() {
        return this.option('propertiesPanel.visibility') === 'visible';
    }
    _renderPropertiesPanelToolbar($parent) {
        const isServerSide = !hasWindow();
        const $container = $('<div>')
            .addClass(DIAGRAM_FLOATING_TOOLBAR_CONTAINER_CLASS)
            .addClass(DIAGRAM_PROPERTIES_PANEL_TOOLBAR_CONTAINER_CLASS)
            .appendTo($parent);
        this._propertiesPanelToolbar = this._createComponent($container, DiagramPropertiesPanelToolbar,
            extend(this._getToolbarBaseOptions(), {
                buttonStylingMode: 'contained',
                buttonType: 'default',
                isPropertiesPanelVisible: this._isPropertiesPanelVisible(),
                needAdjustSize: true
            })
        );
        this._updatePropertiesPanelToolbarPosition($container, $parent, isServerSide);
        this._propertiesPanelToolbarResizeCallback = () => {
            this._updatePropertiesPanelToolbarPosition($container, $parent, isServerSide);
        };
    }
    _updatePropertiesPanelToolbarPosition($container, $parent, isServerSide) {
        if(isServerSide) return;

        positionUtils.setup($container, {
            my: 'right bottom',
            at: 'right bottom',
            of: $parent,
            offset: '-' + DIAGRAM_FLOATING_PANEL_OFFSET + ' -' + DIAGRAM_FLOATING_PANEL_OFFSET
        });
    }
    _renderPropertiesPanel($parent) {
        const isServerSide = !hasWindow();
        const $propertiesPanel = $('<div>')
            .appendTo($parent);

        const offsetX = DIAGRAM_FLOATING_PANEL_OFFSET;
        const offsetY = 2 * DIAGRAM_FLOATING_PANEL_OFFSET + (!isServerSide ? this._propertiesPanelToolbar.$element().height() : 0);
        this._propertiesPanel = this._createComponent($propertiesPanel, DiagramPropertiesPanel, {
            isMobileView: this.isMobileScreenSize(),
            isVisible: this._isPropertiesPanelVisible(),
            offsetParent: $parent,
            offsetX,
            offsetY,
            propertyTabs: this.option('propertiesPanel.tabs'),
            onCreateToolbar: (e) => {
                e.toolbar = this._createComponent(e.$parent, DiagramToolbar,
                    extend(this._getToolbarBaseOptions(), {
                        commands: e.commands,
                        locateInMenu: 'never',
                        editorStylingMode: 'outlined'
                    })
                );
            },
            onVisibilityChanging: (e) => {
                this._updatePropertiesPanelGroupBars(e.component);

                if(isServerSide) return;

                if(this._toolbox) {
                    if(e.visible && this.isMobileScreenSize()) {
                        this._toolbox.hide();
                    }
                }
            },
            onVisibilityChanged: (e) => {
                if(isServerSide) return;

                if(this._propertiesPanelToolbar) {
                    this._propertiesPanelToolbar.option('isPropertiesPanelVisible', e.visible);
                }
            },
            onSelectedGroupChanged: ({ component }) => this._updatePropertiesPanelGroupBars(component),
            onPointerUp: this._onPanelPointerUp.bind(this)
        });
        this._propertiesPanelResizeCallback = () => {
            const prevIsMobileView = this._propertiesPanel.option('isMobileView');
            if(prevIsMobileView !== this.isMobileScreenSize()) {
                if(this._propertiesPanel) {
                    this._propertiesPanel.option({
                        isMobileView: this.isMobileScreenSize(),
                        isVisible: this._isPropertiesPanelVisible(),
                    });
                }
                if(this._propertiesPanelToolbar) {
                    this._propertiesPanelToolbar.option('isPropertiesPanelVisible', this._isPropertiesPanelVisible());
                }
            }
        };
    }
    _updatePropertiesPanelGroupBars(component) {
        component.getActiveToolbars().forEach(toolbar => {
            this._diagramInstance.barManager.updateBarItemsState(toolbar.bar);
        });
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
            onVisibilityChanging: ({ component }) => this._diagramInstance.barManager.updateBarItemsState(component.bar),
            onItemClick: (itemData) => { return this._onBeforeCommandExecuted(itemData.command); },
            export: this.option('export'),
            excludeCommands: this._getExcludeCommands(),
            onCustomCommandExecuted: this._onCustomCommandExecuted.bind(this)
        });
    }

    _renderContextToolbox($mainElement) {
        const isServerSide = !hasWindow();
        const category = this.option('contextToolbox.category');
        const displayMode = this.option('contextToolbox.displayMode');
        const shapes = this.option('contextToolbox.shapes');

        const $contextToolbox = $('<div>')
            .appendTo(this.$element());
        this._contextToolbox = this._createComponent($contextToolbox, DiagramContextToolbox, {
            onShown: (e) => {
                if(isServerSide) return;

                const $toolboxContainer = $(e.$element);
                let isTextGroup = displayMode === 'texts';
                if(!shapes && !category && !isTextGroup) {
                    const group = this._getToolboxGroups().filter(function(g) {
                        return g.category === e.category;
                    })[0];
                    if(group) {
                        isTextGroup = group.displayMode === 'texts';
                    }
                }
                this._diagramInstance.createContextToolbox($toolboxContainer[0],
                    isTextGroup, shapes || category || e.category,
                    {
                        shapeIconSpacing: DIAGRAM_TOOLBOX_ITEM_SPACING,
                        shapeIconCountInRow: DIAGRAM_CONTEXT_TOOLBOX_ITEM_COUNT_IN_ROW
                    },
                    (shapeType) => {
                        e.callback(shapeType);
                        this._diagramInstance.captureFocus();
                        e.hide();
                    }
                );
            }
        });
    }

    _onBeforeCommandExecuted(command) {
        const dialogParameters = DiagramDialogManager.getDialogParameters(command);
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
        const $parent = this._content || this.$element();
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
        this._diagramInstance.onShowContextToolbox = this._onShowContextToolbox.bind(this);
        this._diagramInstance.onHideContextToolbox = this._onHideContextToolbox.bind(this);
        this._diagramInstance.onNativeAction.add({
            notifyItemClick: this._raiseItemClickAction.bind(this),
            notifyItemDblClick: this._raiseItemDblClickAction.bind(this),
            notifySelectionChanged: this._raiseSelectionChanged.bind(this)
        });

        this._updateShapeTexts();
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
            this._edgesOption = new EdgesOption(this);
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
        const expr = this.option(optionName);
        return expr && dataCoreUtils.compileGetter(expr);
    }
    _createOptionSetter(optionName) {
        const expr = this.option(optionName);
        if(typeUtils.isFunction(expr)) {
            return expr;
        }
        return expr && dataCoreUtils.compileSetter(expr);
    }
    _bindDiagramData() {
        if(this._updateDiagramLockCount || !this._isBindingMode()) return;

        const { DiagramCommand, ConnectorLineOption, ConnectorLineEnding } = getDiagram();
        let lineOptionGetter;
        let lineOptionSetter;
        let startLineEndingGetter;
        let startLineEndingSetter;
        let endLineEndingGetter;
        let endLineEndingSetter;
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
                    const lineType = lineOptionGetter(obj);
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
                    const lineType = startLineEndingGetter(obj);
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
                    const lineType = endLineEndingGetter(obj);
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
        const layoutParametersOption = this.option('nodes.autoLayout') || 'off';
        const layoutType = layoutParametersOption.type || layoutParametersOption;
        if(layoutType === 'off' || (layoutType === 'auto' && this._hasNodePositionExprs())) {
            return undefined;
        } else {
            const parameters = {};
            switch(layoutType) {
                case 'tree':
                    parameters.type = DataLayoutType.Tree;
                    break;
                default:
                    parameters.type = DataLayoutType.Sugiyama;
                    break;
            }
            switch(layoutParametersOption.orientation) {
                case 'vertical':
                    parameters.orientation = DataLayoutOrientation.Vertical;
                    break;
                case 'horizontal':
                    parameters.orientation = DataLayoutOrientation.Horizontal;
                    break;
            }
            if(this.option('edges.fromPointIndexExpr') || this.option('edges.toPointIndexExpr')) {
                parameters.skipPointIndices = true;
            }
            return parameters;
        }
    }
    _hasNodePositionExprs() {
        return this.option('nodes.topExpr') && this.option('nodes.leftExpr');
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
        return DiagramToolboxManager.getGroups(this.option('toolbox.groups'));
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
                (s) => {
                    const templateOption = s.template || this.option('customShapeTemplate');
                    const template = templateOption && this._getTemplate(templateOption);
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
                        minWidth: s.minWidth,
                        minHeight: s.minHeight,
                        maxWidth: s.maxWidth,
                        maxHeight: s.maxHeight,
                        allowResize: s.allowResize,
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
                        }),
                        createTemplate: template && ((container, item) => {
                            template.render({
                                model: this._nativeItemToDiagramItem(item),
                                container: domUtils.getPublicElement($(container))
                            });
                        }),
                        templateLeft: s.templateLeft,
                        templateTop: s.templateTop,
                        templateWidth: s.templateWidth,
                        templateHeight: s.templateHeight
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
        const window = getWindow();
        if(window.self === window.top || setModeOn === this._inNativeFullscreen()) return;

        if(setModeOn) {
            this._subscribeFullscreenNativeChanged();
        } else {
            this._unsubscribeFullscreenNativeChanged();
        }
        this._setNativeFullscreen(setModeOn);
    }
    _setNativeFullscreen(on) {
        const window = getWindow();
        const document = window.self.document;
        const body = window.self.document.body;
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
        const document = getWindow().document;
        const fullscreenElement = document.fullscreenElement || document.msFullscreenElement || document.webkitFullscreenElement;
        const isInFullscreen = fullscreenElement === document.body || document.webkitIsFullscreen;
        return !!isInFullscreen;
    }
    _subscribeFullscreenNativeChanged() {
        const document = getWindow().document;
        const handler = this._onNativeFullscreenChangeHandler.bind(this);
        eventsEngine.on(document, FULLSCREEN_CHANGE_EVENT_NAME, handler);
        eventsEngine.on(document, IE_FULLSCREEN_CHANGE_EVENT_NAME, handler);
        eventsEngine.on(document, WEBKIT_FULLSCREEN_CHANGE_EVENT_NAME, handler);
        eventsEngine.on(document, MOZ_FULLSCREEN_CHANGE_EVENT_NAME, handler);
    }
    _unsubscribeFullscreenNativeChanged() {
        const document = getWindow().document;
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
        if(this._contextMenu) {
            this._contextMenu._show(x, y, selection);
        }
    }
    _onHideContextMenu() {
        if(this._contextMenu) {
            this._contextMenu._hide();
        }
    }
    _onShowContextToolbox(x, y, side, category, callback) {
        if(this._contextToolbox) {
            this._contextToolbox._show(x, y, side, category, callback);
        }
    }
    _onHideContextToolbox() {
        if(this._contextToolbox) {
            this._contextToolbox._hide();
        }
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
        const readOnly = this.option('readOnly') || this.option('disabled');
        this._executeDiagramCommand(DiagramCommand.ToggleReadOnly, readOnly);
        this._setToolboxVisible(!readOnly);
    }
    _updateZoomLevelState() {
        let zoomLevel = this.option('zoomLevel.value');
        if(!zoomLevel) {
            zoomLevel = this.option('zoomLevel');
        }

        const { DiagramCommand } = getDiagram();
        this._executeDiagramCommand(DiagramCommand.ZoomLevel, zoomLevel);
    }
    _updateZoomLevelItemsState() {
        const zoomLevelItems = this.option('zoomLevel.items');
        if(!Array.isArray(zoomLevelItems)) return;

        const { DiagramCommand } = getDiagram();
        this._executeDiagramCommand(DiagramCommand.ZoomLevelItems, zoomLevelItems);
    }
    _updateAutoZoomState() {
        const { DiagramCommand } = getDiagram();
        this._executeDiagramCommand(DiagramCommand.SwitchAutoZoom, this._getAutoZoomValue(this.option('autoZoomMode')));
    }
    _updateSimpleViewState() {
        const { DiagramCommand } = getDiagram();
        this._executeDiagramCommand(DiagramCommand.ToggleSimpleView, this.option('simpleView'));
    }
    _updateFullscreenState() {
        const { DiagramCommand } = getDiagram();
        const fullScreen = this.option('fullScreen');
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
        let gridSize = this.option('gridSize.value');
        if(!gridSize) {
            gridSize = this.option('gridSize');
        }

        const { DiagramCommand } = getDiagram();
        this._executeDiagramCommand(DiagramCommand.GridSize, gridSize);
    }
    _updateGridSizeItemsState() {
        const gridSizeItems = this.option('gridSize.items');
        if(!Array.isArray(gridSizeItems)) return;

        const { DiagramCommand } = getDiagram();
        this._executeDiagramCommand(DiagramCommand.GridSizeItems, gridSizeItems);
    }
    _updateUnitItems() {
        const { DiagramLocalizationService } = getDiagram();
        const items = this._getUnitItems();
        if(this._unitItems !== items) {
            this._unitItems = items;
            DiagramLocalizationService.unitItems = items;
        }
    }
    _getUnitItems() {
        const { DiagramUnit } = getDiagram();
        const items = {};
        items[DiagramUnit.In] = messageLocalization.format('dxDiagram-unitIn');
        items[DiagramUnit.Cm] = messageLocalization.format('dxDiagram-unitCm');
        items[DiagramUnit.Px] = messageLocalization.format('dxDiagram-unitPx');
        return items;
    }
    _updateFormatUnitsMethod() {
        const { DiagramLocalizationService } = getDiagram();
        DiagramLocalizationService.formatUnit = function(value) {
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
        const pageSize = this.option('pageSize');
        if(!pageSize || !pageSize.width || !pageSize.height) return;

        const { DiagramCommand } = getDiagram();
        this._executeDiagramCommand(DiagramCommand.PageSize, pageSize);
    }
    _updatePageSizeItemsState() {
        const pageSizeItems = this.option('pageSize.items');
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
    _updateShapeTexts() {
        const { DiagramLocalizationService } = getDiagram();
        const texts = this._getShapeTexts();
        if(this._shapeTexts !== texts) {
            this._shapeTexts = texts;
            DiagramLocalizationService.shapeTexts = texts;
        }
    }
    _getShapeTexts() {
        const { ShapeTypes } = getDiagram();
        const texts = {};
        // Standard
        texts[ShapeTypes.Text] = messageLocalization.format('dxDiagram-shapeText');
        texts[ShapeTypes.Rectangle] = messageLocalization.format('dxDiagram-shapeRectangle');
        texts[ShapeTypes.Ellipse] = messageLocalization.format('dxDiagram-shapeEllipse');
        texts[ShapeTypes.Cross] = messageLocalization.format('dxDiagram-shapeCross');
        texts[ShapeTypes.Triangle] = messageLocalization.format('dxDiagram-shapeTriangle');
        texts[ShapeTypes.Diamond] = messageLocalization.format('dxDiagram-shapeDiamond');
        texts[ShapeTypes.Heart] = messageLocalization.format('dxDiagram-shapeHeart');
        texts[ShapeTypes.Pentagon] = messageLocalization.format('dxDiagram-shapePentagon');
        texts[ShapeTypes.Hexagon] = messageLocalization.format('dxDiagram-shapeHexagon');
        texts[ShapeTypes.Octagon] = messageLocalization.format('dxDiagram-shapeOctagon');
        texts[ShapeTypes.Star] = messageLocalization.format('dxDiagram-shapeStar');
        texts[ShapeTypes.ArrowLeft] = messageLocalization.format('dxDiagram-shapeArrowLeft');
        texts[ShapeTypes.ArrowUp] = messageLocalization.format('dxDiagram-shapeArrowUp');
        texts[ShapeTypes.ArrowRight] = messageLocalization.format('dxDiagram-shapeArrowRight');
        texts[ShapeTypes.ArrowDown] = messageLocalization.format('dxDiagram-shapeArrowDown');
        texts[ShapeTypes.ArrowUpDown] = messageLocalization.format('dxDiagram-shapeArrowUpDown');
        texts[ShapeTypes.ArrowLeftRight] = messageLocalization.format('dxDiagram-shapeArrowLeftRight');
        // Flowchart
        texts[ShapeTypes.Process] = messageLocalization.format('dxDiagram-shapeProcess');
        texts[ShapeTypes.Decision] = messageLocalization.format('dxDiagram-shapeDecision');
        texts[ShapeTypes.Terminator] = messageLocalization.format('dxDiagram-shapeTerminator');
        texts[ShapeTypes.PredefinedProcess] = messageLocalization.format('dxDiagram-shapePredefinedProcess');
        texts[ShapeTypes.Document] = messageLocalization.format('dxDiagram-shapeDocument');
        texts[ShapeTypes.MultipleDocuments] = messageLocalization.format('dxDiagram-shapeMultipleDocuments');
        texts[ShapeTypes.ManualInput] = messageLocalization.format('dxDiagram-shapeManualInput');
        texts[ShapeTypes.Preparation] = messageLocalization.format('dxDiagram-shapePreparation');
        texts[ShapeTypes.Data] = messageLocalization.format('dxDiagram-shapeData');
        texts[ShapeTypes.Database] = messageLocalization.format('dxDiagram-shapeDatabase');
        texts[ShapeTypes.HardDisk] = messageLocalization.format('dxDiagram-shapeHardDisk');
        texts[ShapeTypes.InternalStorage] = messageLocalization.format('dxDiagram-shapeInternalStorage');
        texts[ShapeTypes.PaperTape] = messageLocalization.format('dxDiagram-shapePaperTape');
        texts[ShapeTypes.ManualOperation] = messageLocalization.format('dxDiagram-shapeManualOperation');
        texts[ShapeTypes.Delay] = messageLocalization.format('dxDiagram-shapeDelay');
        texts[ShapeTypes.StoredData] = messageLocalization.format('dxDiagram-shapeStoredData');
        texts[ShapeTypes.Display] = messageLocalization.format('dxDiagram-shapeDisplay');
        texts[ShapeTypes.Merge] = messageLocalization.format('dxDiagram-shapeMerge');
        texts[ShapeTypes.Connector] = messageLocalization.format('dxDiagram-shapeConnector');
        texts[ShapeTypes.Or] = messageLocalization.format('dxDiagram-shapeOr');
        texts[ShapeTypes.SummingJunction] = messageLocalization.format('dxDiagram-shapeSummingJunction');
        // Containers
        texts[ShapeTypes.Container] = messageLocalization.format('dxDiagram-shapeContainerDefaultText');
        texts[ShapeTypes.VerticalContainer] = messageLocalization.format('dxDiagram-shapeVerticalContainer');
        texts[ShapeTypes.HorizontalContainer] = messageLocalization.format('dxDiagram-shapeHorizontalContainer');
        // Shapes with images
        texts[ShapeTypes.Card] = messageLocalization.format('dxDiagram-shapeCardDefaultText');
        texts[ShapeTypes.CardWithImageOnLeft] = messageLocalization.format('dxDiagram-shapeCardWithImageOnLeft');
        texts[ShapeTypes.CardWithImageOnTop] = messageLocalization.format('dxDiagram-shapeCardWithImageOnTop');
        texts[ShapeTypes.CardWithImageOnRight] = messageLocalization.format('dxDiagram-shapeCardWithImageOnRight');
        return texts;
    }

    export() {
        return this._getDiagramData();
    }
    exportTo(format, callback) {
        const command = this._getDiagramExportToCommand(format);
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
            autoZoomMode: DIAGRAM_DEFAULT_AUTOZOOM_MODE,
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
            hasChanges: false,
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
                 * @default "auto"
                 */
                /**
                 * @name dxDiagramOptions.nodes.autoLayout.type
                 * @type Enums.DiagramDataLayoutType
                 */
                /**
                 * @name dxDiagramOptions.nodes.autoLayout.orientation
                 * @type Enums.DiagramDataLayoutOrientation
                 */
                autoLayout: 'auto'
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
                * @name dxDiagramOptions.customShapes.minWidth
                * @type Number
                */
                /**
                * @name dxDiagramOptions.customShapes.minHeight
                * @type Number
                */
                /**
                * @name dxDiagramOptions.customShapes.maxWidth
                * @type Number
                */
                /**
                * @name dxDiagramOptions.customShapes.maxHeight
                * @type Number
                */
                /**
                * @name dxDiagramOptions.customShapes.allowResize
                * @type Boolean
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
                /**
                * @name dxDiagramOptions.customShapes.template
                * @type template|function
                * @type_function_param1 container:dxElement
                * @type_function_param2 data:object
                * @type_function_param2_field1 item:dxDiagramShape
                */
                /**
                * @name dxDiagramOptions.customShapes.templateLeft
                * @type Number
                */
                /**
                * @name dxDiagramOptions.customShapes.templateTop
                * @type Number
                */
                /**
                * @name dxDiagramOptions.customShapes.templateWidth
                * @type Number
                */
                /**
                * @name dxDiagramOptions.customShapes.templateHeight
                * @type Number
                */
            ],
            toolbox: {
                /**
                * @name dxDiagramOptions.toolbox.visibility
                * @type Enums.DiagramPanelVisibility
                * @default true
                */
                visibility: 'auto',
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
            mainToolbar: {
                /**
                * @name dxDiagramOptions.mainToolbar.visible
                * @type boolean
                * @default false
                */
                visible: false,
                /**
                * @name dxDiagramOptions.mainToolbar.commands
                * @type Array<dxDiagramCustomCommand>|Array<Enums.DiagramCommand>
                * @default undefined
                */
            },
            historyToolbar: {
                /**
                * @name dxDiagramOptions.historyToolbar.visible
                * @type boolean
                * @default true
                */
                visible: true,
                /**
                * @name dxDiagramOptions.historyToolbar.commands
                * @type Array<dxDiagramCustomCommand>|Array<Enums.DiagramCommand>
                * @default undefined
                */
            },
            viewToolbar: {
                /**
                * @name dxDiagramOptions.viewToolbar.visible
                * @type boolean
                * @default true
                */
                visible: true,
                /**
                * @name dxDiagramOptions.viewToolbar.commands
                * @type Array<dxDiagramCustomCommand>|Array<Enums.DiagramCommand>
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
                * @type Array<dxDiagramCustomCommand>|Array<Enums.DiagramCommand>
                * @default undefined
                */
            },
            contextToolbox: {
                /**
                * @name dxDiagramOptions.contextToolbox.enabled
                * @type boolean
                * @default true
                */
                enabled: true,
                /**
                * @name dxDiagramOptions.contextToolbox.category
                * @type Enums.DiagramShapeCategory|String
                */
                /**
                * @name dxDiagramOptions.contextToolbox.displayMode
                * @type Enums.DiagramToolboxDisplayMode
                */
                /**
                * @name dxDiagramOptions.contextToolbox.shapes
                * @type Array<Enums.DiagramShapeType>|Array<String>
                */
            },
            propertiesPanel: {
                /**
                * @name dxDiagramOptions.propertiesPanel.visibility
                * @type Enums.DiagramPanelVisibility
                * @default true
                */
                visibility: 'auto',
                /**
                * @name dxDiagramOptions.propertiesPanel.tabs
                * @type Array<Object>
                * @default undefined
                */
                /**
                * @name dxDiagramOptions.propertiesPanel.tabs.title
                * @type string
                */
                /**
                * @name dxDiagramOptions.propertiesPanel.tabs.commands
                * @type Array<dxDiagramCustomCommand>|Array<Enums.DiagramCommand>
                */
                /**
                * @name dxDiagramOptions.propertiesPanel.tabs.groups
                * @type Array<object>
                */
                /**
                * @name dxDiagramOptions.propertiesPanel.tabs.groups.title
                * @type string
                */
                /**
                * @name dxDiagramOptions.propertiesPanel.tabs.groups.commands
                * @type Array<dxDiagramCustomCommand>|Array<Enums.DiagramCommand>
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

    _raiseDataChangeAction() {
        this.option('hasChanges', true);
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
        if(this._toolbox) {
            this._toolbox._raiseToolboxDragStart();

            if(this.isMobileScreenSize()) {
                this._toolbox.hide();
                this._toolboxDragHidden = true;
            }
        }
    }
    _raiseToolboxDragEnd() {
        if(this._toolbox) {
            this._toolbox._raiseToolboxDragEnd();

            if(this._toolboxDragHidden) {
                this._toolbox.show();
                delete this._toolboxDragHidden;
            }
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
    _createCustomCommandExecuted() {
        this._customCommandExecutedAction = this._createActionByOption('onCustomCommandExecuted');
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
            itemType: 'shape',
            text: nativeShape.text,
            type: nativeShape.type
        };
    }
    _nativeConnectorToDiagramConnector(nativeConnector) {
        return {
            dataItem: this._edgesOption && this._edgesOption.findItem(nativeConnector.key),
            itemType: 'connector',
            texts: nativeConnector.texts,
            fromKey: nativeConnector.fromKey,
            toKey: nativeConnector.toKey
        };
    }

    _invalidateContextMenuCommands() {
        if(this._contextMenu) {
            this._contextMenu.option({
                commands: this.option('contextMenu.commands')
            });
        }
    }
    _invalidatePropertiesPanelTabs() {
        if(this._propertiesPanel) {
            this._propertiesPanel.option({
                propertyTabs: this.option('propertiesPanel.tabs')
            });
        }
    }
    _invalidateMainToolbarCommands() {
        if(this._mainToolbar) {
            this._mainToolbar.option({
                commands: this.option('mainToolbar.commands')
            });
        }
    }
    _invalidateHistoryToolbarCommands() {
        if(this._historyToolbar) {
            this._historyToolbar.option({
                commands: this.option('historyToolbar.commands')
            });
        }
    }
    _invalidateViewToolbarCommands() {
        if(this._viewToolbar) {
            this._viewToolbar.option({
                commands: this.option('viewToolbar.commands')
            });
        }
    }
    _invalidateToolboxGroups() {
        if(this._toolbox) {
            this._toolbox.option({
                toolboxGroups: this._getToolboxGroups()
            });
        }
    }
    _setToolboxVisible(visible) {
        if(this._toolbox) {
            this._toolbox.option({
                visible: visible
            });
        }
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
            case 'autoZoomMode':
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
            case 'contextToolbox':
                if(args.fullName === 'contextToolbox.enabled') {
                    this._invalidate();
                }
                break;
            case 'propertiesPanel':
                if(args.name === 'propertiesPanel.tabs') {
                    this._invalidatePropertiesPanelTabs();
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
            case 'mainToolbar':
                if(args.fullName === 'mainToolbar.commands') {
                    this._invalidateMainToolbarCommands();
                } else {
                    this._invalidate();
                }
                break;
            case 'historyToolbar':
                if(args.fullName === 'historyToolbar.commands') {
                    this._invalidateHistoryToolbarCommands();
                } else {
                    this._invalidate();
                }
                break;
            case 'viewToolbar':
                if(args.fullName === 'viewToolbar.commands') {
                    this._invalidateViewToolbarCommands();
                } else {
                    this._invalidate();
                }
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
            case 'onCustomCommandExecuted':
                this._createCustomCommandExecuted();
                break;
            case 'export':
                if(this._mainToolbar) {
                    this._mainToolbar.option('export', args.value);
                }
                break;
            case 'hasChanges':
                break;
            default:
                super._optionChanged(args);
        }
    }
}

registerComponent('dxDiagram', Diagram);
module.exports = Diagram;
