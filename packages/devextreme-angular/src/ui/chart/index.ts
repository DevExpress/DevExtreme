/* tslint:disable:max-line-length */


import {
    TransferState,
    Component,
    NgModule,
    ElementRef,
    NgZone,
    PLATFORM_ID,
    Inject,

    Input,
    Output,
    OnDestroy,
    EventEmitter,
    OnChanges,
    DoCheck,
    SimpleChanges,
    ContentChildren,
    QueryList
} from '@angular/core';


import DataSource from 'devextreme/data/data_source';
import * as CommonChartTypes from 'devextreme/common/charts';
import { AnimationEaseMode, TimeInterval, ChartsDataType, ScaleBreak, ScaleBreakLineStyle, DashStyle, Font, RelativePosition, DiscreteAxisDivisionMode, ArgumentAxisHoverMode, ChartsAxisLabelOverlap, TextOverflow, WordWrap, AxisScaleType, VisualRangeUpdateMode, ChartsColor, SeriesHoverMode, HatchDirection, PointInteractionMode, PointSymbol, SeriesSelectionMode, SeriesType, ValueErrorBarDisplayMode, ValueErrorBarType, SeriesLabel, SeriesPoint, LegendItem, LegendHoverMode, Palette, PaletteExtensionMode, ChartsLabelOverlap, Theme } from 'devextreme/common/charts';
import { dxChartAnnotationConfig, AggregatedPointsPosition, ChartLabelDisplayMode, dxChartCommonAnnotationConfig, chartPointAggregationInfoObject, chartSeriesObject, ChartSeriesAggregationMethod, FinancialChartReductionLevel, chartPointObject, ArgumentAxisClickEvent, DisposingEvent, DoneEvent, DrawnEvent, ExportedEvent, ExportingEvent, FileSavingEvent, IncidentOccurredEvent, InitializedEvent, LegendClickEvent, OptionChangedEvent, PointClickEvent, PointHoverChangedEvent, PointSelectionChangedEvent, SeriesClickEvent, SeriesHoverChangedEvent, SeriesSelectionChangedEvent, TooltipHiddenEvent, TooltipShownEvent, ZoomEndEvent, ZoomStartEvent, ChartTooltipLocation, ChartZoomAndPanMode, EventKeyModifier } from 'devextreme/viz/chart';
import { HorizontalAlignment, VerticalAlignment, Position, ExportFormat, Orientation, VerticalEdge, SingleOrMultiple } from 'devextreme/common';
import { Format } from 'devextreme/common/core/localization';
import { DataSourceOptions } from 'devextreme/data/data_source';
import { Store } from 'devextreme/data/store';
import { ChartSeries } from 'devextreme/viz/common';

import DxChart from 'devextreme/viz/chart';


import {
    DxComponent,
    DxTemplateHost,
    DxIntegrationModule,
    DxTemplateModule,
    NestedOptionHost,
    IterableDifferHelper,
    WatcherHelper
} from 'devextreme-angular/core';

import { DxoAdaptiveLayoutModule } from 'devextreme-angular/ui/nested';
import { DxoAnimationModule } from 'devextreme-angular/ui/nested';
import { DxiAnnotationModule } from 'devextreme-angular/ui/nested';
import { DxoBorderModule } from 'devextreme-angular/ui/nested';
import { DxoFontModule } from 'devextreme-angular/ui/nested';
import { DxoImageModule } from 'devextreme-angular/ui/nested';
import { DxoShadowModule } from 'devextreme-angular/ui/nested';
import { DxoArgumentAxisModule } from 'devextreme-angular/ui/nested';
import { DxoAggregationIntervalModule } from 'devextreme-angular/ui/nested';
import { DxiBreakModule } from 'devextreme-angular/ui/nested';
import { DxoBreakStyleModule } from 'devextreme-angular/ui/nested';
import { DxiConstantLineModule } from 'devextreme-angular/ui/nested';
import { DxoLabelModule } from 'devextreme-angular/ui/nested';
import { DxoConstantLineStyleModule } from 'devextreme-angular/ui/nested';
import { DxoGridModule } from 'devextreme-angular/ui/nested';
import { DxoFormatModule } from 'devextreme-angular/ui/nested';
import { DxoMinorGridModule } from 'devextreme-angular/ui/nested';
import { DxoMinorTickModule } from 'devextreme-angular/ui/nested';
import { DxoMinorTickIntervalModule } from 'devextreme-angular/ui/nested';
import { DxoMinVisualRangeLengthModule } from 'devextreme-angular/ui/nested';
import { DxiStripModule } from 'devextreme-angular/ui/nested';
import { DxoStripStyleModule } from 'devextreme-angular/ui/nested';
import { DxoTickModule } from 'devextreme-angular/ui/nested';
import { DxoTickIntervalModule } from 'devextreme-angular/ui/nested';
import { DxoTitleModule } from 'devextreme-angular/ui/nested';
import { DxoCommonAnnotationSettingsModule } from 'devextreme-angular/ui/nested';
import { DxoCommonAxisSettingsModule } from 'devextreme-angular/ui/nested';
import { DxoCommonPaneSettingsModule } from 'devextreme-angular/ui/nested';
import { DxoBackgroundColorModule } from 'devextreme-angular/ui/nested';
import { DxoCommonSeriesSettingsModule } from 'devextreme-angular/ui/nested';
import { DxoAggregationModule } from 'devextreme-angular/ui/nested';
import { DxoAreaModule } from 'devextreme-angular/ui/nested';
import { DxoHoverStyleModule } from 'devextreme-angular/ui/nested';
import { DxoHatchingModule } from 'devextreme-angular/ui/nested';
import { DxoConnectorModule } from 'devextreme-angular/ui/nested';
import { DxoPointModule } from 'devextreme-angular/ui/nested';
import { DxoHeightModule } from 'devextreme-angular/ui/nested';
import { DxoUrlModule } from 'devextreme-angular/ui/nested';
import { DxoWidthModule } from 'devextreme-angular/ui/nested';
import { DxoSelectionStyleModule } from 'devextreme-angular/ui/nested';
import { DxoReductionModule } from 'devextreme-angular/ui/nested';
import { DxoValueErrorBarModule } from 'devextreme-angular/ui/nested';
import { DxoBarModule } from 'devextreme-angular/ui/nested';
import { DxoBubbleModule } from 'devextreme-angular/ui/nested';
import { DxoCandlestickModule } from 'devextreme-angular/ui/nested';
import { DxoColorModule } from 'devextreme-angular/ui/nested';
import { DxoFullstackedareaModule } from 'devextreme-angular/ui/nested';
import { DxoFullstackedbarModule } from 'devextreme-angular/ui/nested';
import { DxoFullstackedlineModule } from 'devextreme-angular/ui/nested';
import { DxoFullstackedsplineModule } from 'devextreme-angular/ui/nested';
import { DxoFullstackedsplineareaModule } from 'devextreme-angular/ui/nested';
import { DxoArgumentFormatModule } from 'devextreme-angular/ui/nested';
import { DxoLineModule } from 'devextreme-angular/ui/nested';
import { DxoRangeareaModule } from 'devextreme-angular/ui/nested';
import { DxoRangebarModule } from 'devextreme-angular/ui/nested';
import { DxoScatterModule } from 'devextreme-angular/ui/nested';
import { DxoSplineModule } from 'devextreme-angular/ui/nested';
import { DxoSplineareaModule } from 'devextreme-angular/ui/nested';
import { DxoStackedareaModule } from 'devextreme-angular/ui/nested';
import { DxoStackedbarModule } from 'devextreme-angular/ui/nested';
import { DxoStackedlineModule } from 'devextreme-angular/ui/nested';
import { DxoStackedsplineModule } from 'devextreme-angular/ui/nested';
import { DxoStackedsplineareaModule } from 'devextreme-angular/ui/nested';
import { DxoStepareaModule } from 'devextreme-angular/ui/nested';
import { DxoSteplineModule } from 'devextreme-angular/ui/nested';
import { DxoStockModule } from 'devextreme-angular/ui/nested';
import { DxoCrosshairModule } from 'devextreme-angular/ui/nested';
import { DxoHorizontalLineModule } from 'devextreme-angular/ui/nested';
import { DxoVerticalLineModule } from 'devextreme-angular/ui/nested';
import { DxoDataPrepareSettingsModule } from 'devextreme-angular/ui/nested';
import { DxoExportModule } from 'devextreme-angular/ui/nested';
import { DxoLegendModule } from 'devextreme-angular/ui/nested';
import { DxoMarginModule } from 'devextreme-angular/ui/nested';
import { DxoSubtitleModule } from 'devextreme-angular/ui/nested';
import { DxoLoadingIndicatorModule } from 'devextreme-angular/ui/nested';
import { DxiPaneModule } from 'devextreme-angular/ui/nested';
import { DxoScrollBarModule } from 'devextreme-angular/ui/nested';
import { DxiSeriesModule } from 'devextreme-angular/ui/nested';
import { DxoSeriesTemplateModule } from 'devextreme-angular/ui/nested';
import { DxoSizeModule } from 'devextreme-angular/ui/nested';
import { DxoTooltipModule } from 'devextreme-angular/ui/nested';
import { DxiValueAxisModule } from 'devextreme-angular/ui/nested';
import { DxoZoomAndPanModule } from 'devextreme-angular/ui/nested';
import { DxoDragBoxStyleModule } from 'devextreme-angular/ui/nested';

import { DxoChartAdaptiveLayoutModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartAggregationModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartAggregationIntervalModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartAnimationModule } from 'devextreme-angular/ui/chart/nested';
import { DxiChartAnnotationModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartAnnotationBorderModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartAnnotationImageModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartArgumentAxisModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartArgumentFormatModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartAxisConstantLineStyleModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartAxisConstantLineStyleLabelModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartAxisLabelModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartAxisTitleModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartBackgroundColorModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartBorderModule } from 'devextreme-angular/ui/chart/nested';
import { DxiChartBreakModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartBreakStyleModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartChartTitleModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartChartTitleSubtitleModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartColorModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartCommonAnnotationSettingsModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartCommonAxisSettingsModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartCommonAxisSettingsConstantLineStyleModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartCommonAxisSettingsConstantLineStyleLabelModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartCommonAxisSettingsLabelModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartCommonAxisSettingsTitleModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartCommonPaneSettingsModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartCommonSeriesSettingsModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartCommonSeriesSettingsHoverStyleModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartCommonSeriesSettingsLabelModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartCommonSeriesSettingsSelectionStyleModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartConnectorModule } from 'devextreme-angular/ui/chart/nested';
import { DxiChartConstantLineModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartConstantLineLabelModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartConstantLineStyleModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartCrosshairModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartDataPrepareSettingsModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartDragBoxStyleModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartExportModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartFontModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartFormatModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartGridModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartHatchingModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartHeightModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartHorizontalLineModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartHorizontalLineLabelModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartHoverStyleModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartImageModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartLabelModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartLegendModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartLegendTitleModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartLegendTitleSubtitleModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartLengthModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartLoadingIndicatorModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartMarginModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartMinorGridModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartMinorTickModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartMinorTickIntervalModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartMinVisualRangeLengthModule } from 'devextreme-angular/ui/chart/nested';
import { DxiChartPaneModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartPaneBorderModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartPointModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartPointBorderModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartPointHoverStyleModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartPointImageModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartPointSelectionStyleModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartReductionModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartScrollBarModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartSelectionStyleModule } from 'devextreme-angular/ui/chart/nested';
import { DxiChartSeriesModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartSeriesBorderModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartSeriesTemplateModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartShadowModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartSizeModule } from 'devextreme-angular/ui/chart/nested';
import { DxiChartStripModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartStripLabelModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartStripStyleModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartStripStyleLabelModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartSubtitleModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartTickModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartTickIntervalModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartTitleModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartTooltipModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartTooltipBorderModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartUrlModule } from 'devextreme-angular/ui/chart/nested';
import { DxiChartValueAxisModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartValueErrorBarModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartVerticalLineModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartVisualRangeModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartWholeRangeModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartWidthModule } from 'devextreme-angular/ui/chart/nested';
import { DxoChartZoomAndPanModule } from 'devextreme-angular/ui/chart/nested';

