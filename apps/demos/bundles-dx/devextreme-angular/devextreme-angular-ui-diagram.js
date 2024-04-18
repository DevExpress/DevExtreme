System.register(['@angular/platform-browser', '@angular/core', 'devextreme/ui/diagram', './devextreme-angular-core.js', './devextreme-angular-ui-nested.js', '@angular/common', 'devextreme/core/dom_adapter', 'devextreme/events', 'devextreme/core/utils/common', 'devextreme/core/renderer', 'devextreme/core/http_request', 'devextreme/core/utils/ready_callbacks', 'devextreme/events/core/events_engine', 'devextreme/core/utils/ajax', 'devextreme/core/utils/deferred'], (function (exports) {
    'use strict';
    var i2, i0, PLATFORM_ID, Component, Inject, Input, Output, ContentChildren, NgModule, DxDiagram, DxComponent, DxTemplateHost, WatcherHelper, IterableDifferHelper, NestedOptionHost, DxIntegrationModule, DxTemplateModule, DxiCustomShapeComponent, DxoContextMenuModule, DxiCommandModule, DxiItemModule, DxoContextToolboxModule, DxiCustomShapeModule, DxiConnectionPointModule, DxoDefaultItemPropertiesModule, DxoEdgesModule, DxoEditingModule, DxoExportModule, DxoGridSizeModule, DxoHistoryToolbarModule, DxoMainToolbarModule, DxoNodesModule, DxoAutoLayoutModule, DxoPageSizeModule, DxoPropertiesPanelModule, DxiTabModule, DxiGroupModule, DxoToolboxModule, DxoViewToolbarModule, DxoZoomLevelModule;
    return {
        setters: [function (module) {
            i2 = module;
        }, function (module) {
            i0 = module;
            PLATFORM_ID = module.PLATFORM_ID;
            Component = module.Component;
            Inject = module.Inject;
            Input = module.Input;
            Output = module.Output;
            ContentChildren = module.ContentChildren;
            NgModule = module.NgModule;
        }, function (module) {
            DxDiagram = module.default;
        }, function (module) {
            DxComponent = module.c;
            DxTemplateHost = module.h;
            WatcherHelper = module.W;
            IterableDifferHelper = module.I;
            NestedOptionHost = module.i;
            DxIntegrationModule = module.e;
            DxTemplateModule = module.D;
        }, function (module) {
            DxiCustomShapeComponent = module.DxiCustomShapeComponent;
            DxoContextMenuModule = module.DxoContextMenuModule;
            DxiCommandModule = module.DxiCommandModule;
            DxiItemModule = module.DxiItemModule;
            DxoContextToolboxModule = module.DxoContextToolboxModule;
            DxiCustomShapeModule = module.DxiCustomShapeModule;
            DxiConnectionPointModule = module.DxiConnectionPointModule;
            DxoDefaultItemPropertiesModule = module.DxoDefaultItemPropertiesModule;
            DxoEdgesModule = module.DxoEdgesModule;
            DxoEditingModule = module.DxoEditingModule;
            DxoExportModule = module.DxoExportModule;
            DxoGridSizeModule = module.DxoGridSizeModule;
            DxoHistoryToolbarModule = module.DxoHistoryToolbarModule;
            DxoMainToolbarModule = module.DxoMainToolbarModule;
            DxoNodesModule = module.DxoNodesModule;
            DxoAutoLayoutModule = module.DxoAutoLayoutModule;
            DxoPageSizeModule = module.DxoPageSizeModule;
            DxoPropertiesPanelModule = module.DxoPropertiesPanelModule;
            DxiTabModule = module.DxiTabModule;
            DxiGroupModule = module.DxiGroupModule;
            DxoToolboxModule = module.DxoToolboxModule;
            DxoViewToolbarModule = module.DxoViewToolbarModule;
            DxoZoomLevelModule = module.DxoZoomLevelModule;
        }, null, null, null, null, null, null, null, null, null, null],
        execute: (function () {

            /*!
             * devextreme-angular
             * Version: 24.1.1
             * Build date: Mon Apr 15 2024
             *
             * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
             *
             * This software may be modified and distributed under the terms
             * of the MIT license. See the LICENSE file in the root of the project for details.
             *
             * https://github.com/DevExpress/devextreme-angular
             */
            /* tslint:disable:max-line-length */
            /**
             * The Diagram UI component provides a visual interface to help you design new and modify existing diagrams.

             */
            class DxDiagramComponent extends DxComponent {
                _watcherHelper;
                _idh;
                instance = null;
                /**
                 * Specifies how the Diagram UI component automatically zooms the work area.
                
                 */
                get autoZoomMode() {
                    return this._getOption('autoZoomMode');
                }
                set autoZoomMode(value) {
                    this._setOption('autoZoomMode', value);
                }
                /**
                 * Configures the context menu&apos;s settings.
                
                 */
                get contextMenu() {
                    return this._getOption('contextMenu');
                }
                set contextMenu(value) {
                    this._setOption('contextMenu', value);
                }
                /**
                 * Configures the context toolbox&apos;s settings.
                
                 */
                get contextToolbox() {
                    return this._getOption('contextToolbox');
                }
                set contextToolbox(value) {
                    this._setOption('contextToolbox', value);
                }
                /**
                 * Provide access to an array of custom shapes.
                
                 */
                get customShapes() {
                    return this._getOption('customShapes');
                }
                set customShapes(value) {
                    this._setOption('customShapes', value);
                }
                /**
                 * Specifies a custom template for shapes.
                
                 */
                get customShapeTemplate() {
                    return this._getOption('customShapeTemplate');
                }
                set customShapeTemplate(value) {
                    this._setOption('customShapeTemplate', value);
                }
                /**
                 * Specifies a custom template for shapes in the toolbox.
                
                 */
                get customShapeToolboxTemplate() {
                    return this._getOption('customShapeToolboxTemplate');
                }
                set customShapeToolboxTemplate(value) {
                    this._setOption('customShapeToolboxTemplate', value);
                }
                /**
                 * Configures default item properties.
                
                 */
                get defaultItemProperties() {
                    return this._getOption('defaultItemProperties');
                }
                set defaultItemProperties(value) {
                    this._setOption('defaultItemProperties', value);
                }
                /**
                 * Specifies whether the UI component responds to user interaction.
                
                 */
                get disabled() {
                    return this._getOption('disabled');
                }
                set disabled(value) {
                    this._setOption('disabled', value);
                }
                /**
                 * Allows you to bind the collection of diagram edges to a data source. For more information, see the Data Binding section.
                
                 */
                get edges() {
                    return this._getOption('edges');
                }
                set edges(value) {
                    this._setOption('edges', value);
                }
                /**
                 * Specifies which editing operations a user can perform.
                
                 */
                get editing() {
                    return this._getOption('editing');
                }
                set editing(value) {
                    this._setOption('editing', value);
                }
                /**
                 * Specifies the global attributes to be attached to the UI component&apos;s container element.
                
                 */
                get elementAttr() {
                    return this._getOption('elementAttr');
                }
                set elementAttr(value) {
                    this._setOption('elementAttr', value);
                }
                /**
                 * Configures export settings.
                
                 */
                get export() {
                    return this._getOption('export');
                }
                set export(value) {
                    this._setOption('export', value);
                }
                /**
                 * Specifies whether or not to display the UI component in full-screen mode.
                
                 */
                get fullScreen() {
                    return this._getOption('fullScreen');
                }
                set fullScreen(value) {
                    this._setOption('fullScreen', value);
                }
                /**
                 * Specifies the grid pitch.
                
                 */
                get gridSize() {
                    return this._getOption('gridSize');
                }
                set gridSize(value) {
                    this._setOption('gridSize', value);
                }
                /**
                 * Indicates whether diagram content has unsaved changes.
                
                 */
                get hasChanges() {
                    return this._getOption('hasChanges');
                }
                set hasChanges(value) {
                    this._setOption('hasChanges', value);
                }
                /**
                 * Specifies the UI component&apos;s height.
                
                 */
                get height() {
                    return this._getOption('height');
                }
                set height(value) {
                    this._setOption('height', value);
                }
                /**
                 * Configures the history toolbar&apos;s settings.
                
                 */
                get historyToolbar() {
                    return this._getOption('historyToolbar');
                }
                set historyToolbar(value) {
                    this._setOption('historyToolbar', value);
                }
                /**
                 * Configures the main toolbar settings.
                
                 */
                get mainToolbar() {
                    return this._getOption('mainToolbar');
                }
                set mainToolbar(value) {
                    this._setOption('mainToolbar', value);
                }
                /**
                 * Allows you to bind the collection of diagram nodes to a data source. For more information, see the Data Binding section.
                
                 */
                get nodes() {
                    return this._getOption('nodes');
                }
                set nodes(value) {
                    this._setOption('nodes', value);
                }
                /**
                 * Specifies the color of a diagram page.
                
                 */
                get pageColor() {
                    return this._getOption('pageColor');
                }
                set pageColor(value) {
                    this._setOption('pageColor', value);
                }
                /**
                 * Specifies the page orientation.
                
                 */
                get pageOrientation() {
                    return this._getOption('pageOrientation');
                }
                set pageOrientation(value) {
                    this._setOption('pageOrientation', value);
                }
                /**
                 * Specifies a size of pages.
                
                 */
                get pageSize() {
                    return this._getOption('pageSize');
                }
                set pageSize(value) {
                    this._setOption('pageSize', value);
                }
                /**
                 * Configures the Properties panel settings.
                
                 */
                get propertiesPanel() {
                    return this._getOption('propertiesPanel');
                }
                set propertiesPanel(value) {
                    this._setOption('propertiesPanel', value);
                }
                /**
                 * Specifies whether the diagram is read-only.
                
                 */
                get readOnly() {
                    return this._getOption('readOnly');
                }
                set readOnly(value) {
                    this._setOption('readOnly', value);
                }
                /**
                 * Switches the UI component to a right-to-left representation.
                
                 */
                get rtlEnabled() {
                    return this._getOption('rtlEnabled');
                }
                set rtlEnabled(value) {
                    this._setOption('rtlEnabled', value);
                }
                /**
                 * Specifies whether grid lines are visible.
                
                 */
                get showGrid() {
                    return this._getOption('showGrid');
                }
                set showGrid(value) {
                    this._setOption('showGrid', value);
                }
                /**
                 * Switch the Diagram UI component to simple view mode.
                
                 */
                get simpleView() {
                    return this._getOption('simpleView');
                }
                set simpleView(value) {
                    this._setOption('simpleView', value);
                }
                /**
                 * Specifies whether diagram elements should snap to grid lines.
                
                 */
                get snapToGrid() {
                    return this._getOption('snapToGrid');
                }
                set snapToGrid(value) {
                    this._setOption('snapToGrid', value);
                }
                /**
                 * Configures the toolbox settings.
                
                 */
                get toolbox() {
                    return this._getOption('toolbox');
                }
                set toolbox(value) {
                    this._setOption('toolbox', value);
                }
                /**
                 * Specifies the measurement unit for size properties.
                
                 */
                get units() {
                    return this._getOption('units');
                }
                set units(value) {
                    this._setOption('units', value);
                }
                /**
                 * Specifies whether or not the UI component uses native scrolling.
                
                 */
                get useNativeScrolling() {
                    return this._getOption('useNativeScrolling');
                }
                set useNativeScrolling(value) {
                    this._setOption('useNativeScrolling', value);
                }
                /**
                 * Configures the view toolbar settings.
                
                 */
                get viewToolbar() {
                    return this._getOption('viewToolbar');
                }
                set viewToolbar(value) {
                    this._setOption('viewToolbar', value);
                }
                /**
                 * Specifies the measurement unit that is displayed in user interface elements.
                
                 */
                get viewUnits() {
                    return this._getOption('viewUnits');
                }
                set viewUnits(value) {
                    this._setOption('viewUnits', value);
                }
                /**
                 * Specifies whether the UI component is visible.
                
                 */
                get visible() {
                    return this._getOption('visible');
                }
                set visible(value) {
                    this._setOption('visible', value);
                }
                /**
                 * Specifies the UI component&apos;s width.
                
                 */
                get width() {
                    return this._getOption('width');
                }
                set width(value) {
                    this._setOption('width', value);
                }
                /**
                 * Specifies the zoom level.
                
                 */
                get zoomLevel() {
                    return this._getOption('zoomLevel');
                }
                set zoomLevel(value) {
                    this._setOption('zoomLevel', value);
                }
                /**
                
                 * A function that is executed when the UI component is rendered and each time the component is repainted.
                
                
                 */
                onContentReady;
                /**
                
                 * A function that is executed after a custom command item was clicked and allows you to implement the custom command&apos;s logic.
                
                
                 */
                onCustomCommand;
                /**
                
                 * A function that is executed before the UI component is disposed of.
                
                
                 */
                onDisposing;
                /**
                
                 * A function used in JavaScript frameworks to save the UI component instance.
                
                
                 */
                onInitialized;
                /**
                
                 * A function that is executed after a shape or connector is clicked.
                
                
                 */
                onItemClick;
                /**
                
                 * A function that is executed after a shape or connector is double-clicked.
                
                
                 */
                onItemDblClick;
                /**
                
                 * A function that is executed after a UI component property is changed.
                
                
                 */
                onOptionChanged;
                /**
                
                 * A function that allows you to prohibit an edit operation at run time.
                
                
                 */
                onRequestEditOperation;
                /**
                
                 * A function that allows you to specify whether or not the UI component should reapply its auto layout after diagram data is reloaded.
                
                
                 */
                onRequestLayoutUpdate;
                /**
                
                 * A function that is executed after the selection is changed in the Diagram.
                
                
                 */
                onSelectionChanged;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                autoZoomModeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                contextMenuChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                contextToolboxChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                customShapesChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                customShapeTemplateChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                customShapeToolboxTemplateChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                defaultItemPropertiesChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                disabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                edgesChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                editingChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                elementAttrChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                exportChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                fullScreenChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                gridSizeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                hasChangesChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                heightChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                historyToolbarChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                mainToolbarChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                nodesChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                pageColorChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                pageOrientationChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                pageSizeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                propertiesPanelChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                readOnlyChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                rtlEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                showGridChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                simpleViewChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                snapToGridChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                toolboxChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                unitsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                useNativeScrollingChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                viewToolbarChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                viewUnitsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                visibleChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                widthChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                zoomLevelChange;
                get customShapesChildren() {
                    return this._getOption('customShapes');
                }
                set customShapesChildren(value) {
                    this.setChildren('customShapes', value);
                }
                constructor(elementRef, ngZone, templateHost, _watcherHelper, _idh, optionHost, transferState, platformId) {
                    super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);
                    this._watcherHelper = _watcherHelper;
                    this._idh = _idh;
                    this._createEventEmitters([
                        { subscribe: 'contentReady', emit: 'onContentReady' },
                        { subscribe: 'customCommand', emit: 'onCustomCommand' },
                        { subscribe: 'disposing', emit: 'onDisposing' },
                        { subscribe: 'initialized', emit: 'onInitialized' },
                        { subscribe: 'itemClick', emit: 'onItemClick' },
                        { subscribe: 'itemDblClick', emit: 'onItemDblClick' },
                        { subscribe: 'optionChanged', emit: 'onOptionChanged' },
                        { subscribe: 'requestEditOperation', emit: 'onRequestEditOperation' },
                        { subscribe: 'requestLayoutUpdate', emit: 'onRequestLayoutUpdate' },
                        { subscribe: 'selectionChanged', emit: 'onSelectionChanged' },
                        { emit: 'autoZoomModeChange' },
                        { emit: 'contextMenuChange' },
                        { emit: 'contextToolboxChange' },
                        { emit: 'customShapesChange' },
                        { emit: 'customShapeTemplateChange' },
                        { emit: 'customShapeToolboxTemplateChange' },
                        { emit: 'defaultItemPropertiesChange' },
                        { emit: 'disabledChange' },
                        { emit: 'edgesChange' },
                        { emit: 'editingChange' },
                        { emit: 'elementAttrChange' },
                        { emit: 'exportChange' },
                        { emit: 'fullScreenChange' },
                        { emit: 'gridSizeChange' },
                        { emit: 'hasChangesChange' },
                        { emit: 'heightChange' },
                        { emit: 'historyToolbarChange' },
                        { emit: 'mainToolbarChange' },
                        { emit: 'nodesChange' },
                        { emit: 'pageColorChange' },
                        { emit: 'pageOrientationChange' },
                        { emit: 'pageSizeChange' },
                        { emit: 'propertiesPanelChange' },
                        { emit: 'readOnlyChange' },
                        { emit: 'rtlEnabledChange' },
                        { emit: 'showGridChange' },
                        { emit: 'simpleViewChange' },
                        { emit: 'snapToGridChange' },
                        { emit: 'toolboxChange' },
                        { emit: 'unitsChange' },
                        { emit: 'useNativeScrollingChange' },
                        { emit: 'viewToolbarChange' },
                        { emit: 'viewUnitsChange' },
                        { emit: 'visibleChange' },
                        { emit: 'widthChange' },
                        { emit: 'zoomLevelChange' }
                    ]);
                    this._idh.setHost(this);
                    optionHost.setHost(this);
                }
                _createInstance(element, options) {
                    return new DxDiagram(element, options);
                }
                ngOnDestroy() {
                    this._destroyWidget();
                }
                ngOnChanges(changes) {
                    super.ngOnChanges(changes);
                    this.setupChanges('customShapes', changes);
                }
                setupChanges(prop, changes) {
                    if (!(prop in this._optionsToUpdate)) {
                        this._idh.setup(prop, changes);
                    }
                }
                ngDoCheck() {
                    this._idh.doCheck('customShapes');
                    this._watcherHelper.checkWatchers();
                    super.ngDoCheck();
                    super.clearChangedOptions();
                }
                _setOption(name, value) {
                    let isSetup = this._idh.setupSingle(name, value);
                    let isChanged = this._idh.getChanges(name, value) !== null;
                    if (isSetup || isChanged) {
                        super._setOption(name, value);
                    }
                }
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxDiagramComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: DxTemplateHost }, { token: WatcherHelper }, { token: IterableDifferHelper }, { token: NestedOptionHost }, { token: i2.TransferState }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
                /** @nocollapse */ static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.0", type: DxDiagramComponent, selector: "dx-diagram", inputs: { autoZoomMode: "autoZoomMode", contextMenu: "contextMenu", contextToolbox: "contextToolbox", customShapes: "customShapes", customShapeTemplate: "customShapeTemplate", customShapeToolboxTemplate: "customShapeToolboxTemplate", defaultItemProperties: "defaultItemProperties", disabled: "disabled", edges: "edges", editing: "editing", elementAttr: "elementAttr", export: "export", fullScreen: "fullScreen", gridSize: "gridSize", hasChanges: "hasChanges", height: "height", historyToolbar: "historyToolbar", mainToolbar: "mainToolbar", nodes: "nodes", pageColor: "pageColor", pageOrientation: "pageOrientation", pageSize: "pageSize", propertiesPanel: "propertiesPanel", readOnly: "readOnly", rtlEnabled: "rtlEnabled", showGrid: "showGrid", simpleView: "simpleView", snapToGrid: "snapToGrid", toolbox: "toolbox", units: "units", useNativeScrolling: "useNativeScrolling", viewToolbar: "viewToolbar", viewUnits: "viewUnits", visible: "visible", width: "width", zoomLevel: "zoomLevel" }, outputs: { onContentReady: "onContentReady", onCustomCommand: "onCustomCommand", onDisposing: "onDisposing", onInitialized: "onInitialized", onItemClick: "onItemClick", onItemDblClick: "onItemDblClick", onOptionChanged: "onOptionChanged", onRequestEditOperation: "onRequestEditOperation", onRequestLayoutUpdate: "onRequestLayoutUpdate", onSelectionChanged: "onSelectionChanged", autoZoomModeChange: "autoZoomModeChange", contextMenuChange: "contextMenuChange", contextToolboxChange: "contextToolboxChange", customShapesChange: "customShapesChange", customShapeTemplateChange: "customShapeTemplateChange", customShapeToolboxTemplateChange: "customShapeToolboxTemplateChange", defaultItemPropertiesChange: "defaultItemPropertiesChange", disabledChange: "disabledChange", edgesChange: "edgesChange", editingChange: "editingChange", elementAttrChange: "elementAttrChange", exportChange: "exportChange", fullScreenChange: "fullScreenChange", gridSizeChange: "gridSizeChange", hasChangesChange: "hasChangesChange", heightChange: "heightChange", historyToolbarChange: "historyToolbarChange", mainToolbarChange: "mainToolbarChange", nodesChange: "nodesChange", pageColorChange: "pageColorChange", pageOrientationChange: "pageOrientationChange", pageSizeChange: "pageSizeChange", propertiesPanelChange: "propertiesPanelChange", readOnlyChange: "readOnlyChange", rtlEnabledChange: "rtlEnabledChange", showGridChange: "showGridChange", simpleViewChange: "simpleViewChange", snapToGridChange: "snapToGridChange", toolboxChange: "toolboxChange", unitsChange: "unitsChange", useNativeScrollingChange: "useNativeScrollingChange", viewToolbarChange: "viewToolbarChange", viewUnitsChange: "viewUnitsChange", visibleChange: "visibleChange", widthChange: "widthChange", zoomLevelChange: "zoomLevelChange" }, providers: [
                        DxTemplateHost,
                        WatcherHelper,
                        NestedOptionHost,
                        IterableDifferHelper
                    ], queries: [{ propertyName: "customShapesChildren", predicate: DxiCustomShapeComponent }], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: '', isInline: true });
            } exports("DxDiagramComponent", DxDiagramComponent);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxDiagramComponent, decorators: [{
                        type: Component,
                        args: [{
                                selector: 'dx-diagram',
                                template: '',
                                providers: [
                                    DxTemplateHost,
                                    WatcherHelper,
                                    NestedOptionHost,
                                    IterableDifferHelper
                                ]
                            }]
                    }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: DxTemplateHost }, { type: WatcherHelper }, { type: IterableDifferHelper }, { type: NestedOptionHost }, { type: i2.TransferState }, { type: undefined, decorators: [{
                                type: Inject,
                                args: [PLATFORM_ID]
                            }] }], propDecorators: { autoZoomMode: [{
                            type: Input
                        }], contextMenu: [{
                            type: Input
                        }], contextToolbox: [{
                            type: Input
                        }], customShapes: [{
                            type: Input
                        }], customShapeTemplate: [{
                            type: Input
                        }], customShapeToolboxTemplate: [{
                            type: Input
                        }], defaultItemProperties: [{
                            type: Input
                        }], disabled: [{
                            type: Input
                        }], edges: [{
                            type: Input
                        }], editing: [{
                            type: Input
                        }], elementAttr: [{
                            type: Input
                        }], export: [{
                            type: Input
                        }], fullScreen: [{
                            type: Input
                        }], gridSize: [{
                            type: Input
                        }], hasChanges: [{
                            type: Input
                        }], height: [{
                            type: Input
                        }], historyToolbar: [{
                            type: Input
                        }], mainToolbar: [{
                            type: Input
                        }], nodes: [{
                            type: Input
                        }], pageColor: [{
                            type: Input
                        }], pageOrientation: [{
                            type: Input
                        }], pageSize: [{
                            type: Input
                        }], propertiesPanel: [{
                            type: Input
                        }], readOnly: [{
                            type: Input
                        }], rtlEnabled: [{
                            type: Input
                        }], showGrid: [{
                            type: Input
                        }], simpleView: [{
                            type: Input
                        }], snapToGrid: [{
                            type: Input
                        }], toolbox: [{
                            type: Input
                        }], units: [{
                            type: Input
                        }], useNativeScrolling: [{
                            type: Input
                        }], viewToolbar: [{
                            type: Input
                        }], viewUnits: [{
                            type: Input
                        }], visible: [{
                            type: Input
                        }], width: [{
                            type: Input
                        }], zoomLevel: [{
                            type: Input
                        }], onContentReady: [{
                            type: Output
                        }], onCustomCommand: [{
                            type: Output
                        }], onDisposing: [{
                            type: Output
                        }], onInitialized: [{
                            type: Output
                        }], onItemClick: [{
                            type: Output
                        }], onItemDblClick: [{
                            type: Output
                        }], onOptionChanged: [{
                            type: Output
                        }], onRequestEditOperation: [{
                            type: Output
                        }], onRequestLayoutUpdate: [{
                            type: Output
                        }], onSelectionChanged: [{
                            type: Output
                        }], autoZoomModeChange: [{
                            type: Output
                        }], contextMenuChange: [{
                            type: Output
                        }], contextToolboxChange: [{
                            type: Output
                        }], customShapesChange: [{
                            type: Output
                        }], customShapeTemplateChange: [{
                            type: Output
                        }], customShapeToolboxTemplateChange: [{
                            type: Output
                        }], defaultItemPropertiesChange: [{
                            type: Output
                        }], disabledChange: [{
                            type: Output
                        }], edgesChange: [{
                            type: Output
                        }], editingChange: [{
                            type: Output
                        }], elementAttrChange: [{
                            type: Output
                        }], exportChange: [{
                            type: Output
                        }], fullScreenChange: [{
                            type: Output
                        }], gridSizeChange: [{
                            type: Output
                        }], hasChangesChange: [{
                            type: Output
                        }], heightChange: [{
                            type: Output
                        }], historyToolbarChange: [{
                            type: Output
                        }], mainToolbarChange: [{
                            type: Output
                        }], nodesChange: [{
                            type: Output
                        }], pageColorChange: [{
                            type: Output
                        }], pageOrientationChange: [{
                            type: Output
                        }], pageSizeChange: [{
                            type: Output
                        }], propertiesPanelChange: [{
                            type: Output
                        }], readOnlyChange: [{
                            type: Output
                        }], rtlEnabledChange: [{
                            type: Output
                        }], showGridChange: [{
                            type: Output
                        }], simpleViewChange: [{
                            type: Output
                        }], snapToGridChange: [{
                            type: Output
                        }], toolboxChange: [{
                            type: Output
                        }], unitsChange: [{
                            type: Output
                        }], useNativeScrollingChange: [{
                            type: Output
                        }], viewToolbarChange: [{
                            type: Output
                        }], viewUnitsChange: [{
                            type: Output
                        }], visibleChange: [{
                            type: Output
                        }], widthChange: [{
                            type: Output
                        }], zoomLevelChange: [{
                            type: Output
                        }], customShapesChildren: [{
                            type: ContentChildren,
                            args: [DxiCustomShapeComponent]
                        }] } });
            class DxDiagramModule {
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxDiagramModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
                /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0, type: DxDiagramModule, declarations: [DxDiagramComponent], imports: [DxoContextMenuModule,
                        DxiCommandModule,
                        DxiItemModule,
                        DxoContextToolboxModule,
                        DxiCustomShapeModule,
                        DxiConnectionPointModule,
                        DxoDefaultItemPropertiesModule,
                        DxoEdgesModule,
                        DxoEditingModule,
                        DxoExportModule,
                        DxoGridSizeModule,
                        DxoHistoryToolbarModule,
                        DxoMainToolbarModule,
                        DxoNodesModule,
                        DxoAutoLayoutModule,
                        DxoPageSizeModule,
                        DxoPropertiesPanelModule,
                        DxiTabModule,
                        DxiGroupModule,
                        DxoToolboxModule,
                        DxoViewToolbarModule,
                        DxoZoomLevelModule,
                        DxIntegrationModule,
                        DxTemplateModule], exports: [DxDiagramComponent, DxoContextMenuModule,
                        DxiCommandModule,
                        DxiItemModule,
                        DxoContextToolboxModule,
                        DxiCustomShapeModule,
                        DxiConnectionPointModule,
                        DxoDefaultItemPropertiesModule,
                        DxoEdgesModule,
                        DxoEditingModule,
                        DxoExportModule,
                        DxoGridSizeModule,
                        DxoHistoryToolbarModule,
                        DxoMainToolbarModule,
                        DxoNodesModule,
                        DxoAutoLayoutModule,
                        DxoPageSizeModule,
                        DxoPropertiesPanelModule,
                        DxiTabModule,
                        DxiGroupModule,
                        DxoToolboxModule,
                        DxoViewToolbarModule,
                        DxoZoomLevelModule,
                        DxTemplateModule] });
                /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxDiagramModule, imports: [DxoContextMenuModule,
                        DxiCommandModule,
                        DxiItemModule,
                        DxoContextToolboxModule,
                        DxiCustomShapeModule,
                        DxiConnectionPointModule,
                        DxoDefaultItemPropertiesModule,
                        DxoEdgesModule,
                        DxoEditingModule,
                        DxoExportModule,
                        DxoGridSizeModule,
                        DxoHistoryToolbarModule,
                        DxoMainToolbarModule,
                        DxoNodesModule,
                        DxoAutoLayoutModule,
                        DxoPageSizeModule,
                        DxoPropertiesPanelModule,
                        DxiTabModule,
                        DxiGroupModule,
                        DxoToolboxModule,
                        DxoViewToolbarModule,
                        DxoZoomLevelModule,
                        DxIntegrationModule,
                        DxTemplateModule, DxoContextMenuModule,
                        DxiCommandModule,
                        DxiItemModule,
                        DxoContextToolboxModule,
                        DxiCustomShapeModule,
                        DxiConnectionPointModule,
                        DxoDefaultItemPropertiesModule,
                        DxoEdgesModule,
                        DxoEditingModule,
                        DxoExportModule,
                        DxoGridSizeModule,
                        DxoHistoryToolbarModule,
                        DxoMainToolbarModule,
                        DxoNodesModule,
                        DxoAutoLayoutModule,
                        DxoPageSizeModule,
                        DxoPropertiesPanelModule,
                        DxiTabModule,
                        DxiGroupModule,
                        DxoToolboxModule,
                        DxoViewToolbarModule,
                        DxoZoomLevelModule,
                        DxTemplateModule] });
            } exports("DxDiagramModule", DxDiagramModule);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxDiagramModule, decorators: [{
                        type: NgModule,
                        args: [{
                                imports: [
                                    DxoContextMenuModule,
                                    DxiCommandModule,
                                    DxiItemModule,
                                    DxoContextToolboxModule,
                                    DxiCustomShapeModule,
                                    DxiConnectionPointModule,
                                    DxoDefaultItemPropertiesModule,
                                    DxoEdgesModule,
                                    DxoEditingModule,
                                    DxoExportModule,
                                    DxoGridSizeModule,
                                    DxoHistoryToolbarModule,
                                    DxoMainToolbarModule,
                                    DxoNodesModule,
                                    DxoAutoLayoutModule,
                                    DxoPageSizeModule,
                                    DxoPropertiesPanelModule,
                                    DxiTabModule,
                                    DxiGroupModule,
                                    DxoToolboxModule,
                                    DxoViewToolbarModule,
                                    DxoZoomLevelModule,
                                    DxIntegrationModule,
                                    DxTemplateModule
                                ],
                                declarations: [
                                    DxDiagramComponent
                                ],
                                exports: [
                                    DxDiagramComponent,
                                    DxoContextMenuModule,
                                    DxiCommandModule,
                                    DxiItemModule,
                                    DxoContextToolboxModule,
                                    DxiCustomShapeModule,
                                    DxiConnectionPointModule,
                                    DxoDefaultItemPropertiesModule,
                                    DxoEdgesModule,
                                    DxoEditingModule,
                                    DxoExportModule,
                                    DxoGridSizeModule,
                                    DxoHistoryToolbarModule,
                                    DxoMainToolbarModule,
                                    DxoNodesModule,
                                    DxoAutoLayoutModule,
                                    DxoPageSizeModule,
                                    DxoPropertiesPanelModule,
                                    DxiTabModule,
                                    DxiGroupModule,
                                    DxoToolboxModule,
                                    DxoViewToolbarModule,
                                    DxoZoomLevelModule,
                                    DxTemplateModule
                                ]
                            }]
                    }] });

        })
    };
}));
