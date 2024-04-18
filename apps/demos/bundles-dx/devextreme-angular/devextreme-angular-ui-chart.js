System.register(['@angular/platform-browser', '@angular/core', 'devextreme/viz/chart', './devextreme-angular-core.js', './devextreme-angular-ui-nested.js', '@angular/common', 'devextreme/core/dom_adapter', 'devextreme/events', 'devextreme/core/utils/common', 'devextreme/core/renderer', 'devextreme/core/http_request', 'devextreme/core/utils/ready_callbacks', 'devextreme/events/core/events_engine', 'devextreme/core/utils/ajax', 'devextreme/core/utils/deferred'], (function (exports) {
    'use strict';
    var i2, i0, PLATFORM_ID, Component, Inject, Input, Output, ContentChildren, NgModule, DxChart, DxComponent, DxTemplateHost, WatcherHelper, IterableDifferHelper, NestedOptionHost, DxIntegrationModule, DxTemplateModule, DxiAnnotationComponent, DxiPaneComponent, DxiSeriesComponent, DxiValueAxisComponent, DxoAdaptiveLayoutModule, DxoAnimationModule, DxiAnnotationModule, DxoBorderModule, DxoFontModule, DxoImageModule, DxoShadowModule, DxoArgumentAxisModule, DxoAggregationIntervalModule, DxiBreakModule, DxoBreakStyleModule, DxiConstantLineModule, DxoLabelModule, DxoConstantLineStyleModule, DxoGridModule, DxoFormatModule, DxoMinorGridModule, DxoMinorTickModule, DxoMinorTickIntervalModule, DxoMinVisualRangeLengthModule, DxiStripModule, DxoStripStyleModule, DxoTickModule, DxoTickIntervalModule, DxoTitleModule, DxoCommonAnnotationSettingsModule, DxoCommonAxisSettingsModule, DxoCommonPaneSettingsModule, DxoBackgroundColorModule, DxoCommonSeriesSettingsModule, DxoAggregationModule, DxoAreaModule, DxoHoverStyleModule, DxoHatchingModule, DxoConnectorModule, DxoPointModule, DxoHeightModule, DxoUrlModule, DxoWidthModule, DxoSelectionStyleModule, DxoReductionModule, DxoValueErrorBarModule, DxoBarModule, DxoBubbleModule, DxoCandlestickModule, DxoColorModule, DxoFullstackedareaModule, DxoFullstackedbarModule, DxoFullstackedlineModule, DxoFullstackedsplineModule, DxoFullstackedsplineareaModule, DxoArgumentFormatModule, DxoLineModule, DxoRangeareaModule, DxoRangebarModule, DxoScatterModule, DxoSplineModule, DxoSplineareaModule, DxoStackedareaModule, DxoStackedbarModule, DxoStackedlineModule, DxoStackedsplineModule, DxoStackedsplineareaModule, DxoStepareaModule, DxoSteplineModule, DxoStockModule, DxoCrosshairModule, DxoHorizontalLineModule, DxoVerticalLineModule, DxoDataPrepareSettingsModule, DxoExportModule, DxoLegendModule, DxoMarginModule, DxoSubtitleModule, DxoLoadingIndicatorModule, DxiPaneModule, DxoScrollBarModule, DxiSeriesModule, DxoSeriesTemplateModule, DxoSizeModule, DxoTooltipModule, DxiValueAxisModule, DxoZoomAndPanModule, DxoDragBoxStyleModule;
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
            DxChart = module.default;
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
            DxiPaneComponent = module.DxiPaneComponent;
            DxiSeriesComponent = module.DxiSeriesComponent;
            DxiValueAxisComponent = module.DxiValueAxisComponent;
            DxoAdaptiveLayoutModule = module.DxoAdaptiveLayoutModule;
            DxoAnimationModule = module.DxoAnimationModule;
            DxiAnnotationModule = module.DxiAnnotationModule;
            DxoBorderModule = module.DxoBorderModule;
            DxoFontModule = module.DxoFontModule;
            DxoImageModule = module.DxoImageModule;
            DxoShadowModule = module.DxoShadowModule;
            DxoArgumentAxisModule = module.DxoArgumentAxisModule;
            DxoAggregationIntervalModule = module.DxoAggregationIntervalModule;
            DxiBreakModule = module.DxiBreakModule;
            DxoBreakStyleModule = module.DxoBreakStyleModule;
            DxiConstantLineModule = module.DxiConstantLineModule;
            DxoLabelModule = module.DxoLabelModule;
            DxoConstantLineStyleModule = module.DxoConstantLineStyleModule;
            DxoGridModule = module.DxoGridModule;
            DxoFormatModule = module.DxoFormatModule;
            DxoMinorGridModule = module.DxoMinorGridModule;
            DxoMinorTickModule = module.DxoMinorTickModule;
            DxoMinorTickIntervalModule = module.DxoMinorTickIntervalModule;
            DxoMinVisualRangeLengthModule = module.DxoMinVisualRangeLengthModule;
            DxiStripModule = module.DxiStripModule;
            DxoStripStyleModule = module.DxoStripStyleModule;
            DxoTickModule = module.DxoTickModule;
            DxoTickIntervalModule = module.DxoTickIntervalModule;
            DxoTitleModule = module.DxoTitleModule;
            DxoCommonAnnotationSettingsModule = module.DxoCommonAnnotationSettingsModule;
            DxoCommonAxisSettingsModule = module.DxoCommonAxisSettingsModule;
            DxoCommonPaneSettingsModule = module.DxoCommonPaneSettingsModule;
            DxoBackgroundColorModule = module.DxoBackgroundColorModule;
            DxoCommonSeriesSettingsModule = module.DxoCommonSeriesSettingsModule;
            DxoAggregationModule = module.DxoAggregationModule;
            DxoAreaModule = module.DxoAreaModule;
            DxoHoverStyleModule = module.DxoHoverStyleModule;
            DxoHatchingModule = module.DxoHatchingModule;
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
            DxoCrosshairModule = module.DxoCrosshairModule;
            DxoHorizontalLineModule = module.DxoHorizontalLineModule;
            DxoVerticalLineModule = module.DxoVerticalLineModule;
            DxoDataPrepareSettingsModule = module.DxoDataPrepareSettingsModule;
            DxoExportModule = module.DxoExportModule;
            DxoLegendModule = module.DxoLegendModule;
            DxoMarginModule = module.DxoMarginModule;
            DxoSubtitleModule = module.DxoSubtitleModule;
            DxoLoadingIndicatorModule = module.DxoLoadingIndicatorModule;
            DxiPaneModule = module.DxiPaneModule;
            DxoScrollBarModule = module.DxoScrollBarModule;
            DxiSeriesModule = module.DxiSeriesModule;
            DxoSeriesTemplateModule = module.DxoSeriesTemplateModule;
            DxoSizeModule = module.DxoSizeModule;
            DxoTooltipModule = module.DxoTooltipModule;
            DxiValueAxisModule = module.DxiValueAxisModule;
            DxoZoomAndPanModule = module.DxoZoomAndPanModule;
            DxoDragBoxStyleModule = module.DxoDragBoxStyleModule;
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
             * The Chart is a UI component that visualizes data from a local or remote storage using a great variety of series types along with different interactive elements, such as tooltips, crosshair pointer, legend, etc.

             */
            class DxChartComponent extends DxComponent {
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
                 * Specifies whether to adjust the value axis&apos;s visualRange when the argument axis is being zoomed or panned.
                
                 */
                get adjustOnZoom() {
                    return this._getOption('adjustOnZoom');
                }
                set adjustOnZoom(value) {
                    this._setOption('adjustOnZoom', value);
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
                 * Configures the argument axis.
                
                 */
                get argumentAxis() {
                    return this._getOption('argumentAxis');
                }
                set argumentAxis(value) {
                    this._setOption('argumentAxis', value);
                }
                /**
                 * Specifies whether to hide series point markers automatically to reduce visual clutter.
                
                 */
                get autoHidePointMarkers() {
                    return this._getOption('autoHidePointMarkers');
                }
                set autoHidePointMarkers(value) {
                    this._setOption('autoHidePointMarkers', value);
                }
                /**
                 * Controls the padding and consequently the width of a group of bars with the same argument using relative units. Ignored if the barGroupWidth property is set.
                
                 */
                get barGroupPadding() {
                    return this._getOption('barGroupPadding');
                }
                set barGroupPadding(value) {
                    this._setOption('barGroupPadding', value);
                }
                /**
                 * Specifies a fixed width for groups of bars with the same argument, measured in pixels. Takes precedence over the barGroupPadding property.
                
                 */
                get barGroupWidth() {
                    return this._getOption('barGroupWidth');
                }
                set barGroupWidth(value) {
                    this._setOption('barGroupWidth', value);
                }
                /**
                 * Specifies settings common for all annotations in the chart.
                
                 */
                get commonAnnotationSettings() {
                    return this._getOption('commonAnnotationSettings');
                }
                set commonAnnotationSettings(value) {
                    this._setOption('commonAnnotationSettings', value);
                }
                /**
                 * Defines common settings for both the argument and value axis in a chart.
                
                 */
                get commonAxisSettings() {
                    return this._getOption('commonAxisSettings');
                }
                set commonAxisSettings(value) {
                    this._setOption('commonAxisSettings', value);
                }
                /**
                 * Defines common settings for all panes in a chart.
                
                 */
                get commonPaneSettings() {
                    return this._getOption('commonPaneSettings');
                }
                set commonPaneSettings(value) {
                    this._setOption('commonPaneSettings', value);
                }
                /**
                 * Specifies settings common for all series in the chart.
                
                 */
                get commonSeriesSettings() {
                    return this._getOption('commonSeriesSettings');
                }
                set commonSeriesSettings(value) {
                    this._setOption('commonSeriesSettings', value);
                }
                /**
                 * Specifies background color of the chart container.
                
                 */
                get containerBackgroundColor() {
                    return this._getOption('containerBackgroundColor');
                }
                set containerBackgroundColor(value) {
                    this._setOption('containerBackgroundColor', value);
                }
                /**
                 * Configures the crosshair feature.
                
                 */
                get crosshair() {
                    return this._getOption('crosshair');
                }
                set crosshair(value) {
                    this._setOption('crosshair', value);
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
                 * Processes data before visualizing it.
                
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
                 * Specifies which pane should be used by default.
                
                 */
                get defaultPane() {
                    return this._getOption('defaultPane');
                }
                set defaultPane(value) {
                    this._setOption('defaultPane', value);
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
                 * Specifies a coefficient determining the diameter of the largest bubble.
                
                 */
                get maxBubbleSize() {
                    return this._getOption('maxBubbleSize');
                }
                set maxBubbleSize(value) {
                    this._setOption('maxBubbleSize', value);
                }
                /**
                 * Specifies the diameter of the smallest bubble measured in pixels.
                
                 */
                get minBubbleSize() {
                    return this._getOption('minBubbleSize');
                }
                set minBubbleSize(value) {
                    this._setOption('minBubbleSize', value);
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
                 * Declares a collection of panes.
                
                 */
                get panes() {
                    return this._getOption('panes');
                }
                set panes(value) {
                    this._setOption('panes', value);
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
                 * Specifies whether panes can be resized if other chart elements require more space after zooming or panning.
                
                 */
                get resizePanesOnZoom() {
                    return this._getOption('resizePanesOnZoom');
                }
                set resizePanesOnZoom(value) {
                    this._setOption('resizePanesOnZoom', value);
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
                 * Swaps the axes around making the value axis horizontal and the argument axis vertical.
                
                 */
                get rotated() {
                    return this._getOption('rotated');
                }
                set rotated(value) {
                    this._setOption('rotated', value);
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
                 * Specifies the settings of the scroll bar.
                
                 */
                get scrollBar() {
                    return this._getOption('scrollBar');
                }
                set scrollBar(value) {
                    this._setOption('scrollBar', value);
                }
                /**
                 * Specifies properties for Chart UI component series.
                
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
                 * Specifies whether a point should remain in the hover state when the mouse pointer moves away.
                
                 */
                get stickyHovering() {
                    return this._getOption('stickyHovering');
                }
                set stickyHovering(value) {
                    this._setOption('stickyHovering', value);
                }
                /**
                 * Indicates whether or not to synchronize value axes when they are displayed on a single pane.
                
                 */
                get synchronizeMultiAxes() {
                    return this._getOption('synchronizeMultiAxes');
                }
                set synchronizeMultiAxes(value) {
                    this._setOption('synchronizeMultiAxes', value);
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
                 * Configures the value axis.
                
                 */
                get valueAxis() {
                    return this._getOption('valueAxis');
                }
                set valueAxis(value) {
                    this._setOption('valueAxis', value);
                }
                /**
                 * Configures zooming and panning.
                
                 */
                get zoomAndPan() {
                    return this._getOption('zoomAndPan');
                }
                set zoomAndPan(value) {
                    this._setOption('zoomAndPan', value);
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
                adjustOnZoomChange;
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
                autoHidePointMarkersChange;
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
                commonPaneSettingsChange;
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
                crosshairChange;
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
                defaultPaneChange;
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
                maxBubbleSizeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                minBubbleSizeChange;
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
                panesChange;
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
                resizePanesOnZoomChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                resolveLabelOverlappingChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                rotatedChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                rtlEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                scrollBarChange;
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
                stickyHoveringChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                synchronizeMultiAxesChange;
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
                valueAxisChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                zoomAndPanChange;
                get annotationsChildren() {
                    return this._getOption('annotations');
                }
                set annotationsChildren(value) {
                    this.setChildren('annotations', value);
                }
                get panesChildren() {
                    return this._getOption('panes');
                }
                set panesChildren(value) {
                    this.setChildren('panes', value);
                }
                get seriesChildren() {
                    return this._getOption('series');
                }
                set seriesChildren(value) {
                    this.setChildren('series', value);
                }
                get valueAxisChildren() {
                    return this._getOption('valueAxis');
                }
                set valueAxisChildren(value) {
                    this.setChildren('valueAxis', value);
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
                        { emit: 'adjustOnZoomChange' },
                        { emit: 'animationChange' },
                        { emit: 'annotationsChange' },
                        { emit: 'argumentAxisChange' },
                        { emit: 'autoHidePointMarkersChange' },
                        { emit: 'barGroupPaddingChange' },
                        { emit: 'barGroupWidthChange' },
                        { emit: 'commonAnnotationSettingsChange' },
                        { emit: 'commonAxisSettingsChange' },
                        { emit: 'commonPaneSettingsChange' },
                        { emit: 'commonSeriesSettingsChange' },
                        { emit: 'containerBackgroundColorChange' },
                        { emit: 'crosshairChange' },
                        { emit: 'customizeAnnotationChange' },
                        { emit: 'customizeLabelChange' },
                        { emit: 'customizePointChange' },
                        { emit: 'dataPrepareSettingsChange' },
                        { emit: 'dataSourceChange' },
                        { emit: 'defaultPaneChange' },
                        { emit: 'disabledChange' },
                        { emit: 'elementAttrChange' },
                        { emit: 'exportChange' },
                        { emit: 'legendChange' },
                        { emit: 'loadingIndicatorChange' },
                        { emit: 'marginChange' },
                        { emit: 'maxBubbleSizeChange' },
                        { emit: 'minBubbleSizeChange' },
                        { emit: 'negativesAsZeroesChange' },
                        { emit: 'paletteChange' },
                        { emit: 'paletteExtensionModeChange' },
                        { emit: 'panesChange' },
                        { emit: 'pathModifiedChange' },
                        { emit: 'pointSelectionModeChange' },
                        { emit: 'redrawOnResizeChange' },
                        { emit: 'resizePanesOnZoomChange' },
                        { emit: 'resolveLabelOverlappingChange' },
                        { emit: 'rotatedChange' },
                        { emit: 'rtlEnabledChange' },
                        { emit: 'scrollBarChange' },
                        { emit: 'seriesChange' },
                        { emit: 'seriesSelectionModeChange' },
                        { emit: 'seriesTemplateChange' },
                        { emit: 'sizeChange' },
                        { emit: 'stickyHoveringChange' },
                        { emit: 'synchronizeMultiAxesChange' },
                        { emit: 'themeChange' },
                        { emit: 'titleChange' },
                        { emit: 'tooltipChange' },
                        { emit: 'valueAxisChange' },
                        { emit: 'zoomAndPanChange' }
                    ]);
                    this._idh.setHost(this);
                    optionHost.setHost(this);
                }
                _createInstance(element, options) {
                    return new DxChart(element, options);
                }
                ngOnDestroy() {
                    this._destroyWidget();
                }
                ngOnChanges(changes) {
                    super.ngOnChanges(changes);
                    this.setupChanges('annotations', changes);
                    this.setupChanges('dataSource', changes);
                    this.setupChanges('palette', changes);
                    this.setupChanges('panes', changes);
                    this.setupChanges('series', changes);
                    this.setupChanges('valueAxis', changes);
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
                    this._idh.doCheck('panes');
                    this._idh.doCheck('series');
                    this._idh.doCheck('valueAxis');
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
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxChartComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: DxTemplateHost }, { token: WatcherHelper }, { token: IterableDifferHelper }, { token: NestedOptionHost }, { token: i2.TransferState }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
                /** @nocollapse */ static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.0", type: DxChartComponent, selector: "dx-chart", inputs: { adaptiveLayout: "adaptiveLayout", adjustOnZoom: "adjustOnZoom", animation: "animation", annotations: "annotations", argumentAxis: "argumentAxis", autoHidePointMarkers: "autoHidePointMarkers", barGroupPadding: "barGroupPadding", barGroupWidth: "barGroupWidth", commonAnnotationSettings: "commonAnnotationSettings", commonAxisSettings: "commonAxisSettings", commonPaneSettings: "commonPaneSettings", commonSeriesSettings: "commonSeriesSettings", containerBackgroundColor: "containerBackgroundColor", crosshair: "crosshair", customizeAnnotation: "customizeAnnotation", customizeLabel: "customizeLabel", customizePoint: "customizePoint", dataPrepareSettings: "dataPrepareSettings", dataSource: "dataSource", defaultPane: "defaultPane", disabled: "disabled", elementAttr: "elementAttr", export: "export", legend: "legend", loadingIndicator: "loadingIndicator", margin: "margin", maxBubbleSize: "maxBubbleSize", minBubbleSize: "minBubbleSize", negativesAsZeroes: "negativesAsZeroes", palette: "palette", paletteExtensionMode: "paletteExtensionMode", panes: "panes", pathModified: "pathModified", pointSelectionMode: "pointSelectionMode", redrawOnResize: "redrawOnResize", resizePanesOnZoom: "resizePanesOnZoom", resolveLabelOverlapping: "resolveLabelOverlapping", rotated: "rotated", rtlEnabled: "rtlEnabled", scrollBar: "scrollBar", series: "series", seriesSelectionMode: "seriesSelectionMode", seriesTemplate: "seriesTemplate", size: "size", stickyHovering: "stickyHovering", synchronizeMultiAxes: "synchronizeMultiAxes", theme: "theme", title: "title", tooltip: "tooltip", valueAxis: "valueAxis", zoomAndPan: "zoomAndPan" }, outputs: { onArgumentAxisClick: "onArgumentAxisClick", onDisposing: "onDisposing", onDone: "onDone", onDrawn: "onDrawn", onExported: "onExported", onExporting: "onExporting", onFileSaving: "onFileSaving", onIncidentOccurred: "onIncidentOccurred", onInitialized: "onInitialized", onLegendClick: "onLegendClick", onOptionChanged: "onOptionChanged", onPointClick: "onPointClick", onPointHoverChanged: "onPointHoverChanged", onPointSelectionChanged: "onPointSelectionChanged", onSeriesClick: "onSeriesClick", onSeriesHoverChanged: "onSeriesHoverChanged", onSeriesSelectionChanged: "onSeriesSelectionChanged", onTooltipHidden: "onTooltipHidden", onTooltipShown: "onTooltipShown", onZoomEnd: "onZoomEnd", onZoomStart: "onZoomStart", adaptiveLayoutChange: "adaptiveLayoutChange", adjustOnZoomChange: "adjustOnZoomChange", animationChange: "animationChange", annotationsChange: "annotationsChange", argumentAxisChange: "argumentAxisChange", autoHidePointMarkersChange: "autoHidePointMarkersChange", barGroupPaddingChange: "barGroupPaddingChange", barGroupWidthChange: "barGroupWidthChange", commonAnnotationSettingsChange: "commonAnnotationSettingsChange", commonAxisSettingsChange: "commonAxisSettingsChange", commonPaneSettingsChange: "commonPaneSettingsChange", commonSeriesSettingsChange: "commonSeriesSettingsChange", containerBackgroundColorChange: "containerBackgroundColorChange", crosshairChange: "crosshairChange", customizeAnnotationChange: "customizeAnnotationChange", customizeLabelChange: "customizeLabelChange", customizePointChange: "customizePointChange", dataPrepareSettingsChange: "dataPrepareSettingsChange", dataSourceChange: "dataSourceChange", defaultPaneChange: "defaultPaneChange", disabledChange: "disabledChange", elementAttrChange: "elementAttrChange", exportChange: "exportChange", legendChange: "legendChange", loadingIndicatorChange: "loadingIndicatorChange", marginChange: "marginChange", maxBubbleSizeChange: "maxBubbleSizeChange", minBubbleSizeChange: "minBubbleSizeChange", negativesAsZeroesChange: "negativesAsZeroesChange", paletteChange: "paletteChange", paletteExtensionModeChange: "paletteExtensionModeChange", panesChange: "panesChange", pathModifiedChange: "pathModifiedChange", pointSelectionModeChange: "pointSelectionModeChange", redrawOnResizeChange: "redrawOnResizeChange", resizePanesOnZoomChange: "resizePanesOnZoomChange", resolveLabelOverlappingChange: "resolveLabelOverlappingChange", rotatedChange: "rotatedChange", rtlEnabledChange: "rtlEnabledChange", scrollBarChange: "scrollBarChange", seriesChange: "seriesChange", seriesSelectionModeChange: "seriesSelectionModeChange", seriesTemplateChange: "seriesTemplateChange", sizeChange: "sizeChange", stickyHoveringChange: "stickyHoveringChange", synchronizeMultiAxesChange: "synchronizeMultiAxesChange", themeChange: "themeChange", titleChange: "titleChange", tooltipChange: "tooltipChange", valueAxisChange: "valueAxisChange", zoomAndPanChange: "zoomAndPanChange" }, providers: [
                        DxTemplateHost,
                        WatcherHelper,
                        NestedOptionHost,
                        IterableDifferHelper
                    ], queries: [{ propertyName: "annotationsChildren", predicate: DxiAnnotationComponent }, { propertyName: "panesChildren", predicate: DxiPaneComponent }, { propertyName: "seriesChildren", predicate: DxiSeriesComponent }, { propertyName: "valueAxisChildren", predicate: DxiValueAxisComponent }], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: '', isInline: true, styles: [":host{display:block}\n"] });
            } exports("DxChartComponent", DxChartComponent);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxChartComponent, decorators: [{
                        type: Component,
                        args: [{ selector: 'dx-chart', template: '', providers: [
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
                        }], adjustOnZoom: [{
                            type: Input
                        }], animation: [{
                            type: Input
                        }], annotations: [{
                            type: Input
                        }], argumentAxis: [{
                            type: Input
                        }], autoHidePointMarkers: [{
                            type: Input
                        }], barGroupPadding: [{
                            type: Input
                        }], barGroupWidth: [{
                            type: Input
                        }], commonAnnotationSettings: [{
                            type: Input
                        }], commonAxisSettings: [{
                            type: Input
                        }], commonPaneSettings: [{
                            type: Input
                        }], commonSeriesSettings: [{
                            type: Input
                        }], containerBackgroundColor: [{
                            type: Input
                        }], crosshair: [{
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
                        }], defaultPane: [{
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
                        }], maxBubbleSize: [{
                            type: Input
                        }], minBubbleSize: [{
                            type: Input
                        }], negativesAsZeroes: [{
                            type: Input
                        }], palette: [{
                            type: Input
                        }], paletteExtensionMode: [{
                            type: Input
                        }], panes: [{
                            type: Input
                        }], pathModified: [{
                            type: Input
                        }], pointSelectionMode: [{
                            type: Input
                        }], redrawOnResize: [{
                            type: Input
                        }], resizePanesOnZoom: [{
                            type: Input
                        }], resolveLabelOverlapping: [{
                            type: Input
                        }], rotated: [{
                            type: Input
                        }], rtlEnabled: [{
                            type: Input
                        }], scrollBar: [{
                            type: Input
                        }], series: [{
                            type: Input
                        }], seriesSelectionMode: [{
                            type: Input
                        }], seriesTemplate: [{
                            type: Input
                        }], size: [{
                            type: Input
                        }], stickyHovering: [{
                            type: Input
                        }], synchronizeMultiAxes: [{
                            type: Input
                        }], theme: [{
                            type: Input
                        }], title: [{
                            type: Input
                        }], tooltip: [{
                            type: Input
                        }], valueAxis: [{
                            type: Input
                        }], zoomAndPan: [{
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
                        }], adjustOnZoomChange: [{
                            type: Output
                        }], animationChange: [{
                            type: Output
                        }], annotationsChange: [{
                            type: Output
                        }], argumentAxisChange: [{
                            type: Output
                        }], autoHidePointMarkersChange: [{
                            type: Output
                        }], barGroupPaddingChange: [{
                            type: Output
                        }], barGroupWidthChange: [{
                            type: Output
                        }], commonAnnotationSettingsChange: [{
                            type: Output
                        }], commonAxisSettingsChange: [{
                            type: Output
                        }], commonPaneSettingsChange: [{
                            type: Output
                        }], commonSeriesSettingsChange: [{
                            type: Output
                        }], containerBackgroundColorChange: [{
                            type: Output
                        }], crosshairChange: [{
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
                        }], defaultPaneChange: [{
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
                        }], maxBubbleSizeChange: [{
                            type: Output
                        }], minBubbleSizeChange: [{
                            type: Output
                        }], negativesAsZeroesChange: [{
                            type: Output
                        }], paletteChange: [{
                            type: Output
                        }], paletteExtensionModeChange: [{
                            type: Output
                        }], panesChange: [{
                            type: Output
                        }], pathModifiedChange: [{
                            type: Output
                        }], pointSelectionModeChange: [{
                            type: Output
                        }], redrawOnResizeChange: [{
                            type: Output
                        }], resizePanesOnZoomChange: [{
                            type: Output
                        }], resolveLabelOverlappingChange: [{
                            type: Output
                        }], rotatedChange: [{
                            type: Output
                        }], rtlEnabledChange: [{
                            type: Output
                        }], scrollBarChange: [{
                            type: Output
                        }], seriesChange: [{
                            type: Output
                        }], seriesSelectionModeChange: [{
                            type: Output
                        }], seriesTemplateChange: [{
                            type: Output
                        }], sizeChange: [{
                            type: Output
                        }], stickyHoveringChange: [{
                            type: Output
                        }], synchronizeMultiAxesChange: [{
                            type: Output
                        }], themeChange: [{
                            type: Output
                        }], titleChange: [{
                            type: Output
                        }], tooltipChange: [{
                            type: Output
                        }], valueAxisChange: [{
                            type: Output
                        }], zoomAndPanChange: [{
                            type: Output
                        }], annotationsChildren: [{
                            type: ContentChildren,
                            args: [DxiAnnotationComponent]
                        }], panesChildren: [{
                            type: ContentChildren,
                            args: [DxiPaneComponent]
                        }], seriesChildren: [{
                            type: ContentChildren,
                            args: [DxiSeriesComponent]
                        }], valueAxisChildren: [{
                            type: ContentChildren,
                            args: [DxiValueAxisComponent]
                        }] } });
            class DxChartModule {
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxChartModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
                /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0, type: DxChartModule, declarations: [DxChartComponent], imports: [DxoAdaptiveLayoutModule,
                        DxoAnimationModule,
                        DxiAnnotationModule,
                        DxoBorderModule,
                        DxoFontModule,
                        DxoImageModule,
                        DxoShadowModule,
                        DxoArgumentAxisModule,
                        DxoAggregationIntervalModule,
                        DxiBreakModule,
                        DxoBreakStyleModule,
                        DxiConstantLineModule,
                        DxoLabelModule,
                        DxoConstantLineStyleModule,
                        DxoGridModule,
                        DxoFormatModule,
                        DxoMinorGridModule,
                        DxoMinorTickModule,
                        DxoMinorTickIntervalModule,
                        DxoMinVisualRangeLengthModule,
                        DxiStripModule,
                        DxoStripStyleModule,
                        DxoTickModule,
                        DxoTickIntervalModule,
                        DxoTitleModule,
                        DxoCommonAnnotationSettingsModule,
                        DxoCommonAxisSettingsModule,
                        DxoCommonPaneSettingsModule,
                        DxoBackgroundColorModule,
                        DxoCommonSeriesSettingsModule,
                        DxoAggregationModule,
                        DxoAreaModule,
                        DxoHoverStyleModule,
                        DxoHatchingModule,
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
                        DxoCrosshairModule,
                        DxoHorizontalLineModule,
                        DxoVerticalLineModule,
                        DxoDataPrepareSettingsModule,
                        DxoExportModule,
                        DxoLegendModule,
                        DxoMarginModule,
                        DxoSubtitleModule,
                        DxoLoadingIndicatorModule,
                        DxiPaneModule,
                        DxoScrollBarModule,
                        DxiSeriesModule,
                        DxoSeriesTemplateModule,
                        DxoSizeModule,
                        DxoTooltipModule,
                        DxiValueAxisModule,
                        DxoZoomAndPanModule,
                        DxoDragBoxStyleModule,
                        DxIntegrationModule,
                        DxTemplateModule], exports: [DxChartComponent, DxoAdaptiveLayoutModule,
                        DxoAnimationModule,
                        DxiAnnotationModule,
                        DxoBorderModule,
                        DxoFontModule,
                        DxoImageModule,
                        DxoShadowModule,
                        DxoArgumentAxisModule,
                        DxoAggregationIntervalModule,
                        DxiBreakModule,
                        DxoBreakStyleModule,
                        DxiConstantLineModule,
                        DxoLabelModule,
                        DxoConstantLineStyleModule,
                        DxoGridModule,
                        DxoFormatModule,
                        DxoMinorGridModule,
                        DxoMinorTickModule,
                        DxoMinorTickIntervalModule,
                        DxoMinVisualRangeLengthModule,
                        DxiStripModule,
                        DxoStripStyleModule,
                        DxoTickModule,
                        DxoTickIntervalModule,
                        DxoTitleModule,
                        DxoCommonAnnotationSettingsModule,
                        DxoCommonAxisSettingsModule,
                        DxoCommonPaneSettingsModule,
                        DxoBackgroundColorModule,
                        DxoCommonSeriesSettingsModule,
                        DxoAggregationModule,
                        DxoAreaModule,
                        DxoHoverStyleModule,
                        DxoHatchingModule,
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
                        DxoCrosshairModule,
                        DxoHorizontalLineModule,
                        DxoVerticalLineModule,
                        DxoDataPrepareSettingsModule,
                        DxoExportModule,
                        DxoLegendModule,
                        DxoMarginModule,
                        DxoSubtitleModule,
                        DxoLoadingIndicatorModule,
                        DxiPaneModule,
                        DxoScrollBarModule,
                        DxiSeriesModule,
                        DxoSeriesTemplateModule,
                        DxoSizeModule,
                        DxoTooltipModule,
                        DxiValueAxisModule,
                        DxoZoomAndPanModule,
                        DxoDragBoxStyleModule,
                        DxTemplateModule] });
                /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxChartModule, imports: [DxoAdaptiveLayoutModule,
                        DxoAnimationModule,
                        DxiAnnotationModule,
                        DxoBorderModule,
                        DxoFontModule,
                        DxoImageModule,
                        DxoShadowModule,
                        DxoArgumentAxisModule,
                        DxoAggregationIntervalModule,
                        DxiBreakModule,
                        DxoBreakStyleModule,
                        DxiConstantLineModule,
                        DxoLabelModule,
                        DxoConstantLineStyleModule,
                        DxoGridModule,
                        DxoFormatModule,
                        DxoMinorGridModule,
                        DxoMinorTickModule,
                        DxoMinorTickIntervalModule,
                        DxoMinVisualRangeLengthModule,
                        DxiStripModule,
                        DxoStripStyleModule,
                        DxoTickModule,
                        DxoTickIntervalModule,
                        DxoTitleModule,
                        DxoCommonAnnotationSettingsModule,
                        DxoCommonAxisSettingsModule,
                        DxoCommonPaneSettingsModule,
                        DxoBackgroundColorModule,
                        DxoCommonSeriesSettingsModule,
                        DxoAggregationModule,
                        DxoAreaModule,
                        DxoHoverStyleModule,
                        DxoHatchingModule,
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
                        DxoCrosshairModule,
                        DxoHorizontalLineModule,
                        DxoVerticalLineModule,
                        DxoDataPrepareSettingsModule,
                        DxoExportModule,
                        DxoLegendModule,
                        DxoMarginModule,
                        DxoSubtitleModule,
                        DxoLoadingIndicatorModule,
                        DxiPaneModule,
                        DxoScrollBarModule,
                        DxiSeriesModule,
                        DxoSeriesTemplateModule,
                        DxoSizeModule,
                        DxoTooltipModule,
                        DxiValueAxisModule,
                        DxoZoomAndPanModule,
                        DxoDragBoxStyleModule,
                        DxIntegrationModule,
                        DxTemplateModule, DxoAdaptiveLayoutModule,
                        DxoAnimationModule,
                        DxiAnnotationModule,
                        DxoBorderModule,
                        DxoFontModule,
                        DxoImageModule,
                        DxoShadowModule,
                        DxoArgumentAxisModule,
                        DxoAggregationIntervalModule,
                        DxiBreakModule,
                        DxoBreakStyleModule,
                        DxiConstantLineModule,
                        DxoLabelModule,
                        DxoConstantLineStyleModule,
                        DxoGridModule,
                        DxoFormatModule,
                        DxoMinorGridModule,
                        DxoMinorTickModule,
                        DxoMinorTickIntervalModule,
                        DxoMinVisualRangeLengthModule,
                        DxiStripModule,
                        DxoStripStyleModule,
                        DxoTickModule,
                        DxoTickIntervalModule,
                        DxoTitleModule,
                        DxoCommonAnnotationSettingsModule,
                        DxoCommonAxisSettingsModule,
                        DxoCommonPaneSettingsModule,
                        DxoBackgroundColorModule,
                        DxoCommonSeriesSettingsModule,
                        DxoAggregationModule,
                        DxoAreaModule,
                        DxoHoverStyleModule,
                        DxoHatchingModule,
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
                        DxoCrosshairModule,
                        DxoHorizontalLineModule,
                        DxoVerticalLineModule,
                        DxoDataPrepareSettingsModule,
                        DxoExportModule,
                        DxoLegendModule,
                        DxoMarginModule,
                        DxoSubtitleModule,
                        DxoLoadingIndicatorModule,
                        DxiPaneModule,
                        DxoScrollBarModule,
                        DxiSeriesModule,
                        DxoSeriesTemplateModule,
                        DxoSizeModule,
                        DxoTooltipModule,
                        DxiValueAxisModule,
                        DxoZoomAndPanModule,
                        DxoDragBoxStyleModule,
                        DxTemplateModule] });
            } exports("DxChartModule", DxChartModule);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxChartModule, decorators: [{
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
                                    DxoAggregationIntervalModule,
                                    DxiBreakModule,
                                    DxoBreakStyleModule,
                                    DxiConstantLineModule,
                                    DxoLabelModule,
                                    DxoConstantLineStyleModule,
                                    DxoGridModule,
                                    DxoFormatModule,
                                    DxoMinorGridModule,
                                    DxoMinorTickModule,
                                    DxoMinorTickIntervalModule,
                                    DxoMinVisualRangeLengthModule,
                                    DxiStripModule,
                                    DxoStripStyleModule,
                                    DxoTickModule,
                                    DxoTickIntervalModule,
                                    DxoTitleModule,
                                    DxoCommonAnnotationSettingsModule,
                                    DxoCommonAxisSettingsModule,
                                    DxoCommonPaneSettingsModule,
                                    DxoBackgroundColorModule,
                                    DxoCommonSeriesSettingsModule,
                                    DxoAggregationModule,
                                    DxoAreaModule,
                                    DxoHoverStyleModule,
                                    DxoHatchingModule,
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
                                    DxoCrosshairModule,
                                    DxoHorizontalLineModule,
                                    DxoVerticalLineModule,
                                    DxoDataPrepareSettingsModule,
                                    DxoExportModule,
                                    DxoLegendModule,
                                    DxoMarginModule,
                                    DxoSubtitleModule,
                                    DxoLoadingIndicatorModule,
                                    DxiPaneModule,
                                    DxoScrollBarModule,
                                    DxiSeriesModule,
                                    DxoSeriesTemplateModule,
                                    DxoSizeModule,
                                    DxoTooltipModule,
                                    DxiValueAxisModule,
                                    DxoZoomAndPanModule,
                                    DxoDragBoxStyleModule,
                                    DxIntegrationModule,
                                    DxTemplateModule
                                ],
                                declarations: [
                                    DxChartComponent
                                ],
                                exports: [
                                    DxChartComponent,
                                    DxoAdaptiveLayoutModule,
                                    DxoAnimationModule,
                                    DxiAnnotationModule,
                                    DxoBorderModule,
                                    DxoFontModule,
                                    DxoImageModule,
                                    DxoShadowModule,
                                    DxoArgumentAxisModule,
                                    DxoAggregationIntervalModule,
                                    DxiBreakModule,
                                    DxoBreakStyleModule,
                                    DxiConstantLineModule,
                                    DxoLabelModule,
                                    DxoConstantLineStyleModule,
                                    DxoGridModule,
                                    DxoFormatModule,
                                    DxoMinorGridModule,
                                    DxoMinorTickModule,
                                    DxoMinorTickIntervalModule,
                                    DxoMinVisualRangeLengthModule,
                                    DxiStripModule,
                                    DxoStripStyleModule,
                                    DxoTickModule,
                                    DxoTickIntervalModule,
                                    DxoTitleModule,
                                    DxoCommonAnnotationSettingsModule,
                                    DxoCommonAxisSettingsModule,
                                    DxoCommonPaneSettingsModule,
                                    DxoBackgroundColorModule,
                                    DxoCommonSeriesSettingsModule,
                                    DxoAggregationModule,
                                    DxoAreaModule,
                                    DxoHoverStyleModule,
                                    DxoHatchingModule,
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
                                    DxoCrosshairModule,
                                    DxoHorizontalLineModule,
                                    DxoVerticalLineModule,
                                    DxoDataPrepareSettingsModule,
                                    DxoExportModule,
                                    DxoLegendModule,
                                    DxoMarginModule,
                                    DxoSubtitleModule,
                                    DxoLoadingIndicatorModule,
                                    DxiPaneModule,
                                    DxoScrollBarModule,
                                    DxiSeriesModule,
                                    DxoSeriesTemplateModule,
                                    DxoSizeModule,
                                    DxoTooltipModule,
                                    DxiValueAxisModule,
                                    DxoZoomAndPanModule,
                                    DxoDragBoxStyleModule,
                                    DxTemplateModule
                                ]
                            }]
                    }] });

        })
    };
}));
