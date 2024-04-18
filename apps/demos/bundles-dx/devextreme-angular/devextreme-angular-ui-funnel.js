System.register(['@angular/platform-browser', '@angular/core', 'devextreme/viz/funnel', './devextreme-angular-core.js', './devextreme-angular-ui-nested.js', '@angular/common', 'devextreme/core/dom_adapter', 'devextreme/events', 'devextreme/core/utils/common', 'devextreme/core/renderer', 'devextreme/core/http_request', 'devextreme/core/utils/ready_callbacks', 'devextreme/events/core/events_engine', 'devextreme/core/utils/ajax', 'devextreme/core/utils/deferred'], (function (exports) {
    'use strict';
    var i2, i0, PLATFORM_ID, Component, Inject, Input, Output, NgModule, DxFunnel, DxComponent, DxTemplateHost, WatcherHelper, IterableDifferHelper, NestedOptionHost, DxIntegrationModule, DxTemplateModule, DxoAdaptiveLayoutModule, DxoExportModule, DxoItemModule, DxoBorderModule, DxoHoverStyleModule, DxoHatchingModule, DxoSelectionStyleModule, DxoLabelModule, DxoConnectorModule, DxoFontModule, DxoFormatModule, DxoLegendModule, DxoMarginModule, DxoTitleModule, DxoSubtitleModule, DxoLoadingIndicatorModule, DxoSizeModule, DxoTooltipModule, DxoShadowModule;
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
            DxFunnel = module.default;
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
            DxoItemModule = module.DxoItemModule;
            DxoBorderModule = module.DxoBorderModule;
            DxoHoverStyleModule = module.DxoHoverStyleModule;
            DxoHatchingModule = module.DxoHatchingModule;
            DxoSelectionStyleModule = module.DxoSelectionStyleModule;
            DxoLabelModule = module.DxoLabelModule;
            DxoConnectorModule = module.DxoConnectorModule;
            DxoFontModule = module.DxoFontModule;
            DxoFormatModule = module.DxoFormatModule;
            DxoLegendModule = module.DxoLegendModule;
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
             * The Funnel is a UI component that visualizes a value at different stages. It helps assess value changes throughout these stages and identify potential issues. The Funnel UI component conveys information using different interactive elements (tooltips, labels, legend) and enables you to create not only a funnel, but also a pyramid chart.

             */
            class DxFunnelComponent extends DxComponent {
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
                 * Specifies the algorithm for building the funnel.
                
                 */
                get algorithm() {
                    return this._getOption('algorithm');
                }
                set algorithm(value) {
                    this._setOption('algorithm', value);
                }
                /**
                 * Specifies which data source field provides arguments for funnel items. The argument identifies a funnel item and represents it on the legend.
                
                 */
                get argumentField() {
                    return this._getOption('argumentField');
                }
                set argumentField(value) {
                    this._setOption('argumentField', value);
                }
                /**
                 * Specifies which data source field provides colors for funnel items. If this field is absent, the palette provides the colors.
                
                 */
                get colorField() {
                    return this._getOption('colorField');
                }
                set colorField(value) {
                    this._setOption('colorField', value);
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
                 * Specifies whether funnel items change their style when a user pauses on them.
                
                 */
                get hoverEnabled() {
                    return this._getOption('hoverEnabled');
                }
                set hoverEnabled(value) {
                    this._setOption('hoverEnabled', value);
                }
                /**
                 * Turns the funnel upside down.
                
                 */
                get inverted() {
                    return this._getOption('inverted');
                }
                set inverted(value) {
                    this._setOption('inverted', value);
                }
                /**
                 * Configures funnel items&apos; appearance.
                
                 */
                get item() {
                    return this._getOption('item');
                }
                set item(value) {
                    this._setOption('item', value);
                }
                /**
                 * Configures funnel item labels.
                
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
                 * Specifies the ratio between the height of the neck and that of the whole funnel. Accepts values from 0 to 1. Applies only if the algorithm is &apos;dynamicHeight&apos;.
                
                 */
                get neckHeight() {
                    return this._getOption('neckHeight');
                }
                set neckHeight(value) {
                    this._setOption('neckHeight', value);
                }
                /**
                 * Specifies the ratio between the width of the neck and that of the whole funnel. Accepts values from 0 to 1. Applies only if the algorithm is &apos;dynamicHeight&apos;.
                
                 */
                get neckWidth() {
                    return this._getOption('neckWidth');
                }
                set neckWidth(value) {
                    this._setOption('neckWidth', value);
                }
                /**
                 * Sets the palette to be used to colorize funnel items.
                
                 */
                get palette() {
                    return this._getOption('palette');
                }
                set palette(value) {
                    this._setOption('palette', value);
                }
                /**
                 * Specifies what to do with colors in the palette when their number is less than the number of funnel items.
                
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
                 * Specifies how item labels should behave when they overlap.
                
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
                 * Specifies whether a single or multiple funnel items can be in the selected state at a time. Assigning &apos;none&apos; disables the selection feature.
                
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
                 * Specifies whether to sort funnel items.
                
                 */
                get sortData() {
                    return this._getOption('sortData');
                }
                set sortData(value) {
                    this._setOption('sortData', value);
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
                 * Specifies which data source field provides values for funnel items. The value defines a funnel item&apos;s area.
                
                 */
                get valueField() {
                    return this._getOption('valueField');
                }
                set valueField(value) {
                    this._setOption('valueField', value);
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
                
                 * A function that is executed after the pointer enters or leaves a funnel item.
                
                
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
                
                 * A function that is executed when a funnel item is clicked or tapped.
                
                
                 */
                onItemClick;
                /**
                
                 * A function that is executed when a legend item is clicked or tapped.
                
                
                 */
                onLegendClick;
                /**
                
                 * A function that is executed after a UI component property is changed.
                
                
                 */
                onOptionChanged;
                /**
                
                 * A function that is executed when a funnel item is selected or selection is canceled.
                
                
                 */
                onSelectionChanged;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                adaptiveLayoutChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                algorithmChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                argumentFieldChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                colorFieldChange;
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
                invertedChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                itemChange;
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
                neckHeightChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                neckWidthChange;
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
                resolveLabelOverlappingChange;
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
                sortDataChange;
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
                valueFieldChange;
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
                        { subscribe: 'hoverChanged', emit: 'onHoverChanged' },
                        { subscribe: 'incidentOccurred', emit: 'onIncidentOccurred' },
                        { subscribe: 'initialized', emit: 'onInitialized' },
                        { subscribe: 'itemClick', emit: 'onItemClick' },
                        { subscribe: 'legendClick', emit: 'onLegendClick' },
                        { subscribe: 'optionChanged', emit: 'onOptionChanged' },
                        { subscribe: 'selectionChanged', emit: 'onSelectionChanged' },
                        { emit: 'adaptiveLayoutChange' },
                        { emit: 'algorithmChange' },
                        { emit: 'argumentFieldChange' },
                        { emit: 'colorFieldChange' },
                        { emit: 'dataSourceChange' },
                        { emit: 'disabledChange' },
                        { emit: 'elementAttrChange' },
                        { emit: 'exportChange' },
                        { emit: 'hoverEnabledChange' },
                        { emit: 'invertedChange' },
                        { emit: 'itemChange' },
                        { emit: 'labelChange' },
                        { emit: 'legendChange' },
                        { emit: 'loadingIndicatorChange' },
                        { emit: 'marginChange' },
                        { emit: 'neckHeightChange' },
                        { emit: 'neckWidthChange' },
                        { emit: 'paletteChange' },
                        { emit: 'paletteExtensionModeChange' },
                        { emit: 'pathModifiedChange' },
                        { emit: 'redrawOnResizeChange' },
                        { emit: 'resolveLabelOverlappingChange' },
                        { emit: 'rtlEnabledChange' },
                        { emit: 'selectionModeChange' },
                        { emit: 'sizeChange' },
                        { emit: 'sortDataChange' },
                        { emit: 'themeChange' },
                        { emit: 'titleChange' },
                        { emit: 'tooltipChange' },
                        { emit: 'valueFieldChange' }
                    ]);
                    this._idh.setHost(this);
                    optionHost.setHost(this);
                }
                _createInstance(element, options) {
                    return new DxFunnel(element, options);
                }
                ngOnDestroy() {
                    this._destroyWidget();
                }
                ngOnChanges(changes) {
                    super.ngOnChanges(changes);
                    this.setupChanges('dataSource', changes);
                    this.setupChanges('palette', changes);
                }
                setupChanges(prop, changes) {
                    if (!(prop in this._optionsToUpdate)) {
                        this._idh.setup(prop, changes);
                    }
                }
                ngDoCheck() {
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
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxFunnelComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: DxTemplateHost }, { token: WatcherHelper }, { token: IterableDifferHelper }, { token: NestedOptionHost }, { token: i2.TransferState }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
                /** @nocollapse */ static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.0", type: DxFunnelComponent, selector: "dx-funnel", inputs: { adaptiveLayout: "adaptiveLayout", algorithm: "algorithm", argumentField: "argumentField", colorField: "colorField", dataSource: "dataSource", disabled: "disabled", elementAttr: "elementAttr", export: "export", hoverEnabled: "hoverEnabled", inverted: "inverted", item: "item", label: "label", legend: "legend", loadingIndicator: "loadingIndicator", margin: "margin", neckHeight: "neckHeight", neckWidth: "neckWidth", palette: "palette", paletteExtensionMode: "paletteExtensionMode", pathModified: "pathModified", redrawOnResize: "redrawOnResize", resolveLabelOverlapping: "resolveLabelOverlapping", rtlEnabled: "rtlEnabled", selectionMode: "selectionMode", size: "size", sortData: "sortData", theme: "theme", title: "title", tooltip: "tooltip", valueField: "valueField" }, outputs: { onDisposing: "onDisposing", onDrawn: "onDrawn", onExported: "onExported", onExporting: "onExporting", onFileSaving: "onFileSaving", onHoverChanged: "onHoverChanged", onIncidentOccurred: "onIncidentOccurred", onInitialized: "onInitialized", onItemClick: "onItemClick", onLegendClick: "onLegendClick", onOptionChanged: "onOptionChanged", onSelectionChanged: "onSelectionChanged", adaptiveLayoutChange: "adaptiveLayoutChange", algorithmChange: "algorithmChange", argumentFieldChange: "argumentFieldChange", colorFieldChange: "colorFieldChange", dataSourceChange: "dataSourceChange", disabledChange: "disabledChange", elementAttrChange: "elementAttrChange", exportChange: "exportChange", hoverEnabledChange: "hoverEnabledChange", invertedChange: "invertedChange", itemChange: "itemChange", labelChange: "labelChange", legendChange: "legendChange", loadingIndicatorChange: "loadingIndicatorChange", marginChange: "marginChange", neckHeightChange: "neckHeightChange", neckWidthChange: "neckWidthChange", paletteChange: "paletteChange", paletteExtensionModeChange: "paletteExtensionModeChange", pathModifiedChange: "pathModifiedChange", redrawOnResizeChange: "redrawOnResizeChange", resolveLabelOverlappingChange: "resolveLabelOverlappingChange", rtlEnabledChange: "rtlEnabledChange", selectionModeChange: "selectionModeChange", sizeChange: "sizeChange", sortDataChange: "sortDataChange", themeChange: "themeChange", titleChange: "titleChange", tooltipChange: "tooltipChange", valueFieldChange: "valueFieldChange" }, providers: [
                        DxTemplateHost,
                        WatcherHelper,
                        NestedOptionHost,
                        IterableDifferHelper
                    ], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: '', isInline: true, styles: [":host{display:block}\n"] });
            } exports("DxFunnelComponent", DxFunnelComponent);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxFunnelComponent, decorators: [{
                        type: Component,
                        args: [{ selector: 'dx-funnel', template: '', providers: [
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
                        }], algorithm: [{
                            type: Input
                        }], argumentField: [{
                            type: Input
                        }], colorField: [{
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
                        }], inverted: [{
                            type: Input
                        }], item: [{
                            type: Input
                        }], label: [{
                            type: Input
                        }], legend: [{
                            type: Input
                        }], loadingIndicator: [{
                            type: Input
                        }], margin: [{
                            type: Input
                        }], neckHeight: [{
                            type: Input
                        }], neckWidth: [{
                            type: Input
                        }], palette: [{
                            type: Input
                        }], paletteExtensionMode: [{
                            type: Input
                        }], pathModified: [{
                            type: Input
                        }], redrawOnResize: [{
                            type: Input
                        }], resolveLabelOverlapping: [{
                            type: Input
                        }], rtlEnabled: [{
                            type: Input
                        }], selectionMode: [{
                            type: Input
                        }], size: [{
                            type: Input
                        }], sortData: [{
                            type: Input
                        }], theme: [{
                            type: Input
                        }], title: [{
                            type: Input
                        }], tooltip: [{
                            type: Input
                        }], valueField: [{
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
                        }], onHoverChanged: [{
                            type: Output
                        }], onIncidentOccurred: [{
                            type: Output
                        }], onInitialized: [{
                            type: Output
                        }], onItemClick: [{
                            type: Output
                        }], onLegendClick: [{
                            type: Output
                        }], onOptionChanged: [{
                            type: Output
                        }], onSelectionChanged: [{
                            type: Output
                        }], adaptiveLayoutChange: [{
                            type: Output
                        }], algorithmChange: [{
                            type: Output
                        }], argumentFieldChange: [{
                            type: Output
                        }], colorFieldChange: [{
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
                        }], invertedChange: [{
                            type: Output
                        }], itemChange: [{
                            type: Output
                        }], labelChange: [{
                            type: Output
                        }], legendChange: [{
                            type: Output
                        }], loadingIndicatorChange: [{
                            type: Output
                        }], marginChange: [{
                            type: Output
                        }], neckHeightChange: [{
                            type: Output
                        }], neckWidthChange: [{
                            type: Output
                        }], paletteChange: [{
                            type: Output
                        }], paletteExtensionModeChange: [{
                            type: Output
                        }], pathModifiedChange: [{
                            type: Output
                        }], redrawOnResizeChange: [{
                            type: Output
                        }], resolveLabelOverlappingChange: [{
                            type: Output
                        }], rtlEnabledChange: [{
                            type: Output
                        }], selectionModeChange: [{
                            type: Output
                        }], sizeChange: [{
                            type: Output
                        }], sortDataChange: [{
                            type: Output
                        }], themeChange: [{
                            type: Output
                        }], titleChange: [{
                            type: Output
                        }], tooltipChange: [{
                            type: Output
                        }], valueFieldChange: [{
                            type: Output
                        }] } });
            class DxFunnelModule {
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxFunnelModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
                /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0, type: DxFunnelModule, declarations: [DxFunnelComponent], imports: [DxoAdaptiveLayoutModule,
                        DxoExportModule,
                        DxoItemModule,
                        DxoBorderModule,
                        DxoHoverStyleModule,
                        DxoHatchingModule,
                        DxoSelectionStyleModule,
                        DxoLabelModule,
                        DxoConnectorModule,
                        DxoFontModule,
                        DxoFormatModule,
                        DxoLegendModule,
                        DxoMarginModule,
                        DxoTitleModule,
                        DxoSubtitleModule,
                        DxoLoadingIndicatorModule,
                        DxoSizeModule,
                        DxoTooltipModule,
                        DxoShadowModule,
                        DxIntegrationModule,
                        DxTemplateModule], exports: [DxFunnelComponent, DxoAdaptiveLayoutModule,
                        DxoExportModule,
                        DxoItemModule,
                        DxoBorderModule,
                        DxoHoverStyleModule,
                        DxoHatchingModule,
                        DxoSelectionStyleModule,
                        DxoLabelModule,
                        DxoConnectorModule,
                        DxoFontModule,
                        DxoFormatModule,
                        DxoLegendModule,
                        DxoMarginModule,
                        DxoTitleModule,
                        DxoSubtitleModule,
                        DxoLoadingIndicatorModule,
                        DxoSizeModule,
                        DxoTooltipModule,
                        DxoShadowModule,
                        DxTemplateModule] });
                /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxFunnelModule, imports: [DxoAdaptiveLayoutModule,
                        DxoExportModule,
                        DxoItemModule,
                        DxoBorderModule,
                        DxoHoverStyleModule,
                        DxoHatchingModule,
                        DxoSelectionStyleModule,
                        DxoLabelModule,
                        DxoConnectorModule,
                        DxoFontModule,
                        DxoFormatModule,
                        DxoLegendModule,
                        DxoMarginModule,
                        DxoTitleModule,
                        DxoSubtitleModule,
                        DxoLoadingIndicatorModule,
                        DxoSizeModule,
                        DxoTooltipModule,
                        DxoShadowModule,
                        DxIntegrationModule,
                        DxTemplateModule, DxoAdaptiveLayoutModule,
                        DxoExportModule,
                        DxoItemModule,
                        DxoBorderModule,
                        DxoHoverStyleModule,
                        DxoHatchingModule,
                        DxoSelectionStyleModule,
                        DxoLabelModule,
                        DxoConnectorModule,
                        DxoFontModule,
                        DxoFormatModule,
                        DxoLegendModule,
                        DxoMarginModule,
                        DxoTitleModule,
                        DxoSubtitleModule,
                        DxoLoadingIndicatorModule,
                        DxoSizeModule,
                        DxoTooltipModule,
                        DxoShadowModule,
                        DxTemplateModule] });
            } exports("DxFunnelModule", DxFunnelModule);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxFunnelModule, decorators: [{
                        type: NgModule,
                        args: [{
                                imports: [
                                    DxoAdaptiveLayoutModule,
                                    DxoExportModule,
                                    DxoItemModule,
                                    DxoBorderModule,
                                    DxoHoverStyleModule,
                                    DxoHatchingModule,
                                    DxoSelectionStyleModule,
                                    DxoLabelModule,
                                    DxoConnectorModule,
                                    DxoFontModule,
                                    DxoFormatModule,
                                    DxoLegendModule,
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
                                    DxFunnelComponent
                                ],
                                exports: [
                                    DxFunnelComponent,
                                    DxoAdaptiveLayoutModule,
                                    DxoExportModule,
                                    DxoItemModule,
                                    DxoBorderModule,
                                    DxoHoverStyleModule,
                                    DxoHatchingModule,
                                    DxoSelectionStyleModule,
                                    DxoLabelModule,
                                    DxoConnectorModule,
                                    DxoFontModule,
                                    DxoFormatModule,
                                    DxoLegendModule,
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
