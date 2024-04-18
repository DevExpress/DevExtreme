System.register(['@angular/platform-browser', '@angular/core', 'devextreme/viz/polar_chart', './devextreme-angular-core.js', './devextreme-angular-ui-nested.js', '@angular/common', 'devextreme/core/dom_adapter', 'devextreme/events', 'devextreme/core/utils/common', 'devextreme/core/renderer', 'devextreme/core/http_request', 'devextreme/core/utils/ready_callbacks', 'devextreme/events/core/events_engine', 'devextreme/core/utils/ajax', 'devextreme/core/utils/deferred'], (function (exports) {
    'use strict';
    var i2, i0, PLATFORM_ID, Component, Inject, Input, Output, ContentChildren, NgModule, DxPolarChart, DxComponent, DxTemplateHost, WatcherHelper, IterableDifferHelper, NestedOptionHost, DxIntegrationModule, DxTemplateModule, DxiAnnotationComponent, DxiSeriesComponent, DxoAdaptiveLayoutModule, DxoAnimationModule, DxiAnnotationModule, DxoBorderModule, DxoFontModule, DxoImageModule, DxoShadowModule, DxoArgumentAxisModule, DxiConstantLineModule, DxoLabelModule, DxoConstantLineStyleModule, DxoGridModule, DxoFormatModule, DxoMinorGridModule, DxoMinorTickModule, DxoMinorTickIntervalModule, DxiStripModule, DxoStripStyleModule, DxoTickModule, DxoTickIntervalModule, DxoCommonAnnotationSettingsModule, DxoCommonAxisSettingsModule, DxoCommonSeriesSettingsModule, DxoAreaModule, DxoHoverStyleModule, DxoHatchingModule, DxoConnectorModule, DxoPointModule, DxoSelectionStyleModule, DxoValueErrorBarModule, DxoBarModule, DxoColorModule, DxoArgumentFormatModule, DxoLineModule, DxoScatterModule, DxoStackedbarModule, DxoDataPrepareSettingsModule, DxoExportModule, DxoLegendModule, DxoMarginModule, DxoTitleModule, DxoSubtitleModule, DxoLoadingIndicatorModule, DxiSeriesModule, DxoSeriesTemplateModule, DxoSizeModule, DxoTooltipModule, DxoValueAxisModule, DxoMinVisualRangeLengthModule;
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
            DxPolarChart = module.default;
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
            DxoArgumentAxisModule = module.DxoArgumentAxisModule;
            DxiConstantLineModule = module.DxiConstantLineModule;
            DxoLabelModule = module.DxoLabelModule;
            DxoConstantLineStyleModule = module.DxoConstantLineStyleModule;
            DxoGridModule = module.DxoGridModule;
            DxoFormatModule = module.DxoFormatModule;
            DxoMinorGridModule = module.DxoMinorGridModule;
            DxoMinorTickModule = module.DxoMinorTickModule;
            DxoMinorTickIntervalModule = module.DxoMinorTickIntervalModule;
            DxiStripModule = module.DxiStripModule;
            DxoStripStyleModule = module.DxoStripStyleModule;
            DxoTickModule = module.DxoTickModule;
            DxoTickIntervalModule = module.DxoTickIntervalModule;
            DxoCommonAnnotationSettingsModule = module.DxoCommonAnnotationSettingsModule;
            DxoCommonAxisSettingsModule = module.DxoCommonAxisSettingsModule;
            DxoCommonSeriesSettingsModule = module.DxoCommonSeriesSettingsModule;
            DxoAreaModule = module.DxoAreaModule;
            DxoHoverStyleModule = module.DxoHoverStyleModule;
            DxoHatchingModule = module.DxoHatchingModule;
            DxoConnectorModule = module.DxoConnectorModule;
            DxoPointModule = module.DxoPointModule;
            DxoSelectionStyleModule = module.DxoSelectionStyleModule;
            DxoValueErrorBarModule = module.DxoValueErrorBarModule;
            DxoBarModule = module.DxoBarModule;
            DxoColorModule = module.DxoColorModule;
            DxoArgumentFormatModule = module.DxoArgumentFormatModule;
            DxoLineModule = module.DxoLineModule;
            DxoScatterModule = module.DxoScatterModule;
            DxoStackedbarModule = module.DxoStackedbarModule;
            DxoDataPrepareSettingsModule = module.DxoDataPrepareSettingsModule;
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
            DxoValueAxisModule = module.DxoValueAxisModule;
            DxoMinVisualRangeLengthModule = module.DxoMinVisualRangeLengthModule;
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
             * The PolarChart is a UI component that visualizes data in a polar coordinate system.

             */
            class DxPolarChartComponent extends DxComponent {
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
                 * Specifies argument axis properties for the PolarChart UI component.
                
                 */
                get argumentAxis() {
                    return this._getOption('argumentAxis');
                }
                set argumentAxis(value) {
                    this._setOption('argumentAxis', value);
                }
                /**
                 * Controls the padding and consequently the angular width of a group of bars with the same argument using relative units. Ignored if the barGroupWidth property is set.
                
                 */
                get barGroupPadding() {
                    return this._getOption('barGroupPadding');
                }
                set barGroupPadding(value) {
                    this._setOption('barGroupPadding', value);
                }
                /**
                 * Specifies a fixed angular width for groups of bars with the same argument, measured in degrees. Takes precedence over the barGroupPadding property.
                
                 */
                get barGroupWidth() {
                    return this._getOption('barGroupWidth');
                }
                set barGroupWidth(value) {
                    this._setOption('barGroupWidth', value);
                }
                /**
                 * Specifies settings common for all annotations in the PolarChart.
                
                 */
                get commonAnnotationSettings() {
                    return this._getOption('commonAnnotationSettings');
                }
                set commonAnnotationSettings(value) {
                    this._setOption('commonAnnotationSettings', value);
                }
                /**
                 * An object defining the configuration properties that are common for all axes of the PolarChart UI component.
                
                 */
                get commonAxisSettings() {
                    return this._getOption('commonAxisSettings');
                }
                set commonAxisSettings(value) {
                    this._setOption('commonAxisSettings', value);
                }
                /**
                 * An object defining the configuration properties that are common for all series of the PolarChart UI component.
                
                 */
                get commonSeriesSettings() {
                    return this._getOption('commonSeriesSettings');
                }
                set commonSeriesSettings(value) {
                    this._setOption('commonSeriesSettings', value);
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
                 * An object providing properties for managing data from a data source.
                
                 */
                get dataPrepareSettings() {
                    return this._getOption('dataPrepareSettings');
                }
                set dataPrepareSettings(value) {
                    this._setOption('dataPrepareSettings', value);
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
                 * Specifies the properties of a chart&apos;s legend.
                
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
                 * Forces the UI component to treat negative values as zeroes. Applies to stacked-like series only.
                
                 */
                get negativesAsZeroes() {
                    return this._getOption('negativesAsZeroes');
                }
                set negativesAsZeroes(value) {
                    this._setOption('negativesAsZeroes', value);
                }
                /**
                 * Sets the palette to be used for colorizing series and their elements.
                
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
                 * Specifies how the chart must behave when series point labels overlap.
                
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
                 * Specifies properties for PolarChart UI component series.
                
                 */
                get series() {
                    return this._getOption('series');
                }
                set series(value) {
                    this._setOption('series', value);
                }
                /**
                 * Specifies whether a single series or multiple series can be selected in the chart.
                
                 */
                get seriesSelectionMode() {
                    return this._getOption('seriesSelectionMode');
                }
                set seriesSelectionMode(value) {
                    this._setOption('seriesSelectionMode', value);
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
                 * Indicates whether to display a &apos;spider web&apos;.
                
                 */
                get useSpiderWeb() {
                    return this._getOption('useSpiderWeb');
                }
                set useSpiderWeb(value) {
                    this._setOption('useSpiderWeb', value);
                }
                /**
                 * Specifies value axis properties for the PolarChart UI component.
                
                 */
                get valueAxis() {
                    return this._getOption('valueAxis');
                }
                set valueAxis(value) {
                    this._setOption('valueAxis', value);
                }
                /**
                
                 * A function that is executed when a label on the argument axis is clicked or tapped.
                
                
                 */
                onArgumentAxisClick;
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
                
                 * A function that is executed when a series is clicked or tapped.
                
                
                 */
                onSeriesClick;
                /**
                
                 * A function that is executed after the pointer enters or leaves a series.
                
                
                 */
                onSeriesHoverChanged;
                /**
                
                 * A function that is executed when a series is selected or selection is canceled.
                
                
                 */
                onSeriesSelectionChanged;
                /**
                
                 * A function that is executed when a tooltip becomes hidden.
                
                
                 */
                onTooltipHidden;
                /**
                
                 * A function that is executed when a tooltip appears.
                
                
                 */
                onTooltipShown;
                /**
                
                 * A function that is executed when zooming or panning ends.
                
                
                 */
                onZoomEnd;
                /**
                
                 * A function that is executed when zooming or panning begins.
                
                
                 */
                onZoomStart;
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
                argumentAxisChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                barGroupPaddingChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                barGroupWidthChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                commonAnnotationSettingsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                commonAxisSettingsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                commonSeriesSettingsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                containerBackgroundColorChange;
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
                dataPrepareSettingsChange;
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
                negativesAsZeroesChange;
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
                seriesChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                seriesSelectionModeChange;
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
                useSpiderWebChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                valueAxisChange;
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
                        { subscribe: 'argumentAxisClick', emit: 'onArgumentAxisClick' },
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
                        { subscribe: 'seriesClick', emit: 'onSeriesClick' },
                        { subscribe: 'seriesHoverChanged', emit: 'onSeriesHoverChanged' },
                        { subscribe: 'seriesSelectionChanged', emit: 'onSeriesSelectionChanged' },
                        { subscribe: 'tooltipHidden', emit: 'onTooltipHidden' },
                        { subscribe: 'tooltipShown', emit: 'onTooltipShown' },
                        { subscribe: 'zoomEnd', emit: 'onZoomEnd' },
                        { subscribe: 'zoomStart', emit: 'onZoomStart' },
                        { emit: 'adaptiveLayoutChange' },
                        { emit: 'animationChange' },
                        { emit: 'annotationsChange' },
                        { emit: 'argumentAxisChange' },
                        { emit: 'barGroupPaddingChange' },
                        { emit: 'barGroupWidthChange' },
                        { emit: 'commonAnnotationSettingsChange' },
                        { emit: 'commonAxisSettingsChange' },
                        { emit: 'commonSeriesSettingsChange' },
                        { emit: 'containerBackgroundColorChange' },
                        { emit: 'customizeAnnotationChange' },
                        { emit: 'customizeLabelChange' },
                        { emit: 'customizePointChange' },
                        { emit: 'dataPrepareSettingsChange' },
                        { emit: 'dataSourceChange' },
                        { emit: 'disabledChange' },
                        { emit: 'elementAttrChange' },
                        { emit: 'exportChange' },
                        { emit: 'legendChange' },
                        { emit: 'loadingIndicatorChange' },
                        { emit: 'marginChange' },
                        { emit: 'negativesAsZeroesChange' },
                        { emit: 'paletteChange' },
                        { emit: 'paletteExtensionModeChange' },
                        { emit: 'pathModifiedChange' },
                        { emit: 'pointSelectionModeChange' },
                        { emit: 'redrawOnResizeChange' },
                        { emit: 'resolveLabelOverlappingChange' },
                        { emit: 'rtlEnabledChange' },
                        { emit: 'seriesChange' },
                        { emit: 'seriesSelectionModeChange' },
                        { emit: 'seriesTemplateChange' },
                        { emit: 'sizeChange' },
                        { emit: 'themeChange' },
                        { emit: 'titleChange' },
                        { emit: 'tooltipChange' },
                        { emit: 'useSpiderWebChange' },
                        { emit: 'valueAxisChange' }
                    ]);
                    this._idh.setHost(this);
                    optionHost.setHost(this);
                }
                _createInstance(element, options) {
                    return new DxPolarChart(element, options);
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
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxPolarChartComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: DxTemplateHost }, { token: WatcherHelper }, { token: IterableDifferHelper }, { token: NestedOptionHost }, { token: i2.TransferState }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
                /** @nocollapse */ static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.0", type: DxPolarChartComponent, selector: "dx-polar-chart", inputs: { adaptiveLayout: "adaptiveLayout", animation: "animation", annotations: "annotations", argumentAxis: "argumentAxis", barGroupPadding: "barGroupPadding", barGroupWidth: "barGroupWidth", commonAnnotationSettings: "commonAnnotationSettings", commonAxisSettings: "commonAxisSettings", commonSeriesSettings: "commonSeriesSettings", containerBackgroundColor: "containerBackgroundColor", customizeAnnotation: "customizeAnnotation", customizeLabel: "customizeLabel", customizePoint: "customizePoint", dataPrepareSettings: "dataPrepareSettings", dataSource: "dataSource", disabled: "disabled", elementAttr: "elementAttr", export: "export", legend: "legend", loadingIndicator: "loadingIndicator", margin: "margin", negativesAsZeroes: "negativesAsZeroes", palette: "palette", paletteExtensionMode: "paletteExtensionMode", pathModified: "pathModified", pointSelectionMode: "pointSelectionMode", redrawOnResize: "redrawOnResize", resolveLabelOverlapping: "resolveLabelOverlapping", rtlEnabled: "rtlEnabled", series: "series", seriesSelectionMode: "seriesSelectionMode", seriesTemplate: "seriesTemplate", size: "size", theme: "theme", title: "title", tooltip: "tooltip", useSpiderWeb: "useSpiderWeb", valueAxis: "valueAxis" }, outputs: { onArgumentAxisClick: "onArgumentAxisClick", onDisposing: "onDisposing", onDone: "onDone", onDrawn: "onDrawn", onExported: "onExported", onExporting: "onExporting", onFileSaving: "onFileSaving", onIncidentOccurred: "onIncidentOccurred", onInitialized: "onInitialized", onLegendClick: "onLegendClick", onOptionChanged: "onOptionChanged", onPointClick: "onPointClick", onPointHoverChanged: "onPointHoverChanged", onPointSelectionChanged: "onPointSelectionChanged", onSeriesClick: "onSeriesClick", onSeriesHoverChanged: "onSeriesHoverChanged", onSeriesSelectionChanged: "onSeriesSelectionChanged", onTooltipHidden: "onTooltipHidden", onTooltipShown: "onTooltipShown", onZoomEnd: "onZoomEnd", onZoomStart: "onZoomStart", adaptiveLayoutChange: "adaptiveLayoutChange", animationChange: "animationChange", annotationsChange: "annotationsChange", argumentAxisChange: "argumentAxisChange", barGroupPaddingChange: "barGroupPaddingChange", barGroupWidthChange: "barGroupWidthChange", commonAnnotationSettingsChange: "commonAnnotationSettingsChange", commonAxisSettingsChange: "commonAxisSettingsChange", commonSeriesSettingsChange: "commonSeriesSettingsChange", containerBackgroundColorChange: "containerBackgroundColorChange", customizeAnnotationChange: "customizeAnnotationChange", customizeLabelChange: "customizeLabelChange", customizePointChange: "customizePointChange", dataPrepareSettingsChange: "dataPrepareSettingsChange", dataSourceChange: "dataSourceChange", disabledChange: "disabledChange", elementAttrChange: "elementAttrChange", exportChange: "exportChange", legendChange: "legendChange", loadingIndicatorChange: "loadingIndicatorChange", marginChange: "marginChange", negativesAsZeroesChange: "negativesAsZeroesChange", paletteChange: "paletteChange", paletteExtensionModeChange: "paletteExtensionModeChange", pathModifiedChange: "pathModifiedChange", pointSelectionModeChange: "pointSelectionModeChange", redrawOnResizeChange: "redrawOnResizeChange", resolveLabelOverlappingChange: "resolveLabelOverlappingChange", rtlEnabledChange: "rtlEnabledChange", seriesChange: "seriesChange", seriesSelectionModeChange: "seriesSelectionModeChange", seriesTemplateChange: "seriesTemplateChange", sizeChange: "sizeChange", themeChange: "themeChange", titleChange: "titleChange", tooltipChange: "tooltipChange", useSpiderWebChange: "useSpiderWebChange", valueAxisChange: "valueAxisChange" }, providers: [
                        DxTemplateHost,
                        WatcherHelper,
                        NestedOptionHost,
                        IterableDifferHelper
                    ], queries: [{ propertyName: "annotationsChildren", predicate: DxiAnnotationComponent }, { propertyName: "seriesChildren", predicate: DxiSeriesComponent }], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: '', isInline: true, styles: [":host{display:block}\n"] });
            } exports("DxPolarChartComponent", DxPolarChartComponent);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxPolarChartComponent, decorators: [{
                        type: Component,
                        args: [{ selector: 'dx-polar-chart', template: '', providers: [
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
                        }], argumentAxis: [{
                            type: Input
                        }], barGroupPadding: [{
                            type: Input
                        }], barGroupWidth: [{
                            type: Input
                        }], commonAnnotationSettings: [{
                            type: Input
                        }], commonAxisSettings: [{
                            type: Input
                        }], commonSeriesSettings: [{
                            type: Input
                        }], containerBackgroundColor: [{
                            type: Input
                        }], customizeAnnotation: [{
                            type: Input
                        }], customizeLabel: [{
                            type: Input
                        }], customizePoint: [{
                            type: Input
                        }], dataPrepareSettings: [{
                            type: Input
                        }], dataSource: [{
                            type: Input
                        }], disabled: [{
                            type: Input
                        }], elementAttr: [{
                            type: Input
                        }], export: [{
                            type: Input
                        }], legend: [{
                            type: Input
                        }], loadingIndicator: [{
                            type: Input
                        }], margin: [{
                            type: Input
                        }], negativesAsZeroes: [{
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
                        }], series: [{
                            type: Input
                        }], seriesSelectionMode: [{
                            type: Input
                        }], seriesTemplate: [{
                            type: Input
                        }], size: [{
                            type: Input
                        }], theme: [{
                            type: Input
                        }], title: [{
                            type: Input
                        }], tooltip: [{
                            type: Input
                        }], useSpiderWeb: [{
                            type: Input
                        }], valueAxis: [{
                            type: Input
                        }], onArgumentAxisClick: [{
                            type: Output
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
                        }], onSeriesClick: [{
                            type: Output
                        }], onSeriesHoverChanged: [{
                            type: Output
                        }], onSeriesSelectionChanged: [{
                            type: Output
                        }], onTooltipHidden: [{
                            type: Output
                        }], onTooltipShown: [{
                            type: Output
                        }], onZoomEnd: [{
                            type: Output
                        }], onZoomStart: [{
                            type: Output
                        }], adaptiveLayoutChange: [{
                            type: Output
                        }], animationChange: [{
                            type: Output
                        }], annotationsChange: [{
                            type: Output
                        }], argumentAxisChange: [{
                            type: Output
                        }], barGroupPaddingChange: [{
                            type: Output
                        }], barGroupWidthChange: [{
                            type: Output
                        }], commonAnnotationSettingsChange: [{
                            type: Output
                        }], commonAxisSettingsChange: [{
                            type: Output
                        }], commonSeriesSettingsChange: [{
                            type: Output
                        }], containerBackgroundColorChange: [{
                            type: Output
                        }], customizeAnnotationChange: [{
                            type: Output
                        }], customizeLabelChange: [{
                            type: Output
                        }], customizePointChange: [{
                            type: Output
                        }], dataPrepareSettingsChange: [{
                            type: Output
                        }], dataSourceChange: [{
                            type: Output
                        }], disabledChange: [{
                            type: Output
                        }], elementAttrChange: [{
                            type: Output
                        }], exportChange: [{
                            type: Output
                        }], legendChange: [{
                            type: Output
                        }], loadingIndicatorChange: [{
                            type: Output
                        }], marginChange: [{
                            type: Output
                        }], negativesAsZeroesChange: [{
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
                        }], seriesChange: [{
                            type: Output
                        }], seriesSelectionModeChange: [{
                            type: Output
                        }], seriesTemplateChange: [{
                            type: Output
                        }], sizeChange: [{
                            type: Output
                        }], themeChange: [{
                            type: Output
                        }], titleChange: [{
                            type: Output
                        }], tooltipChange: [{
                            type: Output
                        }], useSpiderWebChange: [{
                            type: Output
                        }], valueAxisChange: [{
                            type: Output
                        }], annotationsChildren: [{
                            type: ContentChildren,
                            args: [DxiAnnotationComponent]
                        }], seriesChildren: [{
                            type: ContentChildren,
                            args: [DxiSeriesComponent]
                        }] } });
            class DxPolarChartModule {
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxPolarChartModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
                /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0, type: DxPolarChartModule, declarations: [DxPolarChartComponent], imports: [DxoAdaptiveLayoutModule,
                        DxoAnimationModule,
                        DxiAnnotationModule,
                        DxoBorderModule,
                        DxoFontModule,
                        DxoImageModule,
                        DxoShadowModule,
                        DxoArgumentAxisModule,
                        DxiConstantLineModule,
                        DxoLabelModule,
                        DxoConstantLineStyleModule,
                        DxoGridModule,
                        DxoFormatModule,
                        DxoMinorGridModule,
                        DxoMinorTickModule,
                        DxoMinorTickIntervalModule,
                        DxiStripModule,
                        DxoStripStyleModule,
                        DxoTickModule,
                        DxoTickIntervalModule,
                        DxoCommonAnnotationSettingsModule,
                        DxoCommonAxisSettingsModule,
                        DxoCommonSeriesSettingsModule,
                        DxoAreaModule,
                        DxoHoverStyleModule,
                        DxoHatchingModule,
                        DxoConnectorModule,
                        DxoPointModule,
                        DxoSelectionStyleModule,
                        DxoValueErrorBarModule,
                        DxoBarModule,
                        DxoColorModule,
                        DxoArgumentFormatModule,
                        DxoLineModule,
                        DxoScatterModule,
                        DxoStackedbarModule,
                        DxoDataPrepareSettingsModule,
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
                        DxoValueAxisModule,
                        DxoMinVisualRangeLengthModule,
                        DxIntegrationModule,
                        DxTemplateModule], exports: [DxPolarChartComponent, DxoAdaptiveLayoutModule,
                        DxoAnimationModule,
                        DxiAnnotationModule,
                        DxoBorderModule,
                        DxoFontModule,
                        DxoImageModule,
                        DxoShadowModule,
                        DxoArgumentAxisModule,
                        DxiConstantLineModule,
                        DxoLabelModule,
                        DxoConstantLineStyleModule,
                        DxoGridModule,
                        DxoFormatModule,
                        DxoMinorGridModule,
                        DxoMinorTickModule,
                        DxoMinorTickIntervalModule,
                        DxiStripModule,
                        DxoStripStyleModule,
                        DxoTickModule,
                        DxoTickIntervalModule,
                        DxoCommonAnnotationSettingsModule,
                        DxoCommonAxisSettingsModule,
                        DxoCommonSeriesSettingsModule,
                        DxoAreaModule,
                        DxoHoverStyleModule,
                        DxoHatchingModule,
                        DxoConnectorModule,
                        DxoPointModule,
                        DxoSelectionStyleModule,
                        DxoValueErrorBarModule,
                        DxoBarModule,
                        DxoColorModule,
                        DxoArgumentFormatModule,
                        DxoLineModule,
                        DxoScatterModule,
                        DxoStackedbarModule,
                        DxoDataPrepareSettingsModule,
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
                        DxoValueAxisModule,
                        DxoMinVisualRangeLengthModule,
                        DxTemplateModule] });
                /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxPolarChartModule, imports: [DxoAdaptiveLayoutModule,
                        DxoAnimationModule,
                        DxiAnnotationModule,
                        DxoBorderModule,
                        DxoFontModule,
                        DxoImageModule,
                        DxoShadowModule,
                        DxoArgumentAxisModule,
                        DxiConstantLineModule,
                        DxoLabelModule,
                        DxoConstantLineStyleModule,
                        DxoGridModule,
                        DxoFormatModule,
                        DxoMinorGridModule,
                        DxoMinorTickModule,
                        DxoMinorTickIntervalModule,
                        DxiStripModule,
                        DxoStripStyleModule,
                        DxoTickModule,
                        DxoTickIntervalModule,
                        DxoCommonAnnotationSettingsModule,
                        DxoCommonAxisSettingsModule,
                        DxoCommonSeriesSettingsModule,
                        DxoAreaModule,
                        DxoHoverStyleModule,
                        DxoHatchingModule,
                        DxoConnectorModule,
                        DxoPointModule,
                        DxoSelectionStyleModule,
                        DxoValueErrorBarModule,
                        DxoBarModule,
                        DxoColorModule,
                        DxoArgumentFormatModule,
                        DxoLineModule,
                        DxoScatterModule,
                        DxoStackedbarModule,
                        DxoDataPrepareSettingsModule,
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
                        DxoValueAxisModule,
                        DxoMinVisualRangeLengthModule,
                        DxIntegrationModule,
                        DxTemplateModule, DxoAdaptiveLayoutModule,
                        DxoAnimationModule,
                        DxiAnnotationModule,
                        DxoBorderModule,
                        DxoFontModule,
                        DxoImageModule,
                        DxoShadowModule,
                        DxoArgumentAxisModule,
                        DxiConstantLineModule,
                        DxoLabelModule,
                        DxoConstantLineStyleModule,
                        DxoGridModule,
                        DxoFormatModule,
                        DxoMinorGridModule,
                        DxoMinorTickModule,
                        DxoMinorTickIntervalModule,
                        DxiStripModule,
                        DxoStripStyleModule,
                        DxoTickModule,
                        DxoTickIntervalModule,
                        DxoCommonAnnotationSettingsModule,
                        DxoCommonAxisSettingsModule,
                        DxoCommonSeriesSettingsModule,
                        DxoAreaModule,
                        DxoHoverStyleModule,
                        DxoHatchingModule,
                        DxoConnectorModule,
                        DxoPointModule,
                        DxoSelectionStyleModule,
                        DxoValueErrorBarModule,
                        DxoBarModule,
                        DxoColorModule,
                        DxoArgumentFormatModule,
                        DxoLineModule,
                        DxoScatterModule,
                        DxoStackedbarModule,
                        DxoDataPrepareSettingsModule,
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
                        DxoValueAxisModule,
                        DxoMinVisualRangeLengthModule,
                        DxTemplateModule] });
            } exports("DxPolarChartModule", DxPolarChartModule);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxPolarChartModule, decorators: [{
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
                                    DxoArgumentAxisModule,
                                    DxiConstantLineModule,
                                    DxoLabelModule,
                                    DxoConstantLineStyleModule,
                                    DxoGridModule,
                                    DxoFormatModule,
                                    DxoMinorGridModule,
                                    DxoMinorTickModule,
                                    DxoMinorTickIntervalModule,
                                    DxiStripModule,
                                    DxoStripStyleModule,
                                    DxoTickModule,
                                    DxoTickIntervalModule,
                                    DxoCommonAnnotationSettingsModule,
                                    DxoCommonAxisSettingsModule,
                                    DxoCommonSeriesSettingsModule,
                                    DxoAreaModule,
                                    DxoHoverStyleModule,
                                    DxoHatchingModule,
                                    DxoConnectorModule,
                                    DxoPointModule,
                                    DxoSelectionStyleModule,
                                    DxoValueErrorBarModule,
                                    DxoBarModule,
                                    DxoColorModule,
                                    DxoArgumentFormatModule,
                                    DxoLineModule,
                                    DxoScatterModule,
                                    DxoStackedbarModule,
                                    DxoDataPrepareSettingsModule,
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
                                    DxoValueAxisModule,
                                    DxoMinVisualRangeLengthModule,
                                    DxIntegrationModule,
                                    DxTemplateModule
                                ],
                                declarations: [
                                    DxPolarChartComponent
                                ],
                                exports: [
                                    DxPolarChartComponent,
                                    DxoAdaptiveLayoutModule,
                                    DxoAnimationModule,
                                    DxiAnnotationModule,
                                    DxoBorderModule,
                                    DxoFontModule,
                                    DxoImageModule,
                                    DxoShadowModule,
                                    DxoArgumentAxisModule,
                                    DxiConstantLineModule,
                                    DxoLabelModule,
                                    DxoConstantLineStyleModule,
                                    DxoGridModule,
                                    DxoFormatModule,
                                    DxoMinorGridModule,
                                    DxoMinorTickModule,
                                    DxoMinorTickIntervalModule,
                                    DxiStripModule,
                                    DxoStripStyleModule,
                                    DxoTickModule,
                                    DxoTickIntervalModule,
                                    DxoCommonAnnotationSettingsModule,
                                    DxoCommonAxisSettingsModule,
                                    DxoCommonSeriesSettingsModule,
                                    DxoAreaModule,
                                    DxoHoverStyleModule,
                                    DxoHatchingModule,
                                    DxoConnectorModule,
                                    DxoPointModule,
                                    DxoSelectionStyleModule,
                                    DxoValueErrorBarModule,
                                    DxoBarModule,
                                    DxoColorModule,
                                    DxoArgumentFormatModule,
                                    DxoLineModule,
                                    DxoScatterModule,
                                    DxoStackedbarModule,
                                    DxoDataPrepareSettingsModule,
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
                                    DxoValueAxisModule,
                                    DxoMinVisualRangeLengthModule,
                                    DxTemplateModule
                                ]
                            }]
                    }] });

        })
    };
}));
