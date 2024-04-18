System.register(['@angular/platform-browser', '@angular/core', 'devextreme/viz/range_selector', '@angular/forms', './devextreme-angular-core.js', './devextreme-angular-ui-nested.js', '@angular/common', 'devextreme/core/dom_adapter', 'devextreme/events', 'devextreme/core/utils/common', 'devextreme/core/renderer', 'devextreme/core/http_request', 'devextreme/core/utils/ready_callbacks', 'devextreme/events/core/events_engine', 'devextreme/core/utils/ajax', 'devextreme/core/utils/deferred'], (function (exports) {
    'use strict';
    var i2, forwardRef, i0, PLATFORM_ID, Component, Inject, Input, Output, HostListener, NgModule, DxRangeSelector, NG_VALUE_ACCESSOR, DxComponent, DxTemplateHost, WatcherHelper, IterableDifferHelper, NestedOptionHost, DxIntegrationModule, DxTemplateModule, DxoBackgroundModule, DxoImageModule, DxoBehaviorModule, DxoChartModule, DxoCommonSeriesSettingsModule, DxoAggregationModule, DxoAreaModule, DxoBorderModule, DxoHoverStyleModule, DxoHatchingModule, DxoLabelModule, DxoConnectorModule, DxoPointModule, DxoHeightModule, DxoUrlModule, DxoWidthModule, DxoSelectionStyleModule, DxoReductionModule, DxoValueErrorBarModule, DxoBarModule, DxoBubbleModule, DxoCandlestickModule, DxoColorModule, DxoFullstackedareaModule, DxoFullstackedbarModule, DxoFullstackedlineModule, DxoFullstackedsplineModule, DxoFullstackedsplineareaModule, DxoArgumentFormatModule, DxoFontModule, DxoFormatModule, DxoLineModule, DxoRangeareaModule, DxoRangebarModule, DxoScatterModule, DxoSplineModule, DxoSplineareaModule, DxoStackedareaModule, DxoStackedbarModule, DxoStackedlineModule, DxoStackedsplineModule, DxoStackedsplineareaModule, DxoStepareaModule, DxoSteplineModule, DxoStockModule, DxoDataPrepareSettingsModule, DxiSeriesModule, DxoSeriesTemplateModule, DxoValueAxisModule, DxoExportModule, DxoIndentModule, DxoLoadingIndicatorModule, DxoMarginModule, DxoScaleModule, DxoAggregationIntervalModule, DxiBreakModule, DxoBreakStyleModule, DxoMarkerModule, DxoMaxRangeModule, DxoMinorTickModule, DxoMinorTickIntervalModule, DxoMinRangeModule, DxoTickModule, DxoTickIntervalModule, DxoShutterModule, DxoSizeModule, DxoSliderHandleModule, DxoSliderMarkerModule, DxoTitleModule, DxoSubtitleModule;
    return {
        setters: [function (module) {
            i2 = module;
        }, function (module) {
            forwardRef = module.forwardRef;
            i0 = module;
            PLATFORM_ID = module.PLATFORM_ID;
            Component = module.Component;
            Inject = module.Inject;
            Input = module.Input;
            Output = module.Output;
            HostListener = module.HostListener;
            NgModule = module.NgModule;
        }, function (module) {
            DxRangeSelector = module.default;
        }, function (module) {
            NG_VALUE_ACCESSOR = module.NG_VALUE_ACCESSOR;
        }, function (module) {
            DxComponent = module.c;
            DxTemplateHost = module.h;
            WatcherHelper = module.W;
            IterableDifferHelper = module.I;
            NestedOptionHost = module.i;
            DxIntegrationModule = module.e;
            DxTemplateModule = module.D;
        }, function (module) {
            DxoBackgroundModule = module.DxoBackgroundModule;
            DxoImageModule = module.DxoImageModule;
            DxoBehaviorModule = module.DxoBehaviorModule;
            DxoChartModule = module.DxoChartModule;
            DxoCommonSeriesSettingsModule = module.DxoCommonSeriesSettingsModule;
            DxoAggregationModule = module.DxoAggregationModule;
            DxoAreaModule = module.DxoAreaModule;
            DxoBorderModule = module.DxoBorderModule;
            DxoHoverStyleModule = module.DxoHoverStyleModule;
            DxoHatchingModule = module.DxoHatchingModule;
            DxoLabelModule = module.DxoLabelModule;
            DxoConnectorModule = module.DxoConnectorModule;
            DxoPointModule = module.DxoPointModule;
            DxoHeightModule = module.DxoHeightModule;
            DxoUrlModule = module.DxoUrlModule;
            DxoWidthModule = module.DxoWidthModule;
            DxoSelectionStyleModule = module.DxoSelectionStyleModule;
            DxoReductionModule = module.DxoReductionModule;
            DxoValueErrorBarModule = module.DxoValueErrorBarModule;
            DxoBarModule = module.DxoBarModule;
            DxoBubbleModule = module.DxoBubbleModule;
            DxoCandlestickModule = module.DxoCandlestickModule;
            DxoColorModule = module.DxoColorModule;
            DxoFullstackedareaModule = module.DxoFullstackedareaModule;
            DxoFullstackedbarModule = module.DxoFullstackedbarModule;
            DxoFullstackedlineModule = module.DxoFullstackedlineModule;
            DxoFullstackedsplineModule = module.DxoFullstackedsplineModule;
            DxoFullstackedsplineareaModule = module.DxoFullstackedsplineareaModule;
            DxoArgumentFormatModule = module.DxoArgumentFormatModule;
            DxoFontModule = module.DxoFontModule;
            DxoFormatModule = module.DxoFormatModule;
            DxoLineModule = module.DxoLineModule;
            DxoRangeareaModule = module.DxoRangeareaModule;
            DxoRangebarModule = module.DxoRangebarModule;
            DxoScatterModule = module.DxoScatterModule;
            DxoSplineModule = module.DxoSplineModule;
            DxoSplineareaModule = module.DxoSplineareaModule;
            DxoStackedareaModule = module.DxoStackedareaModule;
            DxoStackedbarModule = module.DxoStackedbarModule;
            DxoStackedlineModule = module.DxoStackedlineModule;
            DxoStackedsplineModule = module.DxoStackedsplineModule;
            DxoStackedsplineareaModule = module.DxoStackedsplineareaModule;
            DxoStepareaModule = module.DxoStepareaModule;
            DxoSteplineModule = module.DxoSteplineModule;
            DxoStockModule = module.DxoStockModule;
            DxoDataPrepareSettingsModule = module.DxoDataPrepareSettingsModule;
            DxiSeriesModule = module.DxiSeriesModule;
            DxoSeriesTemplateModule = module.DxoSeriesTemplateModule;
            DxoValueAxisModule = module.DxoValueAxisModule;
            DxoExportModule = module.DxoExportModule;
            DxoIndentModule = module.DxoIndentModule;
            DxoLoadingIndicatorModule = module.DxoLoadingIndicatorModule;
            DxoMarginModule = module.DxoMarginModule;
            DxoScaleModule = module.DxoScaleModule;
            DxoAggregationIntervalModule = module.DxoAggregationIntervalModule;
            DxiBreakModule = module.DxiBreakModule;
            DxoBreakStyleModule = module.DxoBreakStyleModule;
            DxoMarkerModule = module.DxoMarkerModule;
            DxoMaxRangeModule = module.DxoMaxRangeModule;
            DxoMinorTickModule = module.DxoMinorTickModule;
            DxoMinorTickIntervalModule = module.DxoMinorTickIntervalModule;
            DxoMinRangeModule = module.DxoMinRangeModule;
            DxoTickModule = module.DxoTickModule;
            DxoTickIntervalModule = module.DxoTickIntervalModule;
            DxoShutterModule = module.DxoShutterModule;
            DxoSizeModule = module.DxoSizeModule;
            DxoSliderHandleModule = module.DxoSliderHandleModule;
            DxoSliderMarkerModule = module.DxoSliderMarkerModule;
            DxoTitleModule = module.DxoTitleModule;
            DxoSubtitleModule = module.DxoSubtitleModule;
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
            const CUSTOM_VALUE_ACCESSOR_PROVIDER = {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => DxRangeSelectorComponent),
                multi: true
            };
            /**
             * The RangeSelector is a UI component that allows a user to select a range of values on a scale.

             */
            class DxRangeSelectorComponent extends DxComponent {
                _watcherHelper;
                _idh;
                instance = null;
                /**
                 * Specifies the properties for the range selector&apos;s background.
                
                 */
                get background() {
                    return this._getOption('background');
                }
                set background(value) {
                    this._setOption('background', value);
                }
                /**
                 * Specifies the RangeSelector&apos;s behavior properties.
                
                 */
                get behavior() {
                    return this._getOption('behavior');
                }
                set behavior(value) {
                    this._setOption('behavior', value);
                }
                /**
                 * Specifies the properties required to display a chart as the range selector&apos;s background.
                
                 */
                get chart() {
                    return this._getOption('chart');
                }
                set chart(value) {
                    this._setOption('chart', value);
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
                 * Specifies a data source for the scale values and for the chart at the background.
                
                 */
                get dataSource() {
                    return this._getOption('dataSource');
                }
                set dataSource(value) {
                    this._setOption('dataSource', value);
                }
                /**
                 * Specifies the data source field that provides data for the scale.
                
                 */
                get dataSourceField() {
                    return this._getOption('dataSourceField');
                }
                set dataSourceField(value) {
                    this._setOption('dataSourceField', value);
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
                 * Range selector&apos;s indent properties.
                
                 */
                get indent() {
                    return this._getOption('indent');
                }
                set indent(value) {
                    this._setOption('indent', value);
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
                 * Specifies properties of the range selector&apos;s scale.
                
                 */
                get scale() {
                    return this._getOption('scale');
                }
                set scale(value) {
                    this._setOption('scale', value);
                }
                /**
                 * Specifies the color of the selected range.
                
                 */
                get selectedRangeColor() {
                    return this._getOption('selectedRangeColor');
                }
                set selectedRangeColor(value) {
                    this._setOption('selectedRangeColor', value);
                }
                /**
                 * Specifies how the selected range should behave when data is updated. Applies only when the RangeSelector is bound to a data source.
                
                 */
                get selectedRangeUpdateMode() {
                    return this._getOption('selectedRangeUpdateMode');
                }
                set selectedRangeUpdateMode(value) {
                    this._setOption('selectedRangeUpdateMode', value);
                }
                /**
                 * Specifies range selector shutter properties.
                
                 */
                get shutter() {
                    return this._getOption('shutter');
                }
                set shutter(value) {
                    this._setOption('shutter', value);
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
                 * Specifies the appearance of the range selector&apos;s slider handles.
                
                 */
                get sliderHandle() {
                    return this._getOption('sliderHandle');
                }
                set sliderHandle(value) {
                    this._setOption('sliderHandle', value);
                }
                /**
                 * Defines the properties of the range selector slider markers.
                
                 */
                get sliderMarker() {
                    return this._getOption('sliderMarker');
                }
                set sliderMarker(value) {
                    this._setOption('sliderMarker', value);
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
                 * The selected range (initial or current). Equals the entire scale when not set.
                
                 */
                get value() {
                    return this._getOption('value');
                }
                set value(value) {
                    this._setOption('value', value);
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
                
                 * A function that is executed after the UI component&apos;s value is changed.
                
                
                 */
                onValueChanged;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                backgroundChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                behaviorChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                chartChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                containerBackgroundColorChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                dataSourceChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                dataSourceFieldChange;
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
                indentChange;
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
                selectedRangeColorChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                selectedRangeUpdateModeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                shutterChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                sizeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                sliderHandleChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                sliderMarkerChange;
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
                valueChange;
                /**
                
                 * 
                
                
                 */
                onBlur;
                change(_) { }
                touched = (_) => { };
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
                        { subscribe: 'valueChanged', emit: 'onValueChanged' },
                        { emit: 'backgroundChange' },
                        { emit: 'behaviorChange' },
                        { emit: 'chartChange' },
                        { emit: 'containerBackgroundColorChange' },
                        { emit: 'dataSourceChange' },
                        { emit: 'dataSourceFieldChange' },
                        { emit: 'disabledChange' },
                        { emit: 'elementAttrChange' },
                        { emit: 'exportChange' },
                        { emit: 'indentChange' },
                        { emit: 'loadingIndicatorChange' },
                        { emit: 'marginChange' },
                        { emit: 'pathModifiedChange' },
                        { emit: 'redrawOnResizeChange' },
                        { emit: 'rtlEnabledChange' },
                        { emit: 'scaleChange' },
                        { emit: 'selectedRangeColorChange' },
                        { emit: 'selectedRangeUpdateModeChange' },
                        { emit: 'shutterChange' },
                        { emit: 'sizeChange' },
                        { emit: 'sliderHandleChange' },
                        { emit: 'sliderMarkerChange' },
                        { emit: 'themeChange' },
                        { emit: 'titleChange' },
                        { emit: 'valueChange' },
                        { emit: 'onBlur' }
                    ]);
                    this._idh.setHost(this);
                    optionHost.setHost(this);
                }
                _createInstance(element, options) {
                    return new DxRangeSelector(element, options);
                }
                writeValue(value) {
                    this.eventHelper.lockedValueChangeEvent = true;
                    this.value = value;
                    this.eventHelper.lockedValueChangeEvent = false;
                }
                registerOnChange(fn) { this.change = fn; }
                registerOnTouched(fn) { this.touched = fn; }
                _createWidget(element) {
                    super._createWidget(element);
                    this.instance.on('focusOut', (e) => {
                        this.eventHelper.fireNgEvent('onBlur', [e]);
                    });
                }
                ngOnDestroy() {
                    this._destroyWidget();
                }
                ngOnChanges(changes) {
                    super.ngOnChanges(changes);
                    this.setupChanges('dataSource', changes);
                    this.setupChanges('value', changes);
                }
                setupChanges(prop, changes) {
                    if (!(prop in this._optionsToUpdate)) {
                        this._idh.setup(prop, changes);
                    }
                }
                ngDoCheck() {
                    this._idh.doCheck('dataSource');
                    this._idh.doCheck('value');
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
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxRangeSelectorComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: DxTemplateHost }, { token: WatcherHelper }, { token: IterableDifferHelper }, { token: NestedOptionHost }, { token: i2.TransferState }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
                /** @nocollapse */ static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.0", type: DxRangeSelectorComponent, selector: "dx-range-selector", inputs: { background: "background", behavior: "behavior", chart: "chart", containerBackgroundColor: "containerBackgroundColor", dataSource: "dataSource", dataSourceField: "dataSourceField", disabled: "disabled", elementAttr: "elementAttr", export: "export", indent: "indent", loadingIndicator: "loadingIndicator", margin: "margin", pathModified: "pathModified", redrawOnResize: "redrawOnResize", rtlEnabled: "rtlEnabled", scale: "scale", selectedRangeColor: "selectedRangeColor", selectedRangeUpdateMode: "selectedRangeUpdateMode", shutter: "shutter", size: "size", sliderHandle: "sliderHandle", sliderMarker: "sliderMarker", theme: "theme", title: "title", value: "value" }, outputs: { onDisposing: "onDisposing", onDrawn: "onDrawn", onExported: "onExported", onExporting: "onExporting", onFileSaving: "onFileSaving", onIncidentOccurred: "onIncidentOccurred", onInitialized: "onInitialized", onOptionChanged: "onOptionChanged", onValueChanged: "onValueChanged", backgroundChange: "backgroundChange", behaviorChange: "behaviorChange", chartChange: "chartChange", containerBackgroundColorChange: "containerBackgroundColorChange", dataSourceChange: "dataSourceChange", dataSourceFieldChange: "dataSourceFieldChange", disabledChange: "disabledChange", elementAttrChange: "elementAttrChange", exportChange: "exportChange", indentChange: "indentChange", loadingIndicatorChange: "loadingIndicatorChange", marginChange: "marginChange", pathModifiedChange: "pathModifiedChange", redrawOnResizeChange: "redrawOnResizeChange", rtlEnabledChange: "rtlEnabledChange", scaleChange: "scaleChange", selectedRangeColorChange: "selectedRangeColorChange", selectedRangeUpdateModeChange: "selectedRangeUpdateModeChange", shutterChange: "shutterChange", sizeChange: "sizeChange", sliderHandleChange: "sliderHandleChange", sliderMarkerChange: "sliderMarkerChange", themeChange: "themeChange", titleChange: "titleChange", valueChange: "valueChange", onBlur: "onBlur" }, host: { listeners: { "valueChange": "change($event)", "onBlur": "touched($event)" } }, providers: [
                        DxTemplateHost,
                        WatcherHelper,
                        CUSTOM_VALUE_ACCESSOR_PROVIDER,
                        NestedOptionHost,
                        IterableDifferHelper
                    ], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: '', isInline: true, styles: [":host{display:block}\n"] });
            } exports("DxRangeSelectorComponent", DxRangeSelectorComponent);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxRangeSelectorComponent, decorators: [{
                        type: Component,
                        args: [{ selector: 'dx-range-selector', template: '', providers: [
                                    DxTemplateHost,
                                    WatcherHelper,
                                    CUSTOM_VALUE_ACCESSOR_PROVIDER,
                                    NestedOptionHost,
                                    IterableDifferHelper
                                ], styles: [":host{display:block}\n"] }]
                    }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: DxTemplateHost }, { type: WatcherHelper }, { type: IterableDifferHelper }, { type: NestedOptionHost }, { type: i2.TransferState }, { type: undefined, decorators: [{
                                type: Inject,
                                args: [PLATFORM_ID]
                            }] }], propDecorators: { background: [{
                            type: Input
                        }], behavior: [{
                            type: Input
                        }], chart: [{
                            type: Input
                        }], containerBackgroundColor: [{
                            type: Input
                        }], dataSource: [{
                            type: Input
                        }], dataSourceField: [{
                            type: Input
                        }], disabled: [{
                            type: Input
                        }], elementAttr: [{
                            type: Input
                        }], export: [{
                            type: Input
                        }], indent: [{
                            type: Input
                        }], loadingIndicator: [{
                            type: Input
                        }], margin: [{
                            type: Input
                        }], pathModified: [{
                            type: Input
                        }], redrawOnResize: [{
                            type: Input
                        }], rtlEnabled: [{
                            type: Input
                        }], scale: [{
                            type: Input
                        }], selectedRangeColor: [{
                            type: Input
                        }], selectedRangeUpdateMode: [{
                            type: Input
                        }], shutter: [{
                            type: Input
                        }], size: [{
                            type: Input
                        }], sliderHandle: [{
                            type: Input
                        }], sliderMarker: [{
                            type: Input
                        }], theme: [{
                            type: Input
                        }], title: [{
                            type: Input
                        }], value: [{
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
                        }], onValueChanged: [{
                            type: Output
                        }], backgroundChange: [{
                            type: Output
                        }], behaviorChange: [{
                            type: Output
                        }], chartChange: [{
                            type: Output
                        }], containerBackgroundColorChange: [{
                            type: Output
                        }], dataSourceChange: [{
                            type: Output
                        }], dataSourceFieldChange: [{
                            type: Output
                        }], disabledChange: [{
                            type: Output
                        }], elementAttrChange: [{
                            type: Output
                        }], exportChange: [{
                            type: Output
                        }], indentChange: [{
                            type: Output
                        }], loadingIndicatorChange: [{
                            type: Output
                        }], marginChange: [{
                            type: Output
                        }], pathModifiedChange: [{
                            type: Output
                        }], redrawOnResizeChange: [{
                            type: Output
                        }], rtlEnabledChange: [{
                            type: Output
                        }], scaleChange: [{
                            type: Output
                        }], selectedRangeColorChange: [{
                            type: Output
                        }], selectedRangeUpdateModeChange: [{
                            type: Output
                        }], shutterChange: [{
                            type: Output
                        }], sizeChange: [{
                            type: Output
                        }], sliderHandleChange: [{
                            type: Output
                        }], sliderMarkerChange: [{
                            type: Output
                        }], themeChange: [{
                            type: Output
                        }], titleChange: [{
                            type: Output
                        }], valueChange: [{
                            type: Output
                        }], onBlur: [{
                            type: Output
                        }], change: [{
                            type: HostListener,
                            args: ['valueChange', ['$event']]
                        }], touched: [{
                            type: HostListener,
                            args: ['onBlur', ['$event']]
                        }] } });
            class DxRangeSelectorModule {
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxRangeSelectorModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
                /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0, type: DxRangeSelectorModule, declarations: [DxRangeSelectorComponent], imports: [DxoBackgroundModule,
                        DxoImageModule,
                        DxoBehaviorModule,
                        DxoChartModule,
                        DxoCommonSeriesSettingsModule,
                        DxoAggregationModule,
                        DxoAreaModule,
                        DxoBorderModule,
                        DxoHoverStyleModule,
                        DxoHatchingModule,
                        DxoLabelModule,
                        DxoConnectorModule,
                        DxoPointModule,
                        DxoHeightModule,
                        DxoUrlModule,
                        DxoWidthModule,
                        DxoSelectionStyleModule,
                        DxoReductionModule,
                        DxoValueErrorBarModule,
                        DxoBarModule,
                        DxoBubbleModule,
                        DxoCandlestickModule,
                        DxoColorModule,
                        DxoFullstackedareaModule,
                        DxoFullstackedbarModule,
                        DxoFullstackedlineModule,
                        DxoFullstackedsplineModule,
                        DxoFullstackedsplineareaModule,
                        DxoArgumentFormatModule,
                        DxoFontModule,
                        DxoFormatModule,
                        DxoLineModule,
                        DxoRangeareaModule,
                        DxoRangebarModule,
                        DxoScatterModule,
                        DxoSplineModule,
                        DxoSplineareaModule,
                        DxoStackedareaModule,
                        DxoStackedbarModule,
                        DxoStackedlineModule,
                        DxoStackedsplineModule,
                        DxoStackedsplineareaModule,
                        DxoStepareaModule,
                        DxoSteplineModule,
                        DxoStockModule,
                        DxoDataPrepareSettingsModule,
                        DxiSeriesModule,
                        DxoSeriesTemplateModule,
                        DxoValueAxisModule,
                        DxoExportModule,
                        DxoIndentModule,
                        DxoLoadingIndicatorModule,
                        DxoMarginModule,
                        DxoScaleModule,
                        DxoAggregationIntervalModule,
                        DxiBreakModule,
                        DxoBreakStyleModule,
                        DxoMarkerModule,
                        DxoMaxRangeModule,
                        DxoMinorTickModule,
                        DxoMinorTickIntervalModule,
                        DxoMinRangeModule,
                        DxoTickModule,
                        DxoTickIntervalModule,
                        DxoShutterModule,
                        DxoSizeModule,
                        DxoSliderHandleModule,
                        DxoSliderMarkerModule,
                        DxoTitleModule,
                        DxoSubtitleModule,
                        DxIntegrationModule,
                        DxTemplateModule], exports: [DxRangeSelectorComponent, DxoBackgroundModule,
                        DxoImageModule,
                        DxoBehaviorModule,
                        DxoChartModule,
                        DxoCommonSeriesSettingsModule,
                        DxoAggregationModule,
                        DxoAreaModule,
                        DxoBorderModule,
                        DxoHoverStyleModule,
                        DxoHatchingModule,
                        DxoLabelModule,
                        DxoConnectorModule,
                        DxoPointModule,
                        DxoHeightModule,
                        DxoUrlModule,
                        DxoWidthModule,
                        DxoSelectionStyleModule,
                        DxoReductionModule,
                        DxoValueErrorBarModule,
                        DxoBarModule,
                        DxoBubbleModule,
                        DxoCandlestickModule,
                        DxoColorModule,
                        DxoFullstackedareaModule,
                        DxoFullstackedbarModule,
                        DxoFullstackedlineModule,
                        DxoFullstackedsplineModule,
                        DxoFullstackedsplineareaModule,
                        DxoArgumentFormatModule,
                        DxoFontModule,
                        DxoFormatModule,
                        DxoLineModule,
                        DxoRangeareaModule,
                        DxoRangebarModule,
                        DxoScatterModule,
                        DxoSplineModule,
                        DxoSplineareaModule,
                        DxoStackedareaModule,
                        DxoStackedbarModule,
                        DxoStackedlineModule,
                        DxoStackedsplineModule,
                        DxoStackedsplineareaModule,
                        DxoStepareaModule,
                        DxoSteplineModule,
                        DxoStockModule,
                        DxoDataPrepareSettingsModule,
                        DxiSeriesModule,
                        DxoSeriesTemplateModule,
                        DxoValueAxisModule,
                        DxoExportModule,
                        DxoIndentModule,
                        DxoLoadingIndicatorModule,
                        DxoMarginModule,
                        DxoScaleModule,
                        DxoAggregationIntervalModule,
                        DxiBreakModule,
                        DxoBreakStyleModule,
                        DxoMarkerModule,
                        DxoMaxRangeModule,
                        DxoMinorTickModule,
                        DxoMinorTickIntervalModule,
                        DxoMinRangeModule,
                        DxoTickModule,
                        DxoTickIntervalModule,
                        DxoShutterModule,
                        DxoSizeModule,
                        DxoSliderHandleModule,
                        DxoSliderMarkerModule,
                        DxoTitleModule,
                        DxoSubtitleModule,
                        DxTemplateModule] });
                /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxRangeSelectorModule, imports: [DxoBackgroundModule,
                        DxoImageModule,
                        DxoBehaviorModule,
                        DxoChartModule,
                        DxoCommonSeriesSettingsModule,
                        DxoAggregationModule,
                        DxoAreaModule,
                        DxoBorderModule,
                        DxoHoverStyleModule,
                        DxoHatchingModule,
                        DxoLabelModule,
                        DxoConnectorModule,
                        DxoPointModule,
                        DxoHeightModule,
                        DxoUrlModule,
                        DxoWidthModule,
                        DxoSelectionStyleModule,
                        DxoReductionModule,
                        DxoValueErrorBarModule,
                        DxoBarModule,
                        DxoBubbleModule,
                        DxoCandlestickModule,
                        DxoColorModule,
                        DxoFullstackedareaModule,
                        DxoFullstackedbarModule,
                        DxoFullstackedlineModule,
                        DxoFullstackedsplineModule,
                        DxoFullstackedsplineareaModule,
                        DxoArgumentFormatModule,
                        DxoFontModule,
                        DxoFormatModule,
                        DxoLineModule,
                        DxoRangeareaModule,
                        DxoRangebarModule,
                        DxoScatterModule,
                        DxoSplineModule,
                        DxoSplineareaModule,
                        DxoStackedareaModule,
                        DxoStackedbarModule,
                        DxoStackedlineModule,
                        DxoStackedsplineModule,
                        DxoStackedsplineareaModule,
                        DxoStepareaModule,
                        DxoSteplineModule,
                        DxoStockModule,
                        DxoDataPrepareSettingsModule,
                        DxiSeriesModule,
                        DxoSeriesTemplateModule,
                        DxoValueAxisModule,
                        DxoExportModule,
                        DxoIndentModule,
                        DxoLoadingIndicatorModule,
                        DxoMarginModule,
                        DxoScaleModule,
                        DxoAggregationIntervalModule,
                        DxiBreakModule,
                        DxoBreakStyleModule,
                        DxoMarkerModule,
                        DxoMaxRangeModule,
                        DxoMinorTickModule,
                        DxoMinorTickIntervalModule,
                        DxoMinRangeModule,
                        DxoTickModule,
                        DxoTickIntervalModule,
                        DxoShutterModule,
                        DxoSizeModule,
                        DxoSliderHandleModule,
                        DxoSliderMarkerModule,
                        DxoTitleModule,
                        DxoSubtitleModule,
                        DxIntegrationModule,
                        DxTemplateModule, DxoBackgroundModule,
                        DxoImageModule,
                        DxoBehaviorModule,
                        DxoChartModule,
                        DxoCommonSeriesSettingsModule,
                        DxoAggregationModule,
                        DxoAreaModule,
                        DxoBorderModule,
                        DxoHoverStyleModule,
                        DxoHatchingModule,
                        DxoLabelModule,
                        DxoConnectorModule,
                        DxoPointModule,
                        DxoHeightModule,
                        DxoUrlModule,
                        DxoWidthModule,
                        DxoSelectionStyleModule,
                        DxoReductionModule,
                        DxoValueErrorBarModule,
                        DxoBarModule,
                        DxoBubbleModule,
                        DxoCandlestickModule,
                        DxoColorModule,
                        DxoFullstackedareaModule,
                        DxoFullstackedbarModule,
                        DxoFullstackedlineModule,
                        DxoFullstackedsplineModule,
                        DxoFullstackedsplineareaModule,
                        DxoArgumentFormatModule,
                        DxoFontModule,
                        DxoFormatModule,
                        DxoLineModule,
                        DxoRangeareaModule,
                        DxoRangebarModule,
                        DxoScatterModule,
                        DxoSplineModule,
                        DxoSplineareaModule,
                        DxoStackedareaModule,
                        DxoStackedbarModule,
                        DxoStackedlineModule,
                        DxoStackedsplineModule,
                        DxoStackedsplineareaModule,
                        DxoStepareaModule,
                        DxoSteplineModule,
                        DxoStockModule,
                        DxoDataPrepareSettingsModule,
                        DxiSeriesModule,
                        DxoSeriesTemplateModule,
                        DxoValueAxisModule,
                        DxoExportModule,
                        DxoIndentModule,
                        DxoLoadingIndicatorModule,
                        DxoMarginModule,
                        DxoScaleModule,
                        DxoAggregationIntervalModule,
                        DxiBreakModule,
                        DxoBreakStyleModule,
                        DxoMarkerModule,
                        DxoMaxRangeModule,
                        DxoMinorTickModule,
                        DxoMinorTickIntervalModule,
                        DxoMinRangeModule,
                        DxoTickModule,
                        DxoTickIntervalModule,
                        DxoShutterModule,
                        DxoSizeModule,
                        DxoSliderHandleModule,
                        DxoSliderMarkerModule,
                        DxoTitleModule,
                        DxoSubtitleModule,
                        DxTemplateModule] });
            } exports("DxRangeSelectorModule", DxRangeSelectorModule);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxRangeSelectorModule, decorators: [{
                        type: NgModule,
                        args: [{
                                imports: [
                                    DxoBackgroundModule,
                                    DxoImageModule,
                                    DxoBehaviorModule,
                                    DxoChartModule,
                                    DxoCommonSeriesSettingsModule,
                                    DxoAggregationModule,
                                    DxoAreaModule,
                                    DxoBorderModule,
                                    DxoHoverStyleModule,
                                    DxoHatchingModule,
                                    DxoLabelModule,
                                    DxoConnectorModule,
                                    DxoPointModule,
                                    DxoHeightModule,
                                    DxoUrlModule,
                                    DxoWidthModule,
                                    DxoSelectionStyleModule,
                                    DxoReductionModule,
                                    DxoValueErrorBarModule,
                                    DxoBarModule,
                                    DxoBubbleModule,
                                    DxoCandlestickModule,
                                    DxoColorModule,
                                    DxoFullstackedareaModule,
                                    DxoFullstackedbarModule,
                                    DxoFullstackedlineModule,
                                    DxoFullstackedsplineModule,
                                    DxoFullstackedsplineareaModule,
                                    DxoArgumentFormatModule,
                                    DxoFontModule,
                                    DxoFormatModule,
                                    DxoLineModule,
                                    DxoRangeareaModule,
                                    DxoRangebarModule,
                                    DxoScatterModule,
                                    DxoSplineModule,
                                    DxoSplineareaModule,
                                    DxoStackedareaModule,
                                    DxoStackedbarModule,
                                    DxoStackedlineModule,
                                    DxoStackedsplineModule,
                                    DxoStackedsplineareaModule,
                                    DxoStepareaModule,
                                    DxoSteplineModule,
                                    DxoStockModule,
                                    DxoDataPrepareSettingsModule,
                                    DxiSeriesModule,
                                    DxoSeriesTemplateModule,
                                    DxoValueAxisModule,
                                    DxoExportModule,
                                    DxoIndentModule,
                                    DxoLoadingIndicatorModule,
                                    DxoMarginModule,
                                    DxoScaleModule,
                                    DxoAggregationIntervalModule,
                                    DxiBreakModule,
                                    DxoBreakStyleModule,
                                    DxoMarkerModule,
                                    DxoMaxRangeModule,
                                    DxoMinorTickModule,
                                    DxoMinorTickIntervalModule,
                                    DxoMinRangeModule,
                                    DxoTickModule,
                                    DxoTickIntervalModule,
                                    DxoShutterModule,
                                    DxoSizeModule,
                                    DxoSliderHandleModule,
                                    DxoSliderMarkerModule,
                                    DxoTitleModule,
                                    DxoSubtitleModule,
                                    DxIntegrationModule,
                                    DxTemplateModule
                                ],
                                declarations: [
                                    DxRangeSelectorComponent
                                ],
                                exports: [
                                    DxRangeSelectorComponent,
                                    DxoBackgroundModule,
                                    DxoImageModule,
                                    DxoBehaviorModule,
                                    DxoChartModule,
                                    DxoCommonSeriesSettingsModule,
                                    DxoAggregationModule,
                                    DxoAreaModule,
                                    DxoBorderModule,
                                    DxoHoverStyleModule,
                                    DxoHatchingModule,
                                    DxoLabelModule,
                                    DxoConnectorModule,
                                    DxoPointModule,
                                    DxoHeightModule,
                                    DxoUrlModule,
                                    DxoWidthModule,
                                    DxoSelectionStyleModule,
                                    DxoReductionModule,
                                    DxoValueErrorBarModule,
                                    DxoBarModule,
                                    DxoBubbleModule,
                                    DxoCandlestickModule,
                                    DxoColorModule,
                                    DxoFullstackedareaModule,
                                    DxoFullstackedbarModule,
                                    DxoFullstackedlineModule,
                                    DxoFullstackedsplineModule,
                                    DxoFullstackedsplineareaModule,
                                    DxoArgumentFormatModule,
                                    DxoFontModule,
                                    DxoFormatModule,
                                    DxoLineModule,
                                    DxoRangeareaModule,
                                    DxoRangebarModule,
                                    DxoScatterModule,
                                    DxoSplineModule,
                                    DxoSplineareaModule,
                                    DxoStackedareaModule,
                                    DxoStackedbarModule,
                                    DxoStackedlineModule,
                                    DxoStackedsplineModule,
                                    DxoStackedsplineareaModule,
                                    DxoStepareaModule,
                                    DxoSteplineModule,
                                    DxoStockModule,
                                    DxoDataPrepareSettingsModule,
                                    DxiSeriesModule,
                                    DxoSeriesTemplateModule,
                                    DxoValueAxisModule,
                                    DxoExportModule,
                                    DxoIndentModule,
                                    DxoLoadingIndicatorModule,
                                    DxoMarginModule,
                                    DxoScaleModule,
                                    DxoAggregationIntervalModule,
                                    DxiBreakModule,
                                    DxoBreakStyleModule,
                                    DxoMarkerModule,
                                    DxoMaxRangeModule,
                                    DxoMinorTickModule,
                                    DxoMinorTickIntervalModule,
                                    DxoMinRangeModule,
                                    DxoTickModule,
                                    DxoTickIntervalModule,
                                    DxoShutterModule,
                                    DxoSizeModule,
                                    DxoSliderHandleModule,
                                    DxoSliderMarkerModule,
                                    DxoTitleModule,
                                    DxoSubtitleModule,
                                    DxTemplateModule
                                ]
                            }]
                    }] });

        })
    };
}));
