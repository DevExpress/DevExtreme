System.register(['@angular/platform-browser', '@angular/core', 'devextreme/viz/bar_gauge', './devextreme-angular-core.js', './devextreme-angular-ui-nested.js', '@angular/common', 'devextreme/core/dom_adapter', 'devextreme/events', 'devextreme/core/utils/common', 'devextreme/core/renderer', 'devextreme/core/http_request', 'devextreme/core/utils/ready_callbacks', 'devextreme/events/core/events_engine', 'devextreme/core/utils/ajax', 'devextreme/core/utils/deferred'], (function (exports) {
    'use strict';
    var i2, i0, PLATFORM_ID, Component, Inject, Input, Output, NgModule, DxBarGauge, DxComponent, DxTemplateHost, WatcherHelper, IterableDifferHelper, NestedOptionHost, DxIntegrationModule, DxTemplateModule, DxoAnimationModule, DxoExportModule, DxoGeometryModule, DxoLabelModule, DxoFontModule, DxoFormatModule, DxoLegendModule, DxoBorderModule, DxoItemTextFormatModule, DxoMarginModule, DxoTitleModule, DxoSubtitleModule, DxoLoadingIndicatorModule, DxoSizeModule, DxoTooltipModule, DxoShadowModule;
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
            DxBarGauge = module.default;
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
            DxoLabelModule = module.DxoLabelModule;
            DxoFontModule = module.DxoFontModule;
            DxoFormatModule = module.DxoFormatModule;
            DxoLegendModule = module.DxoLegendModule;
            DxoBorderModule = module.DxoBorderModule;
            DxoItemTextFormatModule = module.DxoItemTextFormatModule;
            DxoMarginModule = module.DxoMarginModule;
            DxoTitleModule = module.DxoTitleModule;
            DxoSubtitleModule = module.DxoSubtitleModule;
            DxoLoadingIndicatorModule = module.DxoLoadingIndicatorModule;
            DxoSizeModule = module.DxoSizeModule;
            DxoTooltipModule = module.DxoTooltipModule;
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
             * The BarGauge UI component contains several circular bars that each indicates a single value.

             */
            class DxBarGaugeComponent extends DxComponent {
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
                 * Specifies a color for the remaining segment of the bar&apos;s track.
                
                 */
                get backgroundColor() {
                    return this._getOption('backgroundColor');
                }
                set backgroundColor(value) {
                    this._setOption('backgroundColor', value);
                }
                /**
                 * Specifies a distance between bars in pixels.
                
                 */
                get barSpacing() {
                    return this._getOption('barSpacing');
                }
                set barSpacing(value) {
                    this._setOption('barSpacing', value);
                }
                /**
                 * Specifies a base value for bars.
                
                 */
                get baseValue() {
                    return this._getOption('baseValue');
                }
                set baseValue(value) {
                    this._setOption('baseValue', value);
                }
                /**
                 * Specifies a custom template for content in the component&apos;s center.
                
                 */
                get centerTemplate() {
                    return this._getOption('centerTemplate');
                }
                set centerTemplate(value) {
                    this._setOption('centerTemplate', value);
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
                 * Specifies an end value for the gauge&apos;s invisible scale.
                
                 */
                get endValue() {
                    return this._getOption('endValue');
                }
                set endValue(value) {
                    this._setOption('endValue', value);
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
                 * Defines the shape of the gauge&apos;s arc.
                
                 */
                get geometry() {
                    return this._getOption('geometry');
                }
                set geometry(value) {
                    this._setOption('geometry', value);
                }
                /**
                 * Specifies the properties of the labels that accompany gauge bars.
                
                 */
                get label() {
                    return this._getOption('label');
                }
                set label(value) {
                    this._setOption('label', value);
                }
                /**
                 * Configures the legend.
                
                 */
                get legend() {
                    return this._getOption('legend');
                }
                set legend(value) {
                    this._setOption('legend', value);
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
                 * Sets the palette to be used for colorizing bars in the gauge.
                
                 */
                get palette() {
                    return this._getOption('palette');
                }
                set palette(value) {
                    this._setOption('palette', value);
                }
                /**
                 * Specifies what to do with colors in the palette when their number is less than the number of bars in the gauge.
                
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
                 * Defines the radius of the bar that is closest to the center relatively to the radius of the topmost bar.
                
                 */
                get relativeInnerRadius() {
                    return this._getOption('relativeInnerRadius');
                }
                set relativeInnerRadius(value) {
                    this._setOption('relativeInnerRadius', value);
                }
                /**
                 * Specifies how the UI component should behave when bar labels overlap.
                
                 */
                get resolveLabelOverlapping() {
                    return this._getOption('resolveLabelOverlapping');
                }
                set resolveLabelOverlapping(value) {
                    this._setOption('resolveLabelOverlapping', value);
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
                 * Specifies a start value for the gauge&apos;s invisible scale.
                
                 */
                get startValue() {
                    return this._getOption('startValue');
                }
                set startValue(value) {
                    this._setOption('startValue', value);
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
                 * Specifies the array of values to be indicated on a bar gauge.
                
                 */
                get values() {
                    return this._getOption('values');
                }
                set values(value) {
                    this._setOption('values', value);
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
                backgroundColorChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                barSpacingChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                baseValueChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                centerTemplateChange;
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
                endValueChange;
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
                labelChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                legendChange;
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
                relativeInnerRadiusChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                resolveLabelOverlappingChange;
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
                startValueChange;
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
                valuesChange;
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
                        { emit: 'backgroundColorChange' },
                        { emit: 'barSpacingChange' },
                        { emit: 'baseValueChange' },
                        { emit: 'centerTemplateChange' },
                        { emit: 'disabledChange' },
                        { emit: 'elementAttrChange' },
                        { emit: 'endValueChange' },
                        { emit: 'exportChange' },
                        { emit: 'geometryChange' },
                        { emit: 'labelChange' },
                        { emit: 'legendChange' },
                        { emit: 'loadingIndicatorChange' },
                        { emit: 'marginChange' },
                        { emit: 'paletteChange' },
                        { emit: 'paletteExtensionModeChange' },
                        { emit: 'pathModifiedChange' },
                        { emit: 'redrawOnResizeChange' },
                        { emit: 'relativeInnerRadiusChange' },
                        { emit: 'resolveLabelOverlappingChange' },
                        { emit: 'rtlEnabledChange' },
                        { emit: 'sizeChange' },
                        { emit: 'startValueChange' },
                        { emit: 'themeChange' },
                        { emit: 'titleChange' },
                        { emit: 'tooltipChange' },
                        { emit: 'valuesChange' }
                    ]);
                    this._idh.setHost(this);
                    optionHost.setHost(this);
                }
                _createInstance(element, options) {
                    return new DxBarGauge(element, options);
                }
                ngOnDestroy() {
                    this._destroyWidget();
                }
                ngOnChanges(changes) {
                    super.ngOnChanges(changes);
                    this.setupChanges('palette', changes);
                    this.setupChanges('values', changes);
                }
                setupChanges(prop, changes) {
                    if (!(prop in this._optionsToUpdate)) {
                        this._idh.setup(prop, changes);
                    }
                }
                ngDoCheck() {
                    this._idh.doCheck('palette');
                    this._idh.doCheck('values');
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
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxBarGaugeComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: DxTemplateHost }, { token: WatcherHelper }, { token: IterableDifferHelper }, { token: NestedOptionHost }, { token: i2.TransferState }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
                /** @nocollapse */ static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.0", type: DxBarGaugeComponent, selector: "dx-bar-gauge", inputs: { animation: "animation", backgroundColor: "backgroundColor", barSpacing: "barSpacing", baseValue: "baseValue", centerTemplate: "centerTemplate", disabled: "disabled", elementAttr: "elementAttr", endValue: "endValue", export: "export", geometry: "geometry", label: "label", legend: "legend", loadingIndicator: "loadingIndicator", margin: "margin", palette: "palette", paletteExtensionMode: "paletteExtensionMode", pathModified: "pathModified", redrawOnResize: "redrawOnResize", relativeInnerRadius: "relativeInnerRadius", resolveLabelOverlapping: "resolveLabelOverlapping", rtlEnabled: "rtlEnabled", size: "size", startValue: "startValue", theme: "theme", title: "title", tooltip: "tooltip", values: "values" }, outputs: { onDisposing: "onDisposing", onDrawn: "onDrawn", onExported: "onExported", onExporting: "onExporting", onFileSaving: "onFileSaving", onIncidentOccurred: "onIncidentOccurred", onInitialized: "onInitialized", onOptionChanged: "onOptionChanged", onTooltipHidden: "onTooltipHidden", onTooltipShown: "onTooltipShown", animationChange: "animationChange", backgroundColorChange: "backgroundColorChange", barSpacingChange: "barSpacingChange", baseValueChange: "baseValueChange", centerTemplateChange: "centerTemplateChange", disabledChange: "disabledChange", elementAttrChange: "elementAttrChange", endValueChange: "endValueChange", exportChange: "exportChange", geometryChange: "geometryChange", labelChange: "labelChange", legendChange: "legendChange", loadingIndicatorChange: "loadingIndicatorChange", marginChange: "marginChange", paletteChange: "paletteChange", paletteExtensionModeChange: "paletteExtensionModeChange", pathModifiedChange: "pathModifiedChange", redrawOnResizeChange: "redrawOnResizeChange", relativeInnerRadiusChange: "relativeInnerRadiusChange", resolveLabelOverlappingChange: "resolveLabelOverlappingChange", rtlEnabledChange: "rtlEnabledChange", sizeChange: "sizeChange", startValueChange: "startValueChange", themeChange: "themeChange", titleChange: "titleChange", tooltipChange: "tooltipChange", valuesChange: "valuesChange" }, providers: [
                        DxTemplateHost,
                        WatcherHelper,
                        NestedOptionHost,
                        IterableDifferHelper
                    ], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: '', isInline: true, styles: [":host{display:block}\n"] });
            } exports("DxBarGaugeComponent", DxBarGaugeComponent);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxBarGaugeComponent, decorators: [{
                        type: Component,
                        args: [{ selector: 'dx-bar-gauge', template: '', providers: [
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
                        }], backgroundColor: [{
                            type: Input
                        }], barSpacing: [{
                            type: Input
                        }], baseValue: [{
                            type: Input
                        }], centerTemplate: [{
                            type: Input
                        }], disabled: [{
                            type: Input
                        }], elementAttr: [{
                            type: Input
                        }], endValue: [{
                            type: Input
                        }], export: [{
                            type: Input
                        }], geometry: [{
                            type: Input
                        }], label: [{
                            type: Input
                        }], legend: [{
                            type: Input
                        }], loadingIndicator: [{
                            type: Input
                        }], margin: [{
                            type: Input
                        }], palette: [{
                            type: Input
                        }], paletteExtensionMode: [{
                            type: Input
                        }], pathModified: [{
                            type: Input
                        }], redrawOnResize: [{
                            type: Input
                        }], relativeInnerRadius: [{
                            type: Input
                        }], resolveLabelOverlapping: [{
                            type: Input
                        }], rtlEnabled: [{
                            type: Input
                        }], size: [{
                            type: Input
                        }], startValue: [{
                            type: Input
                        }], theme: [{
                            type: Input
                        }], title: [{
                            type: Input
                        }], tooltip: [{
                            type: Input
                        }], values: [{
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
                        }], backgroundColorChange: [{
                            type: Output
                        }], barSpacingChange: [{
                            type: Output
                        }], baseValueChange: [{
                            type: Output
                        }], centerTemplateChange: [{
                            type: Output
                        }], disabledChange: [{
                            type: Output
                        }], elementAttrChange: [{
                            type: Output
                        }], endValueChange: [{
                            type: Output
                        }], exportChange: [{
                            type: Output
                        }], geometryChange: [{
                            type: Output
                        }], labelChange: [{
                            type: Output
                        }], legendChange: [{
                            type: Output
                        }], loadingIndicatorChange: [{
                            type: Output
                        }], marginChange: [{
                            type: Output
                        }], paletteChange: [{
                            type: Output
                        }], paletteExtensionModeChange: [{
                            type: Output
                        }], pathModifiedChange: [{
                            type: Output
                        }], redrawOnResizeChange: [{
                            type: Output
                        }], relativeInnerRadiusChange: [{
                            type: Output
                        }], resolveLabelOverlappingChange: [{
                            type: Output
                        }], rtlEnabledChange: [{
                            type: Output
                        }], sizeChange: [{
                            type: Output
                        }], startValueChange: [{
                            type: Output
                        }], themeChange: [{
                            type: Output
                        }], titleChange: [{
                            type: Output
                        }], tooltipChange: [{
                            type: Output
                        }], valuesChange: [{
                            type: Output
                        }] } });
            class DxBarGaugeModule {
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxBarGaugeModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
                /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0, type: DxBarGaugeModule, declarations: [DxBarGaugeComponent], imports: [DxoAnimationModule,
                        DxoExportModule,
                        DxoGeometryModule,
                        DxoLabelModule,
                        DxoFontModule,
                        DxoFormatModule,
                        DxoLegendModule,
                        DxoBorderModule,
                        DxoItemTextFormatModule,
                        DxoMarginModule,
                        DxoTitleModule,
                        DxoSubtitleModule,
                        DxoLoadingIndicatorModule,
                        DxoSizeModule,
                        DxoTooltipModule,
                        DxoShadowModule,
                        DxIntegrationModule,
                        DxTemplateModule], exports: [DxBarGaugeComponent, DxoAnimationModule,
                        DxoExportModule,
                        DxoGeometryModule,
                        DxoLabelModule,
                        DxoFontModule,
                        DxoFormatModule,
                        DxoLegendModule,
                        DxoBorderModule,
                        DxoItemTextFormatModule,
                        DxoMarginModule,
                        DxoTitleModule,
                        DxoSubtitleModule,
                        DxoLoadingIndicatorModule,
                        DxoSizeModule,
                        DxoTooltipModule,
                        DxoShadowModule,
                        DxTemplateModule] });
                /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxBarGaugeModule, imports: [DxoAnimationModule,
                        DxoExportModule,
                        DxoGeometryModule,
                        DxoLabelModule,
                        DxoFontModule,
                        DxoFormatModule,
                        DxoLegendModule,
                        DxoBorderModule,
                        DxoItemTextFormatModule,
                        DxoMarginModule,
                        DxoTitleModule,
                        DxoSubtitleModule,
                        DxoLoadingIndicatorModule,
                        DxoSizeModule,
                        DxoTooltipModule,
                        DxoShadowModule,
                        DxIntegrationModule,
                        DxTemplateModule, DxoAnimationModule,
                        DxoExportModule,
                        DxoGeometryModule,
                        DxoLabelModule,
                        DxoFontModule,
                        DxoFormatModule,
                        DxoLegendModule,
                        DxoBorderModule,
                        DxoItemTextFormatModule,
                        DxoMarginModule,
                        DxoTitleModule,
                        DxoSubtitleModule,
                        DxoLoadingIndicatorModule,
                        DxoSizeModule,
                        DxoTooltipModule,
                        DxoShadowModule,
                        DxTemplateModule] });
            } exports("DxBarGaugeModule", DxBarGaugeModule);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxBarGaugeModule, decorators: [{
                        type: NgModule,
                        args: [{
                                imports: [
                                    DxoAnimationModule,
                                    DxoExportModule,
                                    DxoGeometryModule,
                                    DxoLabelModule,
                                    DxoFontModule,
                                    DxoFormatModule,
                                    DxoLegendModule,
                                    DxoBorderModule,
                                    DxoItemTextFormatModule,
                                    DxoMarginModule,
                                    DxoTitleModule,
                                    DxoSubtitleModule,
                                    DxoLoadingIndicatorModule,
                                    DxoSizeModule,
                                    DxoTooltipModule,
                                    DxoShadowModule,
                                    DxIntegrationModule,
                                    DxTemplateModule
                                ],
                                declarations: [
                                    DxBarGaugeComponent
                                ],
                                exports: [
                                    DxBarGaugeComponent,
                                    DxoAnimationModule,
                                    DxoExportModule,
                                    DxoGeometryModule,
                                    DxoLabelModule,
                                    DxoFontModule,
                                    DxoFormatModule,
                                    DxoLegendModule,
                                    DxoBorderModule,
                                    DxoItemTextFormatModule,
                                    DxoMarginModule,
                                    DxoTitleModule,
                                    DxoSubtitleModule,
                                    DxoLoadingIndicatorModule,
                                    DxoSizeModule,
                                    DxoTooltipModule,
                                    DxoShadowModule,
                                    DxTemplateModule
                                ]
                            }]
                    }] });

        })
    };
}));
