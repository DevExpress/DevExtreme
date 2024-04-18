System.register(['@angular/platform-browser', '@angular/core', 'devextreme/viz/vector_map', './devextreme-angular-core.js', './devextreme-angular-ui-nested.js', '@angular/common', 'devextreme/core/dom_adapter', 'devextreme/events', 'devextreme/core/utils/common', 'devextreme/core/renderer', 'devextreme/core/http_request', 'devextreme/core/utils/ready_callbacks', 'devextreme/events/core/events_engine', 'devextreme/core/utils/ajax', 'devextreme/core/utils/deferred'], (function (exports) {
    'use strict';
    var i2, i0, PLATFORM_ID, Component, Inject, Input, Output, ContentChildren, NgModule, DxVectorMap, DxComponent, DxTemplateHost, WatcherHelper, IterableDifferHelper, NestedOptionHost, DxIntegrationModule, DxTemplateModule, DxiAnnotationComponent, DxiLayerComponent, DxiLegendComponent, DxiAnnotationModule, DxoBorderModule, DxoFontModule, DxoImageModule, DxoShadowModule, DxoBackgroundModule, DxoCommonAnnotationSettingsModule, DxoControlBarModule, DxoExportModule, DxiLayerModule, DxoLabelModule, DxiLegendModule, DxoMarginModule, DxoSourceModule, DxoTitleModule, DxoSubtitleModule, DxoLoadingIndicatorModule, DxoProjectionModule, DxoSizeModule, DxoTooltipModule;
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
            DxVectorMap = module.default;
        }, function (module) {
            DxComponent = module.c;
            DxTemplateHost = module.h;
            WatcherHelper = module.W;
            IterableDifferHelper = module.I;
            NestedOptionHost = module.i;
            DxIntegrationModule = module.e;
            DxTemplateModule = module.D;
        }, function (module) {
            DxiAnnotationComponent = module.DxiAnnotationComponent;
            DxiLayerComponent = module.DxiLayerComponent;
            DxiLegendComponent = module.DxiLegendComponent;
            DxiAnnotationModule = module.DxiAnnotationModule;
            DxoBorderModule = module.DxoBorderModule;
            DxoFontModule = module.DxoFontModule;
            DxoImageModule = module.DxoImageModule;
            DxoShadowModule = module.DxoShadowModule;
            DxoBackgroundModule = module.DxoBackgroundModule;
            DxoCommonAnnotationSettingsModule = module.DxoCommonAnnotationSettingsModule;
            DxoControlBarModule = module.DxoControlBarModule;
            DxoExportModule = module.DxoExportModule;
            DxiLayerModule = module.DxiLayerModule;
            DxoLabelModule = module.DxoLabelModule;
            DxiLegendModule = module.DxiLegendModule;
            DxoMarginModule = module.DxoMarginModule;
            DxoSourceModule = module.DxoSourceModule;
            DxoTitleModule = module.DxoTitleModule;
            DxoSubtitleModule = module.DxoSubtitleModule;
            DxoLoadingIndicatorModule = module.DxoLoadingIndicatorModule;
            DxoProjectionModule = module.DxoProjectionModule;
            DxoSizeModule = module.DxoSizeModule;
            DxoTooltipModule = module.DxoTooltipModule;
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
             * The VectorMap is a UI component that visualizes geographical locations. This UI component represents a geographical map that contains areas and markers. Areas embody continents and countries. Markers flag specific points on the map, for example, towns, cities or capitals.

             */
            class DxVectorMapComponent extends DxComponent {
                _watcherHelper;
                _idh;
                instance = null;
                /**
                 * Specifies the annotation collection.
                
                 */
                get annotations() {
                    return this._getOption('annotations');
                }
                set annotations(value) {
                    this._setOption('annotations', value);
                }
                /**
                 * Specifies the properties for the map background.
                
                 */
                get background() {
                    return this._getOption('background');
                }
                set background(value) {
                    this._setOption('background', value);
                }
                /**
                 * Specifies the positioning of a map in geographical coordinates.
                
                 */
                get bounds() {
                    return this._getOption('bounds');
                }
                set bounds(value) {
                    this._setOption('bounds', value);
                }
                /**
                 * Specifies the geographical coordinates of the center for a map.
                
                 */
                get center() {
                    return this._getOption('center');
                }
                set center(value) {
                    this._setOption('center', value);
                }
                /**
                 * Specifies settings common for all annotations in the VectorMap.
                
                 */
                get commonAnnotationSettings() {
                    return this._getOption('commonAnnotationSettings');
                }
                set commonAnnotationSettings(value) {
                    this._setOption('commonAnnotationSettings', value);
                }
                /**
                 * Configures the control bar.
                
                 */
                get controlBar() {
                    return this._getOption('controlBar');
                }
                set controlBar(value) {
                    this._setOption('controlBar', value);
                }
                /**
                 * Customizes an individual annotation.
                
                 */
                get customizeAnnotation() {
                    return this._getOption('customizeAnnotation');
                }
                set customizeAnnotation(value) {
                    this._setOption('customizeAnnotation', value);
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
                 * Specifies properties for VectorMap UI component layers.
                
                 */
                get layers() {
                    return this._getOption('layers');
                }
                set layers(value) {
                    this._setOption('layers', value);
                }
                /**
                 * Configures map legends.
                
                 */
                get legends() {
                    return this._getOption('legends');
                }
                set legends(value) {
                    this._setOption('legends', value);
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
                 * Specifies a map&apos;s maximum zoom factor.
                
                 */
                get maxZoomFactor() {
                    return this._getOption('maxZoomFactor');
                }
                set maxZoomFactor(value) {
                    this._setOption('maxZoomFactor', value);
                }
                /**
                 * Disables the panning capability.
                
                 */
                get panningEnabled() {
                    return this._getOption('panningEnabled');
                }
                set panningEnabled(value) {
                    this._setOption('panningEnabled', value);
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
                 * Specifies the map projection.
                
                 */
                get projection() {
                    return this._getOption('projection');
                }
                set projection(value) {
                    this._setOption('projection', value);
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
                 * Configures tooltips.
                
                 */
                get tooltip() {
                    return this._getOption('tooltip');
                }
                set tooltip(value) {
                    this._setOption('tooltip', value);
                }
                /**
                 * Specifies whether the map should respond to touch gestures.
                
                 */
                get touchEnabled() {
                    return this._getOption('touchEnabled');
                }
                set touchEnabled(value) {
                    this._setOption('touchEnabled', value);
                }
                /**
                 * Specifies whether or not the map should respond when a user rolls the mouse wheel.
                
                 */
                get wheelEnabled() {
                    return this._getOption('wheelEnabled');
                }
                set wheelEnabled(value) {
                    this._setOption('wheelEnabled', value);
                }
                /**
                 * Specifies a number that is used to zoom a map initially.
                
                 */
                get zoomFactor() {
                    return this._getOption('zoomFactor');
                }
                set zoomFactor(value) {
                    this._setOption('zoomFactor', value);
                }
                /**
                 * Disables the zooming capability.
                
                 */
                get zoomingEnabled() {
                    return this._getOption('zoomingEnabled');
                }
                set zoomingEnabled(value) {
                    this._setOption('zoomingEnabled', value);
                }
                /**
                
                 * A function that is executed each time the center coordinates are changed.
                
                
                 */
                onCenterChanged;
                /**
                
                 * A function that is executed when any location on the map is clicked or tapped.
                
                
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
                
                 * A function that is executed after a UI component property is changed.
                
                
                 */
                onOptionChanged;
                /**
                
                 * A function that is executed when a layer element is selected or selection is canceled.
                
                
                 */
                onSelectionChanged;
                /**
                
                 * A function that is executed when a tooltip becomes hidden.
                
                
                 */
                onTooltipHidden;
                /**
                
                 * A function that is executed when a tooltip appears.
                
                
                 */
                onTooltipShown;
                /**
                
                 * A function that is executed each time the zoom factor is changed.
                
                
                 */
                onZoomFactorChanged;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                annotationsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                backgroundChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                boundsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                centerChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                commonAnnotationSettingsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                controlBarChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                customizeAnnotationChange;
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
                layersChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                legendsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                loadingIndicatorChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                maxZoomFactorChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                panningEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                pathModifiedChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                projectionChange;
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
                touchEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                wheelEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                zoomFactorChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                zoomingEnabledChange;
                get annotationsChildren() {
                    return this._getOption('annotations');
                }
                set annotationsChildren(value) {
                    this.setChildren('annotations', value);
                }
                get layersChildren() {
                    return this._getOption('layers');
                }
                set layersChildren(value) {
                    this.setChildren('layers', value);
                }
                get legendsChildren() {
                    return this._getOption('legends');
                }
                set legendsChildren(value) {
                    this.setChildren('legends', value);
                }
                constructor(elementRef, ngZone, templateHost, _watcherHelper, _idh, optionHost, transferState, platformId) {
                    super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);
                    this._watcherHelper = _watcherHelper;
                    this._idh = _idh;
                    this._createEventEmitters([
                        { subscribe: 'centerChanged', emit: 'onCenterChanged' },
                        { subscribe: 'click', emit: 'onClick' },
                        { subscribe: 'disposing', emit: 'onDisposing' },
                        { subscribe: 'drawn', emit: 'onDrawn' },
                        { subscribe: 'exported', emit: 'onExported' },
                        { subscribe: 'exporting', emit: 'onExporting' },
                        { subscribe: 'fileSaving', emit: 'onFileSaving' },
                        { subscribe: 'incidentOccurred', emit: 'onIncidentOccurred' },
                        { subscribe: 'initialized', emit: 'onInitialized' },
                        { subscribe: 'optionChanged', emit: 'onOptionChanged' },
                        { subscribe: 'selectionChanged', emit: 'onSelectionChanged' },
                        { subscribe: 'tooltipHidden', emit: 'onTooltipHidden' },
                        { subscribe: 'tooltipShown', emit: 'onTooltipShown' },
                        { subscribe: 'zoomFactorChanged', emit: 'onZoomFactorChanged' },
                        { emit: 'annotationsChange' },
                        { emit: 'backgroundChange' },
                        { emit: 'boundsChange' },
                        { emit: 'centerChange' },
                        { emit: 'commonAnnotationSettingsChange' },
                        { emit: 'controlBarChange' },
                        { emit: 'customizeAnnotationChange' },
                        { emit: 'disabledChange' },
                        { emit: 'elementAttrChange' },
                        { emit: 'exportChange' },
                        { emit: 'layersChange' },
                        { emit: 'legendsChange' },
                        { emit: 'loadingIndicatorChange' },
                        { emit: 'maxZoomFactorChange' },
                        { emit: 'panningEnabledChange' },
                        { emit: 'pathModifiedChange' },
                        { emit: 'projectionChange' },
                        { emit: 'redrawOnResizeChange' },
                        { emit: 'rtlEnabledChange' },
                        { emit: 'sizeChange' },
                        { emit: 'themeChange' },
                        { emit: 'titleChange' },
                        { emit: 'tooltipChange' },
                        { emit: 'touchEnabledChange' },
                        { emit: 'wheelEnabledChange' },
                        { emit: 'zoomFactorChange' },
                        { emit: 'zoomingEnabledChange' }
                    ]);
                    this._idh.setHost(this);
                    optionHost.setHost(this);
                }
                _createInstance(element, options) {
                    return new DxVectorMap(element, options);
                }
                ngOnDestroy() {
                    this._destroyWidget();
                }
                ngOnChanges(changes) {
                    super.ngOnChanges(changes);
                    this.setupChanges('annotations', changes);
                    this.setupChanges('bounds', changes);
                    this.setupChanges('center', changes);
                    this.setupChanges('layers', changes);
                    this.setupChanges('legends', changes);
                }
                setupChanges(prop, changes) {
                    if (!(prop in this._optionsToUpdate)) {
                        this._idh.setup(prop, changes);
                    }
                }
                ngDoCheck() {
                    this._idh.doCheck('annotations');
                    this._idh.doCheck('bounds');
                    this._idh.doCheck('center');
                    this._idh.doCheck('layers');
                    this._idh.doCheck('legends');
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
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxVectorMapComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: DxTemplateHost }, { token: WatcherHelper }, { token: IterableDifferHelper }, { token: NestedOptionHost }, { token: i2.TransferState }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
                /** @nocollapse */ static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.0", type: DxVectorMapComponent, selector: "dx-vector-map", inputs: { annotations: "annotations", background: "background", bounds: "bounds", center: "center", commonAnnotationSettings: "commonAnnotationSettings", controlBar: "controlBar", customizeAnnotation: "customizeAnnotation", disabled: "disabled", elementAttr: "elementAttr", export: "export", layers: "layers", legends: "legends", loadingIndicator: "loadingIndicator", maxZoomFactor: "maxZoomFactor", panningEnabled: "panningEnabled", pathModified: "pathModified", projection: "projection", redrawOnResize: "redrawOnResize", rtlEnabled: "rtlEnabled", size: "size", theme: "theme", title: "title", tooltip: "tooltip", touchEnabled: "touchEnabled", wheelEnabled: "wheelEnabled", zoomFactor: "zoomFactor", zoomingEnabled: "zoomingEnabled" }, outputs: { onCenterChanged: "onCenterChanged", onClick: "onClick", onDisposing: "onDisposing", onDrawn: "onDrawn", onExported: "onExported", onExporting: "onExporting", onFileSaving: "onFileSaving", onIncidentOccurred: "onIncidentOccurred", onInitialized: "onInitialized", onOptionChanged: "onOptionChanged", onSelectionChanged: "onSelectionChanged", onTooltipHidden: "onTooltipHidden", onTooltipShown: "onTooltipShown", onZoomFactorChanged: "onZoomFactorChanged", annotationsChange: "annotationsChange", backgroundChange: "backgroundChange", boundsChange: "boundsChange", centerChange: "centerChange", commonAnnotationSettingsChange: "commonAnnotationSettingsChange", controlBarChange: "controlBarChange", customizeAnnotationChange: "customizeAnnotationChange", disabledChange: "disabledChange", elementAttrChange: "elementAttrChange", exportChange: "exportChange", layersChange: "layersChange", legendsChange: "legendsChange", loadingIndicatorChange: "loadingIndicatorChange", maxZoomFactorChange: "maxZoomFactorChange", panningEnabledChange: "panningEnabledChange", pathModifiedChange: "pathModifiedChange", projectionChange: "projectionChange", redrawOnResizeChange: "redrawOnResizeChange", rtlEnabledChange: "rtlEnabledChange", sizeChange: "sizeChange", themeChange: "themeChange", titleChange: "titleChange", tooltipChange: "tooltipChange", touchEnabledChange: "touchEnabledChange", wheelEnabledChange: "wheelEnabledChange", zoomFactorChange: "zoomFactorChange", zoomingEnabledChange: "zoomingEnabledChange" }, providers: [
                        DxTemplateHost,
                        WatcherHelper,
                        NestedOptionHost,
                        IterableDifferHelper
                    ], queries: [{ propertyName: "annotationsChildren", predicate: DxiAnnotationComponent }, { propertyName: "layersChildren", predicate: DxiLayerComponent }, { propertyName: "legendsChildren", predicate: DxiLegendComponent }], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: '', isInline: true, styles: [":host{display:block}\n"] });
            } exports("DxVectorMapComponent", DxVectorMapComponent);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxVectorMapComponent, decorators: [{
                        type: Component,
                        args: [{ selector: 'dx-vector-map', template: '', providers: [
                                    DxTemplateHost,
                                    WatcherHelper,
                                    NestedOptionHost,
                                    IterableDifferHelper
                                ], styles: [":host{display:block}\n"] }]
                    }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: DxTemplateHost }, { type: WatcherHelper }, { type: IterableDifferHelper }, { type: NestedOptionHost }, { type: i2.TransferState }, { type: undefined, decorators: [{
                                type: Inject,
                                args: [PLATFORM_ID]
                            }] }], propDecorators: { annotations: [{
                            type: Input
                        }], background: [{
                            type: Input
                        }], bounds: [{
                            type: Input
                        }], center: [{
                            type: Input
                        }], commonAnnotationSettings: [{
                            type: Input
                        }], controlBar: [{
                            type: Input
                        }], customizeAnnotation: [{
                            type: Input
                        }], disabled: [{
                            type: Input
                        }], elementAttr: [{
                            type: Input
                        }], export: [{
                            type: Input
                        }], layers: [{
                            type: Input
                        }], legends: [{
                            type: Input
                        }], loadingIndicator: [{
                            type: Input
                        }], maxZoomFactor: [{
                            type: Input
                        }], panningEnabled: [{
                            type: Input
                        }], pathModified: [{
                            type: Input
                        }], projection: [{
                            type: Input
                        }], redrawOnResize: [{
                            type: Input
                        }], rtlEnabled: [{
                            type: Input
                        }], size: [{
                            type: Input
                        }], theme: [{
                            type: Input
                        }], title: [{
                            type: Input
                        }], tooltip: [{
                            type: Input
                        }], touchEnabled: [{
                            type: Input
                        }], wheelEnabled: [{
                            type: Input
                        }], zoomFactor: [{
                            type: Input
                        }], zoomingEnabled: [{
                            type: Input
                        }], onCenterChanged: [{
                            type: Output
                        }], onClick: [{
                            type: Output
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
                        }], onOptionChanged: [{
                            type: Output
                        }], onSelectionChanged: [{
                            type: Output
                        }], onTooltipHidden: [{
                            type: Output
                        }], onTooltipShown: [{
                            type: Output
                        }], onZoomFactorChanged: [{
                            type: Output
                        }], annotationsChange: [{
                            type: Output
                        }], backgroundChange: [{
                            type: Output
                        }], boundsChange: [{
                            type: Output
                        }], centerChange: [{
                            type: Output
                        }], commonAnnotationSettingsChange: [{
                            type: Output
                        }], controlBarChange: [{
                            type: Output
                        }], customizeAnnotationChange: [{
                            type: Output
                        }], disabledChange: [{
                            type: Output
                        }], elementAttrChange: [{
                            type: Output
                        }], exportChange: [{
                            type: Output
                        }], layersChange: [{
                            type: Output
                        }], legendsChange: [{
                            type: Output
                        }], loadingIndicatorChange: [{
                            type: Output
                        }], maxZoomFactorChange: [{
                            type: Output
                        }], panningEnabledChange: [{
                            type: Output
                        }], pathModifiedChange: [{
                            type: Output
                        }], projectionChange: [{
                            type: Output
                        }], redrawOnResizeChange: [{
                            type: Output
                        }], rtlEnabledChange: [{
                            type: Output
                        }], sizeChange: [{
                            type: Output
                        }], themeChange: [{
                            type: Output
                        }], titleChange: [{
                            type: Output
                        }], tooltipChange: [{
                            type: Output
                        }], touchEnabledChange: [{
                            type: Output
                        }], wheelEnabledChange: [{
                            type: Output
                        }], zoomFactorChange: [{
                            type: Output
                        }], zoomingEnabledChange: [{
                            type: Output
                        }], annotationsChildren: [{
                            type: ContentChildren,
                            args: [DxiAnnotationComponent]
                        }], layersChildren: [{
                            type: ContentChildren,
                            args: [DxiLayerComponent]
                        }], legendsChildren: [{
                            type: ContentChildren,
                            args: [DxiLegendComponent]
                        }] } });
            class DxVectorMapModule {
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxVectorMapModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
                /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0, type: DxVectorMapModule, declarations: [DxVectorMapComponent], imports: [DxiAnnotationModule,
                        DxoBorderModule,
                        DxoFontModule,
                        DxoImageModule,
                        DxoShadowModule,
                        DxoBackgroundModule,
                        DxoCommonAnnotationSettingsModule,
                        DxoControlBarModule,
                        DxoExportModule,
                        DxiLayerModule,
                        DxoLabelModule,
                        DxiLegendModule,
                        DxoMarginModule,
                        DxoSourceModule,
                        DxoTitleModule,
                        DxoSubtitleModule,
                        DxoLoadingIndicatorModule,
                        DxoProjectionModule,
                        DxoSizeModule,
                        DxoTooltipModule,
                        DxIntegrationModule,
                        DxTemplateModule], exports: [DxVectorMapComponent, DxiAnnotationModule,
                        DxoBorderModule,
                        DxoFontModule,
                        DxoImageModule,
                        DxoShadowModule,
                        DxoBackgroundModule,
                        DxoCommonAnnotationSettingsModule,
                        DxoControlBarModule,
                        DxoExportModule,
                        DxiLayerModule,
                        DxoLabelModule,
                        DxiLegendModule,
                        DxoMarginModule,
                        DxoSourceModule,
                        DxoTitleModule,
                        DxoSubtitleModule,
                        DxoLoadingIndicatorModule,
                        DxoProjectionModule,
                        DxoSizeModule,
                        DxoTooltipModule,
                        DxTemplateModule] });
                /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxVectorMapModule, imports: [DxiAnnotationModule,
                        DxoBorderModule,
                        DxoFontModule,
                        DxoImageModule,
                        DxoShadowModule,
                        DxoBackgroundModule,
                        DxoCommonAnnotationSettingsModule,
                        DxoControlBarModule,
                        DxoExportModule,
                        DxiLayerModule,
                        DxoLabelModule,
                        DxiLegendModule,
                        DxoMarginModule,
                        DxoSourceModule,
                        DxoTitleModule,
                        DxoSubtitleModule,
                        DxoLoadingIndicatorModule,
                        DxoProjectionModule,
                        DxoSizeModule,
                        DxoTooltipModule,
                        DxIntegrationModule,
                        DxTemplateModule, DxiAnnotationModule,
                        DxoBorderModule,
                        DxoFontModule,
                        DxoImageModule,
                        DxoShadowModule,
                        DxoBackgroundModule,
                        DxoCommonAnnotationSettingsModule,
                        DxoControlBarModule,
                        DxoExportModule,
                        DxiLayerModule,
                        DxoLabelModule,
                        DxiLegendModule,
                        DxoMarginModule,
                        DxoSourceModule,
                        DxoTitleModule,
                        DxoSubtitleModule,
                        DxoLoadingIndicatorModule,
                        DxoProjectionModule,
                        DxoSizeModule,
                        DxoTooltipModule,
                        DxTemplateModule] });
            } exports("DxVectorMapModule", DxVectorMapModule);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxVectorMapModule, decorators: [{
                        type: NgModule,
                        args: [{
                                imports: [
                                    DxiAnnotationModule,
                                    DxoBorderModule,
                                    DxoFontModule,
                                    DxoImageModule,
                                    DxoShadowModule,
                                    DxoBackgroundModule,
                                    DxoCommonAnnotationSettingsModule,
                                    DxoControlBarModule,
                                    DxoExportModule,
                                    DxiLayerModule,
                                    DxoLabelModule,
                                    DxiLegendModule,
                                    DxoMarginModule,
                                    DxoSourceModule,
                                    DxoTitleModule,
                                    DxoSubtitleModule,
                                    DxoLoadingIndicatorModule,
                                    DxoProjectionModule,
                                    DxoSizeModule,
                                    DxoTooltipModule,
                                    DxIntegrationModule,
                                    DxTemplateModule
                                ],
                                declarations: [
                                    DxVectorMapComponent
                                ],
                                exports: [
                                    DxVectorMapComponent,
                                    DxiAnnotationModule,
                                    DxoBorderModule,
                                    DxoFontModule,
                                    DxoImageModule,
                                    DxoShadowModule,
                                    DxoBackgroundModule,
                                    DxoCommonAnnotationSettingsModule,
                                    DxoControlBarModule,
                                    DxoExportModule,
                                    DxiLayerModule,
                                    DxoLabelModule,
                                    DxiLegendModule,
                                    DxoMarginModule,
                                    DxoSourceModule,
                                    DxoTitleModule,
                                    DxoSubtitleModule,
                                    DxoLoadingIndicatorModule,
                                    DxoProjectionModule,
                                    DxoSizeModule,
                                    DxoTooltipModule,
                                    DxTemplateModule
                                ]
                            }]
                    }] });

        })
    };
}));