import { DxiAnnotationComponent } from 'devextreme-angular/ui/nested';
import { DxiPaneComponent } from 'devextreme-angular/ui/nested';
import { DxiSeriesComponent } from 'devextreme-angular/ui/nested';
import { DxiValueAxisComponent } from 'devextreme-angular/ui/nested';

import { DxiChartAnnotationComponent } from 'devextreme-angular/ui/chart/nested';
import { DxiChartPaneComponent } from 'devextreme-angular/ui/chart/nested';
import { DxiChartSeriesComponent } from 'devextreme-angular/ui/chart/nested';
import { DxiChartValueAxisComponent } from 'devextreme-angular/ui/chart/nested';


/**
 * [descr:dxChart]

 */
@Component({
    selector: 'dx-chart',
    template: '',
    styles: [ ' :host {  display: block; }'],
    host: { ngSkipHydration: 'true' },
    providers: [
        DxTemplateHost,
        WatcherHelper,
        NestedOptionHost,
        IterableDifferHelper
    ]
})
export class DxChartComponent extends DxComponent implements OnDestroy, OnChanges, DoCheck {
    instance: DxChart = null;

    /**
     * [descr:BaseChartOptions.adaptiveLayout]
    
     */
    @Input()
    get adaptiveLayout(): { height?: number, keepLabels?: boolean, width?: number } {
        return this._getOption('adaptiveLayout');
    }
    set adaptiveLayout(value: { height?: number, keepLabels?: boolean, width?: number }) {
        this._setOption('adaptiveLayout', value);
    }


    /**
     * [descr:dxChartOptions.adjustOnZoom]
    
     */
    @Input()
    get adjustOnZoom(): boolean {
        return this._getOption('adjustOnZoom');
    }
    set adjustOnZoom(value: boolean) {
        this._setOption('adjustOnZoom', value);
    }


    /**
     * [descr:BaseChartOptions.animation]
    
     */
    @Input()
    get animation(): boolean | { duration?: number, easing?: AnimationEaseMode, enabled?: boolean, maxPointCountSupported?: number } {
        return this._getOption('animation');
    }
    set animation(value: boolean | { duration?: number, easing?: AnimationEaseMode, enabled?: boolean, maxPointCountSupported?: number }) {
        this._setOption('animation', value);
    }


    /**
     * [descr:dxChartOptions.annotations]
    
     */
    @Input()
    get annotations(): Array<any | dxChartAnnotationConfig> {
        return this._getOption('annotations');
    }
    set annotations(value: Array<any | dxChartAnnotationConfig>) {
        this._setOption('annotations', value);
    }


