System.register(['@angular/platform-browser', '@angular/core', 'devextreme/viz/sankey', './devextreme-angular-core.js', './devextreme-angular-ui-nested.js', '@angular/common', 'devextreme/core/dom_adapter', 'devextreme/events', 'devextreme/core/utils/common', 'devextreme/core/renderer', 'devextreme/core/http_request', 'devextreme/core/utils/ready_callbacks', 'devextreme/events/core/events_engine', 'devextreme/core/utils/ajax', 'devextreme/core/utils/deferred'], (function (exports) {
    'use strict';
    var i2, i0, PLATFORM_ID, Component, Inject, Input, Output, NgModule, DxSankey, DxComponent, DxTemplateHost, WatcherHelper, IterableDifferHelper, NestedOptionHost, DxIntegrationModule, DxTemplateModule, DxoAdaptiveLayoutModule, DxoExportModule, DxoLabelModule, DxoBorderModule, DxoFontModule, DxoShadowModule, DxoLinkModule, DxoHoverStyleModule, DxoHatchingModule, DxoLoadingIndicatorModule, DxoMarginModule, DxoNodeModule, DxoSizeModule, DxoTitleModule, DxoSubtitleModule, DxoTooltipModule, DxoFormatModule;
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
            DxSankey = module.default;
        }, function (module) {
            DxComponent = module.c;
            DxTemplateHost = module.h;
            WatcherHelper = module.W;
            IterableDifferHelper = module.I;
            NestedOptionHost = module.i;
            DxIntegrationModule = module.e;
            DxTemplateModule = module.D;
        }, function (module) {
            DxoAdaptiveLayoutModule = module.DxoAdaptiveLayoutModule;
            DxoExportModule = module.DxoExportModule;
            DxoLabelModule = module.DxoLabelModule;
            DxoBorderModule = module.DxoBorderModule;
            DxoFontModule = module.DxoFontModule;
            DxoShadowModule = module.DxoShadowModule;
            DxoLinkModule = module.DxoLinkModule;
            DxoHoverStyleModule = module.DxoHoverStyleModule;
            DxoHatchingModule = module.DxoHatchingModule;
            DxoLoadingIndicatorModule = module.DxoLoadingIndicatorModule;
            DxoMarginModule = module.DxoMarginModule;
            DxoNodeModule = module.DxoNodeModule;
            DxoSizeModule = module.DxoSizeModule;
            DxoTitleModule = module.DxoTitleModule;
            DxoSubtitleModule = module.DxoSubtitleModule;
            DxoTooltipModule = module.DxoTooltipModule;
            DxoFormatModule = module.DxoFormatModule;
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
             * The Sankey is a UI component that visualizes the flow magnitude between value sets. The values being connected are called nodes; the connections - links. The higher the flow magnitude, the wider the link is.

             */
            class DxSankeyComponent extends DxComponent {
                _watcherHelper;
                _idh;
                instance = null;
                /**
                 * Specifies adaptive layout properties.
                
                 */
                get adaptiveLayout() {
                    return this._getOption('adaptiveLayout');
                }
                set adaptiveLayout(value) {
                    this._setOption('adaptiveLayout', value);
                }
                /**
                 * Aligns node columns vertically.
                
                 */
                get alignment() {
                    return this._getOption('alignment');
                }
                set alignment(value) {
                    this._setOption('alignment', value);
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
                 * Specifies whether nodes and links change their style when they are hovered over or pressed.
                
                 */
                get hoverEnabled() {
                    return this._getOption('hoverEnabled');
                }
                set hoverEnabled(value) {
                    this._setOption('hoverEnabled', value);
                }
                /**
                 * Configures sankey nodes&apos; labels.
                
                 */
                get label() {
                    return this._getOption('label');
                }
                set label(value) {
                    this._setOption('label', value);
                }
                /**
                 * Configures sankey links&apos; appearance.
                
                 */
                get link() {
                    return this._getOption('link');
                }
                set link(value) {
                    this._setOption('link', value);
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
                 * Generates space around the UI component.
                
                 */
                get margin() {
                    return this._getOption('margin');
                }
                set margin(value) {
                    this._setOption('margin', value);
                }
                /**
                 * Configures sankey nodes&apos; appearance.
                
                 */
                get node() {
                    return this._getOption('node');
                }
                set node(value) {
                    this._setOption('node', value);
                }
                /**
                 * Sets the palette to be used to colorize sankey nodes.
                
                 */
                get palette() {
                    return this._getOption('palette');
                }
                set palette(value) {
                    this._setOption('palette', value);
                }
                /**
                 * Specifies how to extend the palette when it contains less colors than the number of sankey nodes.
                
                 */
                get paletteExtensionMode() {
                    return this._getOption('paletteExtensionMode');
                }
                set paletteExtensionMode(value) {
                    this._setOption('paletteExtensionMode', value);
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
                 * Specifies the UI component&apos;s size in pixels.
                
                 */
                get size() {
                    return this._getOption('size');
                }
                set size(value) {
                    this._setOption('size', value);
                }
                /**
                 * Specifies nodes&apos; sorting order in their columns.
                
                 */
                get sortData() {
                    return this._getOption('sortData');
                }
                set sortData(value) {
                    this._setOption('sortData', value);
                }
                /**
                 * Specifies which data source field provides links&apos; source nodes.
                
                 */
                get sourceField() {
                    return this._getOption('sourceField');
                }
                set sourceField(value) {
                    this._setOption('sourceField', value);
                }
                /**
                 * Specifies which data source field provides links&apos; target nodes.
                
                 */
                get targetField() {
                    return this._getOption('targetField');
                }
                set targetField(value) {
                    this._setOption('targetField', value);
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
                 * Specifies which data source field provides links&apos; weights.
                
                 */
                get weightField() {
                    return this._getOption('weightField');
                }
                set weightField(value) {
                    this._setOption('weightField', value);
                }
                /**
                
                 * A function that is executed before the UI component is disposed of.
                
                
                 */
                onDisposing;
                /**
                
                 * A function that is executed when the UI component&apos;s rendering has finished.
                
                
                 */
                onDrawn;
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
                
                 * A function that is executed when an error or warning occurs.
                
                
                 */
                onIncidentOccurred;
                /**
                
                 * A function used in JavaScript frameworks to save the UI component instance.
                
                
                 */
                onInitialized;
                /**
                
                 * A function that is executed when a sankey link is clicked or tapped.
                
                
                 */
                onLinkClick;
                /**
                
                 * A function that is executed after the pointer enters or leaves a sankey link.
                
                
                 */
                onLinkHoverChanged;
                /**
                
                 * A function that is executed when a sankey node is clicked or tapped.
                
                
                 */
                onNodeClick;
                /**
                
                 * A function that is executed after the pointer enters or leaves a sankey node.
                
                
                 */
                onNodeHoverChanged;
                /**
                
                 * A function that is executed after a UI component property is changed.
                
                
                 */
                onOptionChanged;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                adaptiveLayoutChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                alignmentChange;
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
                hoverEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                labelChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                linkChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                loadingIndicatorChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                marginChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                nodeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                paletteChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                paletteExtensionModeChange;
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
                sizeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                sortDataChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                sourceFieldChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                targetFieldChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                themeChange;
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
                weightFieldChange;
                constructor(elementRef, ngZone, templateHost, _watcherHelper, _idh, optionHost, transferState, platformId) {
                    super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);
                    this._watcherHelper = _watcherHelper;
                    this._idh = _idh;
                    this._createEventEmitters([
                        { subscribe: 'disposing', emit: 'onDisposing' },
                        { subscribe: 'drawn', emit: 'onDrawn' },
                        { subscribe: 'exported', emit: 'onExported' },
                        { subscribe: 'exporting', emit: 'onExporting' },
                        { subscribe: 'fileSaving', emit: 'onFileSaving' },
                        { subscribe: 'incidentOccurred', emit: 'onIncidentOccurred' },
                        { subscribe: 'initialized', emit: 'onInitialized' },
                        { subscribe: 'linkClick', emit: 'onLinkClick' },
                        { subscribe: 'linkHoverChanged', emit: 'onLinkHoverChanged' },
                        { subscribe: 'nodeClick', emit: 'onNodeClick' },
                        { subscribe: 'nodeHoverChanged', emit: 'onNodeHoverChanged' },
                        { subscribe: 'optionChanged', emit: 'onOptionChanged' },
                        { emit: 'adaptiveLayoutChange' },
                        { emit: 'alignmentChange' },
                        { emit: 'dataSourceChange' },
                        { emit: 'disabledChange' },
                        { emit: 'elementAttrChange' },
                        { emit: 'exportChange' },
                        { emit: 'hoverEnabledChange' },
                        { emit: 'labelChange' },
                        { emit: 'linkChange' },
                        { emit: 'loadingIndicatorChange' },
                        { emit: 'marginChange' },
                        { emit: 'nodeChange' },
                        { emit: 'paletteChange' },
                        { emit: 'paletteExtensionModeChange' },
                        { emit: 'pathModifiedChange' },
                        { emit: 'redrawOnResizeChange' },
                        { emit: 'rtlEnabledChange' },
                        { emit: 'sizeChange' },
                        { emit: 'sortDataChange' },
                        { emit: 'sourceFieldChange' },
                        { emit: 'targetFieldChange' },
                        { emit: 'themeChange' },
                        { emit: 'titleChange' },
                        { emit: 'tooltipChange' },
                        { emit: 'weightFieldChange' }
                    ]);
                    this._idh.setHost(this);
                    optionHost.setHost(this);
                }
                _createInstance(element, options) {
                    return new DxSankey(element, options);
                }
                ngOnDestroy() {
                    this._destroyWidget();
                }
                ngOnChanges(changes) {
                    super.ngOnChanges(changes);
                    this.setupChanges('alignment', changes);
                    this.setupChanges('dataSource', changes);
                    this.setupChanges('palette', changes);
                }
                setupChanges(prop, changes) {
                    if (!(prop in this._optionsToUpdate)) {
                        this._idh.setup(prop, changes);
                    }
                }
                ngDoCheck() {
                    this._idh.doCheck('alignment');
                    this._idh.doCheck('dataSource');
                    this._idh.doCheck('palette');
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
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxSankeyComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: DxTemplateHost }, { token: WatcherHelper }, { token: IterableDifferHelper }, { token: NestedOptionHost }, { token: i2.TransferState }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
                /** @nocollapse */ static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.0", type: DxSankeyComponent, selector: "dx-sankey", inputs: { adaptiveLayout: "adaptiveLayout", alignment: "alignment", dataSource: "dataSource", disabled: "disabled", elementAttr: "elementAttr", export: "export", hoverEnabled: "hoverEnabled", label: "label", link: "link", loadingIndicator: "loadingIndicator", margin: "margin", node: "node", palette: "palette", paletteExtensionMode: "paletteExtensionMode", pathModified: "pathModified", redrawOnResize: "redrawOnResize", rtlEnabled: "rtlEnabled", size: "size", sortData: "sortData", sourceField: "sourceField", targetField: "targetField", theme: "theme", title: "title", tooltip: "tooltip", weightField: "weightField" }, outputs: { onDisposing: "onDisposing", onDrawn: "onDrawn", onExported: "onExported", onExporting: "onExporting", onFileSaving: "onFileSaving", onIncidentOccurred: "onIncidentOccurred", onInitialized: "onInitialized", onLinkClick: "onLinkClick", onLinkHoverChanged: "onLinkHoverChanged", onNodeClick: "onNodeClick", onNodeHoverChanged: "onNodeHoverChanged", onOptionChanged: "onOptionChanged", adaptiveLayoutChange: "adaptiveLayoutChange", alignmentChange: "alignmentChange", dataSourceChange: "dataSourceChange", disabledChange: "disabledChange", elementAttrChange: "elementAttrChange", exportChange: "exportChange", hoverEnabledChange: "hoverEnabledChange", labelChange: "labelChange", linkChange: "linkChange", loadingIndicatorChange: "loadingIndicatorChange", marginChange: "marginChange", nodeChange: "nodeChange", paletteChange: "paletteChange", paletteExtensionModeChange: "paletteExtensionModeChange", pathModifiedChange: "pathModifiedChange", redrawOnResizeChange: "redrawOnResizeChange", rtlEnabledChange: "rtlEnabledChange", sizeChange: "sizeChange", sortDataChange: "sortDataChange", sourceFieldChange: "sourceFieldChange", targetFieldChange: "targetFieldChange", themeChange: "themeChange", titleChange: "titleChange", tooltipChange: "tooltipChange", weightFieldChange: "weightFieldChange" }, providers: [
                        DxTemplateHost,
                        WatcherHelper,
                        NestedOptionHost,
                        IterableDifferHelper
                    ], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: '', isInline: true, styles: [":host{display:block}\n"] });
            } exports("DxSankeyComponent", DxSankeyComponent);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxSankeyComponent, decorators: [{
                        type: Component,
                        args: [{ selector: 'dx-sankey', template: '', providers: [
                                    DxTemplateHost,
                                    WatcherHelper,
                                    NestedOptionHost,
                                    IterableDifferHelper
                                ], styles: [":host{display:block}\n"] }]
                    }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: DxTemplateHost }, { type: WatcherHelper }, { type: IterableDifferHelper }, { type: NestedOptionHost }, { type: i2.TransferState }, { type: undefined, decorators: [{
                                type: Inject,
                                args: [PLATFORM_ID]
                            }] }], propDecorators: { adaptiveLayout: [{
                            type: Input
                        }], alignment: [{
                            type: Input
                        }], dataSource: [{
                            type: Input
                        }], disabled: [{
                            type: Input
                        }], elementAttr: [{
                            type: Input
                        }], export: [{
                            type: Input
                        }], hoverEnabled: [{
                            type: Input
                        }], label: [{
                            type: Input
                        }], link: [{
                            type: Input
                        }], loadingIndicator: [{
                            type: Input
                        }], margin: [{
                            type: Input
                        }], node: [{
                            type: Input
                        }], palette: [{
                            type: Input
                        }], paletteExtensionMode: [{
                            type: Input
                        }], pathModified: [{
                            type: Input
                        }], redrawOnResize: [{
                            type: Input
                        }], rtlEnabled: [{
                            type: Input
                        }], size: [{
                            type: Input
                        }], sortData: [{
                            type: Input
                        }], sourceField: [{
                            type: Input
                        }], targetField: [{
                            type: Input
                        }], theme: [{
                            type: Input
                        }], title: [{
                            type: Input
                        }], tooltip: [{
                            type: Input
                        }], weightField: [{
                            type: Input
                        }], onDisposing: [{
                            type: Output
                        }], onDrawn: [{
                            type: Output
                        }], onExported: [{
                            type: Output
                        }], onExporting: [{
                            type: Output
                        }], onFileSaving: [{
                            type: Output
                        }], onIncidentOccurred: [{
                            type: Output
                        }], onInitialized: [{
                            type: Output
                        }], onLinkClick: [{
                            type: Output
                        }], onLinkHoverChanged: [{
                            type: Output
                        }], onNodeClick: [{
                            type: Output
                        }], onNodeHoverChanged: [{
                            type: Output
                        }], onOptionChanged: [{
                            type: Output
                        }], adaptiveLayoutChange: [{
                            type: Output
                        }], alignmentChange: [{
                            type: Output
                        }], dataSourceChange: [{
                            type: Output
                        }], disabledChange: [{
                            type: Output
                        }], elementAttrChange: [{
                            type: Output
                        }], exportChange: [{
                            type: Output
                        }], hoverEnabledChange: [{
                            type: Output
                        }], labelChange: [{
                            type: Output
                        }], linkChange: [{
                            type: Output
                        }], loadingIndicatorChange: [{
                            type: Output
                        }], marginChange: [{
                            type: Output
                        }], nodeChange: [{
                            type: Output
                        }], paletteChange: [{
                            type: Output
                        }], paletteExtensionModeChange: [{
                            type: Output
                        }], pathModifiedChange: [{
                            type: Output
                        }], redrawOnResizeChange: [{
                            type: Output
                        }], rtlEnabledChange: [{
                            type: Output
                        }], sizeChange: [{
                            type: Output
                        }], sortDataChange: [{
                            type: Output
                        }], sourceFieldChange: [{
                            type: Output
                        }], targetFieldChange: [{
                            type: Output
                        }], themeChange: [{
                            type: Output
                        }], titleChange: [{
                            type: Output
                        }], tooltipChange: [{
                            type: Output
                        }], weightFieldChange: [{
                            type: Output
                        }] } });
            class DxSankeyModule {
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxSankeyModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
                /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0, type: DxSankeyModule, declarations: [DxSankeyComponent], imports: [DxoAdaptiveLayoutModule,
                        DxoExportModule,
                        DxoLabelModule,
                        DxoBorderModule,
                        DxoFontModule,
                        DxoShadowModule,
                        DxoLinkModule,
                        DxoHoverStyleModule,
                        DxoHatchingModule,
                        DxoLoadingIndicatorModule,
                        DxoMarginModule,
                        DxoNodeModule,
                        DxoSizeModule,
                        DxoTitleModule,
                        DxoSubtitleModule,
                        DxoTooltipModule,
                        DxoFormatModule,
                        DxIntegrationModule,
                        DxTemplateModule], exports: [DxSankeyComponent, DxoAdaptiveLayoutModule,
                        DxoExportModule,
                        DxoLabelModule,
                        DxoBorderModule,
                        DxoFontModule,
                        DxoShadowModule,
                        DxoLinkModule,
                        DxoHoverStyleModule,
                        DxoHatchingModule,
                        DxoLoadingIndicatorModule,
                        DxoMarginModule,
                        DxoNodeModule,
                        DxoSizeModule,
                        DxoTitleModule,
                        DxoSubtitleModule,
                        DxoTooltipModule,
                        DxoFormatModule,
                        DxTemplateModule] });
                /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxSankeyModule, imports: [DxoAdaptiveLayoutModule,
                        DxoExportModule,
                        DxoLabelModule,
                        DxoBorderModule,
                        DxoFontModule,
                        DxoShadowModule,
                        DxoLinkModule,
                        DxoHoverStyleModule,
                        DxoHatchingModule,
                        DxoLoadingIndicatorModule,
                        DxoMarginModule,
                        DxoNodeModule,
                        DxoSizeModule,
                        DxoTitleModule,
                        DxoSubtitleModule,
                        DxoTooltipModule,
                        DxoFormatModule,
                        DxIntegrationModule,
                        DxTemplateModule, DxoAdaptiveLayoutModule,
                        DxoExportModule,
                        DxoLabelModule,
                        DxoBorderModule,
                        DxoFontModule,
                        DxoShadowModule,
                        DxoLinkModule,
                        DxoHoverStyleModule,
                        DxoHatchingModule,
                        DxoLoadingIndicatorModule,
                        DxoMarginModule,
                        DxoNodeModule,
                        DxoSizeModule,
                        DxoTitleModule,
                        DxoSubtitleModule,
                        DxoTooltipModule,
                        DxoFormatModule,
                        DxTemplateModule] });
            } exports("DxSankeyModule", DxSankeyModule);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxSankeyModule, decorators: [{
                        type: NgModule,
                        args: [{
                                imports: [
                                    DxoAdaptiveLayoutModule,
                                    DxoExportModule,
                                    DxoLabelModule,
                                    DxoBorderModule,
                                    DxoFontModule,
                                    DxoShadowModule,
                                    DxoLinkModule,
                                    DxoHoverStyleModule,
                                    DxoHatchingModule,
                                    DxoLoadingIndicatorModule,
                                    DxoMarginModule,
                                    DxoNodeModule,
                                    DxoSizeModule,
                                    DxoTitleModule,
                                    DxoSubtitleModule,
                                    DxoTooltipModule,
                                    DxoFormatModule,
                                    DxIntegrationModule,
                                    DxTemplateModule
                                ],
                                declarations: [
                                    DxSankeyComponent
                                ],
                                exports: [
                                    DxSankeyComponent,
                                    DxoAdaptiveLayoutModule,
                                    DxoExportModule,
                                    DxoLabelModule,
                                    DxoBorderModule,
                                    DxoFontModule,
                                    DxoShadowModule,
                                    DxoLinkModule,
                                    DxoHoverStyleModule,
                                    DxoHatchingModule,
                                    DxoLoadingIndicatorModule,
                                    DxoMarginModule,
                                    DxoNodeModule,
                                    DxoSizeModule,
                                    DxoTitleModule,
                                    DxoSubtitleModule,
                                    DxoTooltipModule,
                                    DxoFormatModule,
                                    DxTemplateModule
                                ]
                            }]
                    }] });

        })
    };
}));
