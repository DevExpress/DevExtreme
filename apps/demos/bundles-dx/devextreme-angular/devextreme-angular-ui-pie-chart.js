System.register(['@angular/platform-browser', '@angular/core', 'devextreme/viz/pie_chart', './devextreme-angular-core.js', './devextreme-angular-ui-nested.js', '@angular/common', 'devextreme/core/dom_adapter', 'devextreme/events', 'devextreme/core/utils/common', 'devextreme/core/renderer', 'devextreme/core/http_request', 'devextreme/core/utils/ready_callbacks', 'devextreme/events/core/events_engine', 'devextreme/core/utils/ajax', 'devextreme/core/utils/deferred'], (function (exports) {
    'use strict';
    var i2, i0, PLATFORM_ID, Component, Inject, Input, Output, ContentChildren, NgModule, DxPieChart, DxComponent, DxTemplateHost, WatcherHelper, IterableDifferHelper, NestedOptionHost, DxIntegrationModule, DxTemplateModule, DxiAnnotationComponent, DxiSeriesComponent, DxoAdaptiveLayoutModule, DxoAnimationModule, DxiAnnotationModule, DxoBorderModule, DxoFontModule, DxoImageModule, DxoShadowModule, DxoCommonAnnotationSettingsModule, DxoCommonSeriesSettingsModule, DxoColorModule, DxoHoverStyleModule, DxoHatchingModule, DxoLabelModule, DxoArgumentFormatModule, DxoConnectorModule, DxoFormatModule, DxoSelectionStyleModule, DxoSmallValuesGroupingModule, DxoExportModule, DxoLegendModule, DxoMarginModule, DxoTitleModule, DxoSubtitleModule, DxoLoadingIndicatorModule, DxiSeriesModule, DxoSeriesTemplateModule, DxoSizeModule, DxoTooltipModule;
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
            DxPieChart = module.default;
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
            DxiSeriesComponent = module.DxiSeriesComponent;
            DxoAdaptiveLayoutModule = module.DxoAdaptiveLayoutModule;
            DxoAnimationModule = module.DxoAnimationModule;
            DxiAnnotationModule = module.DxiAnnotationModule;
            DxoBorderModule = module.DxoBorderModule;
            DxoFontModule = module.DxoFontModule;
            DxoImageModule = module.DxoImageModule;
            DxoShadowModule = module.DxoShadowModule;
            DxoCommonAnnotationSettingsModule = module.DxoCommonAnnotationSettingsModule;
            DxoCommonSeriesSettingsModule = module.DxoCommonSeriesSettingsModule;
            DxoColorModule = module.DxoColorModule;
            DxoHoverStyleModule = module.DxoHoverStyleModule;
            DxoHatchingModule = module.DxoHatchingModule;
            DxoLabelModule = module.DxoLabelModule;
            DxoArgumentFormatModule = module.DxoArgumentFormatModule;
            DxoConnectorModule = module.DxoConnectorModule;
            DxoFormatModule = module.DxoFormatModule;
            DxoSelectionStyleModule = module.DxoSelectionStyleModule;
            DxoSmallValuesGroupingModule = module.DxoSmallValuesGroupingModule;
            DxoExportModule = module.DxoExportModule;
            DxoLegendModule = module.DxoLegendModule;
            DxoMarginModule = module.DxoMarginModule;
            DxoTitleModule = module.DxoTitleModule;
            DxoSubtitleModule = module.DxoSubtitleModule;
            DxoLoadingIndicatorModule = module.DxoLoadingIndicatorModule;
            DxiSeriesModule = module.DxiSeriesModule;
            DxoSeriesTemplateModule = module.DxoSeriesTemplateModule;
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
             * The PieChart is a UI component that visualizes data as a circle divided into sectors that each represents a portion of the whole.

             */
            class DxPieChartComponent extends DxComponent {
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
                 * Specifies animation properties.
                
                 */
                get animation() {
                    return this._getOption('animation');
                }
                set animation(value) {
                    this._setOption('animation', value);
                }
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
                 * Specifies a custom template for content in the pie&apos;s center.
                
                 */
                get centerTemplate() {
                    return this._getOption('centerTemplate');
                }
                set centerTemplate(value) {
                    this._setOption('centerTemplate', value);
                }
                /**
                 * Specifies settings common for all annotations in the PieChart.
                
                 */
                get commonAnnotationSettings() {
                    return this._getOption('commonAnnotationSettings');
                }
                set commonAnnotationSettings(value) {
                    this._setOption('commonAnnotationSettings', value);
                }
                /**
                 * An object defining the configuration properties that are common for all series of the PieChart UI component.
                
                 */
                get commonSeriesSettings() {
                    return this._getOption('commonSeriesSettings');
                }
                set commonSeriesSettings(value) {
                    this._setOption('commonSeriesSettings', value);
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
                 * Customizes the appearance of an individual point label.
                
                 */
                get customizeLabel() {
                    return this._getOption('customizeLabel');
                }
                set customizeLabel(value) {
                    this._setOption('customizeLabel', value);
                }
                /**
                 * Customizes the appearance of an individual series point.
                
                 */
                get customizePoint() {
                    return this._getOption('customizePoint');
                }
                set customizePoint(value) {
                    this._setOption('customizePoint', value);
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
                 * Specifies the diameter of the pie.
                
                 */
                get diameter() {
                    return this._getOption('diameter');
                }
                set diameter(value) {
                    this._setOption('diameter', value);
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
                 * Specifies the fraction of the inner radius relative to the total radius in the series of the &apos;doughnut&apos; type. The value should be between 0 and 1.
                
                 */
                get innerRadius() {
                    return this._getOption('innerRadius');
                }
                set innerRadius(value) {
                    this._setOption('innerRadius', value);
                }
                /**
                 * Specifies PieChart legend properties.
                
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
                 * Specifies the minimum diameter of the pie.
                
                 */
                get minDiameter() {
                    return this._getOption('minDiameter');
                }
                set minDiameter(value) {
                    this._setOption('minDiameter', value);
                }
                /**
                 * Sets the palette to be used to colorize series and their elements.
                
                 */
                get palette() {
                    return this._getOption('palette');
                }
                set palette(value) {
                    this._setOption('palette', value);
                }
                /**
                 * Specifies what to do with colors in the palette when their number is less than the number of series (in the Chart UI component) or points in a series (in the PieChart UI component).
                
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
                 * Specifies whether a single point or multiple points can be selected in the chart.
                
                 */
                get pointSelectionMode() {
                    return this._getOption('pointSelectionMode');
                }
                set pointSelectionMode(value) {
                    this._setOption('pointSelectionMode', value);
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
                 * Specifies how a chart must behave when point labels overlap.
                
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
                 * Specifies the direction that the pie chart segments will occupy.
                
                 */
                get segmentsDirection() {
                    return this._getOption('segmentsDirection');
                }
                set segmentsDirection(value) {
                    this._setOption('segmentsDirection', value);
                }
                /**
                 * Specifies properties for the series of the PieChart UI component.
                
                 */
                get series() {
                    return this._getOption('series');
                }
                set series(value) {
                    this._setOption('series', value);
                }
                /**
                 * Defines properties for the series template.
                
                 */
                get seriesTemplate() {
                    return this._getOption('seriesTemplate');
                }
                set seriesTemplate(value) {
                    this._setOption('seriesTemplate', value);
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
                 * Allows you to display several adjoining pies in the same size.
                
                 */
                get sizeGroup() {
                    return this._getOption('sizeGroup');
                }
                set sizeGroup(value) {
                    this._setOption('sizeGroup', value);
                }
                /**
                 * Specifies the angle in arc degrees from which the first segment of a pie chart should start.
                
                 */
                get startAngle() {
                    return this._getOption('startAngle');
                }
                set startAngle(value) {
                    this._setOption('startAngle', value);
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
                 * Specifies the type of the pie chart series.
                
                 */
                get type() {
                    return this._getOption('type');
                }
                set type(value) {
                    this._setOption('type', value);
                }
                /**
                
                 * A function that is executed before the UI component is disposed of.
                
                
                 */
                onDisposing;
                /**
                
                 * A function that is executed when all series are ready.
                
                
                 */
                onDone;
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
                
                 * A function that is executed when a legend item is clicked or tapped.
                
                
                 */
                onLegendClick;
                /**
                
                 * A function that is executed after a UI component property is changed.
                
                
                 */
                onOptionChanged;
                /**
                
                 * A function that is executed when a series point is clicked or tapped.
                
                
                 */
                onPointClick;
                /**
                
                 * A function that is executed after the pointer enters or leaves a series point.
                
                
                 */
                onPointHoverChanged;
                /**
                
                 * A function that is executed when a series point is selected or selection is canceled.
                
                
                 */
                onPointSelectionChanged;
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
                adaptiveLayoutChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                animationChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                annotationsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                centerTemplateChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                commonAnnotationSettingsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                commonSeriesSettingsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                customizeAnnotationChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                customizeLabelChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                customizePointChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                dataSourceChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                diameterChange;
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
                innerRadiusChange;
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
                minDiameterChange;
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
                pointSelectionModeChange;
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
                segmentsDirectionChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                seriesChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                seriesTemplateChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                sizeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                sizeGroupChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                startAngleChange;
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
                typeChange;
                get annotationsChildren() {
                    return this._getOption('annotations');
                }
                set annotationsChildren(value) {
                    this.setChildren('annotations', value);
                }
                get seriesChildren() {
                    return this._getOption('series');
                }
                set seriesChildren(value) {
                    this.setChildren('series', value);
                }
                constructor(elementRef, ngZone, templateHost, _watcherHelper, _idh, optionHost, transferState, platformId) {
                    super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);
                    this._watcherHelper = _watcherHelper;
                    this._idh = _idh;
                    this._createEventEmitters([
                        { subscribe: 'disposing', emit: 'onDisposing' },
                        { subscribe: 'done', emit: 'onDone' },
                        { subscribe: 'drawn', emit: 'onDrawn' },
                        { subscribe: 'exported', emit: 'onExported' },
                        { subscribe: 'exporting', emit: 'onExporting' },
                        { subscribe: 'fileSaving', emit: 'onFileSaving' },
                        { subscribe: 'incidentOccurred', emit: 'onIncidentOccurred' },
                        { subscribe: 'initialized', emit: 'onInitialized' },
                        { subscribe: 'legendClick', emit: 'onLegendClick' },
                        { subscribe: 'optionChanged', emit: 'onOptionChanged' },
                        { subscribe: 'pointClick', emit: 'onPointClick' },
                        { subscribe: 'pointHoverChanged', emit: 'onPointHoverChanged' },
                        { subscribe: 'pointSelectionChanged', emit: 'onPointSelectionChanged' },
                        { subscribe: 'tooltipHidden', emit: 'onTooltipHidden' },
                        { subscribe: 'tooltipShown', emit: 'onTooltipShown' },
                        { emit: 'adaptiveLayoutChange' },
                        { emit: 'animationChange' },
                        { emit: 'annotationsChange' },
                        { emit: 'centerTemplateChange' },
                        { emit: 'commonAnnotationSettingsChange' },
                        { emit: 'commonSeriesSettingsChange' },
                        { emit: 'customizeAnnotationChange' },
                        { emit: 'customizeLabelChange' },
                        { emit: 'customizePointChange' },
                        { emit: 'dataSourceChange' },
                        { emit: 'diameterChange' },
                        { emit: 'disabledChange' },
                        { emit: 'elementAttrChange' },
                        { emit: 'exportChange' },
                        { emit: 'innerRadiusChange' },
                        { emit: 'legendChange' },
                        { emit: 'loadingIndicatorChange' },
                        { emit: 'marginChange' },
                        { emit: 'minDiameterChange' },
                        { emit: 'paletteChange' },
                        { emit: 'paletteExtensionModeChange' },
                        { emit: 'pathModifiedChange' },
                        { emit: 'pointSelectionModeChange' },
                        { emit: 'redrawOnResizeChange' },
                        { emit: 'resolveLabelOverlappingChange' },
                        { emit: 'rtlEnabledChange' },
                        { emit: 'segmentsDirectionChange' },
                        { emit: 'seriesChange' },
                        { emit: 'seriesTemplateChange' },
                        { emit: 'sizeChange' },
                        { emit: 'sizeGroupChange' },
                        { emit: 'startAngleChange' },
                        { emit: 'themeChange' },
                        { emit: 'titleChange' },
                        { emit: 'tooltipChange' },
                        { emit: 'typeChange' }
                    ]);
                    this._idh.setHost(this);
                    optionHost.setHost(this);
                }
                _createInstance(element, options) {
                    return new DxPieChart(element, options);
                }
                ngOnDestroy() {
                    this._destroyWidget();
                }
                ngOnChanges(changes) {
                    super.ngOnChanges(changes);
                    this.setupChanges('annotations', changes);
                    this.setupChanges('dataSource', changes);
                    this.setupChanges('palette', changes);
                    this.setupChanges('series', changes);
                }
                setupChanges(prop, changes) {
                    if (!(prop in this._optionsToUpdate)) {
                        this._idh.setup(prop, changes);
                    }
                }
                ngDoCheck() {
                    this._idh.doCheck('annotations');
                    this._idh.doCheck('dataSource');
                    this._idh.doCheck('palette');
                    this._idh.doCheck('series');
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
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxPieChartComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: DxTemplateHost }, { token: WatcherHelper }, { token: IterableDifferHelper }, { token: NestedOptionHost }, { token: i2.TransferState }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
                /** @nocollapse */ static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.0", type: DxPieChartComponent, selector: "dx-pie-chart", inputs: { adaptiveLayout: "adaptiveLayout", animation: "animation", annotations: "annotations", centerTemplate: "centerTemplate", commonAnnotationSettings: "commonAnnotationSettings", commonSeriesSettings: "commonSeriesSettings", customizeAnnotation: "customizeAnnotation", customizeLabel: "customizeLabel", customizePoint: "customizePoint", dataSource: "dataSource", diameter: "diameter", disabled: "disabled", elementAttr: "elementAttr", export: "export", innerRadius: "innerRadius", legend: "legend", loadingIndicator: "loadingIndicator", margin: "margin", minDiameter: "minDiameter", palette: "palette", paletteExtensionMode: "paletteExtensionMode", pathModified: "pathModified", pointSelectionMode: "pointSelectionMode", redrawOnResize: "redrawOnResize", resolveLabelOverlapping: "resolveLabelOverlapping", rtlEnabled: "rtlEnabled", segmentsDirection: "segmentsDirection", series: "series", seriesTemplate: "seriesTemplate", size: "size", sizeGroup: "sizeGroup", startAngle: "startAngle", theme: "theme", title: "title", tooltip: "tooltip", type: "type" }, outputs: { onDisposing: "onDisposing", onDone: "onDone", onDrawn: "onDrawn", onExported: "onExported", onExporting: "onExporting", onFileSaving: "onFileSaving", onIncidentOccurred: "onIncidentOccurred", onInitialized: "onInitialized", onLegendClick: "onLegendClick", onOptionChanged: "onOptionChanged", onPointClick: "onPointClick", onPointHoverChanged: "onPointHoverChanged", onPointSelectionChanged: "onPointSelectionChanged", onTooltipHidden: "onTooltipHidden", onTooltipShown: "onTooltipShown", adaptiveLayoutChange: "adaptiveLayoutChange", animationChange: "animationChange", annotationsChange: "annotationsChange", centerTemplateChange: "centerTemplateChange", commonAnnotationSettingsChange: "commonAnnotationSettingsChange", commonSeriesSettingsChange: "commonSeriesSettingsChange", customizeAnnotationChange: "customizeAnnotationChange", customizeLabelChange: "customizeLabelChange", customizePointChange: "customizePointChange", dataSourceChange: "dataSourceChange", diameterChange: "diameterChange", disabledChange: "disabledChange", elementAttrChange: "elementAttrChange", exportChange: "exportChange", innerRadiusChange: "innerRadiusChange", legendChange: "legendChange", loadingIndicatorChange: "loadingIndicatorChange", marginChange: "marginChange", minDiameterChange: "minDiameterChange", paletteChange: "paletteChange", paletteExtensionModeChange: "paletteExtensionModeChange", pathModifiedChange: "pathModifiedChange", pointSelectionModeChange: "pointSelectionModeChange", redrawOnResizeChange: "redrawOnResizeChange", resolveLabelOverlappingChange: "resolveLabelOverlappingChange", rtlEnabledChange: "rtlEnabledChange", segmentsDirectionChange: "segmentsDirectionChange", seriesChange: "seriesChange", seriesTemplateChange: "seriesTemplateChange", sizeChange: "sizeChange", sizeGroupChange: "sizeGroupChange", startAngleChange: "startAngleChange", themeChange: "themeChange", titleChange: "titleChange", tooltipChange: "tooltipChange", typeChange: "typeChange" }, providers: [
                        DxTemplateHost,
                        WatcherHelper,
                        NestedOptionHost,
                        IterableDifferHelper
                    ], queries: [{ propertyName: "annotationsChildren", predicate: DxiAnnotationComponent }, { propertyName: "seriesChildren", predicate: DxiSeriesComponent }], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: '', isInline: true, styles: [":host{display:block}\n"] });
            } exports("DxPieChartComponent", DxPieChartComponent);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxPieChartComponent, decorators: [{
                        type: Component,
                        args: [{ selector: 'dx-pie-chart', template: '', providers: [
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
                        }], animation: [{
                            type: Input
                        }], annotations: [{
                            type: Input
                        }], centerTemplate: [{
                            type: Input
                        }], commonAnnotationSettings: [{
                            type: Input
                        }], commonSeriesSettings: [{
                            type: Input
                        }], customizeAnnotation: [{
                            type: Input
                        }], customizeLabel: [{
                            type: Input
                        }], customizePoint: [{
                            type: Input
                        }], dataSource: [{
                            type: Input
                        }], diameter: [{
                            type: Input
                        }], disabled: [{
                            type: Input
                        }], elementAttr: [{
                            type: Input
                        }], export: [{
                            type: Input
                        }], innerRadius: [{
                            type: Input
                        }], legend: [{
                            type: Input
                        }], loadingIndicator: [{
                            type: Input
                        }], margin: [{
                            type: Input
                        }], minDiameter: [{
                            type: Input
                        }], palette: [{
                            type: Input
                        }], paletteExtensionMode: [{
                            type: Input
                        }], pathModified: [{
                            type: Input
                        }], pointSelectionMode: [{
                            type: Input
                        }], redrawOnResize: [{
                            type: Input
                        }], resolveLabelOverlapping: [{
                            type: Input
                        }], rtlEnabled: [{
                            type: Input
                        }], segmentsDirection: [{
                            type: Input
                        }], series: [{
                            type: Input
                        }], seriesTemplate: [{
                            type: Input
                        }], size: [{
                            type: Input
                        }], sizeGroup: [{
                            type: Input
                        }], startAngle: [{
                            type: Input
                        }], theme: [{
                            type: Input
                        }], title: [{
                            type: Input
                        }], tooltip: [{
                            type: Input
                        }], type: [{
                            type: Input
                        }], onDisposing: [{
                            type: Output
                        }], onDone: [{
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
                        }], onLegendClick: [{
                            type: Output
                        }], onOptionChanged: [{
                            type: Output
                        }], onPointClick: [{
                            type: Output
                        }], onPointHoverChanged: [{
                            type: Output
                        }], onPointSelectionChanged: [{
                            type: Output
                        }], onTooltipHidden: [{
                            type: Output
                        }], onTooltipShown: [{
                            type: Output
                        }], adaptiveLayoutChange: [{
                            type: Output
                        }], animationChange: [{
                            type: Output
                        }], annotationsChange: [{
                            type: Output
                        }], centerTemplateChange: [{
                            type: Output
                        }], commonAnnotationSettingsChange: [{
                            type: Output
                        }], commonSeriesSettingsChange: [{
                            type: Output
                        }], customizeAnnotationChange: [{
                            type: Output
                        }], customizeLabelChange: [{
                            type: Output
                        }], customizePointChange: [{
                            type: Output
                        }], dataSourceChange: [{
                            type: Output
                        }], diameterChange: [{
                            type: Output
                        }], disabledChange: [{
                            type: Output
                        }], elementAttrChange: [{
                            type: Output
                        }], exportChange: [{
                            type: Output
                        }], innerRadiusChange: [{
                            type: Output
                        }], legendChange: [{
                            type: Output
                        }], loadingIndicatorChange: [{
                            type: Output
                        }], marginChange: [{
                            type: Output
                        }], minDiameterChange: [{
                            type: Output
                        }], paletteChange: [{
                            type: Output
                        }], paletteExtensionModeChange: [{
                            type: Output
                        }], pathModifiedChange: [{
                            type: Output
                        }], pointSelectionModeChange: [{
                            type: Output
                        }], redrawOnResizeChange: [{
                            type: Output
                        }], resolveLabelOverlappingChange: [{
                            type: Output
                        }], rtlEnabledChange: [{
                            type: Output
                        }], segmentsDirectionChange: [{
                            type: Output
                        }], seriesChange: [{
                            type: Output
                        }], seriesTemplateChange: [{
                            type: Output
                        }], sizeChange: [{
                            type: Output
                        }], sizeGroupChange: [{
                            type: Output
                        }], startAngleChange: [{
                            type: Output
                        }], themeChange: [{
                            type: Output
                        }], titleChange: [{
                            type: Output
                        }], tooltipChange: [{
                            type: Output
                        }], typeChange: [{
                            type: Output
                        }], annotationsChildren: [{
                            type: ContentChildren,
                            args: [DxiAnnotationComponent]
                        }], seriesChildren: [{
                            type: ContentChildren,
                            args: [DxiSeriesComponent]
                        }] } });
            class DxPieChartModule {
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxPieChartModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
                /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0, type: DxPieChartModule, declarations: [DxPieChartComponent], imports: [DxoAdaptiveLayoutModule,
                        DxoAnimationModule,
                        DxiAnnotationModule,
                        DxoBorderModule,
                        DxoFontModule,
                        DxoImageModule,
                        DxoShadowModule,
                        DxoCommonAnnotationSettingsModule,
                        DxoCommonSeriesSettingsModule,
                        DxoColorModule,
                        DxoHoverStyleModule,
                        DxoHatchingModule,
                        DxoLabelModule,
                        DxoArgumentFormatModule,
                        DxoConnectorModule,
                        DxoFormatModule,
                        DxoSelectionStyleModule,
                        DxoSmallValuesGroupingModule,
                        DxoExportModule,
                        DxoLegendModule,
                        DxoMarginModule,
                        DxoTitleModule,
                        DxoSubtitleModule,
                        DxoLoadingIndicatorModule,
                        DxiSeriesModule,
                        DxoSeriesTemplateModule,
                        DxoSizeModule,
                        DxoTooltipModule,
                        DxIntegrationModule,
                        DxTemplateModule], exports: [DxPieChartComponent, DxoAdaptiveLayoutModule,
                        DxoAnimationModule,
                        DxiAnnotationModule,
                        DxoBorderModule,
                        DxoFontModule,
                        DxoImageModule,
                        DxoShadowModule,
                        DxoCommonAnnotationSettingsModule,
                        DxoCommonSeriesSettingsModule,
                        DxoColorModule,
                        DxoHoverStyleModule,
                        DxoHatchingModule,
                        DxoLabelModule,
                        DxoArgumentFormatModule,
                        DxoConnectorModule,
                        DxoFormatModule,
                        DxoSelectionStyleModule,
                        DxoSmallValuesGroupingModule,
                        DxoExportModule,
                        DxoLegendModule,
                        DxoMarginModule,
                        DxoTitleModule,
                        DxoSubtitleModule,
                        DxoLoadingIndicatorModule,
                        DxiSeriesModule,
                        DxoSeriesTemplateModule,
                        DxoSizeModule,
                        DxoTooltipModule,
                        DxTemplateModule] });
                /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxPieChartModule, imports: [DxoAdaptiveLayoutModule,
                        DxoAnimationModule,
                        DxiAnnotationModule,
                        DxoBorderModule,
                        DxoFontModule,
                        DxoImageModule,
                        DxoShadowModule,
                        DxoCommonAnnotationSettingsModule,
                        DxoCommonSeriesSettingsModule,
                        DxoColorModule,
                        DxoHoverStyleModule,
                        DxoHatchingModule,
                        DxoLabelModule,
                        DxoArgumentFormatModule,
                        DxoConnectorModule,
                        DxoFormatModule,
                        DxoSelectionStyleModule,
                        DxoSmallValuesGroupingModule,
                        DxoExportModule,
                        DxoLegendModule,
                        DxoMarginModule,
                        DxoTitleModule,
                        DxoSubtitleModule,
                        DxoLoadingIndicatorModule,
                        DxiSeriesModule,
                        DxoSeriesTemplateModule,
                        DxoSizeModule,
                        DxoTooltipModule,
                        DxIntegrationModule,
                        DxTemplateModule, DxoAdaptiveLayoutModule,
                        DxoAnimationModule,
                        DxiAnnotationModule,
                        DxoBorderModule,
                        DxoFontModule,
                        DxoImageModule,
                        DxoShadowModule,
                        DxoCommonAnnotationSettingsModule,
                        DxoCommonSeriesSettingsModule,
                        DxoColorModule,
                        DxoHoverStyleModule,
                        DxoHatchingModule,
                        DxoLabelModule,
                        DxoArgumentFormatModule,
                        DxoConnectorModule,
                        DxoFormatModule,
                        DxoSelectionStyleModule,
                        DxoSmallValuesGroupingModule,
                        DxoExportModule,
                        DxoLegendModule,
                        DxoMarginModule,
                        DxoTitleModule,
                        DxoSubtitleModule,
                        DxoLoadingIndicatorModule,
                        DxiSeriesModule,
                        DxoSeriesTemplateModule,
                        DxoSizeModule,
                        DxoTooltipModule,
                        DxTemplateModule] });
            } exports("DxPieChartModule", DxPieChartModule);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxPieChartModule, decorators: [{
                        type: NgModule,
                        args: [{
                                imports: [
                                    DxoAdaptiveLayoutModule,
                                    DxoAnimationModule,
                                    DxiAnnotationModule,
                                    DxoBorderModule,
                                    DxoFontModule,
                                    DxoImageModule,
                                    DxoShadowModule,
                                    DxoCommonAnnotationSettingsModule,
                                    DxoCommonSeriesSettingsModule,
                                    DxoColorModule,
                                    DxoHoverStyleModule,
                                    DxoHatchingModule,
                                    DxoLabelModule,
                                    DxoArgumentFormatModule,
                                    DxoConnectorModule,
                                    DxoFormatModule,
                                    DxoSelectionStyleModule,
                                    DxoSmallValuesGroupingModule,
                                    DxoExportModule,
                                    DxoLegendModule,
                                    DxoMarginModule,
                                    DxoTitleModule,
                                    DxoSubtitleModule,
                                    DxoLoadingIndicatorModule,
                                    DxiSeriesModule,
                                    DxoSeriesTemplateModule,
                                    DxoSizeModule,
                                    DxoTooltipModule,
                                    DxIntegrationModule,
                                    DxTemplateModule
                                ],
                                declarations: [
                                    DxPieChartComponent
                                ],
                                exports: [
                                    DxPieChartComponent,
                                    DxoAdaptiveLayoutModule,
                                    DxoAnimationModule,
                                    DxiAnnotationModule,
                                    DxoBorderModule,
                                    DxoFontModule,
                                    DxoImageModule,
                                    DxoShadowModule,
                                    DxoCommonAnnotationSettingsModule,
                                    DxoCommonSeriesSettingsModule,
                                    DxoColorModule,
                                    DxoHoverStyleModule,
                                    DxoHatchingModule,
                                    DxoLabelModule,
                                    DxoArgumentFormatModule,
                                    DxoConnectorModule,
                                    DxoFormatModule,
                                    DxoSelectionStyleModule,
                                    DxoSmallValuesGroupingModule,
                                    DxoExportModule,
                                    DxoLegendModule,
                                    DxoMarginModule,
                                    DxoTitleModule,
                                    DxoSubtitleModule,
                                    DxoLoadingIndicatorModule,
                                    DxiSeriesModule,
                                    DxoSeriesTemplateModule,
                                    DxoSizeModule,
                                    DxoTooltipModule,
                                    DxTemplateModule
                                ]
                            }]
                    }] });

        })
    };
}));