    /**
     * [descr:dxChartOptions.argumentAxis]
    
     */
    @Input()
    get argumentAxis(): { aggregateByCategory?: boolean, aggregatedPointsPosition?: AggregatedPointsPosition, aggregationGroupWidth?: number | undefined, aggregationInterval?: number | TimeInterval | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }, allowDecimals?: boolean | undefined, argumentType?: ChartsDataType | undefined, axisDivisionFactor?: number, breaks?: Array<ScaleBreak> | { endValue?: Date | number | string | undefined, startValue?: Date | number | string | undefined }[], breakStyle?: { color?: string, line?: ScaleBreakLineStyle, width?: number }, categories?: Array<Date | number | string>, color?: string, constantLines?: { color?: string, dashStyle?: DashStyle, displayBehindSeries?: boolean, extendAxis?: boolean, label?: { font?: Font, horizontalAlignment?: HorizontalAlignment, position?: RelativePosition, text?: string | undefined, verticalAlignment?: VerticalAlignment, visible?: boolean }, paddingLeftRight?: number, paddingTopBottom?: number, value?: Date | number | string | undefined, width?: number }[], constantLineStyle?: { color?: string, dashStyle?: DashStyle, label?: { font?: Font, horizontalAlignment?: HorizontalAlignment, position?: RelativePosition, verticalAlignment?: VerticalAlignment, visible?: boolean }, paddingLeftRight?: number, paddingTopBottom?: number, width?: number }, customPosition?: Date | number | string | undefined, customPositionAxis?: string | undefined, discreteAxisDivisionMode?: DiscreteAxisDivisionMode, endOnTick?: boolean, grid?: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }, holidays?: Array<Date | string> | Array<number>, hoverMode?: ArgumentAxisHoverMode, inverted?: boolean, label?: { alignment?: HorizontalAlignment | undefined, customizeHint?: ((argument: { value: Date | number | string, valueText: string }) => string), customizeText?: ((argument: { value: Date | number | string, valueText: string }) => string), displayMode?: ChartLabelDisplayMode, font?: Font, format?: Format | undefined, indentFromAxis?: number, overlappingBehavior?: ChartsAxisLabelOverlap, position?: Position | RelativePosition, rotationAngle?: number, staggeringSpacing?: number, template?: any, textOverflow?: TextOverflow, visible?: boolean, wordWrap?: WordWrap }, linearThreshold?: number | undefined, logarithmBase?: number, maxValueMargin?: number | undefined, minorGrid?: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }, minorTick?: { color?: string, length?: number, opacity?: number, shift?: number, visible?: boolean, width?: number }, minorTickCount?: number | undefined, minorTickInterval?: number | TimeInterval | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }, minValueMargin?: number | undefined, minVisualRangeLength?: number | TimeInterval | undefined | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }, offset?: number | undefined, opacity?: number | undefined, placeholderSize?: number, position?: Position, singleWorkdays?: Array<Date | string> | Array<number>, strips?: { color?: string | undefined, endValue?: Date | number | string | undefined, label?: { font?: Font, horizontalAlignment?: HorizontalAlignment, text?: string | undefined, verticalAlignment?: VerticalAlignment }, paddingLeftRight?: number, paddingTopBottom?: number, startValue?: Date | number | string | undefined }[], stripStyle?: { label?: { font?: Font, horizontalAlignment?: HorizontalAlignment, verticalAlignment?: VerticalAlignment }, paddingLeftRight?: number, paddingTopBottom?: number }, tick?: { color?: string, length?: number, opacity?: number | undefined, shift?: number, visible?: boolean, width?: number }, tickInterval?: number | TimeInterval | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }, title?: string | { alignment?: HorizontalAlignment, font?: Font, margin?: number, text?: string | undefined, textOverflow?: TextOverflow, wordWrap?: WordWrap }, type?: AxisScaleType | undefined, valueMarginsEnabled?: boolean, visible?: boolean, visualRange?: Array<Date | number | string> | CommonChartTypes.VisualRange, visualRangeUpdateMode?: VisualRangeUpdateMode, wholeRange?: Array<Date | number | string> | undefined | CommonChartTypes.VisualRange, width?: number, workdaysOnly?: boolean, workWeek?: Array<number> } {
        return this._getOption('argumentAxis');
    }
    set argumentAxis(value: { aggregateByCategory?: boolean, aggregatedPointsPosition?: AggregatedPointsPosition, aggregationGroupWidth?: number | undefined, aggregationInterval?: number | TimeInterval | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }, allowDecimals?: boolean | undefined, argumentType?: ChartsDataType | undefined, axisDivisionFactor?: number, breaks?: Array<ScaleBreak> | { endValue?: Date | number | string | undefined, startValue?: Date | number | string | undefined }[], breakStyle?: { color?: string, line?: ScaleBreakLineStyle, width?: number }, categories?: Array<Date | number | string>, color?: string, constantLines?: { color?: string, dashStyle?: DashStyle, displayBehindSeries?: boolean, extendAxis?: boolean, label?: { font?: Font, horizontalAlignment?: HorizontalAlignment, position?: RelativePosition, text?: string | undefined, verticalAlignment?: VerticalAlignment, visible?: boolean }, paddingLeftRight?: number, paddingTopBottom?: number, value?: Date | number | string | undefined, width?: number }[], constantLineStyle?: { color?: string, dashStyle?: DashStyle, label?: { font?: Font, horizontalAlignment?: HorizontalAlignment, position?: RelativePosition, verticalAlignment?: VerticalAlignment, visible?: boolean }, paddingLeftRight?: number, paddingTopBottom?: number, width?: number }, customPosition?: Date | number | string | undefined, customPositionAxis?: string | undefined, discreteAxisDivisionMode?: DiscreteAxisDivisionMode, endOnTick?: boolean, grid?: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }, holidays?: Array<Date | string> | Array<number>, hoverMode?: ArgumentAxisHoverMode, inverted?: boolean, label?: { alignment?: HorizontalAlignment | undefined, customizeHint?: ((argument: { value: Date | number | string, valueText: string }) => string), customizeText?: ((argument: { value: Date | number | string, valueText: string }) => string), displayMode?: ChartLabelDisplayMode, font?: Font, format?: Format | undefined, indentFromAxis?: number, overlappingBehavior?: ChartsAxisLabelOverlap, position?: Position | RelativePosition, rotationAngle?: number, staggeringSpacing?: number, template?: any, textOverflow?: TextOverflow, visible?: boolean, wordWrap?: WordWrap }, linearThreshold?: number | undefined, logarithmBase?: number, maxValueMargin?: number | undefined, minorGrid?: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }, minorTick?: { color?: string, length?: number, opacity?: number, shift?: number, visible?: boolean, width?: number }, minorTickCount?: number | undefined, minorTickInterval?: number | TimeInterval | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }, minValueMargin?: number | undefined, minVisualRangeLength?: number | TimeInterval | undefined | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }, offset?: number | undefined, opacity?: number | undefined, placeholderSize?: number, position?: Position, singleWorkdays?: Array<Date | string> | Array<number>, strips?: { color?: string | undefined, endValue?: Date | number | string | undefined, label?: { font?: Font, horizontalAlignment?: HorizontalAlignment, text?: string | undefined, verticalAlignment?: VerticalAlignment }, paddingLeftRight?: number, paddingTopBottom?: number, startValue?: Date | number | string | undefined }[], stripStyle?: { label?: { font?: Font, horizontalAlignment?: HorizontalAlignment, verticalAlignment?: VerticalAlignment }, paddingLeftRight?: number, paddingTopBottom?: number }, tick?: { color?: string, length?: number, opacity?: number | undefined, shift?: number, visible?: boolean, width?: number }, tickInterval?: number | TimeInterval | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }, title?: string | { alignment?: HorizontalAlignment, font?: Font, margin?: number, text?: string | undefined, textOverflow?: TextOverflow, wordWrap?: WordWrap }, type?: AxisScaleType | undefined, valueMarginsEnabled?: boolean, visible?: boolean, visualRange?: Array<Date | number | string> | CommonChartTypes.VisualRange, visualRangeUpdateMode?: VisualRangeUpdateMode, wholeRange?: Array<Date | number | string> | undefined | CommonChartTypes.VisualRange, width?: number, workdaysOnly?: boolean, workWeek?: Array<number> }) {
        this._setOption('argumentAxis', value);
    }


    /**
     * [descr:dxChartOptions.autoHidePointMarkers]
    
     */
    @Input()
    get autoHidePointMarkers(): boolean {
        return this._getOption('autoHidePointMarkers');
    }
    set autoHidePointMarkers(value: boolean) {
        this._setOption('autoHidePointMarkers', value);
    }


    /**
     * [descr:dxChartOptions.barGroupPadding]
    
     */
    @Input()
    get barGroupPadding(): number {
        return this._getOption('barGroupPadding');
    }
    set barGroupPadding(value: number) {
        this._setOption('barGroupPadding', value);
    }


    /**
     * [descr:dxChartOptions.barGroupWidth]
    
     */
    @Input()
    get barGroupWidth(): number | undefined {
        return this._getOption('barGroupWidth');
    }
    set barGroupWidth(value: number | undefined) {
        this._setOption('barGroupWidth', value);
    }


    /**
     * [descr:dxChartOptions.commonAnnotationSettings]
    
     */
    @Input()
    get commonAnnotationSettings(): dxChartCommonAnnotationConfig {
        return this._getOption('commonAnnotationSettings');
    }
    set commonAnnotationSettings(value: dxChartCommonAnnotationConfig) {
        this._setOption('commonAnnotationSettings', value);
    }


    /**
     * [descr:dxChartOptions.commonAxisSettings]
    
     */
    @Input()
    get commonAxisSettings(): { aggregatedPointsPosition?: AggregatedPointsPosition, allowDecimals?: boolean | undefined, breakStyle?: { color?: string, line?: ScaleBreakLineStyle, width?: number }, color?: string, constantLineStyle?: { color?: string, dashStyle?: DashStyle, label?: { font?: Font, position?: RelativePosition, visible?: boolean }, paddingLeftRight?: number, paddingTopBottom?: number, width?: number }, discreteAxisDivisionMode?: DiscreteAxisDivisionMode, endOnTick?: boolean | undefined, grid?: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }, inverted?: boolean, label?: { alignment?: HorizontalAlignment | undefined, displayMode?: ChartLabelDisplayMode, font?: Font, indentFromAxis?: number, overlappingBehavior?: ChartsAxisLabelOverlap, position?: Position | RelativePosition, rotationAngle?: number, staggeringSpacing?: number, template?: any, textOverflow?: TextOverflow, visible?: boolean, wordWrap?: WordWrap }, maxValueMargin?: number | undefined, minorGrid?: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }, minorTick?: { color?: string, length?: number, opacity?: number, shift?: number, visible?: boolean, width?: number }, minValueMargin?: number | undefined, opacity?: number | undefined, placeholderSize?: number, stripStyle?: { label?: { font?: Font, horizontalAlignment?: HorizontalAlignment, verticalAlignment?: VerticalAlignment }, paddingLeftRight?: number, paddingTopBottom?: number }, tick?: { color?: string, length?: number, opacity?: number | undefined, shift?: number, visible?: boolean, width?: number }, title?: { alignment?: HorizontalAlignment, font?: Font, margin?: number, textOverflow?: TextOverflow, wordWrap?: WordWrap }, valueMarginsEnabled?: boolean, visible?: boolean, width?: number } {
        return this._getOption('commonAxisSettings');
    }
    set commonAxisSettings(value: { aggregatedPointsPosition?: AggregatedPointsPosition, allowDecimals?: boolean | undefined, breakStyle?: { color?: string, line?: ScaleBreakLineStyle, width?: number }, color?: string, constantLineStyle?: { color?: string, dashStyle?: DashStyle, label?: { font?: Font, position?: RelativePosition, visible?: boolean }, paddingLeftRight?: number, paddingTopBottom?: number, width?: number }, discreteAxisDivisionMode?: DiscreteAxisDivisionMode, endOnTick?: boolean | undefined, grid?: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }, inverted?: boolean, label?: { alignment?: HorizontalAlignment | undefined, displayMode?: ChartLabelDisplayMode, font?: Font, indentFromAxis?: number, overlappingBehavior?: ChartsAxisLabelOverlap, position?: Position | RelativePosition, rotationAngle?: number, staggeringSpacing?: number, template?: any, textOverflow?: TextOverflow, visible?: boolean, wordWrap?: WordWrap }, maxValueMargin?: number | undefined, minorGrid?: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }, minorTick?: { color?: string, length?: number, opacity?: number, shift?: number, visible?: boolean, width?: number }, minValueMargin?: number | undefined, opacity?: number | undefined, placeholderSize?: number, stripStyle?: { label?: { font?: Font, horizontalAlignment?: HorizontalAlignment, verticalAlignment?: VerticalAlignment }, paddingLeftRight?: number, paddingTopBottom?: number }, tick?: { color?: string, length?: number, opacity?: number | undefined, shift?: number, visible?: boolean, width?: number }, title?: { alignment?: HorizontalAlignment, font?: Font, margin?: number, textOverflow?: TextOverflow, wordWrap?: WordWrap }, valueMarginsEnabled?: boolean, visible?: boolean, width?: number }) {
        this._setOption('commonAxisSettings', value);
    }


    /**
     * [descr:dxChartOptions.commonPaneSettings]
    
     */
    @Input()
    get commonPaneSettings(): { backgroundColor?: ChartsColor | string, border?: { bottom?: boolean, color?: string, dashStyle?: DashStyle, left?: boolean, opacity?: number | undefined, right?: boolean, top?: boolean, visible?: boolean, width?: number } } {
        return this._getOption('commonPaneSettings');
    }
    set commonPaneSettings(value: { backgroundColor?: ChartsColor | string, border?: { bottom?: boolean, color?: string, dashStyle?: DashStyle, left?: boolean, opacity?: number | undefined, right?: boolean, top?: boolean, visible?: boolean, width?: number } }) {
        this._setOption('commonPaneSettings', value);
    }


    /**
     * [descr:dxChartOptions.commonSeriesSettings]
    
     */
    @Input()
    get commonSeriesSettings(): { aggregation?: { calculate?: ((aggregationInfo: chartPointAggregationInfoObject, series: chartSeriesObject) => Record<string, any> | Array<Record<string, any>>) | undefined, enabled?: boolean, method?: ChartSeriesAggregationMethod }, area?: any, argumentField?: string, axis?: string | undefined, bar?: any, barOverlapGroup?: string | undefined, barPadding?: number | undefined, barWidth?: number | undefined, border?: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, bubble?: any, candlestick?: any, closeValueField?: string, color?: ChartsColor | string | undefined, cornerRadius?: number, dashStyle?: DashStyle, fullstackedarea?: any, fullstackedbar?: any, fullstackedline?: any, fullstackedspline?: any, fullstackedsplinearea?: any, highValueField?: string, hoverMode?: SeriesHoverMode, hoverStyle?: { border?: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, dashStyle?: DashStyle, hatching?: { direction?: HatchDirection, opacity?: number, step?: number, width?: number }, highlight?: boolean, width?: number }, ignoreEmptyPoints?: boolean, innerColor?: string, label?: { alignment?: HorizontalAlignment, argumentFormat?: Format | undefined, backgroundColor?: string | undefined, border?: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, connector?: { color?: string | undefined, visible?: boolean, width?: number }, customizeText?: ((pointInfo: any) => string), displayFormat?: string | undefined, font?: Font, format?: Format | undefined, horizontalOffset?: number, position?: RelativePosition, rotationAngle?: number, showForZeroValues?: boolean, verticalOffset?: number, visible?: boolean }, line?: any, lowValueField?: string, maxLabelCount?: number | undefined, minBarSize?: number | undefined, opacity?: number, openValueField?: string, pane?: string, point?: { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, hoverMode?: PointInteractionMode, hoverStyle?: { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, size?: number | undefined }, image?: string | undefined | { height?: number | { rangeMaxPoint?: number | undefined, rangeMinPoint?: number | undefined }, url?: string | undefined | { rangeMaxPoint?: string | undefined, rangeMinPoint?: string | undefined }, width?: number | { rangeMaxPoint?: number | undefined, rangeMinPoint?: number | undefined } }, selectionMode?: PointInteractionMode, selectionStyle?: { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, size?: number | undefined }, size?: number, symbol?: PointSymbol, visible?: boolean }, rangearea?: any, rangebar?: any, rangeValue1Field?: string, rangeValue2Field?: string, reduction?: { color?: string, level?: FinancialChartReductionLevel }, scatter?: any, selectionMode?: SeriesSelectionMode, selectionStyle?: { border?: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, dashStyle?: DashStyle, hatching?: { direction?: HatchDirection, opacity?: number, step?: number, width?: number }, highlight?: boolean, width?: number }, showInLegend?: boolean, sizeField?: string, spline?: any, splinearea?: any, stack?: string, stackedarea?: any, stackedbar?: any, stackedline?: any, stackedspline?: any, stackedsplinearea?: any, steparea?: any, stepline?: any, stock?: any, tagField?: string, type?: SeriesType, valueErrorBar?: { color?: string, displayMode?: ValueErrorBarDisplayMode, edgeLength?: number, highValueField?: string | undefined, lineWidth?: number, lowValueField?: string | undefined, opacity?: number | undefined, type?: undefined | ValueErrorBarType, value?: number }, valueField?: string, visible?: boolean, width?: number } {
        return this._getOption('commonSeriesSettings');
    }
    set commonSeriesSettings(value: { aggregation?: { calculate?: ((aggregationInfo: chartPointAggregationInfoObject, series: chartSeriesObject) => Record<string, any> | Array<Record<string, any>>) | undefined, enabled?: boolean, method?: ChartSeriesAggregationMethod }, area?: any, argumentField?: string, axis?: string | undefined, bar?: any, barOverlapGroup?: string | undefined, barPadding?: number | undefined, barWidth?: number | undefined, border?: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, bubble?: any, candlestick?: any, closeValueField?: string, color?: ChartsColor | string | undefined, cornerRadius?: number, dashStyle?: DashStyle, fullstackedarea?: any, fullstackedbar?: any, fullstackedline?: any, fullstackedspline?: any, fullstackedsplinearea?: any, highValueField?: string, hoverMode?: SeriesHoverMode, hoverStyle?: { border?: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, dashStyle?: DashStyle, hatching?: { direction?: HatchDirection, opacity?: number, step?: number, width?: number }, highlight?: boolean, width?: number }, ignoreEmptyPoints?: boolean, innerColor?: string, label?: { alignment?: HorizontalAlignment, argumentFormat?: Format | undefined, backgroundColor?: string | undefined, border?: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, connector?: { color?: string | undefined, visible?: boolean, width?: number }, customizeText?: ((pointInfo: any) => string), displayFormat?: string | undefined, font?: Font, format?: Format | undefined, horizontalOffset?: number, position?: RelativePosition, rotationAngle?: number, showForZeroValues?: boolean, verticalOffset?: number, visible?: boolean }, line?: any, lowValueField?: string, maxLabelCount?: number | undefined, minBarSize?: number | undefined, opacity?: number, openValueField?: string, pane?: string, point?: { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, hoverMode?: PointInteractionMode, hoverStyle?: { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, size?: number | undefined }, image?: string | undefined | { height?: number | { rangeMaxPoint?: number | undefined, rangeMinPoint?: number | undefined }, url?: string | undefined | { rangeMaxPoint?: string | undefined, rangeMinPoint?: string | undefined }, width?: number | { rangeMaxPoint?: number | undefined, rangeMinPoint?: number | undefined } }, selectionMode?: PointInteractionMode, selectionStyle?: { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, size?: number | undefined }, size?: number, symbol?: PointSymbol, visible?: boolean }, rangearea?: any, rangebar?: any, rangeValue1Field?: string, rangeValue2Field?: string, reduction?: { color?: string, level?: FinancialChartReductionLevel }, scatter?: any, selectionMode?: SeriesSelectionMode, selectionStyle?: { border?: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, dashStyle?: DashStyle, hatching?: { direction?: HatchDirection, opacity?: number, step?: number, width?: number }, highlight?: boolean, width?: number }, showInLegend?: boolean, sizeField?: string, spline?: any, splinearea?: any, stack?: string, stackedarea?: any, stackedbar?: any, stackedline?: any, stackedspline?: any, stackedsplinearea?: any, steparea?: any, stepline?: any, stock?: any, tagField?: string, type?: SeriesType, valueErrorBar?: { color?: string, displayMode?: ValueErrorBarDisplayMode, edgeLength?: number, highValueField?: string | undefined, lineWidth?: number, lowValueField?: string | undefined, opacity?: number | undefined, type?: undefined | ValueErrorBarType, value?: number }, valueField?: string, visible?: boolean, width?: number }) {
        this._setOption('commonSeriesSettings', value);
    }


    /**
     * [descr:dxChartOptions.containerBackgroundColor]
    
     */
    @Input()
    get containerBackgroundColor(): string {
        return this._getOption('containerBackgroundColor');
    }
    set containerBackgroundColor(value: string) {
        this._setOption('containerBackgroundColor', value);
    }


    /**
     * [descr:dxChartOptions.crosshair]
    
     */
    @Input()
    get crosshair(): { color?: string, dashStyle?: DashStyle, enabled?: boolean, horizontalLine?: boolean | { color?: string, dashStyle?: DashStyle, label?: { backgroundColor?: string, customizeText?: ((info: { point: chartPointObject, value: Date | number | string, valueText: string }) => string), font?: Font, format?: Format | undefined, visible?: boolean }, opacity?: number | undefined, visible?: boolean, width?: number }, label?: { backgroundColor?: string, customizeText?: ((info: { point: chartPointObject, value: Date | number | string, valueText: string }) => string), font?: Font, format?: Format | undefined, visible?: boolean }, opacity?: number | undefined, verticalLine?: boolean | { color?: string, dashStyle?: DashStyle, label?: { backgroundColor?: string, customizeText?: ((info: { point: chartPointObject, value: Date | number | string, valueText: string }) => string), font?: Font, format?: Format | undefined, visible?: boolean }, opacity?: number | undefined, visible?: boolean, width?: number }, width?: number } {
        return this._getOption('crosshair');
    }
    set crosshair(value: { color?: string, dashStyle?: DashStyle, enabled?: boolean, horizontalLine?: boolean | { color?: string, dashStyle?: DashStyle, label?: { backgroundColor?: string, customizeText?: ((info: { point: chartPointObject, value: Date | number | string, valueText: string }) => string), font?: Font, format?: Format | undefined, visible?: boolean }, opacity?: number | undefined, visible?: boolean, width?: number }, label?: { backgroundColor?: string, customizeText?: ((info: { point: chartPointObject, value: Date | number | string, valueText: string }) => string), font?: Font, format?: Format | undefined, visible?: boolean }, opacity?: number | undefined, verticalLine?: boolean | { color?: string, dashStyle?: DashStyle, label?: { backgroundColor?: string, customizeText?: ((info: { point: chartPointObject, value: Date | number | string, valueText: string }) => string), font?: Font, format?: Format | undefined, visible?: boolean }, opacity?: number | undefined, visible?: boolean, width?: number }, width?: number }) {
        this._setOption('crosshair', value);
    }


    /**
     * [descr:dxChartOptions.customizeAnnotation]
    
     */
    @Input()
    get customizeAnnotation(): ((annotation: dxChartAnnotationConfig | any) => dxChartAnnotationConfig) | undefined {
        return this._getOption('customizeAnnotation');
    }
    set customizeAnnotation(value: ((annotation: dxChartAnnotationConfig | any) => dxChartAnnotationConfig) | undefined) {
        this._setOption('customizeAnnotation', value);
    }


    /**
     * [descr:BaseChartOptions.customizeLabel]
    
     */
    @Input()
    get customizeLabel(): ((pointInfo: any) => SeriesLabel) {
        return this._getOption('customizeLabel');
    }
    set customizeLabel(value: ((pointInfo: any) => SeriesLabel)) {
        this._setOption('customizeLabel', value);
    }


    /**
     * [descr:BaseChartOptions.customizePoint]
    
     */
    @Input()
    get customizePoint(): ((pointInfo: any) => SeriesPoint) {
        return this._getOption('customizePoint');
    }
    set customizePoint(value: ((pointInfo: any) => SeriesPoint)) {
        this._setOption('customizePoint', value);
    }


    /**
     * [descr:dxChartOptions.dataPrepareSettings]
    
     */
    @Input()
    get dataPrepareSettings(): { checkTypeForAllData?: boolean, convertToAxisDataType?: boolean, sortingMethod?: boolean | ((a: any, b: any) => number) } {
        return this._getOption('dataPrepareSettings');
    }
    set dataPrepareSettings(value: { checkTypeForAllData?: boolean, convertToAxisDataType?: boolean, sortingMethod?: boolean | ((a: any, b: any) => number) }) {
        this._setOption('dataPrepareSettings', value);
    }


    /**
     * [descr:BaseChartOptions.dataSource]
    
     */
    @Input()
    get dataSource(): Array<any> | DataSource | DataSourceOptions | null | Store | string {
        return this._getOption('dataSource');
    }
    set dataSource(value: Array<any> | DataSource | DataSourceOptions | null | Store | string) {
        this._setOption('dataSource', value);
    }


    /**
     * [descr:dxChartOptions.defaultPane]
    
     */
    @Input()
    get defaultPane(): string | undefined {
        return this._getOption('defaultPane');
    }
    set defaultPane(value: string | undefined) {
        this._setOption('defaultPane', value);
    }


    /**
     * [descr:BaseWidgetOptions.disabled]
    
     */
    @Input()
    get disabled(): boolean {
        return this._getOption('disabled');
    }
    set disabled(value: boolean) {
        this._setOption('disabled', value);
    }


    /**
     * [descr:DOMComponentOptions.elementAttr]
    
     */
    @Input()
    get elementAttr(): Record<string, any> {
        return this._getOption('elementAttr');
    }
    set elementAttr(value: Record<string, any>) {
        this._setOption('elementAttr', value);
    }


    /**
     * [descr:BaseWidgetOptions.export]
    
     */
    @Input()
    get export(): { backgroundColor?: string, enabled?: boolean, fileName?: string, formats?: Array<ExportFormat>, margin?: number, printingEnabled?: boolean, svgToCanvas?: ((svg: any, canvas: any) => any) | undefined } {
        return this._getOption('export');
    }
    set export(value: { backgroundColor?: string, enabled?: boolean, fileName?: string, formats?: Array<ExportFormat>, margin?: number, printingEnabled?: boolean, svgToCanvas?: ((svg: any, canvas: any) => any) | undefined }) {
        this._setOption('export', value);
    }


    /**
     * [descr:dxChartOptions.legend]
    
     */
    @Input()
    get legend(): { backgroundColor?: string | undefined, border?: { color?: string, cornerRadius?: number, dashStyle?: DashStyle, opacity?: number | undefined, visible?: boolean, width?: number }, columnCount?: number, columnItemSpacing?: number, customizeHint?: ((seriesInfo: { seriesColor: string, seriesIndex: number, seriesName: any }) => string), customizeItems?: ((items: Array<LegendItem>) => Array<LegendItem>), customizeText?: ((seriesInfo: { seriesColor: string, seriesIndex: number, seriesName: any }) => string), font?: Font, horizontalAlignment?: HorizontalAlignment, hoverMode?: LegendHoverMode, itemsAlignment?: HorizontalAlignment | undefined, itemTextPosition?: Position | undefined, margin?: number | { bottom?: number, left?: number, right?: number, top?: number }, markerSize?: number, markerTemplate?: any, orientation?: Orientation | undefined, paddingLeftRight?: number, paddingTopBottom?: number, position?: RelativePosition, rowCount?: number, rowItemSpacing?: number, title?: string | { font?: Font, horizontalAlignment?: HorizontalAlignment | undefined, margin?: { bottom?: number, left?: number, right?: number, top?: number }, placeholderSize?: number | undefined, subtitle?: string | { font?: Font, offset?: number, text?: string }, text?: string, verticalAlignment?: VerticalEdge }, verticalAlignment?: VerticalEdge, visible?: boolean } {
        return this._getOption('legend');
    }
    set legend(value: { backgroundColor?: string | undefined, border?: { color?: string, cornerRadius?: number, dashStyle?: DashStyle, opacity?: number | undefined, visible?: boolean, width?: number }, columnCount?: number, columnItemSpacing?: number, customizeHint?: ((seriesInfo: { seriesColor: string, seriesIndex: number, seriesName: any }) => string), customizeItems?: ((items: Array<LegendItem>) => Array<LegendItem>), customizeText?: ((seriesInfo: { seriesColor: string, seriesIndex: number, seriesName: any }) => string), font?: Font, horizontalAlignment?: HorizontalAlignment, hoverMode?: LegendHoverMode, itemsAlignment?: HorizontalAlignment | undefined, itemTextPosition?: Position | undefined, margin?: number | { bottom?: number, left?: number, right?: number, top?: number }, markerSize?: number, markerTemplate?: any, orientation?: Orientation | undefined, paddingLeftRight?: number, paddingTopBottom?: number, position?: RelativePosition, rowCount?: number, rowItemSpacing?: number, title?: string | { font?: Font, horizontalAlignment?: HorizontalAlignment | undefined, margin?: { bottom?: number, left?: number, right?: number, top?: number }, placeholderSize?: number | undefined, subtitle?: string | { font?: Font, offset?: number, text?: string }, text?: string, verticalAlignment?: VerticalEdge }, verticalAlignment?: VerticalEdge, visible?: boolean }) {
        this._setOption('legend', value);
    }


    /**
     * [descr:BaseWidgetOptions.loadingIndicator]
    
     */
    @Input()
    get loadingIndicator(): { backgroundColor?: string, enabled?: boolean, font?: Font, show?: boolean, text?: string } {
        return this._getOption('loadingIndicator');
    }
    set loadingIndicator(value: { backgroundColor?: string, enabled?: boolean, font?: Font, show?: boolean, text?: string }) {
        this._setOption('loadingIndicator', value);
    }


    /**
     * [descr:BaseWidgetOptions.margin]
    
     */
    @Input()
    get margin(): { bottom?: number, left?: number, right?: number, top?: number } {
        return this._getOption('margin');
    }
    set margin(value: { bottom?: number, left?: number, right?: number, top?: number }) {
        this._setOption('margin', value);
    }


    /**
     * [descr:dxChartOptions.maxBubbleSize]
    
     */
    @Input()
    get maxBubbleSize(): number {
        return this._getOption('maxBubbleSize');
    }
    set maxBubbleSize(value: number) {
        this._setOption('maxBubbleSize', value);
    }


    /**
     * [descr:dxChartOptions.minBubbleSize]
    
     */
    @Input()
    get minBubbleSize(): number {
        return this._getOption('minBubbleSize');
    }
    set minBubbleSize(value: number) {
        this._setOption('minBubbleSize', value);
    }


    /**
     * [descr:dxChartOptions.negativesAsZeroes]
    
     */
    @Input()
    get negativesAsZeroes(): boolean {
        return this._getOption('negativesAsZeroes');
    }
    set negativesAsZeroes(value: boolean) {
        this._setOption('negativesAsZeroes', value);
    }


    /**
     * [descr:BaseChartOptions.palette]
    
     */
    @Input()
    get palette(): Array<string> | Palette {
        return this._getOption('palette');
    }
    set palette(value: Array<string> | Palette) {
        this._setOption('palette', value);
    }


    /**
     * [descr:BaseChartOptions.paletteExtensionMode]
    
     */
    @Input()
    get paletteExtensionMode(): PaletteExtensionMode {
        return this._getOption('paletteExtensionMode');
    }
    set paletteExtensionMode(value: PaletteExtensionMode) {
        this._setOption('paletteExtensionMode', value);
    }


    /**
     * [descr:dxChartOptions.panes]
    
     */
    @Input()
    get panes(): { backgroundColor?: ChartsColor | string, border?: { bottom?: boolean, color?: string, dashStyle?: DashStyle, left?: boolean, opacity?: number | undefined, right?: boolean, top?: boolean, visible?: boolean, width?: number }, height?: number | string | undefined, name?: string | undefined }[] {
        return this._getOption('panes');
    }
    set panes(value: { backgroundColor?: ChartsColor | string, border?: { bottom?: boolean, color?: string, dashStyle?: DashStyle, left?: boolean, opacity?: number | undefined, right?: boolean, top?: boolean, visible?: boolean, width?: number }, height?: number | string | undefined, name?: string | undefined }[]) {
        this._setOption('panes', value);
    }


    /**
     * [descr:BaseWidgetOptions.pathModified]
    
     */
    @Input()
    get pathModified(): boolean {
        return this._getOption('pathModified');
    }
    set pathModified(value: boolean) {
        this._setOption('pathModified', value);
    }


    /**
     * [descr:BaseChartOptions.pointSelectionMode]
    
     */
    @Input()
    get pointSelectionMode(): SingleOrMultiple {
        return this._getOption('pointSelectionMode');
    }
    set pointSelectionMode(value: SingleOrMultiple) {
        this._setOption('pointSelectionMode', value);
    }


    /**
     * [descr:BaseWidgetOptions.redrawOnResize]
    
     */
    @Input()
    get redrawOnResize(): boolean {
        return this._getOption('redrawOnResize');
    }
    set redrawOnResize(value: boolean) {
        this._setOption('redrawOnResize', value);
    }


    /**
     * [descr:dxChartOptions.resizePanesOnZoom]
    
     */
    @Input()
    get resizePanesOnZoom(): boolean {
        return this._getOption('resizePanesOnZoom');
    }
    set resizePanesOnZoom(value: boolean) {
        this._setOption('resizePanesOnZoom', value);
    }


    /**
     * [descr:dxChartOptions.resolveLabelOverlapping]
    
     */
    @Input()
    get resolveLabelOverlapping(): ChartsLabelOverlap {
        return this._getOption('resolveLabelOverlapping');
    }
    set resolveLabelOverlapping(value: ChartsLabelOverlap) {
        this._setOption('resolveLabelOverlapping', value);
    }


    /**
     * [descr:dxChartOptions.rotated]
    
     */
    @Input()
    get rotated(): boolean {
        return this._getOption('rotated');
    }
    set rotated(value: boolean) {
        this._setOption('rotated', value);
    }


    /**
     * [descr:BaseWidgetOptions.rtlEnabled]
    
     */
    @Input()
    get rtlEnabled(): boolean {
        return this._getOption('rtlEnabled');
    }
    set rtlEnabled(value: boolean) {
        this._setOption('rtlEnabled', value);
    }


    /**
     * [descr:dxChartOptions.scrollBar]
    
     */
    @Input()
    get scrollBar(): { color?: string, offset?: number, opacity?: number | undefined, position?: Position, visible?: boolean, width?: number } {
        return this._getOption('scrollBar');
    }
    set scrollBar(value: { color?: string, offset?: number, opacity?: number | undefined, position?: Position, visible?: boolean, width?: number }) {
        this._setOption('scrollBar', value);
    }


    /**
     * [descr:dxChartOptions.series]
    
     */
    @Input()
    get series(): Array<ChartSeries> | ChartSeries | undefined {
        return this._getOption('series');
    }
    set series(value: Array<ChartSeries> | ChartSeries | undefined) {
        this._setOption('series', value);
    }


    /**
     * [descr:dxChartOptions.seriesSelectionMode]
    
     */
    @Input()
    get seriesSelectionMode(): SingleOrMultiple {
        return this._getOption('seriesSelectionMode');
    }
    set seriesSelectionMode(value: SingleOrMultiple) {
        this._setOption('seriesSelectionMode', value);
    }


    /**
     * [descr:dxChartOptions.seriesTemplate]
    
     */
    @Input()
    get seriesTemplate(): any {
        return this._getOption('seriesTemplate');
    }
    set seriesTemplate(value: any) {
        this._setOption('seriesTemplate', value);
    }


    /**
     * [descr:BaseWidgetOptions.size]
    
     */
    @Input()
    get size(): { height?: number | undefined, width?: number | undefined } {
        return this._getOption('size');
    }
    set size(value: { height?: number | undefined, width?: number | undefined }) {
        this._setOption('size', value);
    }


    /**
     * [descr:dxChartOptions.stickyHovering]
    
     */
    @Input()
    get stickyHovering(): boolean {
        return this._getOption('stickyHovering');
    }
    set stickyHovering(value: boolean) {
        this._setOption('stickyHovering', value);
    }


    /**
     * [descr:dxChartOptions.synchronizeMultiAxes]
    
     */
    @Input()
    get synchronizeMultiAxes(): boolean {
        return this._getOption('synchronizeMultiAxes');
    }
    set synchronizeMultiAxes(value: boolean) {
        this._setOption('synchronizeMultiAxes', value);
    }


    /**
     * [descr:BaseWidgetOptions.theme]
    
     */
    @Input()
    get theme(): Theme {
        return this._getOption('theme');
    }
    set theme(value: Theme) {
        this._setOption('theme', value);
    }


    /**
     * [descr:BaseWidgetOptions.title]
    
     */
    @Input()
    get title(): string | { font?: Font, horizontalAlignment?: HorizontalAlignment, margin?: number | { bottom?: number, left?: number, right?: number, top?: number }, placeholderSize?: number | undefined, subtitle?: string | { font?: Font, offset?: number, text?: string, textOverflow?: TextOverflow, wordWrap?: WordWrap }, text?: string, textOverflow?: TextOverflow, verticalAlignment?: VerticalEdge, wordWrap?: WordWrap } {
        return this._getOption('title');
    }
    set title(value: string | { font?: Font, horizontalAlignment?: HorizontalAlignment, margin?: number | { bottom?: number, left?: number, right?: number, top?: number }, placeholderSize?: number | undefined, subtitle?: string | { font?: Font, offset?: number, text?: string, textOverflow?: TextOverflow, wordWrap?: WordWrap }, text?: string, textOverflow?: TextOverflow, verticalAlignment?: VerticalEdge, wordWrap?: WordWrap }) {
        this._setOption('title', value);
    }


    /**
     * [descr:dxChartOptions.tooltip]
    
     */
    @Input()
    get tooltip(): { argumentFormat?: Format | undefined, arrowLength?: number, border?: { color?: string, dashStyle?: DashStyle, opacity?: number | undefined, visible?: boolean, width?: number }, color?: string, container?: any | string | undefined, contentTemplate?: any, cornerRadius?: number, customizeTooltip?: ((pointInfo: any) => Record<string, any>) | undefined, enabled?: boolean, font?: Font, format?: Format | undefined, interactive?: boolean, location?: ChartTooltipLocation, opacity?: number | undefined, paddingLeftRight?: number, paddingTopBottom?: number, shadow?: { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number }, shared?: boolean, zIndex?: number | undefined } {
        return this._getOption('tooltip');
    }
    set tooltip(value: { argumentFormat?: Format | undefined, arrowLength?: number, border?: { color?: string, dashStyle?: DashStyle, opacity?: number | undefined, visible?: boolean, width?: number }, color?: string, container?: any | string | undefined, contentTemplate?: any, cornerRadius?: number, customizeTooltip?: ((pointInfo: any) => Record<string, any>) | undefined, enabled?: boolean, font?: Font, format?: Format | undefined, interactive?: boolean, location?: ChartTooltipLocation, opacity?: number | undefined, paddingLeftRight?: number, paddingTopBottom?: number, shadow?: { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number }, shared?: boolean, zIndex?: number | undefined }) {
        this._setOption('tooltip', value);
    }


    /**
     * [descr:dxChartOptions.valueAxis]
    
     */
    @Input()
    get valueAxis(): { aggregatedPointsPosition?: AggregatedPointsPosition, allowDecimals?: boolean | undefined, autoBreaksEnabled?: boolean, axisDivisionFactor?: number, breaks?: Array<ScaleBreak> | { endValue?: Date | number | string | undefined, startValue?: Date | number | string | undefined }[], breakStyle?: { color?: string, line?: ScaleBreakLineStyle, width?: number }, categories?: Array<Date | number | string>, color?: string, constantLines?: { color?: string, dashStyle?: DashStyle, displayBehindSeries?: boolean, extendAxis?: boolean, label?: { font?: Font, horizontalAlignment?: HorizontalAlignment, position?: RelativePosition, text?: string | undefined, verticalAlignment?: VerticalAlignment, visible?: boolean }, paddingLeftRight?: number, paddingTopBottom?: number, value?: Date | number | string | undefined, width?: number }[], constantLineStyle?: { color?: string, dashStyle?: DashStyle, label?: { font?: Font, horizontalAlignment?: HorizontalAlignment, position?: RelativePosition, verticalAlignment?: VerticalAlignment, visible?: boolean }, paddingLeftRight?: number, paddingTopBottom?: number, width?: number }, customPosition?: Date | number | string | undefined, discreteAxisDivisionMode?: DiscreteAxisDivisionMode, endOnTick?: boolean | undefined, grid?: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }, inverted?: boolean, label?: { alignment?: HorizontalAlignment | undefined, customizeHint?: ((axisValue: { value: Date | number | string, valueText: string }) => string), customizeText?: ((axisValue: { value: Date | number | string, valueText: string }) => string), displayMode?: ChartLabelDisplayMode, font?: Font, format?: Format | undefined, indentFromAxis?: number, overlappingBehavior?: ChartsAxisLabelOverlap, position?: Position | RelativePosition, rotationAngle?: number, staggeringSpacing?: number, template?: any, textOverflow?: TextOverflow, visible?: boolean, wordWrap?: WordWrap }, linearThreshold?: number | undefined, logarithmBase?: number, maxAutoBreakCount?: number, maxValueMargin?: number | undefined, minorGrid?: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }, minorTick?: { color?: string, length?: number, opacity?: number, shift?: number, visible?: boolean, width?: number }, minorTickCount?: number | undefined, minorTickInterval?: number | TimeInterval | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }, minValueMargin?: number | undefined, minVisualRangeLength?: number | TimeInterval | undefined | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }, multipleAxesSpacing?: number, name?: string | undefined, offset?: number | undefined, opacity?: number | undefined, pane?: string | undefined, placeholderSize?: number, position?: Position, showZero?: boolean | undefined, strips?: { color?: string | undefined, endValue?: Date | number | string | undefined, label?: { font?: Font, horizontalAlignment?: HorizontalAlignment, text?: string | undefined, verticalAlignment?: VerticalAlignment }, paddingLeftRight?: number, paddingTopBottom?: number, startValue?: Date | number | string | undefined }[], stripStyle?: { label?: { font?: Font, horizontalAlignment?: HorizontalAlignment, verticalAlignment?: VerticalAlignment }, paddingLeftRight?: number, paddingTopBottom?: number }, synchronizedValue?: number | undefined, tick?: { color?: string, length?: number, opacity?: number | undefined, shift?: number, visible?: boolean, width?: number }, tickInterval?: number | TimeInterval | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }, title?: string | { alignment?: HorizontalAlignment, font?: Font, margin?: number, text?: string | undefined, textOverflow?: TextOverflow, wordWrap?: WordWrap }, type?: AxisScaleType | undefined, valueMarginsEnabled?: boolean, valueType?: ChartsDataType | undefined, visible?: boolean, visualRange?: Array<Date | number | string> | CommonChartTypes.VisualRange, visualRangeUpdateMode?: VisualRangeUpdateMode, wholeRange?: Array<Date | number | string> | undefined | CommonChartTypes.VisualRange, width?: number }[] {
        return this._getOption('valueAxis');
    }
    set valueAxis(value: { aggregatedPointsPosition?: AggregatedPointsPosition, allowDecimals?: boolean | undefined, autoBreaksEnabled?: boolean, axisDivisionFactor?: number, breaks?: Array<ScaleBreak> | { endValue?: Date | number | string | undefined, startValue?: Date | number | string | undefined }[], breakStyle?: { color?: string, line?: ScaleBreakLineStyle, width?: number }, categories?: Array<Date | number | string>, color?: string, constantLines?: { color?: string, dashStyle?: DashStyle, displayBehindSeries?: boolean, extendAxis?: boolean, label?: { font?: Font, horizontalAlignment?: HorizontalAlignment, position?: RelativePosition, text?: string | undefined, verticalAlignment?: VerticalAlignment, visible?: boolean }, paddingLeftRight?: number, paddingTopBottom?: number, value?: Date | number | string | undefined, width?: number }[], constantLineStyle?: { color?: string, dashStyle?: DashStyle, label?: { font?: Font, horizontalAlignment?: HorizontalAlignment, position?: RelativePosition, verticalAlignment?: VerticalAlignment, visible?: boolean }, paddingLeftRight?: number, paddingTopBottom?: number, width?: number }, customPosition?: Date | number | string | undefined, discreteAxisDivisionMode?: DiscreteAxisDivisionMode, endOnTick?: boolean | undefined, grid?: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }, inverted?: boolean, label?: { alignment?: HorizontalAlignment | undefined, customizeHint?: ((axisValue: { value: Date | number | string, valueText: string }) => string), customizeText?: ((axisValue: { value: Date | number | string, valueText: string }) => string), displayMode?: ChartLabelDisplayMode, font?: Font, format?: Format | undefined, indentFromAxis?: number, overlappingBehavior?: ChartsAxisLabelOverlap, position?: Position | RelativePosition, rotationAngle?: number, staggeringSpacing?: number, template?: any, textOverflow?: TextOverflow, visible?: boolean, wordWrap?: WordWrap }, linearThreshold?: number | undefined, logarithmBase?: number, maxAutoBreakCount?: number, maxValueMargin?: number | undefined, minorGrid?: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }, minorTick?: { color?: string, length?: number, opacity?: number, shift?: number, visible?: boolean, width?: number }, minorTickCount?: number | undefined, minorTickInterval?: number | TimeInterval | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }, minValueMargin?: number | undefined, minVisualRangeLength?: number | TimeInterval | undefined | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }, multipleAxesSpacing?: number, name?: string | undefined, offset?: number | undefined, opacity?: number | undefined, pane?: string | undefined, placeholderSize?: number, position?: Position, showZero?: boolean | undefined, strips?: { color?: string | undefined, endValue?: Date | number | string | undefined, label?: { font?: Font, horizontalAlignment?: HorizontalAlignment, text?: string | undefined, verticalAlignment?: VerticalAlignment }, paddingLeftRight?: number, paddingTopBottom?: number, startValue?: Date | number | string | undefined }[], stripStyle?: { label?: { font?: Font, horizontalAlignment?: HorizontalAlignment, verticalAlignment?: VerticalAlignment }, paddingLeftRight?: number, paddingTopBottom?: number }, synchronizedValue?: number | undefined, tick?: { color?: string, length?: number, opacity?: number | undefined, shift?: number, visible?: boolean, width?: number }, tickInterval?: number | TimeInterval | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }, title?: string | { alignment?: HorizontalAlignment, font?: Font, margin?: number, text?: string | undefined, textOverflow?: TextOverflow, wordWrap?: WordWrap }, type?: AxisScaleType | undefined, valueMarginsEnabled?: boolean, valueType?: ChartsDataType | undefined, visible?: boolean, visualRange?: Array<Date | number | string> | CommonChartTypes.VisualRange, visualRangeUpdateMode?: VisualRangeUpdateMode, wholeRange?: Array<Date | number | string> | undefined | CommonChartTypes.VisualRange, width?: number }[]) {
        this._setOption('valueAxis', value);
    }


    /**
     * [descr:dxChartOptions.zoomAndPan]
    
     */
    @Input()
    get zoomAndPan(): { allowMouseWheel?: boolean, allowTouchGestures?: boolean, argumentAxis?: ChartZoomAndPanMode, dragBoxStyle?: { color?: string | undefined, opacity?: number | undefined }, dragToZoom?: boolean, panKey?: EventKeyModifier, valueAxis?: ChartZoomAndPanMode } {
        return this._getOption('zoomAndPan');
    }
    set zoomAndPan(value: { allowMouseWheel?: boolean, allowTouchGestures?: boolean, argumentAxis?: ChartZoomAndPanMode, dragBoxStyle?: { color?: string | undefined, opacity?: number | undefined }, dragToZoom?: boolean, panKey?: EventKeyModifier, valueAxis?: ChartZoomAndPanMode }) {
        this._setOption('zoomAndPan', value);
    }

    /**
    
     * [descr:dxChartOptions.onArgumentAxisClick]
    
    
     */
    @Output() onArgumentAxisClick: EventEmitter<ArgumentAxisClickEvent>;

    /**
    
     * [descr:dxChartOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<DisposingEvent>;

    /**
    
     * [descr:dxChartOptions.onDone]
    
    
     */
    @Output() onDone: EventEmitter<DoneEvent>;

    /**
    
     * [descr:dxChartOptions.onDrawn]
    
    
     */
    @Output() onDrawn: EventEmitter<DrawnEvent>;

    /**
    
     * [descr:dxChartOptions.onExported]
    
    
     */
    @Output() onExported: EventEmitter<ExportedEvent>;

    /**
    
     * [descr:dxChartOptions.onExporting]
    
    
     */
    @Output() onExporting: EventEmitter<ExportingEvent>;

    /**
    
     * [descr:dxChartOptions.onFileSaving]
    
    
     */
    @Output() onFileSaving: EventEmitter<FileSavingEvent>;

    /**
    
     * [descr:dxChartOptions.onIncidentOccurred]
    
    
     */
    @Output() onIncidentOccurred: EventEmitter<IncidentOccurredEvent>;

    /**
    
     * [descr:dxChartOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<InitializedEvent>;

    /**
    
     * [descr:dxChartOptions.onLegendClick]
    
    
     */
    @Output() onLegendClick: EventEmitter<LegendClickEvent>;

    /**
    
     * [descr:dxChartOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<OptionChangedEvent>;

    /**
    
     * [descr:dxChartOptions.onPointClick]
    
    
     */
    @Output() onPointClick: EventEmitter<PointClickEvent>;

    /**
    
     * [descr:dxChartOptions.onPointHoverChanged]
    
    
     */
    @Output() onPointHoverChanged: EventEmitter<PointHoverChangedEvent>;

    /**
    
     * [descr:dxChartOptions.onPointSelectionChanged]
    
    
     */
    @Output() onPointSelectionChanged: EventEmitter<PointSelectionChangedEvent>;

    /**
    
     * [descr:dxChartOptions.onSeriesClick]
    
    
     */
    @Output() onSeriesClick: EventEmitter<SeriesClickEvent>;

    /**
    
     * [descr:dxChartOptions.onSeriesHoverChanged]
    
    
     */
    @Output() onSeriesHoverChanged: EventEmitter<SeriesHoverChangedEvent>;

    /**
    
     * [descr:dxChartOptions.onSeriesSelectionChanged]
    
    
     */
    @Output() onSeriesSelectionChanged: EventEmitter<SeriesSelectionChangedEvent>;

    /**
    
     * [descr:dxChartOptions.onTooltipHidden]
    
    
     */
    @Output() onTooltipHidden: EventEmitter<TooltipHiddenEvent>;

    /**
    
     * [descr:dxChartOptions.onTooltipShown]
    
    
     */
    @Output() onTooltipShown: EventEmitter<TooltipShownEvent>;

    /**
    
     * [descr:dxChartOptions.onZoomEnd]
    
    
     */
    @Output() onZoomEnd: EventEmitter<ZoomEndEvent>;

    /**
    
     * [descr:dxChartOptions.onZoomStart]
    
    
     */
    @Output() onZoomStart: EventEmitter<ZoomStartEvent>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() adaptiveLayoutChange: EventEmitter<{ height?: number, keepLabels?: boolean, width?: number }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() adjustOnZoomChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() animationChange: EventEmitter<boolean | { duration?: number, easing?: AnimationEaseMode, enabled?: boolean, maxPointCountSupported?: number }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() annotationsChange: EventEmitter<Array<any | dxChartAnnotationConfig>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() argumentAxisChange: EventEmitter<{ aggregateByCategory?: boolean, aggregatedPointsPosition?: AggregatedPointsPosition, aggregationGroupWidth?: number | undefined, aggregationInterval?: number | TimeInterval | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }, allowDecimals?: boolean | undefined, argumentType?: ChartsDataType | undefined, axisDivisionFactor?: number, breaks?: Array<ScaleBreak> | { endValue?: Date | number | string | undefined, startValue?: Date | number | string | undefined }[], breakStyle?: { color?: string, line?: ScaleBreakLineStyle, width?: number }, categories?: Array<Date | number | string>, color?: string, constantLines?: { color?: string, dashStyle?: DashStyle, displayBehindSeries?: boolean, extendAxis?: boolean, label?: { font?: Font, horizontalAlignment?: HorizontalAlignment, position?: RelativePosition, text?: string | undefined, verticalAlignment?: VerticalAlignment, visible?: boolean }, paddingLeftRight?: number, paddingTopBottom?: number, value?: Date | number | string | undefined, width?: number }[], constantLineStyle?: { color?: string, dashStyle?: DashStyle, label?: { font?: Font, horizontalAlignment?: HorizontalAlignment, position?: RelativePosition, verticalAlignment?: VerticalAlignment, visible?: boolean }, paddingLeftRight?: number, paddingTopBottom?: number, width?: number }, customPosition?: Date | number | string | undefined, customPositionAxis?: string | undefined, discreteAxisDivisionMode?: DiscreteAxisDivisionMode, endOnTick?: boolean, grid?: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }, holidays?: Array<Date | string> | Array<number>, hoverMode?: ArgumentAxisHoverMode, inverted?: boolean, label?: { alignment?: HorizontalAlignment | undefined, customizeHint?: ((argument: { value: Date | number | string, valueText: string }) => string), customizeText?: ((argument: { value: Date | number | string, valueText: string }) => string), displayMode?: ChartLabelDisplayMode, font?: Font, format?: Format | undefined, indentFromAxis?: number, overlappingBehavior?: ChartsAxisLabelOverlap, position?: Position | RelativePosition, rotationAngle?: number, staggeringSpacing?: number, template?: any, textOverflow?: TextOverflow, visible?: boolean, wordWrap?: WordWrap }, linearThreshold?: number | undefined, logarithmBase?: number, maxValueMargin?: number | undefined, minorGrid?: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }, minorTick?: { color?: string, length?: number, opacity?: number, shift?: number, visible?: boolean, width?: number }, minorTickCount?: number | undefined, minorTickInterval?: number | TimeInterval | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }, minValueMargin?: number | undefined, minVisualRangeLength?: number | TimeInterval | undefined | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }, offset?: number | undefined, opacity?: number | undefined, placeholderSize?: number, position?: Position, singleWorkdays?: Array<Date | string> | Array<number>, strips?: { color?: string | undefined, endValue?: Date | number | string | undefined, label?: { font?: Font, horizontalAlignment?: HorizontalAlignment, text?: string | undefined, verticalAlignment?: VerticalAlignment }, paddingLeftRight?: number, paddingTopBottom?: number, startValue?: Date | number | string | undefined }[], stripStyle?: { label?: { font?: Font, horizontalAlignment?: HorizontalAlignment, verticalAlignment?: VerticalAlignment }, paddingLeftRight?: number, paddingTopBottom?: number }, tick?: { color?: string, length?: number, opacity?: number | undefined, shift?: number, visible?: boolean, width?: number }, tickInterval?: number | TimeInterval | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }, title?: string | { alignment?: HorizontalAlignment, font?: Font, margin?: number, text?: string | undefined, textOverflow?: TextOverflow, wordWrap?: WordWrap }, type?: AxisScaleType | undefined, valueMarginsEnabled?: boolean, visible?: boolean, visualRange?: Array<Date | number | string> | CommonChartTypes.VisualRange, visualRangeUpdateMode?: VisualRangeUpdateMode, wholeRange?: Array<Date | number | string> | undefined | CommonChartTypes.VisualRange, width?: number, workdaysOnly?: boolean, workWeek?: Array<number> }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() autoHidePointMarkersChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() barGroupPaddingChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() barGroupWidthChange: EventEmitter<number | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() commonAnnotationSettingsChange: EventEmitter<dxChartCommonAnnotationConfig>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() commonAxisSettingsChange: EventEmitter<{ aggregatedPointsPosition?: AggregatedPointsPosition, allowDecimals?: boolean | undefined, breakStyle?: { color?: string, line?: ScaleBreakLineStyle, width?: number }, color?: string, constantLineStyle?: { color?: string, dashStyle?: DashStyle, label?: { font?: Font, position?: RelativePosition, visible?: boolean }, paddingLeftRight?: number, paddingTopBottom?: number, width?: number }, discreteAxisDivisionMode?: DiscreteAxisDivisionMode, endOnTick?: boolean | undefined, grid?: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }, inverted?: boolean, label?: { alignment?: HorizontalAlignment | undefined, displayMode?: ChartLabelDisplayMode, font?: Font, indentFromAxis?: number, overlappingBehavior?: ChartsAxisLabelOverlap, position?: Position | RelativePosition, rotationAngle?: number, staggeringSpacing?: number, template?: any, textOverflow?: TextOverflow, visible?: boolean, wordWrap?: WordWrap }, maxValueMargin?: number | undefined, minorGrid?: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }, minorTick?: { color?: string, length?: number, opacity?: number, shift?: number, visible?: boolean, width?: number }, minValueMargin?: number | undefined, opacity?: number | undefined, placeholderSize?: number, stripStyle?: { label?: { font?: Font, horizontalAlignment?: HorizontalAlignment, verticalAlignment?: VerticalAlignment }, paddingLeftRight?: number, paddingTopBottom?: number }, tick?: { color?: string, length?: number, opacity?: number | undefined, shift?: number, visible?: boolean, width?: number }, title?: { alignment?: HorizontalAlignment, font?: Font, margin?: number, textOverflow?: TextOverflow, wordWrap?: WordWrap }, valueMarginsEnabled?: boolean, visible?: boolean, width?: number }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() commonPaneSettingsChange: EventEmitter<{ backgroundColor?: ChartsColor | string, border?: { bottom?: boolean, color?: string, dashStyle?: DashStyle, left?: boolean, opacity?: number | undefined, right?: boolean, top?: boolean, visible?: boolean, width?: number } }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() commonSeriesSettingsChange: EventEmitter<{ aggregation?: { calculate?: ((aggregationInfo: chartPointAggregationInfoObject, series: chartSeriesObject) => Record<string, any> | Array<Record<string, any>>) | undefined, enabled?: boolean, method?: ChartSeriesAggregationMethod }, area?: any, argumentField?: string, axis?: string | undefined, bar?: any, barOverlapGroup?: string | undefined, barPadding?: number | undefined, barWidth?: number | undefined, border?: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, bubble?: any, candlestick?: any, closeValueField?: string, color?: ChartsColor | string | undefined, cornerRadius?: number, dashStyle?: DashStyle, fullstackedarea?: any, fullstackedbar?: any, fullstackedline?: any, fullstackedspline?: any, fullstackedsplinearea?: any, highValueField?: string, hoverMode?: SeriesHoverMode, hoverStyle?: { border?: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, dashStyle?: DashStyle, hatching?: { direction?: HatchDirection, opacity?: number, step?: number, width?: number }, highlight?: boolean, width?: number }, ignoreEmptyPoints?: boolean, innerColor?: string, label?: { alignment?: HorizontalAlignment, argumentFormat?: Format | undefined, backgroundColor?: string | undefined, border?: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, connector?: { color?: string | undefined, visible?: boolean, width?: number }, customizeText?: ((pointInfo: any) => string), displayFormat?: string | undefined, font?: Font, format?: Format | undefined, horizontalOffset?: number, position?: RelativePosition, rotationAngle?: number, showForZeroValues?: boolean, verticalOffset?: number, visible?: boolean }, line?: any, lowValueField?: string, maxLabelCount?: number | undefined, minBarSize?: number | undefined, opacity?: number, openValueField?: string, pane?: string, point?: { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, hoverMode?: PointInteractionMode, hoverStyle?: { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, size?: number | undefined }, image?: string | undefined | { height?: number | { rangeMaxPoint?: number | undefined, rangeMinPoint?: number | undefined }, url?: string | undefined | { rangeMaxPoint?: string | undefined, rangeMinPoint?: string | undefined }, width?: number | { rangeMaxPoint?: number | undefined, rangeMinPoint?: number | undefined } }, selectionMode?: PointInteractionMode, selectionStyle?: { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, size?: number | undefined }, size?: number, symbol?: PointSymbol, visible?: boolean }, rangearea?: any, rangebar?: any, rangeValue1Field?: string, rangeValue2Field?: string, reduction?: { color?: string, level?: FinancialChartReductionLevel }, scatter?: any, selectionMode?: SeriesSelectionMode, selectionStyle?: { border?: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, dashStyle?: DashStyle, hatching?: { direction?: HatchDirection, opacity?: number, step?: number, width?: number }, highlight?: boolean, width?: number }, showInLegend?: boolean, sizeField?: string, spline?: any, splinearea?: any, stack?: string, stackedarea?: any, stackedbar?: any, stackedline?: any, stackedspline?: any, stackedsplinearea?: any, steparea?: any, stepline?: any, stock?: any, tagField?: string, type?: SeriesType, valueErrorBar?: { color?: string, displayMode?: ValueErrorBarDisplayMode, edgeLength?: number, highValueField?: string | undefined, lineWidth?: number, lowValueField?: string | undefined, opacity?: number | undefined, type?: undefined | ValueErrorBarType, value?: number }, valueField?: string, visible?: boolean, width?: number }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() containerBackgroundColorChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() crosshairChange: EventEmitter<{ color?: string, dashStyle?: DashStyle, enabled?: boolean, horizontalLine?: boolean | { color?: string, dashStyle?: DashStyle, label?: { backgroundColor?: string, customizeText?: ((info: { point: chartPointObject, value: Date | number | string, valueText: string }) => string), font?: Font, format?: Format | undefined, visible?: boolean }, opacity?: number | undefined, visible?: boolean, width?: number }, label?: { backgroundColor?: string, customizeText?: ((info: { point: chartPointObject, value: Date | number | string, valueText: string }) => string), font?: Font, format?: Format | undefined, visible?: boolean }, opacity?: number | undefined, verticalLine?: boolean | { color?: string, dashStyle?: DashStyle, label?: { backgroundColor?: string, customizeText?: ((info: { point: chartPointObject, value: Date | number | string, valueText: string }) => string), font?: Font, format?: Format | undefined, visible?: boolean }, opacity?: number | undefined, visible?: boolean, width?: number }, width?: number }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() customizeAnnotationChange: EventEmitter<((annotation: dxChartAnnotationConfig | any) => dxChartAnnotationConfig) | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() customizeLabelChange: EventEmitter<((pointInfo: any) => SeriesLabel)>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() customizePointChange: EventEmitter<((pointInfo: any) => SeriesPoint)>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() dataPrepareSettingsChange: EventEmitter<{ checkTypeForAllData?: boolean, convertToAxisDataType?: boolean, sortingMethod?: boolean | ((a: any, b: any) => number) }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() dataSourceChange: EventEmitter<Array<any> | DataSource | DataSourceOptions | null | Store | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() defaultPaneChange: EventEmitter<string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() disabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() elementAttrChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() exportChange: EventEmitter<{ backgroundColor?: string, enabled?: boolean, fileName?: string, formats?: Array<ExportFormat>, margin?: number, printingEnabled?: boolean, svgToCanvas?: ((svg: any, canvas: any) => any) | undefined }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() legendChange: EventEmitter<{ backgroundColor?: string | undefined, border?: { color?: string, cornerRadius?: number, dashStyle?: DashStyle, opacity?: number | undefined, visible?: boolean, width?: number }, columnCount?: number, columnItemSpacing?: number, customizeHint?: ((seriesInfo: { seriesColor: string, seriesIndex: number, seriesName: any }) => string), customizeItems?: ((items: Array<LegendItem>) => Array<LegendItem>), customizeText?: ((seriesInfo: { seriesColor: string, seriesIndex: number, seriesName: any }) => string), font?: Font, horizontalAlignment?: HorizontalAlignment, hoverMode?: LegendHoverMode, itemsAlignment?: HorizontalAlignment | undefined, itemTextPosition?: Position | undefined, margin?: number | { bottom?: number, left?: number, right?: number, top?: number }, markerSize?: number, markerTemplate?: any, orientation?: Orientation | undefined, paddingLeftRight?: number, paddingTopBottom?: number, position?: RelativePosition, rowCount?: number, rowItemSpacing?: number, title?: string | { font?: Font, horizontalAlignment?: HorizontalAlignment | undefined, margin?: { bottom?: number, left?: number, right?: number, top?: number }, placeholderSize?: number | undefined, subtitle?: string | { font?: Font, offset?: number, text?: string }, text?: string, verticalAlignment?: VerticalEdge }, verticalAlignment?: VerticalEdge, visible?: boolean }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() loadingIndicatorChange: EventEmitter<{ backgroundColor?: string, enabled?: boolean, font?: Font, show?: boolean, text?: string }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() marginChange: EventEmitter<{ bottom?: number, left?: number, right?: number, top?: number }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() maxBubbleSizeChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() minBubbleSizeChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() negativesAsZeroesChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() paletteChange: EventEmitter<Array<string> | Palette>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() paletteExtensionModeChange: EventEmitter<PaletteExtensionMode>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() panesChange: EventEmitter<{ backgroundColor?: ChartsColor | string, border?: { bottom?: boolean, color?: string, dashStyle?: DashStyle, left?: boolean, opacity?: number | undefined, right?: boolean, top?: boolean, visible?: boolean, width?: number }, height?: number | string | undefined, name?: string | undefined }[]>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() pathModifiedChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() pointSelectionModeChange: EventEmitter<SingleOrMultiple>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() redrawOnResizeChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() resizePanesOnZoomChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() resolveLabelOverlappingChange: EventEmitter<ChartsLabelOverlap>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() rotatedChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() rtlEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() scrollBarChange: EventEmitter<{ color?: string, offset?: number, opacity?: number | undefined, position?: Position, visible?: boolean, width?: number }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() seriesChange: EventEmitter<Array<ChartSeries> | ChartSeries | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() seriesSelectionModeChange: EventEmitter<SingleOrMultiple>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() seriesTemplateChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() sizeChange: EventEmitter<{ height?: number | undefined, width?: number | undefined }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() stickyHoveringChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() synchronizeMultiAxesChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() themeChange: EventEmitter<Theme>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() titleChange: EventEmitter<string | { font?: Font, horizontalAlignment?: HorizontalAlignment, margin?: number | { bottom?: number, left?: number, right?: number, top?: number }, placeholderSize?: number | undefined, subtitle?: string | { font?: Font, offset?: number, text?: string, textOverflow?: TextOverflow, wordWrap?: WordWrap }, text?: string, textOverflow?: TextOverflow, verticalAlignment?: VerticalEdge, wordWrap?: WordWrap }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() tooltipChange: EventEmitter<{ argumentFormat?: Format | undefined, arrowLength?: number, border?: { color?: string, dashStyle?: DashStyle, opacity?: number | undefined, visible?: boolean, width?: number }, color?: string, container?: any | string | undefined, contentTemplate?: any, cornerRadius?: number, customizeTooltip?: ((pointInfo: any) => Record<string, any>) | undefined, enabled?: boolean, font?: Font, format?: Format | undefined, interactive?: boolean, location?: ChartTooltipLocation, opacity?: number | undefined, paddingLeftRight?: number, paddingTopBottom?: number, shadow?: { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number }, shared?: boolean, zIndex?: number | undefined }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() valueAxisChange: EventEmitter<{ aggregatedPointsPosition?: AggregatedPointsPosition, allowDecimals?: boolean | undefined, autoBreaksEnabled?: boolean, axisDivisionFactor?: number, breaks?: Array<ScaleBreak> | { endValue?: Date | number | string | undefined, startValue?: Date | number | string | undefined }[], breakStyle?: { color?: string, line?: ScaleBreakLineStyle, width?: number }, categories?: Array<Date | number | string>, color?: string, constantLines?: { color?: string, dashStyle?: DashStyle, displayBehindSeries?: boolean, extendAxis?: boolean, label?: { font?: Font, horizontalAlignment?: HorizontalAlignment, position?: RelativePosition, text?: string | undefined, verticalAlignment?: VerticalAlignment, visible?: boolean }, paddingLeftRight?: number, paddingTopBottom?: number, value?: Date | number | string | undefined, width?: number }[], constantLineStyle?: { color?: string, dashStyle?: DashStyle, label?: { font?: Font, horizontalAlignment?: HorizontalAlignment, position?: RelativePosition, verticalAlignment?: VerticalAlignment, visible?: boolean }, paddingLeftRight?: number, paddingTopBottom?: number, width?: number }, customPosition?: Date | number | string | undefined, discreteAxisDivisionMode?: DiscreteAxisDivisionMode, endOnTick?: boolean | undefined, grid?: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }, inverted?: boolean, label?: { alignment?: HorizontalAlignment | undefined, customizeHint?: ((axisValue: { value: Date | number | string, valueText: string }) => string), customizeText?: ((axisValue: { value: Date | number | string, valueText: string }) => string), displayMode?: ChartLabelDisplayMode, font?: Font, format?: Format | undefined, indentFromAxis?: number, overlappingBehavior?: ChartsAxisLabelOverlap, position?: Position | RelativePosition, rotationAngle?: number, staggeringSpacing?: number, template?: any, textOverflow?: TextOverflow, visible?: boolean, wordWrap?: WordWrap }, linearThreshold?: number | undefined, logarithmBase?: number, maxAutoBreakCount?: number, maxValueMargin?: number | undefined, minorGrid?: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }, minorTick?: { color?: string, length?: number, opacity?: number, shift?: number, visible?: boolean, width?: number }, minorTickCount?: number | undefined, minorTickInterval?: number | TimeInterval | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }, minValueMargin?: number | undefined, minVisualRangeLength?: number | TimeInterval | undefined | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }, multipleAxesSpacing?: number, name?: string | undefined, offset?: number | undefined, opacity?: number | undefined, pane?: string | undefined, placeholderSize?: number, position?: Position, showZero?: boolean | undefined, strips?: { color?: string | undefined, endValue?: Date | number | string | undefined, label?: { font?: Font, horizontalAlignment?: HorizontalAlignment, text?: string | undefined, verticalAlignment?: VerticalAlignment }, paddingLeftRight?: number, paddingTopBottom?: number, startValue?: Date | number | string | undefined }[], stripStyle?: { label?: { font?: Font, horizontalAlignment?: HorizontalAlignment, verticalAlignment?: VerticalAlignment }, paddingLeftRight?: number, paddingTopBottom?: number }, synchronizedValue?: number | undefined, tick?: { color?: string, length?: number, opacity?: number | undefined, shift?: number, visible?: boolean, width?: number }, tickInterval?: number | TimeInterval | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }, title?: string | { alignment?: HorizontalAlignment, font?: Font, margin?: number, text?: string | undefined, textOverflow?: TextOverflow, wordWrap?: WordWrap }, type?: AxisScaleType | undefined, valueMarginsEnabled?: boolean, valueType?: ChartsDataType | undefined, visible?: boolean, visualRange?: Array<Date | number | string> | CommonChartTypes.VisualRange, visualRangeUpdateMode?: VisualRangeUpdateMode, wholeRange?: Array<Date | number | string> | undefined | CommonChartTypes.VisualRange, width?: number }[]>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() zoomAndPanChange: EventEmitter<{ allowMouseWheel?: boolean, allowTouchGestures?: boolean, argumentAxis?: ChartZoomAndPanMode, dragBoxStyle?: { color?: string | undefined, opacity?: number | undefined }, dragToZoom?: boolean, panKey?: EventKeyModifier, valueAxis?: ChartZoomAndPanMode }>;




    @ContentChildren(DxiChartAnnotationComponent)
    get annotationsChildren(): QueryList<DxiChartAnnotationComponent> {
        return this._getOption('annotations');
    }
    set annotationsChildren(value) {
        this._setChildren('annotations', value, 'DxiChartAnnotationComponent');
    }

    @ContentChildren(DxiChartPaneComponent)
    get panesChildren(): QueryList<DxiChartPaneComponent> {
        return this._getOption('panes');
    }
    set panesChildren(value) {
        this._setChildren('panes', value, 'DxiChartPaneComponent');
    }

    @ContentChildren(DxiChartSeriesComponent)
    get seriesChildren(): QueryList<DxiChartSeriesComponent> {
        return this._getOption('series');
    }
    set seriesChildren(value) {
        this._setChildren('series', value, 'DxiChartSeriesComponent');
    }

    @ContentChildren(DxiChartValueAxisComponent)
    get valueAxesChildren(): QueryList<DxiChartValueAxisComponent> {
        return this._getOption('valueAxis');
    }
    set valueAxesChildren(value) {
        this._setChildren('valueAxis', value, 'DxiChartValueAxisComponent');
    }


    @ContentChildren(DxiAnnotationComponent)
    get annotationsLegacyChildren(): QueryList<DxiAnnotationComponent> {
        return this._getOption('annotations');
    }
    set annotationsLegacyChildren(value) {
        this._setChildren('annotations', value, 'DxiAnnotationComponent');
    }

    @ContentChildren(DxiPaneComponent)
    get panesLegacyChildren(): QueryList<DxiPaneComponent> {
        return this._getOption('panes');
    }
    set panesLegacyChildren(value) {
        this._setChildren('panes', value, 'DxiPaneComponent');
    }

    @ContentChildren(DxiSeriesComponent)
    get seriesLegacyChildren(): QueryList<DxiSeriesComponent> {
        return this._getOption('series');
    }
    set seriesLegacyChildren(value) {
        this._setChildren('series', value, 'DxiSeriesComponent');
    }

    @ContentChildren(DxiValueAxisComponent)
    get valueAxisLegacyChildren(): QueryList<DxiValueAxisComponent> {
        return this._getOption('valueAxis');
    }
    set valueAxisLegacyChildren(value) {
        this._setChildren('valueAxis', value, 'DxiValueAxisComponent');
    }




    constructor(elementRef: ElementRef, ngZone: NgZone, templateHost: DxTemplateHost,
            private _watcherHelper: WatcherHelper,
            private _idh: IterableDifferHelper,
            optionHost: NestedOptionHost,
            transferState: TransferState,
            @Inject(PLATFORM_ID) platformId: any) {

        super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);

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

    protected _createInstance(element, options) {

        return new DxChart(element, options);
    }


    ngOnDestroy() {
        this._destroyWidget();
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        this.setupChanges('annotations', changes);
        this.setupChanges('dataSource', changes);
        this.setupChanges('palette', changes);
        this.setupChanges('panes', changes);
        this.setupChanges('series', changes);
        this.setupChanges('valueAxis', changes);
    }

    setupChanges(prop: string, changes: SimpleChanges) {
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

    _setOption(name: string, value: any) {
        let isSetup = this._idh.setupSingle(name, value);
        let isChanged = this._idh.getChanges(name, value) !== null;

        if (isSetup || isChanged) {
            super._setOption(name, value);
        }
    }
}

