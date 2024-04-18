System.register(['@angular/platform-browser', '@angular/core', 'devextreme/viz/tree_map', './devextreme-angular-core.js', './devextreme-angular-ui-nested.js', '@angular/common', 'devextreme/core/dom_adapter', 'devextreme/events', 'devextreme/core/utils/common', 'devextreme/core/renderer', 'devextreme/core/http_request', 'devextreme/core/utils/ready_callbacks', 'devextreme/events/core/events_engine', 'devextreme/core/utils/ajax', 'devextreme/core/utils/deferred'], (function (exports) {
    'use strict';
    var i2, i0, PLATFORM_ID, Component, Inject, Input, Output, NgModule, DxTreeMap, DxComponent, DxTemplateHost, WatcherHelper, IterableDifferHelper, NestedOptionHost, DxIntegrationModule, DxTemplateModule, DxoColorizerModule, DxoExportModule, DxoGroupModule, DxoBorderModule, DxoHoverStyleModule, DxoLabelModule, DxoFontModule, DxoSelectionStyleModule, DxoLoadingIndicatorModule, DxoSizeModule, DxoTileModule, DxoTitleModule, DxoMarginModule, DxoSubtitleModule, DxoTooltipModule, DxoFormatModule, DxoShadowModule;
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
            NgModule = module.NgModule;
        }, function (module) {
            DxTreeMap = module.default;
        }, function (module) {
            DxComponent = module.c;
            DxTemplateHost = module.h;
            WatcherHelper = module.W;
            IterableDifferHelper = module.I;
            NestedOptionHost = module.i;
            DxIntegrationModule = module.e;
            DxTemplateModule = module.D;
        }, function (module) {
            DxoColorizerModule = module.DxoColorizerModule;
            DxoExportModule = module.DxoExportModule;
            DxoGroupModule = module.DxoGroupModule;
            DxoBorderModule = module.DxoBorderModule;
            DxoHoverStyleModule = module.DxoHoverStyleModule;
            DxoLabelModule = module.DxoLabelModule;
            DxoFontModule = module.DxoFontModule;
            DxoSelectionStyleModule = module.DxoSelectionStyleModule;
            DxoLoadingIndicatorModule = module.DxoLoadingIndicatorModule;
            DxoSizeModule = module.DxoSizeModule;
            DxoTileModule = module.DxoTileModule;
            DxoTitleModule = module.DxoTitleModule;
            DxoMarginModule = module.DxoMarginModule;
            DxoSubtitleModule = module.DxoSubtitleModule;
            DxoTooltipModule = module.DxoTooltipModule;
            DxoFormatModule = module.DxoFormatModule;
            DxoShadowModule = module.DxoShadowModule;
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
             * The TreeMap is a UI component that displays hierarchical data by using nested rectangles.

             */
            class DxTreeMapComponent extends DxComponent {
                _watcherHelper;
                _idh;
                instance = null;
                /**
                 * Specifies the name of the data source field that provides nested items for a group. Applies to hierarchical data sources only.
                
                 */
                get childrenField() {
                    return this._getOption('childrenField');
                }
                set childrenField(value) {
                    this._setOption('childrenField', value);
                }
                /**
                 * Specifies the name of the data source field that provides colors for tiles.
                
                 */
                get colorField() {
                    return this._getOption('colorField');
                }
                set colorField(value) {
                    this._setOption('colorField', value);
                }
                /**
                 * Manages the color settings.
                
                 */
                get colorizer() {
                    return this._getOption('colorizer');
                }
                set colorizer(value) {
                    this._setOption('colorizer', value);
                }
                /**
                 * Binds the UI component to data.
                
                 */
                get dataSource() {
                    return this._getOption('dataSource');
                }
                set dataSource(value) {
                    this._setOption('dataSource', value);
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
                 * Specifies the global attributes to be attached to the UI component&apos;s container element.
                
                 */
                get elementAttr() {
                    return this._getOption('elementAttr');
                }
                set elementAttr(value) {
                    this._setOption('elementAttr', value);
                }
                /**
                 * Configures the exporting and printing features.
                
                 */
                get export() {
                    return this._getOption('export');
                }
                set export(value) {
                    this._setOption('export', value);
                }
                /**
                 * Configures groups.
                
                 */
                get group() {
                    return this._getOption('group');
                }
                set group(value) {
                    this._setOption('group', value);
                }
                /**
                 * Specifies whether tiles and groups change their style when a user pauses on them.
                
                 */
                get hoverEnabled() {
                    return this._getOption('hoverEnabled');
                }
                set hoverEnabled(value) {
                    this._setOption('hoverEnabled', value);
                }
                /**
                 * Specifies the name of the data source field that provides IDs for items. Applies to plain data sources only.
                
                 */
                get idField() {
                    return this._getOption('idField');
                }
                set idField(value) {
                    this._setOption('idField', value);
                }
                /**
                 * Specifies whether the user will interact with a single tile or its group.
                
                 */
                get interactWithGroup() {
                    return this._getOption('interactWithGroup');
                }
                set interactWithGroup(value) {
                    this._setOption('interactWithGroup', value);
                }
                /**
                 * Specifies the name of the data source field that provides texts for tile and group labels.
                
                 */
                get labelField() {
                    return this._getOption('labelField');
                }
                set labelField(value) {
                    this._setOption('labelField', value);
                }
                /**
                 * Specifies the layout algorithm.
                
                 */
                get layoutAlgorithm() {
                    return this._getOption('layoutAlgorithm');
                }
                set layoutAlgorithm(value) {
                    this._setOption('layoutAlgorithm', value);
                }
                /**
                 * Specifies the direction in which the items will be laid out.
                
                 */
                get layoutDirection() {
                    return this._getOption('layoutDirection');
                }
                set layoutDirection(value) {
                    this._setOption('layoutDirection', value);
                }
                /**
                 * Configures the loading indicator.
                
                 */
                get loadingIndicator() {
                    return this._getOption('loadingIndicator');
                }
                set loadingIndicator(value) {
                    this._setOption('loadingIndicator', value);
                }
                /**
                 * Specifies how many hierarchical levels must be visualized.
                
                 */
                get maxDepth() {
                    return this._getOption('maxDepth');
                }
                set maxDepth(value) {
                    this._setOption('maxDepth', value);
                }
                /**
                 * Specifies the name of the data source field that provides parent IDs for items. Applies to plain data sources only.
                
                 */
                get parentField() {
                    return this._getOption('parentField');
                }
                set parentField(value) {
                    this._setOption('parentField', value);
                }
                /**
                 * Notifies the UI component that it is embedded into an HTML page that uses a tag modifying the path.
                
                 */
                get pathModified() {
                    return this._getOption('pathModified');
                }
                set pathModified(value) {
                    this._setOption('pathModified', value);
                }
                /**
                 * Specifies whether to redraw the UI component when the size of the container changes or a mobile device rotates.
                
                 */
                get redrawOnResize() {
                    return this._getOption('redrawOnResize');
                }
                set redrawOnResize(value) {
                    this._setOption('redrawOnResize', value);
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
                 * Specifies whether a single or multiple nodes can be in the selected state simultaneously.
                
                 */
                get selectionMode() {
                    return this._getOption('selectionMode');
                }
                set selectionMode(value) {
                    this._setOption('selectionMode', value);
                }
                /**
                 * Specifies the UI component&apos;s size in pixels.
                
                 */
                get size() {
                    return this._getOption('size');
                }
                set size(value) {
                    this._setOption('size', value);
                }
                /**
                 * Sets the name of the theme the UI component uses.
                
                 */
                get theme() {
                    return this._getOption('theme');
                }
                set theme(value) {
                    this._setOption('theme', value);
                }
                /**
                 * Configures tiles.
                
                 */
                get tile() {
                    return this._getOption('tile');
                }
                set tile(value) {
                    this._setOption('tile', value);
                }
                /**
                 * Configures the UI component&apos;s title.
                
                 */
                get title() {
                    return this._getOption('title');
                }
                set title(value) {
                    this._setOption('title', value);
                }
                /**
                 * Configures tooltips - small pop-up rectangles that display information about a data-visualizing UI component element being pressed or hovered over with the mouse pointer.
                
                 */
                get tooltip() {
                    return this._getOption('tooltip');
                }
                set tooltip(value) {
                    this._setOption('tooltip', value);
                }
                /**
                 * Specifies the name of the data source field that provides values for tiles.
                
                 */
                get valueField() {
                    return this._getOption('valueField');
                }
                set valueField(value) {
                    this._setOption('valueField', value);
                }
                /**
                
                 * A function that is executed when a node is clicked or tapped.
                
                
                 */
                onClick;
                /**
                
                 * A function that is executed before the UI component is disposed of.
                
                
                 */
                onDisposing;
                /**
                
                 * A function that is executed when the UI component&apos;s rendering has finished.
                
                
                 */
                onDrawn;
                /**
                
                 * A function that is executed when a user drills up or down.
                
                
                 */
                onDrill;
                /**
                
                 * A function that is executed after the UI component is exported.
                
                
                 */
                onExported;
                /**
                
                 * A function that is executed before the UI component is exported.
                
                
                 */
                onExporting;
                /**
                
                 * A function that is executed before a file with exported UI component is saved to the user&apos;s local storage.
                
                
                 */
                onFileSaving;
                /**
                
                 * A function that is executed after the pointer enters or leaves a node.
                
                
                 */
                onHoverChanged;
                /**
                
                 * A function that is executed when an error or warning occurs.
                
                
                 */
                onIncidentOccurred;
                /**
                
                 * A function used in JavaScript frameworks to save the UI component instance.
                
                
                 */
                onInitialized;
                /**
                
                 * A function that is executed only once, after the nodes are initialized.
                
                
                 */
                onNodesInitialized;
                /**
                
                 * A function that is executed before the nodes are displayed and each time the collection of active nodes is changed.
                
                
                 */
                onNodesRendering;
                /**
                
                 * A function that is executed after a UI component property is changed.
                
                
                 */
                onOptionChanged;
                /**
                
                 * A function that is executed when a node is selected or selection is canceled.
                
                
                 */
                onSelectionChanged;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                childrenFieldChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                colorFieldChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                colorizerChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                dataSourceChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                disabledChange;
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
                groupChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                hoverEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                idFieldChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                interactWithGroupChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                labelFieldChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                layoutAlgorithmChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                layoutDirectionChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                loadingIndicatorChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                maxDepthChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                parentFieldChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                pathModifiedChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                redrawOnResizeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                rtlEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                selectionModeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                sizeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                themeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                tileChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                titleChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                tooltipChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                valueFieldChange;
                constructor(elementRef, ngZone, templateHost, _watcherHelper, _idh, optionHost, transferState, platformId) {
                    super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);
                    this._watcherHelper = _watcherHelper;
                    this._idh = _idh;
                    this._createEventEmitters([
                        { subscribe: 'click', emit: 'onClick' },
                        { subscribe: 'disposing', emit: 'onDisposing' },
                        { subscribe: 'drawn', emit: 'onDrawn' },
                        { subscribe: 'drill', emit: 'onDrill' },
                        { subscribe: 'exported', emit: 'onExported' },
                        { subscribe: 'exporting', emit: 'onExporting' },
                        { subscribe: 'fileSaving', emit: 'onFileSaving' },
                        { subscribe: 'hoverChanged', emit: 'onHoverChanged' },
                        { subscribe: 'incidentOccurred', emit: 'onIncidentOccurred' },
                        { subscribe: 'initialized', emit: 'onInitialized' },
                        { subscribe: 'nodesInitialized', emit: 'onNodesInitialized' },
                        { subscribe: 'nodesRendering', emit: 'onNodesRendering' },
                        { subscribe: 'optionChanged', emit: 'onOptionChanged' },
                        { subscribe: 'selectionChanged', emit: 'onSelectionChanged' },
                        { emit: 'childrenFieldChange' },
                        { emit: 'colorFieldChange' },
                        { emit: 'colorizerChange' },
                        { emit: 'dataSourceChange' },
                        { emit: 'disabledChange' },
                        { emit: 'elementAttrChange' },
                        { emit: 'exportChange' },
                        { emit: 'groupChange' },
                        { emit: 'hoverEnabledChange' },
                        { emit: 'idFieldChange' },
                        { emit: 'interactWithGroupChange' },
                        { emit: 'labelFieldChange' },
                        { emit: 'layoutAlgorithmChange' },
                        { emit: 'layoutDirectionChange' },
                        { emit: 'loadingIndicatorChange' },
                        { emit: 'maxDepthChange' },
                        { emit: 'parentFieldChange' },
                        { emit: 'pathModifiedChange' },
                        { emit: 'redrawOnResizeChange' },
                        { emit: 'rtlEnabledChange' },
                        { emit: 'selectionModeChange' },
                        { emit: 'sizeChange' },
                        { emit: 'themeChange' },
                        { emit: 'tileChange' },
                        { emit: 'titleChange' },
                        { emit: 'tooltipChange' },
                        { emit: 'valueFieldChange' }
                    ]);
                    this._idh.setHost(this);
                    optionHost.setHost(this);
                }
                _createInstance(element, options) {
                    return new DxTreeMap(element, options);
                }
                ngOnDestroy() {
                    this._destroyWidget();
                }
                ngOnChanges(changes) {
                    super.ngOnChanges(changes);
                    this.setupChanges('dataSource', changes);
                }
                setupChanges(prop, changes) {
                    if (!(prop in this._optionsToUpdate)) {
                        this._idh.setup(prop, changes);
                    }
                }
                ngDoCheck() {
                    this._idh.doCheck('dataSource');
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
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxTreeMapComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: DxTemplateHost }, { token: WatcherHelper }, { token: IterableDifferHelper }, { token: NestedOptionHost }, { token: i2.TransferState }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
                /** @nocollapse */ static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.0", type: DxTreeMapComponent, selector: "dx-tree-map", inputs: { childrenField: "childrenField", colorField: "colorField", colorizer: "colorizer", dataSource: "dataSource", disabled: "disabled", elementAttr: "elementAttr", export: "export", group: "group", hoverEnabled: "hoverEnabled", idField: "idField", interactWithGroup: "interactWithGroup", labelField: "labelField", layoutAlgorithm: "layoutAlgorithm", layoutDirection: "layoutDirection", loadingIndicator: "loadingIndicator", maxDepth: "maxDepth", parentField: "parentField", pathModified: "pathModified", redrawOnResize: "redrawOnResize", rtlEnabled: "rtlEnabled", selectionMode: "selectionMode", size: "size", theme: "theme", tile: "tile", title: "title", tooltip: "tooltip", valueField: "valueField" }, outputs: { onClick: "onClick", onDisposing: "onDisposing", onDrawn: "onDrawn", onDrill: "onDrill", onExported: "onExported", onExporting: "onExporting", onFileSaving: "onFileSaving", onHoverChanged: "onHoverChanged", onIncidentOccurred: "onIncidentOccurred", onInitialized: "onInitialized", onNodesInitialized: "onNodesInitialized", onNodesRendering: "onNodesRendering", onOptionChanged: "onOptionChanged", onSelectionChanged: "onSelectionChanged", childrenFieldChange: "childrenFieldChange", colorFieldChange: "colorFieldChange", colorizerChange: "colorizerChange", dataSourceChange: "dataSourceChange", disabledChange: "disabledChange", elementAttrChange: "elementAttrChange", exportChange: "exportChange", groupChange: "groupChange", hoverEnabledChange: "hoverEnabledChange", idFieldChange: "idFieldChange", interactWithGroupChange: "interactWithGroupChange", labelFieldChange: "labelFieldChange", layoutAlgorithmChange: "layoutAlgorithmChange", layoutDirectionChange: "layoutDirectionChange", loadingIndicatorChange: "loadingIndicatorChange", maxDepthChange: "maxDepthChange", parentFieldChange: "parentFieldChange", pathModifiedChange: "pathModifiedChange", redrawOnResizeChange: "redrawOnResizeChange", rtlEnabledChange: "rtlEnabledChange", selectionModeChange: "selectionModeChange", sizeChange: "sizeChange", themeChange: "themeChange", tileChange: "tileChange", titleChange: "titleChange", tooltipChange: "tooltipChange", valueFieldChange: "valueFieldChange" }, providers: [
                        DxTemplateHost,
                        WatcherHelper,
                        NestedOptionHost,
                        IterableDifferHelper
                    ], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: '', isInline: true, styles: [":host{display:block}\n"] });
            } exports("DxTreeMapComponent", DxTreeMapComponent);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxTreeMapComponent, decorators: [{
                        type: Component,
                        args: [{ selector: 'dx-tree-map', template: '', providers: [
                                    DxTemplateHost,
                                    WatcherHelper,
                                    NestedOptionHost,
                                    IterableDifferHelper
                                ], styles: [":host{display:block}\n"] }]
                    }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: DxTemplateHost }, { type: WatcherHelper }, { type: IterableDifferHelper }, { type: NestedOptionHost }, { type: i2.TransferState }, { type: undefined, decorators: [{
                                type: Inject,
                                args: [PLATFORM_ID]
                            }] }], propDecorators: { childrenField: [{
                            type: Input
                        }], colorField: [{
                            type: Input
                        }], colorizer: [{
                            type: Input
                        }], dataSource: [{
                            type: Input
                        }], disabled: [{
                            type: Input
                        }], elementAttr: [{
                            type: Input
                        }], export: [{
                            type: Input
                        }], group: [{
                            type: Input
                        }], hoverEnabled: [{
                            type: Input
                        }], idField: [{
                            type: Input
                        }], interactWithGroup: [{
                            type: Input
                        }], labelField: [{
                            type: Input
                        }], layoutAlgorithm: [{
                            type: Input
                        }], layoutDirection: [{
                            type: Input
                        }], loadingIndicator: [{
                            type: Input
                        }], maxDepth: [{
                            type: Input
                        }], parentField: [{
                            type: Input
                        }], pathModified: [{
                            type: Input
                        }], redrawOnResize: [{
                            type: Input
                        }], rtlEnabled: [{
                            type: Input
                        }], selectionMode: [{
                            type: Input
                        }], size: [{
                            type: Input
                        }], theme: [{
                            type: Input
                        }], tile: [{
                            type: Input
                        }], title: [{
                            type: Input
                        }], tooltip: [{
                            type: Input
                        }], valueField: [{
                            type: Input
                        }], onClick: [{
                            type: Output
                        }], onDisposing: [{
                            type: Output
                        }], onDrawn: [{
                            type: Output
                        }], onDrill: [{
                            type: Output
                        }], onExported: [{
                            type: Output
                        }], onExporting: [{
                            type: Output
                        }], onFileSaving: [{
                            type: Output
                        }], onHoverChanged: [{
                            type: Output
                        }], onIncidentOccurred: [{
                            type: Output
                        }], onInitialized: [{
                            type: Output
                        }], onNodesInitialized: [{
                            type: Output
                        }], onNodesRendering: [{
                            type: Output
                        }], onOptionChanged: [{
                            type: Output
                        }], onSelectionChanged: [{
                            type: Output
                        }], childrenFieldChange: [{
                            type: Output
                        }], colorFieldChange: [{
                            type: Output
                        }], colorizerChange: [{
                            type: Output
                        }], dataSourceChange: [{
                            type: Output
                        }], disabledChange: [{
                            type: Output
                        }], elementAttrChange: [{
                            type: Output
                        }], exportChange: [{
                            type: Output
                        }], groupChange: [{
                            type: Output
                        }], hoverEnabledChange: [{
                            type: Output
                        }], idFieldChange: [{
                            type: Output
                        }], interactWithGroupChange: [{
                            type: Output
                        }], labelFieldChange: [{
                            type: Output
                        }], layoutAlgorithmChange: [{
                            type: Output
                        }], layoutDirectionChange: [{
                            type: Output
                        }], loadingIndicatorChange: [{
                            type: Output
                        }], maxDepthChange: [{
                            type: Output
                        }], parentFieldChange: [{
                            type: Output
                        }], pathModifiedChange: [{
                            type: Output
                        }], redrawOnResizeChange: [{
                            type: Output
                        }], rtlEnabledChange: [{
                            type: Output
                        }], selectionModeChange: [{
                            type: Output
                        }], sizeChange: [{
                            type: Output
                        }], themeChange: [{
                            type: Output
                        }], tileChange: [{
                            type: Output
                        }], titleChange: [{
                            type: Output
                        }], tooltipChange: [{
                            type: Output
                        }], valueFieldChange: [{
                            type: Output
                        }] } });
            class DxTreeMapModule {
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxTreeMapModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
                /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0, type: DxTreeMapModule, declarations: [DxTreeMapComponent], imports: [DxoColorizerModule,
                        DxoExportModule,
                        DxoGroupModule,
                        DxoBorderModule,
                        DxoHoverStyleModule,
                        DxoLabelModule,
                        DxoFontModule,
                        DxoSelectionStyleModule,
                        DxoLoadingIndicatorModule,
                        DxoSizeModule,
                        DxoTileModule,
                        DxoTitleModule,
                        DxoMarginModule,
                        DxoSubtitleModule,
                        DxoTooltipModule,
                        DxoFormatModule,
                        DxoShadowModule,
                        DxIntegrationModule,
                        DxTemplateModule], exports: [DxTreeMapComponent, DxoColorizerModule,
                        DxoExportModule,
                        DxoGroupModule,
                        DxoBorderModule,
                        DxoHoverStyleModule,
                        DxoLabelModule,
                        DxoFontModule,
                        DxoSelectionStyleModule,
                        DxoLoadingIndicatorModule,
                        DxoSizeModule,
                        DxoTileModule,
                        DxoTitleModule,
                        DxoMarginModule,
                        DxoSubtitleModule,
                        DxoTooltipModule,
                        DxoFormatModule,
                        DxoShadowModule,
                        DxTemplateModule] });
                /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxTreeMapModule, imports: [DxoColorizerModule,
                        DxoExportModule,
                        DxoGroupModule,
                        DxoBorderModule,
                        DxoHoverStyleModule,
                        DxoLabelModule,
                        DxoFontModule,
                        DxoSelectionStyleModule,
                        DxoLoadingIndicatorModule,
                        DxoSizeModule,
                        DxoTileModule,
                        DxoTitleModule,
                        DxoMarginModule,
                        DxoSubtitleModule,
                        DxoTooltipModule,
                        DxoFormatModule,
                        DxoShadowModule,
                        DxIntegrationModule,
                        DxTemplateModule, DxoColorizerModule,
                        DxoExportModule,
                        DxoGroupModule,
                        DxoBorderModule,
                        DxoHoverStyleModule,
                        DxoLabelModule,
                        DxoFontModule,
                        DxoSelectionStyleModule,
                        DxoLoadingIndicatorModule,
                        DxoSizeModule,
                        DxoTileModule,
                        DxoTitleModule,
                        DxoMarginModule,
                        DxoSubtitleModule,
                        DxoTooltipModule,
                        DxoFormatModule,
                        DxoShadowModule,
                        DxTemplateModule] });
            } exports("DxTreeMapModule", DxTreeMapModule);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxTreeMapModule, decorators: [{
                        type: NgModule,
                        args: [{
                                imports: [
                                    DxoColorizerModule,
                                    DxoExportModule,
                                    DxoGroupModule,
                                    DxoBorderModule,
                                    DxoHoverStyleModule,
                                    DxoLabelModule,
                                    DxoFontModule,
                                    DxoSelectionStyleModule,
                                    DxoLoadingIndicatorModule,
                                    DxoSizeModule,
                                    DxoTileModule,
                                    DxoTitleModule,
                                    DxoMarginModule,
                                    DxoSubtitleModule,
                                    DxoTooltipModule,
                                    DxoFormatModule,
                                    DxoShadowModule,
                                    DxIntegrationModule,
                                    DxTemplateModule
                                ],
                                declarations: [
                                    DxTreeMapComponent
                                ],
                                exports: [
                                    DxTreeMapComponent,
                                    DxoColorizerModule,
                                    DxoExportModule,
                                    DxoGroupModule,
                                    DxoBorderModule,
                                    DxoHoverStyleModule,
                                    DxoLabelModule,
                                    DxoFontModule,
                                    DxoSelectionStyleModule,
                                    DxoLoadingIndicatorModule,
                                    DxoSizeModule,
                                    DxoTileModule,
                                    DxoTitleModule,
                                    DxoMarginModule,
                                    DxoSubtitleModule,
                                    DxoTooltipModule,
                                    DxoFormatModule,
                                    DxoShadowModule,
                                    DxTemplateModule
                                ]
                            }]
                    }] });

        })
    };
}));
