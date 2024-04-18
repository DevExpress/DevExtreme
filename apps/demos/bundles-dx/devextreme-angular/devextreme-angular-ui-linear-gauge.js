System.register(['@angular/platform-browser', '@angular/core', 'devextreme/viz/linear_gauge', './devextreme-angular-core.js', './devextreme-angular-ui-nested.js', '@angular/common', 'devextreme/core/dom_adapter', 'devextreme/events', 'devextreme/core/utils/common', 'devextreme/core/renderer', 'devextreme/core/http_request', 'devextreme/core/utils/ready_callbacks', 'devextreme/events/core/events_engine', 'devextreme/core/utils/ajax', 'devextreme/core/utils/deferred'], (function (exports) {
    'use strict';
    var i2, i0, PLATFORM_ID, Component, Inject, Input, Output, NgModule, DxLinearGauge, DxComponent, DxTemplateHost, WatcherHelper, IterableDifferHelper, NestedOptionHost, DxIntegrationModule, DxTemplateModule, DxoAnimationModule, DxoExportModule, DxoGeometryModule, DxoLoadingIndicatorModule, DxoFontModule, DxoMarginModule, DxoRangeContainerModule, DxoBackgroundColorModule, DxiRangeModule, DxoColorModule, DxoWidthModule, DxoScaleModule, DxoLabelModule, DxoFormatModule, DxoMinorTickModule, DxoTickModule, DxoSizeModule, DxoSubvalueIndicatorModule, DxoTextModule, DxoTitleModule, DxoSubtitleModule, DxoTooltipModule, DxoBorderModule, DxoShadowModule, DxoValueIndicatorModule;
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
            DxLinearGauge = module.default;
        }, function (module) {
            DxComponent = module.c;
            DxTemplateHost = module.h;
            WatcherHelper = module.W;
            IterableDifferHelper = module.I;
            NestedOptionHost = module.i;
            DxIntegrationModule = module.e;
            DxTemplateModule = module.D;
        }, function (module) {
            DxoAnimationModule = module.DxoAnimationModule;
            DxoExportModule = module.DxoExportModule;
            DxoGeometryModule = module.DxoGeometryModule;
            DxoLoadingIndicatorModule = module.DxoLoadingIndicatorModule;
            DxoFontModule = module.DxoFontModule;
            DxoMarginModule = module.DxoMarginModule;
            DxoRangeContainerModule = module.DxoRangeContainerModule;
            DxoBackgroundColorModule = module.DxoBackgroundColorModule;
            DxiRangeModule = module.DxiRangeModule;
            DxoColorModule = module.DxoColorModule;
            DxoWidthModule = module.DxoWidthModule;
            DxoScaleModule = module.DxoScaleModule;
            DxoLabelModule = module.DxoLabelModule;
            DxoFormatModule = module.DxoFormatModule;
            DxoMinorTickModule = module.DxoMinorTickModule;
            DxoTickModule = module.DxoTickModule;
            DxoSizeModule = module.DxoSizeModule;
            DxoSubvalueIndicatorModule = module.DxoSubvalueIndicatorModule;
            DxoTextModule = module.DxoTextModule;
            DxoTitleModule = module.DxoTitleModule;
            DxoSubtitleModule = module.DxoSubtitleModule;
            DxoTooltipModule = module.DxoTooltipModule;
            DxoBorderModule = module.DxoBorderModule;
            DxoShadowModule = module.DxoShadowModule;
            DxoValueIndicatorModule = module.DxoValueIndicatorModule;
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
             * The LinearGauge is a UI component that indicates values on a linear numeric scale.

             */
            class DxLinearGaugeComponent extends DxComponent {
                _watcherHelper;
                _idh;
                instance = null;
                /**
                 * Specifies animation properties.
                
                 */
                get animation() {
                    return this._getOption('animation');
                }
                set animation(value) {
                    this._setOption('animation', value);
                }
                /**
                 * Specifies the color of the parent page element.
                
                 */
                get containerBackgroundColor() {
                    return this._getOption('containerBackgroundColor');
                }
                set containerBackgroundColor(value) {
                    this._setOption('containerBackgroundColor', value);
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
                 * Specifies the properties required to set the geometry of the LinearGauge UI component.
                
                 */
                get geometry() {
                    return this._getOption('geometry');
                }
                set geometry(value) {
                    this._setOption('geometry', value);
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
                 * Notifies the UI component that it is embedded into an HTML page that uses a tag modifying the path.
                
                 */
                get pathModified() {
                    return this._getOption('pathModified');
                }
                set pathModified(value) {
                    this._setOption('pathModified', value);
                }
                /**
                 * Specifies gauge range container properties.
                
                 */
                get rangeContainer() {
                    return this._getOption('rangeContainer');
                }
                set rangeContainer(value) {
                    this._setOption('rangeContainer', value);
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
                 * Specifies the gauge&apos;s scale properties.
                
                 */
                get scale() {
                    return this._getOption('scale');
                }
                set scale(value) {
                    this._setOption('scale', value);
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
                 * Specifies the appearance properties of subvalue indicators.
                
                 */
                get subvalueIndicator() {
                    return this._getOption('subvalueIndicator');
                }
                set subvalueIndicator(value) {
                    this._setOption('subvalueIndicator', value);
                }
                /**
                 * Specifies a set of subvalues to be designated by the subvalue indicators.
                
                 */
                get subvalues() {
                    return this._getOption('subvalues');
                }
                set subvalues(value) {
                    this._setOption('subvalues', value);
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
                 * Specifies the main value on a gauge.
                
                 */
                get value() {
                    return this._getOption('value');
                }
                set value(value) {
                    this._setOption('value', value);
                }
                /**
                 * Specifies the appearance properties of the value indicator.
                
                 */
                get valueIndicator() {
                    return this._getOption('valueIndicator');
                }
                set valueIndicator(value) {
                    this._setOption('valueIndicator', value);
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
                
                 * A function that is executed after a UI component property is changed.
                
                
                 */
                onOptionChanged;
                /**
                
                 * A function that is executed when a tooltip becomes hidden.
                
                
                 */
                onTooltipHidden;
                /**
                
                 * A function that is executed when a tooltip appears.
                
                
                 */
                onTooltipShown;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                animationChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                containerBackgroundColorChange;
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
                geometryChange;
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
                pathModifiedChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                rangeContainerChange;
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
                scaleChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                sizeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                subvalueIndicatorChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                subvaluesChange;
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
                valueChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                valueIndicatorChange;
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
                        { subscribe: 'optionChanged', emit: 'onOptionChanged' },
                        { subscribe: 'tooltipHidden', emit: 'onTooltipHidden' },
                        { subscribe: 'tooltipShown', emit: 'onTooltipShown' },
                        { emit: 'animationChange' },
                        { emit: 'containerBackgroundColorChange' },
                        { emit: 'disabledChange' },
                        { emit: 'elementAttrChange' },
                        { emit: 'exportChange' },
                        { emit: 'geometryChange' },
                        { emit: 'loadingIndicatorChange' },
                        { emit: 'marginChange' },
                        { emit: 'pathModifiedChange' },
                        { emit: 'rangeContainerChange' },
                        { emit: 'redrawOnResizeChange' },
                        { emit: 'rtlEnabledChange' },
                        { emit: 'scaleChange' },
                        { emit: 'sizeChange' },
                        { emit: 'subvalueIndicatorChange' },
                        { emit: 'subvaluesChange' },
                        { emit: 'themeChange' },
                        { emit: 'titleChange' },
                        { emit: 'tooltipChange' },
                        { emit: 'valueChange' },
                        { emit: 'valueIndicatorChange' }
                    ]);
                    this._idh.setHost(this);
                    optionHost.setHost(this);
                }
                _createInstance(element, options) {
                    return new DxLinearGauge(element, options);
                }
                ngOnDestroy() {
                    this._destroyWidget();
                }
                ngOnChanges(changes) {
                    super.ngOnChanges(changes);
                    this.setupChanges('subvalues', changes);
                }
                setupChanges(prop, changes) {
                    if (!(prop in this._optionsToUpdate)) {
                        this._idh.setup(prop, changes);
                    }
                }
                ngDoCheck() {
                    this._idh.doCheck('subvalues');
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
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxLinearGaugeComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: DxTemplateHost }, { token: WatcherHelper }, { token: IterableDifferHelper }, { token: NestedOptionHost }, { token: i2.TransferState }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
                /** @nocollapse */ static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.0", type: DxLinearGaugeComponent, selector: "dx-linear-gauge", inputs: { animation: "animation", containerBackgroundColor: "containerBackgroundColor", disabled: "disabled", elementAttr: "elementAttr", export: "export", geometry: "geometry", loadingIndicator: "loadingIndicator", margin: "margin", pathModified: "pathModified", rangeContainer: "rangeContainer", redrawOnResize: "redrawOnResize", rtlEnabled: "rtlEnabled", scale: "scale", size: "size", subvalueIndicator: "subvalueIndicator", subvalues: "subvalues", theme: "theme", title: "title", tooltip: "tooltip", value: "value", valueIndicator: "valueIndicator" }, outputs: { onDisposing: "onDisposing", onDrawn: "onDrawn", onExported: "onExported", onExporting: "onExporting", onFileSaving: "onFileSaving", onIncidentOccurred: "onIncidentOccurred", onInitialized: "onInitialized", onOptionChanged: "onOptionChanged", onTooltipHidden: "onTooltipHidden", onTooltipShown: "onTooltipShown", animationChange: "animationChange", containerBackgroundColorChange: "containerBackgroundColorChange", disabledChange: "disabledChange", elementAttrChange: "elementAttrChange", exportChange: "exportChange", geometryChange: "geometryChange", loadingIndicatorChange: "loadingIndicatorChange", marginChange: "marginChange", pathModifiedChange: "pathModifiedChange", rangeContainerChange: "rangeContainerChange", redrawOnResizeChange: "redrawOnResizeChange", rtlEnabledChange: "rtlEnabledChange", scaleChange: "scaleChange", sizeChange: "sizeChange", subvalueIndicatorChange: "subvalueIndicatorChange", subvaluesChange: "subvaluesChange", themeChange: "themeChange", titleChange: "titleChange", tooltipChange: "tooltipChange", valueChange: "valueChange", valueIndicatorChange: "valueIndicatorChange" }, providers: [
                        DxTemplateHost,
                        WatcherHelper,
                        NestedOptionHost,
                        IterableDifferHelper
                    ], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: '', isInline: true, styles: [":host{display:block}\n"] });
            } exports("DxLinearGaugeComponent", DxLinearGaugeComponent);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxLinearGaugeComponent, decorators: [{
                        type: Component,
                        args: [{ selector: 'dx-linear-gauge', template: '', providers: [
                                    DxTemplateHost,
                                    WatcherHelper,
                                    NestedOptionHost,
                                    IterableDifferHelper
                                ], styles: [":host{display:block}\n"] }]
                    }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: DxTemplateHost }, { type: WatcherHelper }, { type: IterableDifferHelper }, { type: NestedOptionHost }, { type: i2.TransferState }, { type: undefined, decorators: [{
                                type: Inject,
                                args: [PLATFORM_ID]
                            }] }], propDecorators: { animation: [{
                            type: Input
                        }], containerBackgroundColor: [{
                            type: Input
                        }], disabled: [{
                            type: Input
                        }], elementAttr: [{
                            type: Input
                        }], export: [{
                            type: Input
                        }], geometry: [{
                            type: Input
                        }], loadingIndicator: [{
                            type: Input
                        }], margin: [{
                            type: Input
                        }], pathModified: [{
                            type: Input
                        }], rangeContainer: [{
                            type: Input
                        }], redrawOnResize: [{
                            type: Input
                        }], rtlEnabled: [{
                            type: Input
                        }], scale: [{
                            type: Input
                        }], size: [{
                            type: Input
                        }], subvalueIndicator: [{
                            type: Input
                        }], subvalues: [{
                            type: Input
                        }], theme: [{
                            type: Input
                        }], title: [{
                            type: Input
                        }], tooltip: [{
                            type: Input
                        }], value: [{
                            type: Input
                        }], valueIndicator: [{
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
                        }], onOptionChanged: [{
                            type: Output
                        }], onTooltipHidden: [{
                            type: Output
                        }], onTooltipShown: [{
                            type: Output
                        }], animationChange: [{
                            type: Output
                        }], containerBackgroundColorChange: [{
                            type: Output
                        }], disabledChange: [{
                            type: Output
                        }], elementAttrChange: [{
                            type: Output
                        }], exportChange: [{
                            type: Output
                        }], geometryChange: [{
                            type: Output
                        }], loadingIndicatorChange: [{
                            type: Output
                        }], marginChange: [{
                            type: Output
                        }], pathModifiedChange: [{
                            type: Output
                        }], rangeContainerChange: [{
                            type: Output
                        }], redrawOnResizeChange: [{
                            type: Output
                        }], rtlEnabledChange: [{
                            type: Output
                        }], scaleChange: [{
                            type: Output
                        }], sizeChange: [{
                            type: Output
                        }], subvalueIndicatorChange: [{
                            type: Output
                        }], subvaluesChange: [{
                            type: Output
                        }], themeChange: [{
                            type: Output
                        }], titleChange: [{
                            type: Output
                        }], tooltipChange: [{
                            type: Output
                        }], valueChange: [{
                            type: Output
                        }], valueIndicatorChange: [{
                            type: Output
                        }] } });
            class DxLinearGaugeModule {
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxLinearGaugeModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
                /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0, type: DxLinearGaugeModule, declarations: [DxLinearGaugeComponent], imports: [DxoAnimationModule,
                        DxoExportModule,
                        DxoGeometryModule,
                        DxoLoadingIndicatorModule,
                        DxoFontModule,
                        DxoMarginModule,
                        DxoRangeContainerModule,
                        DxoBackgroundColorModule,
                        DxiRangeModule,
                        DxoColorModule,
                        DxoWidthModule,
                        DxoScaleModule,
                        DxoLabelModule,
                        DxoFormatModule,
                        DxoMinorTickModule,
                        DxoTickModule,
                        DxoSizeModule,
                        DxoSubvalueIndicatorModule,
                        DxoTextModule,
                        DxoTitleModule,
                        DxoSubtitleModule,
                        DxoTooltipModule,
                        DxoBorderModule,
                        DxoShadowModule,
                        DxoValueIndicatorModule,
                        DxIntegrationModule,
                        DxTemplateModule], exports: [DxLinearGaugeComponent, DxoAnimationModule,
                        DxoExportModule,
                        DxoGeometryModule,
                        DxoLoadingIndicatorModule,
                        DxoFontModule,
                        DxoMarginModule,
                        DxoRangeContainerModule,
                        DxoBackgroundColorModule,
                        DxiRangeModule,
                        DxoColorModule,
                        DxoWidthModule,
                        DxoScaleModule,
                        DxoLabelModule,
                        DxoFormatModule,
                        DxoMinorTickModule,
                        DxoTickModule,
                        DxoSizeModule,
                        DxoSubvalueIndicatorModule,
                        DxoTextModule,
                        DxoTitleModule,
                        DxoSubtitleModule,
                        DxoTooltipModule,
                        DxoBorderModule,
                        DxoShadowModule,
                        DxoValueIndicatorModule,
                        DxTemplateModule] });
                /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxLinearGaugeModule, imports: [DxoAnimationModule,
                        DxoExportModule,
                        DxoGeometryModule,
                        DxoLoadingIndicatorModule,
                        DxoFontModule,
                        DxoMarginModule,
                        DxoRangeContainerModule,
                        DxoBackgroundColorModule,
                        DxiRangeModule,
                        DxoColorModule,
                        DxoWidthModule,
                        DxoScaleModule,
                        DxoLabelModule,
                        DxoFormatModule,
                        DxoMinorTickModule,
                        DxoTickModule,
                        DxoSizeModule,
                        DxoSubvalueIndicatorModule,
                        DxoTextModule,
                        DxoTitleModule,
                        DxoSubtitleModule,
                        DxoTooltipModule,
                        DxoBorderModule,
                        DxoShadowModule,
                        DxoValueIndicatorModule,
                        DxIntegrationModule,
                        DxTemplateModule, DxoAnimationModule,
                        DxoExportModule,
                        DxoGeometryModule,
                        DxoLoadingIndicatorModule,
                        DxoFontModule,
                        DxoMarginModule,
                        DxoRangeContainerModule,
                        DxoBackgroundColorModule,
                        DxiRangeModule,
                        DxoColorModule,
                        DxoWidthModule,
                        DxoScaleModule,
                        DxoLabelModule,
                        DxoFormatModule,
                        DxoMinorTickModule,
                        DxoTickModule,
                        DxoSizeModule,
                        DxoSubvalueIndicatorModule,
                        DxoTextModule,
                        DxoTitleModule,
                        DxoSubtitleModule,
                        DxoTooltipModule,
                        DxoBorderModule,
                        DxoShadowModule,
                        DxoValueIndicatorModule,
                        DxTemplateModule] });
            } exports("DxLinearGaugeModule", DxLinearGaugeModule);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxLinearGaugeModule, decorators: [{
                        type: NgModule,
                        args: [{
                                imports: [
                                    DxoAnimationModule,
                                    DxoExportModule,
                                    DxoGeometryModule,
                                    DxoLoadingIndicatorModule,
                                    DxoFontModule,
                                    DxoMarginModule,
                                    DxoRangeContainerModule,
                                    DxoBackgroundColorModule,
                                    DxiRangeModule,
                                    DxoColorModule,
                                    DxoWidthModule,
                                    DxoScaleModule,
                                    DxoLabelModule,
                                    DxoFormatModule,
                                    DxoMinorTickModule,
                                    DxoTickModule,
                                    DxoSizeModule,
                                    DxoSubvalueIndicatorModule,
                                    DxoTextModule,
                                    DxoTitleModule,
                                    DxoSubtitleModule,
                                    DxoTooltipModule,
                                    DxoBorderModule,
                                    DxoShadowModule,
                                    DxoValueIndicatorModule,
                                    DxIntegrationModule,
                                    DxTemplateModule
                                ],
                                declarations: [
                                    DxLinearGaugeComponent
                                ],
                                exports: [
                                    DxLinearGaugeComponent,
                                    DxoAnimationModule,
                                    DxoExportModule,
                                    DxoGeometryModule,
                                    DxoLoadingIndicatorModule,
                                    DxoFontModule,
                                    DxoMarginModule,
                                    DxoRangeContainerModule,
                                    DxoBackgroundColorModule,
                                    DxiRangeModule,
                                    DxoColorModule,
                                    DxoWidthModule,
                                    DxoScaleModule,
                                    DxoLabelModule,
                                    DxoFormatModule,
                                    DxoMinorTickModule,
                                    DxoTickModule,
                                    DxoSizeModule,
                                    DxoSubvalueIndicatorModule,
                                    DxoTextModule,
                                    DxoTitleModule,
                                    DxoSubtitleModule,
                                    DxoTooltipModule,
                                    DxoBorderModule,
                                    DxoShadowModule,
                                    DxoValueIndicatorModule,
                                    DxTemplateModule
                                ]
                            }]
                    }] });

        })
    };
}));