@NgModule({
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
    DxoChartAdaptiveLayoutModule,
    DxoChartAggregationModule,
    DxoChartAggregationIntervalModule,
    DxoChartAnimationModule,
    DxiChartAnnotationModule,
    DxoChartAnnotationBorderModule,
    DxoChartAnnotationImageModule,
    DxoChartArgumentAxisModule,
    DxoChartArgumentFormatModule,
    DxoChartAxisConstantLineStyleModule,
    DxoChartAxisConstantLineStyleLabelModule,
    DxoChartAxisLabelModule,
    DxoChartAxisTitleModule,
    DxoChartBackgroundColorModule,
    DxoChartBorderModule,
    DxiChartBreakModule,
    DxoChartBreakStyleModule,
    DxoChartChartTitleModule,
    DxoChartChartTitleSubtitleModule,
    DxoChartColorModule,
    DxoChartCommonAnnotationSettingsModule,
    DxoChartCommonAxisSettingsModule,
    DxoChartCommonAxisSettingsConstantLineStyleModule,
    DxoChartCommonAxisSettingsConstantLineStyleLabelModule,
    DxoChartCommonAxisSettingsLabelModule,
    DxoChartCommonAxisSettingsTitleModule,
    DxoChartCommonPaneSettingsModule,
    DxoChartCommonSeriesSettingsModule,
    DxoChartCommonSeriesSettingsHoverStyleModule,
    DxoChartCommonSeriesSettingsLabelModule,
    DxoChartCommonSeriesSettingsSelectionStyleModule,
    DxoChartConnectorModule,
    DxiChartConstantLineModule,
    DxoChartConstantLineLabelModule,
    DxoChartConstantLineStyleModule,
    DxoChartCrosshairModule,
    DxoChartDataPrepareSettingsModule,
    DxoChartDragBoxStyleModule,
    DxoChartExportModule,
    DxoChartFontModule,
    DxoChartFormatModule,
    DxoChartGridModule,
    DxoChartHatchingModule,
    DxoChartHeightModule,
    DxoChartHorizontalLineModule,
    DxoChartHorizontalLineLabelModule,
    DxoChartHoverStyleModule,
    DxoChartImageModule,
    DxoChartLabelModule,
    DxoChartLegendModule,
    DxoChartLegendTitleModule,
    DxoChartLegendTitleSubtitleModule,
    DxoChartLengthModule,
    DxoChartLoadingIndicatorModule,
    DxoChartMarginModule,
    DxoChartMinorGridModule,
    DxoChartMinorTickModule,
    DxoChartMinorTickIntervalModule,
    DxoChartMinVisualRangeLengthModule,
    DxiChartPaneModule,
    DxoChartPaneBorderModule,
    DxoChartPointModule,
    DxoChartPointBorderModule,
    DxoChartPointHoverStyleModule,
    DxoChartPointImageModule,
    DxoChartPointSelectionStyleModule,
    DxoChartReductionModule,
    DxoChartScrollBarModule,
    DxoChartSelectionStyleModule,
    DxiChartSeriesModule,
    DxoChartSeriesBorderModule,
    DxoChartSeriesTemplateModule,
    DxoChartShadowModule,
    DxoChartSizeModule,
    DxiChartStripModule,
    DxoChartStripLabelModule,
    DxoChartStripStyleModule,
    DxoChartStripStyleLabelModule,
    DxoChartSubtitleModule,
    DxoChartTickModule,
    DxoChartTickIntervalModule,
    DxoChartTitleModule,
    DxoChartTooltipModule,
    DxoChartTooltipBorderModule,
    DxoChartUrlModule,
    DxiChartValueAxisModule,
    DxoChartValueErrorBarModule,
    DxoChartVerticalLineModule,
    DxoChartVisualRangeModule,
    DxoChartWholeRangeModule,
    DxoChartWidthModule,
    DxoChartZoomAndPanModule,
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
    DxoChartAdaptiveLayoutModule,
    DxoChartAggregationModule,
    DxoChartAggregationIntervalModule,
    DxoChartAnimationModule,
    DxiChartAnnotationModule,
    DxoChartAnnotationBorderModule,
    DxoChartAnnotationImageModule,
    DxoChartArgumentAxisModule,
    DxoChartArgumentFormatModule,
    DxoChartAxisConstantLineStyleModule,
    DxoChartAxisConstantLineStyleLabelModule,
    DxoChartAxisLabelModule,
    DxoChartAxisTitleModule,
    DxoChartBackgroundColorModule,
    DxoChartBorderModule,
    DxiChartBreakModule,
    DxoChartBreakStyleModule,
    DxoChartChartTitleModule,
    DxoChartChartTitleSubtitleModule,
    DxoChartColorModule,
    DxoChartCommonAnnotationSettingsModule,
    DxoChartCommonAxisSettingsModule,
    DxoChartCommonAxisSettingsConstantLineStyleModule,
    DxoChartCommonAxisSettingsConstantLineStyleLabelModule,
    DxoChartCommonAxisSettingsLabelModule,
    DxoChartCommonAxisSettingsTitleModule,
    DxoChartCommonPaneSettingsModule,
    DxoChartCommonSeriesSettingsModule,
    DxoChartCommonSeriesSettingsHoverStyleModule,
    DxoChartCommonSeriesSettingsLabelModule,
    DxoChartCommonSeriesSettingsSelectionStyleModule,
    DxoChartConnectorModule,
    DxiChartConstantLineModule,
    DxoChartConstantLineLabelModule,
    DxoChartConstantLineStyleModule,
    DxoChartCrosshairModule,
    DxoChartDataPrepareSettingsModule,
    DxoChartDragBoxStyleModule,
    DxoChartExportModule,
    DxoChartFontModule,
    DxoChartFormatModule,
    DxoChartGridModule,
    DxoChartHatchingModule,
    DxoChartHeightModule,
    DxoChartHorizontalLineModule,
    DxoChartHorizontalLineLabelModule,
    DxoChartHoverStyleModule,
    DxoChartImageModule,
    DxoChartLabelModule,
    DxoChartLegendModule,
    DxoChartLegendTitleModule,
    DxoChartLegendTitleSubtitleModule,
    DxoChartLengthModule,
    DxoChartLoadingIndicatorModule,
    DxoChartMarginModule,
    DxoChartMinorGridModule,
    DxoChartMinorTickModule,
    DxoChartMinorTickIntervalModule,
    DxoChartMinVisualRangeLengthModule,
    DxiChartPaneModule,
    DxoChartPaneBorderModule,
    DxoChartPointModule,
    DxoChartPointBorderModule,
    DxoChartPointHoverStyleModule,
    DxoChartPointImageModule,
    DxoChartPointSelectionStyleModule,
    DxoChartReductionModule,
    DxoChartScrollBarModule,
    DxoChartSelectionStyleModule,
    DxiChartSeriesModule,
    DxoChartSeriesBorderModule,
    DxoChartSeriesTemplateModule,
    DxoChartShadowModule,
    DxoChartSizeModule,
    DxiChartStripModule,
    DxoChartStripLabelModule,
    DxoChartStripStyleModule,
    DxoChartStripStyleLabelModule,
    DxoChartSubtitleModule,
    DxoChartTickModule,
    DxoChartTickIntervalModule,
    DxoChartTitleModule,
    DxoChartTooltipModule,
    DxoChartTooltipBorderModule,
    DxoChartUrlModule,
    DxiChartValueAxisModule,
    DxoChartValueErrorBarModule,
    DxoChartVerticalLineModule,
    DxoChartVisualRangeModule,
    DxoChartWholeRangeModule,
    DxoChartWidthModule,
    DxoChartZoomAndPanModule,
    DxTemplateModule
  ]
})
export class DxChartModule { }

import type * as DxChartTypes from "devextreme/viz/chart_types";
export { DxChartTypes };


