System.register(['@angular/platform-browser', '@angular/core', 'devextreme/viz/sparkline', './devextreme-angular-core.js', './devextreme-angular-ui-nested.js', '@angular/common', 'devextreme/core/dom_adapter', 'devextreme/events', 'devextreme/core/utils/common', 'devextreme/core/renderer', 'devextreme/core/http_request', 'devextreme/core/utils/ready_callbacks', 'devextreme/events/core/events_engine', 'devextreme/core/utils/ajax', 'devextreme/core/utils/deferred'], (function (exports) {
    'use strict';
    var i2, i0, PLATFORM_ID, Component, Inject, Input, Output, NgModule, DxSparkline, DxComponent, DxTemplateHost, WatcherHelper, IterableDifferHelper, NestedOptionHost, DxIntegrationModule, DxTemplateModule, DxoMarginModule, DxoSizeModule, DxoTooltipModule, DxoBorderModule, DxoFontModule, DxoFormatModule, DxoShadowModule;
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
            DxSparkline = module.default;
        }, function (module) {
            DxComponent = module.c;
            DxTemplateHost = module.h;
            WatcherHelper = module.W;
            IterableDifferHelper = module.I;
            NestedOptionHost = module.i;
            DxIntegrationModule = module.e;
            DxTemplateModule = module.D;
        }, function (module) {
            DxoMarginModule = module.DxoMarginModule;
            DxoSizeModule = module.DxoSizeModule;
            DxoTooltipModule = module.DxoTooltipModule;
            DxoBorderModule = module.DxoBorderModule;
            DxoFontModule = module.DxoFontModule;
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
             * The Sparkline UI component is a compact chart that contains only one series. Owing to their size, sparklines occupy very little space and can be easily collected in a table or embedded straight in text.

             */
            class DxSparklineComponent extends DxComponent {
                _watcherHelper;
                _idh;
                instance = null;
                /**
                 * Specifies the data source field that provides arguments for a sparkline.
                
                 */
                get argumentField() {
                    return this._getOption('argumentField');
                }
                set argumentField(value) {
                    this._setOption('argumentField', value);
                }
                /**
                 * Sets a color for the bars indicating negative values. Available for a sparkline of the bar type only.
                
                 */
                get barNegativeColor() {
                    return this._getOption('barNegativeColor');
                }
                set barNegativeColor(value) {
                    this._setOption('barNegativeColor', value);
                }
                /**
                 * Sets a color for the bars indicating positive values. Available for a sparkline of the bar type only.
                
                 */
                get barPositiveColor() {
                    return this._getOption('barPositiveColor');
                }
                set barPositiveColor(value) {
                    this._setOption('barPositiveColor', value);
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
                 * Sets a color for the boundary of both the first and last points on a sparkline.
                
                 */
                get firstLastColor() {
                    return this._getOption('firstLastColor');
                }
                set firstLastColor(value) {
                    this._setOption('firstLastColor', value);
                }
                /**
                 * Specifies whether the sparkline should ignore null data points.
                
                 */
                get ignoreEmptyPoints() {
                    return this._getOption('ignoreEmptyPoints');
                }
                set ignoreEmptyPoints(value) {
                    this._setOption('ignoreEmptyPoints', value);
                }
                /**
                 * Sets a color for a line on a sparkline. Available for the sparklines of the line- and area-like types.
                
                 */
                get lineColor() {
                    return this._getOption('lineColor');
                }
                set lineColor(value) {
                    this._setOption('lineColor', value);
                }
                /**
                 * Specifies a width for a line on a sparkline. Available for the sparklines of the line- and area-like types.
                
                 */
                get lineWidth() {
                    return this._getOption('lineWidth');
                }
                set lineWidth(value) {
                    this._setOption('lineWidth', value);
                }
                /**
                 * Sets a color for the bars indicating the values that are less than the winloss threshold. Available for a sparkline of the winloss type only.
                
                 */
                get lossColor() {
                    return this._getOption('lossColor');
                }
                set lossColor(value) {
                    this._setOption('lossColor', value);
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
                 * Sets a color for the boundary of the maximum point on a sparkline.
                
                 */
                get maxColor() {
                    return this._getOption('maxColor');
                }
                set maxColor(value) {
                    this._setOption('maxColor', value);
                }
                /**
                 * Specifies the maximum value of the sparkline&apos;s value axis.
                
                 */
                get maxValue() {
                    return this._getOption('maxValue');
                }
                set maxValue(value) {
                    this._setOption('maxValue', value);
                }
                /**
                 * Sets a color for the boundary of the minimum point on a sparkline.
                
                 */
                get minColor() {
                    return this._getOption('minColor');
                }
                set minColor(value) {
                    this._setOption('minColor', value);
                }
                /**
                 * Specifies the minimum value of the sparkline value axis.
                
                 */
                get minValue() {
                    return this._getOption('minValue');
                }
                set minValue(value) {
                    this._setOption('minValue', value);
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
                 * Sets a color for points on a sparkline. Available for the sparklines of the line- and area-like types.
                
                 */
                get pointColor() {
                    return this._getOption('pointColor');
                }
                set pointColor(value) {
                    this._setOption('pointColor', value);
                }
                /**
                 * Specifies the diameter of sparkline points in pixels. Available for the sparklines of line- and area-like types.
                
                 */
                get pointSize() {
                    return this._getOption('pointSize');
                }
                set pointSize(value) {
                    this._setOption('pointSize', value);
                }
                /**
                 * Specifies a symbol to use as a point marker on a sparkline. Available for the sparklines of the line- and area-like types.
                
                 */
                get pointSymbol() {
                    return this._getOption('pointSymbol');
                }
                set pointSymbol(value) {
                    this._setOption('pointSymbol', value);
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
                 * Specifies whether or not to indicate both the first and last values on a sparkline.
                
                 */
                get showFirstLast() {
                    return this._getOption('showFirstLast');
                }
                set showFirstLast(value) {
                    this._setOption('showFirstLast', value);
                }
                /**
                 * Specifies whether or not to indicate both the minimum and maximum values on a sparkline.
                
                 */
                get showMinMax() {
                    return this._getOption('showMinMax');
                }
                set showMinMax(value) {
                    this._setOption('showMinMax', value);
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
                 * Configures the tooltip.
                
                 */
                get tooltip() {
                    return this._getOption('tooltip');
                }
                set tooltip(value) {
                    this._setOption('tooltip', value);
                }
                /**
                 * Determines the type of a sparkline.
                
                 */
                get type() {
                    return this._getOption('type');
                }
                set type(value) {
                    this._setOption('type', value);
                }
                /**
                 * Specifies the data source field that provides values for a sparkline.
                
                 */
                get valueField() {
                    return this._getOption('valueField');
                }
                set valueField(value) {
                    this._setOption('valueField', value);
                }
                /**
                 * Sets a color for the bars indicating the values greater than a winloss threshold. Available for a sparkline of the winloss type only.
                
                 */
                get winColor() {
                    return this._getOption('winColor');
                }
                set winColor(value) {
                    this._setOption('winColor', value);
                }
                /**
                 * Specifies a value that serves as a threshold for the sparkline of the winloss type.
                
                 */
                get winlossThreshold() {
                    return this._getOption('winlossThreshold');
                }
                set winlossThreshold(value) {
                    this._setOption('winlossThreshold', value);
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
                argumentFieldChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                barNegativeColorChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                barPositiveColorChange;
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
                firstLastColorChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                ignoreEmptyPointsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                lineColorChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                lineWidthChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                lossColorChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                marginChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                maxColorChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                maxValueChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                minColorChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                minValueChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                pathModifiedChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                pointColorChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                pointSizeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                pointSymbolChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                rtlEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                showFirstLastChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                showMinMaxChange;
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
                tooltipChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                typeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                valueFieldChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                winColorChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                winlossThresholdChange;
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
                        { emit: 'argumentFieldChange' },
                        { emit: 'barNegativeColorChange' },
                        { emit: 'barPositiveColorChange' },
                        { emit: 'dataSourceChange' },
                        { emit: 'disabledChange' },
                        { emit: 'elementAttrChange' },
                        { emit: 'firstLastColorChange' },
                        { emit: 'ignoreEmptyPointsChange' },
                        { emit: 'lineColorChange' },
                        { emit: 'lineWidthChange' },
                        { emit: 'lossColorChange' },
                        { emit: 'marginChange' },
                        { emit: 'maxColorChange' },
                        { emit: 'maxValueChange' },
                        { emit: 'minColorChange' },
                        { emit: 'minValueChange' },
                        { emit: 'pathModifiedChange' },
                        { emit: 'pointColorChange' },
                        { emit: 'pointSizeChange' },
                        { emit: 'pointSymbolChange' },
                        { emit: 'rtlEnabledChange' },
                        { emit: 'showFirstLastChange' },
                        { emit: 'showMinMaxChange' },
                        { emit: 'sizeChange' },
                        { emit: 'themeChange' },
                        { emit: 'tooltipChange' },
                        { emit: 'typeChange' },
                        { emit: 'valueFieldChange' },
                        { emit: 'winColorChange' },
                        { emit: 'winlossThresholdChange' }
                    ]);
                    this._idh.setHost(this);
                    optionHost.setHost(this);
                }
                _createInstance(element, options) {
                    return new DxSparkline(element, options);
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
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxSparklineComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: DxTemplateHost }, { token: WatcherHelper }, { token: IterableDifferHelper }, { token: NestedOptionHost }, { token: i2.TransferState }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
                /** @nocollapse */ static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.0", type: DxSparklineComponent, selector: "dx-sparkline", inputs: { argumentField: "argumentField", barNegativeColor: "barNegativeColor", barPositiveColor: "barPositiveColor", dataSource: "dataSource", disabled: "disabled", elementAttr: "elementAttr", firstLastColor: "firstLastColor", ignoreEmptyPoints: "ignoreEmptyPoints", lineColor: "lineColor", lineWidth: "lineWidth", lossColor: "lossColor", margin: "margin", maxColor: "maxColor", maxValue: "maxValue", minColor: "minColor", minValue: "minValue", pathModified: "pathModified", pointColor: "pointColor", pointSize: "pointSize", pointSymbol: "pointSymbol", rtlEnabled: "rtlEnabled", showFirstLast: "showFirstLast", showMinMax: "showMinMax", size: "size", theme: "theme", tooltip: "tooltip", type: "type", valueField: "valueField", winColor: "winColor", winlossThreshold: "winlossThreshold" }, outputs: { onDisposing: "onDisposing", onDrawn: "onDrawn", onExported: "onExported", onExporting: "onExporting", onFileSaving: "onFileSaving", onIncidentOccurred: "onIncidentOccurred", onInitialized: "onInitialized", onOptionChanged: "onOptionChanged", onTooltipHidden: "onTooltipHidden", onTooltipShown: "onTooltipShown", argumentFieldChange: "argumentFieldChange", barNegativeColorChange: "barNegativeColorChange", barPositiveColorChange: "barPositiveColorChange", dataSourceChange: "dataSourceChange", disabledChange: "disabledChange", elementAttrChange: "elementAttrChange", firstLastColorChange: "firstLastColorChange", ignoreEmptyPointsChange: "ignoreEmptyPointsChange", lineColorChange: "lineColorChange", lineWidthChange: "lineWidthChange", lossColorChange: "lossColorChange", marginChange: "marginChange", maxColorChange: "maxColorChange", maxValueChange: "maxValueChange", minColorChange: "minColorChange", minValueChange: "minValueChange", pathModifiedChange: "pathModifiedChange", pointColorChange: "pointColorChange", pointSizeChange: "pointSizeChange", pointSymbolChange: "pointSymbolChange", rtlEnabledChange: "rtlEnabledChange", showFirstLastChange: "showFirstLastChange", showMinMaxChange: "showMinMaxChange", sizeChange: "sizeChange", themeChange: "themeChange", tooltipChange: "tooltipChange", typeChange: "typeChange", valueFieldChange: "valueFieldChange", winColorChange: "winColorChange", winlossThresholdChange: "winlossThresholdChange" }, providers: [
                        DxTemplateHost,
                        WatcherHelper,
                        NestedOptionHost,
                        IterableDifferHelper
                    ], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: '', isInline: true, styles: [":host{display:block}\n"] });
            } exports("DxSparklineComponent", DxSparklineComponent);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxSparklineComponent, decorators: [{
                        type: Component,
                        args: [{ selector: 'dx-sparkline', template: '', providers: [
                                    DxTemplateHost,
                                    WatcherHelper,
                                    NestedOptionHost,
                                    IterableDifferHelper
                                ], styles: [":host{display:block}\n"] }]
                    }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: DxTemplateHost }, { type: WatcherHelper }, { type: IterableDifferHelper }, { type: NestedOptionHost }, { type: i2.TransferState }, { type: undefined, decorators: [{
                                type: Inject,
                                args: [PLATFORM_ID]
                            }] }], propDecorators: { argumentField: [{
                            type: Input
                        }], barNegativeColor: [{
                            type: Input
                        }], barPositiveColor: [{
                            type: Input
                        }], dataSource: [{
                            type: Input
                        }], disabled: [{
                            type: Input
                        }], elementAttr: [{
                            type: Input
                        }], firstLastColor: [{
                            type: Input
                        }], ignoreEmptyPoints: [{
                            type: Input
                        }], lineColor: [{
                            type: Input
                        }], lineWidth: [{
                            type: Input
                        }], lossColor: [{
                            type: Input
                        }], margin: [{
                            type: Input
                        }], maxColor: [{
                            type: Input
                        }], maxValue: [{
                            type: Input
                        }], minColor: [{
                            type: Input
                        }], minValue: [{
                            type: Input
                        }], pathModified: [{
                            type: Input
                        }], pointColor: [{
                            type: Input
                        }], pointSize: [{
                            type: Input
                        }], pointSymbol: [{
                            type: Input
                        }], rtlEnabled: [{
                            type: Input
                        }], showFirstLast: [{
                            type: Input
                        }], showMinMax: [{
                            type: Input
                        }], size: [{
                            type: Input
                        }], theme: [{
                            type: Input
                        }], tooltip: [{
                            type: Input
                        }], type: [{
                            type: Input
                        }], valueField: [{
                            type: Input
                        }], winColor: [{
                            type: Input
                        }], winlossThreshold: [{
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
                        }], argumentFieldChange: [{
                            type: Output
                        }], barNegativeColorChange: [{
                            type: Output
                        }], barPositiveColorChange: [{
                            type: Output
                        }], dataSourceChange: [{
                            type: Output
                        }], disabledChange: [{
                            type: Output
                        }], elementAttrChange: [{
                            type: Output
                        }], firstLastColorChange: [{
                            type: Output
                        }], ignoreEmptyPointsChange: [{
                            type: Output
                        }], lineColorChange: [{
                            type: Output
                        }], lineWidthChange: [{
                            type: Output
                        }], lossColorChange: [{
                            type: Output
                        }], marginChange: [{
                            type: Output
                        }], maxColorChange: [{
                            type: Output
                        }], maxValueChange: [{
                            type: Output
                        }], minColorChange: [{
                            type: Output
                        }], minValueChange: [{
                            type: Output
                        }], pathModifiedChange: [{
                            type: Output
                        }], pointColorChange: [{
                            type: Output
                        }], pointSizeChange: [{
                            type: Output
                        }], pointSymbolChange: [{
                            type: Output
                        }], rtlEnabledChange: [{
                            type: Output
                        }], showFirstLastChange: [{
                            type: Output
                        }], showMinMaxChange: [{
                            type: Output
                        }], sizeChange: [{
                            type: Output
                        }], themeChange: [{
                            type: Output
                        }], tooltipChange: [{
                            type: Output
                        }], typeChange: [{
                            type: Output
                        }], valueFieldChange: [{
                            type: Output
                        }], winColorChange: [{
                            type: Output
                        }], winlossThresholdChange: [{
                            type: Output
                        }] } });
            class DxSparklineModule {
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxSparklineModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
                /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0, type: DxSparklineModule, declarations: [DxSparklineComponent], imports: [DxoMarginModule,
                        DxoSizeModule,
                        DxoTooltipModule,
                        DxoBorderModule,
                        DxoFontModule,
                        DxoFormatModule,
                        DxoShadowModule,
                        DxIntegrationModule,
                        DxTemplateModule], exports: [DxSparklineComponent, DxoMarginModule,
                        DxoSizeModule,
                        DxoTooltipModule,
                        DxoBorderModule,
                        DxoFontModule,
                        DxoFormatModule,
                        DxoShadowModule,
                        DxTemplateModule] });
                /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxSparklineModule, imports: [DxoMarginModule,
                        DxoSizeModule,
                        DxoTooltipModule,
                        DxoBorderModule,
                        DxoFontModule,
                        DxoFormatModule,
                        DxoShadowModule,
                        DxIntegrationModule,
                        DxTemplateModule, DxoMarginModule,
                        DxoSizeModule,
                        DxoTooltipModule,
                        DxoBorderModule,
                        DxoFontModule,
                        DxoFormatModule,
                        DxoShadowModule,
                        DxTemplateModule] });
            } exports("DxSparklineModule", DxSparklineModule);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxSparklineModule, decorators: [{
                        type: NgModule,
                        args: [{
                                imports: [
                                    DxoMarginModule,
                                    DxoSizeModule,
                                    DxoTooltipModule,
                                    DxoBorderModule,
                                    DxoFontModule,
                                    DxoFormatModule,
                                    DxoShadowModule,
                                    DxIntegrationModule,
                                    DxTemplateModule
                                ],
                                declarations: [
                                    DxSparklineComponent
                                ],
                                exports: [
                                    DxSparklineComponent,
                                    DxoMarginModule,
                                    DxoSizeModule,
                                    DxoTooltipModule,
                                    DxoBorderModule,
                                    DxoFontModule,
                                    DxoFormatModule,
                                    DxoShadowModule,
                                    DxTemplateModule
                                ]
                            }]
                    }] });

        })
    };
}));
