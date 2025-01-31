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
import { AnimationEaseMode, ChartsDataType, DashStyle, Font, DiscreteAxisDivisionMode, ArgumentAxisHoverMode, LabelOverlap, TimeInterval, AxisScaleType, ChartsColor, SeriesHoverMode, HatchDirection, RelativePosition, PointInteractionMode, PointSymbol, SeriesSelectionMode, ValueErrorBarDisplayMode, ValueErrorBarType, SeriesLabel, SeriesPoint, LegendItem, LegendHoverMode, Palette, PaletteExtensionMode, Theme, TextOverflow, WordWrap } from 'devextreme/common/charts';
import { dxPolarChartAnnotationConfig, dxPolarChartCommonAnnotationConfig, PolarChartSeriesType, ArgumentAxisClickEvent, DisposingEvent, DoneEvent, DrawnEvent, ExportedEvent, ExportingEvent, FileSavingEvent, IncidentOccurredEvent, InitializedEvent, LegendClickEvent, OptionChangedEvent, PointClickEvent, PointHoverChangedEvent, PointSelectionChangedEvent, SeriesClickEvent, SeriesHoverChangedEvent, SeriesSelectionChangedEvent, TooltipHiddenEvent, TooltipShownEvent, ZoomEndEvent, ZoomStartEvent, PolarChartSeries, ValueAxisVisualRangeUpdateMode } from 'devextreme/viz/polar_chart';
import { Format } from 'devextreme/common/core/localization';
import { DataSourceOptions } from 'devextreme/data/data_source';
import { Store } from 'devextreme/data/store';
import { ExportFormat, HorizontalAlignment, Position, Orientation, VerticalEdge, SingleOrMultiple } from 'devextreme/common';

import DxPolarChart from 'devextreme/viz/polar_chart';


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
import { DxiConstantLineModule } from 'devextreme-angular/ui/nested';
import { DxoLabelModule } from 'devextreme-angular/ui/nested';
import { DxoConstantLineStyleModule } from 'devextreme-angular/ui/nested';
import { DxoGridModule } from 'devextreme-angular/ui/nested';
import { DxoFormatModule } from 'devextreme-angular/ui/nested';
import { DxoMinorGridModule } from 'devextreme-angular/ui/nested';
import { DxoMinorTickModule } from 'devextreme-angular/ui/nested';
import { DxoMinorTickIntervalModule } from 'devextreme-angular/ui/nested';
import { DxiStripModule } from 'devextreme-angular/ui/nested';
import { DxoStripStyleModule } from 'devextreme-angular/ui/nested';
import { DxoTickModule } from 'devextreme-angular/ui/nested';
import { DxoTickIntervalModule } from 'devextreme-angular/ui/nested';
import { DxoCommonAnnotationSettingsModule } from 'devextreme-angular/ui/nested';
import { DxoCommonAxisSettingsModule } from 'devextreme-angular/ui/nested';
import { DxoCommonSeriesSettingsModule } from 'devextreme-angular/ui/nested';
import { DxoAreaModule } from 'devextreme-angular/ui/nested';
import { DxoHoverStyleModule } from 'devextreme-angular/ui/nested';
import { DxoHatchingModule } from 'devextreme-angular/ui/nested';
import { DxoConnectorModule } from 'devextreme-angular/ui/nested';
import { DxoPointModule } from 'devextreme-angular/ui/nested';
import { DxoSelectionStyleModule } from 'devextreme-angular/ui/nested';
import { DxoValueErrorBarModule } from 'devextreme-angular/ui/nested';
import { DxoBarModule } from 'devextreme-angular/ui/nested';
import { DxoColorModule } from 'devextreme-angular/ui/nested';
import { DxoArgumentFormatModule } from 'devextreme-angular/ui/nested';
import { DxoLineModule } from 'devextreme-angular/ui/nested';
import { DxoScatterModule } from 'devextreme-angular/ui/nested';
import { DxoStackedbarModule } from 'devextreme-angular/ui/nested';
import { DxoDataPrepareSettingsModule } from 'devextreme-angular/ui/nested';
import { DxoExportModule } from 'devextreme-angular/ui/nested';
import { DxoLegendModule } from 'devextreme-angular/ui/nested';
import { DxoMarginModule } from 'devextreme-angular/ui/nested';
import { DxoTitleModule } from 'devextreme-angular/ui/nested';
import { DxoSubtitleModule } from 'devextreme-angular/ui/nested';
import { DxoLoadingIndicatorModule } from 'devextreme-angular/ui/nested';
import { DxiSeriesModule } from 'devextreme-angular/ui/nested';
import { DxoSeriesTemplateModule } from 'devextreme-angular/ui/nested';
import { DxoSizeModule } from 'devextreme-angular/ui/nested';
import { DxoTooltipModule } from 'devextreme-angular/ui/nested';
import { DxoValueAxisModule } from 'devextreme-angular/ui/nested';
import { DxoMinVisualRangeLengthModule } from 'devextreme-angular/ui/nested';

import { DxoPolarChartAdaptiveLayoutModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartAnimationModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxiPolarChartAnnotationModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartAnnotationBorderModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartArgumentAxisModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartArgumentAxisMinorTickModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartArgumentAxisTickModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartArgumentFormatModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartAxisLabelModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartBorderModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartColorModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartCommonAnnotationSettingsModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartCommonAxisSettingsModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartCommonAxisSettingsLabelModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartCommonAxisSettingsMinorTickModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartCommonAxisSettingsTickModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartCommonSeriesSettingsModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartCommonSeriesSettingsHoverStyleModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartCommonSeriesSettingsLabelModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartCommonSeriesSettingsSelectionStyleModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartConnectorModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxiPolarChartConstantLineModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartConstantLineLabelModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartConstantLineStyleModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartConstantLineStyleLabelModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartDataPrepareSettingsModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartExportModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartFontModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartFormatModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartGridModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartHatchingModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartHoverStyleModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartImageModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartLabelModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartLegendModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartLegendTitleModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartLegendTitleSubtitleModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartLengthModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartLoadingIndicatorModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartMarginModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartMinorGridModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartMinorTickModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartMinorTickIntervalModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartMinVisualRangeLengthModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartPointModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartPointBorderModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartPointHoverStyleModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartPointSelectionStyleModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartPolarChartTitleModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartPolarChartTitleSubtitleModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartSelectionStyleModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxiPolarChartSeriesModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartSeriesBorderModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartSeriesTemplateModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartShadowModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartSizeModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxiPolarChartStripModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartStripLabelModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartStripStyleModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartStripStyleLabelModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartSubtitleModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartTickModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartTickIntervalModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartTitleModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartTooltipModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartTooltipBorderModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartValueAxisModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartValueErrorBarModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartVisualRangeModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPolarChartWholeRangeModule } from 'devextreme-angular/ui/polar-chart/nested';

import { DxiAnnotationComponent } from 'devextreme-angular/ui/nested';
import { DxiSeriesComponent } from 'devextreme-angular/ui/nested';

import { DxiPolarChartAnnotationComponent } from 'devextreme-angular/ui/polar-chart/nested';
import { DxiPolarChartSeriesComponent } from 'devextreme-angular/ui/polar-chart/nested';


/**
 * [descr:dxPolarChart]

 */
@Component({
    selector: 'dx-polar-chart',
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
export class DxPolarChartComponent extends DxComponent implements OnDestroy, OnChanges, DoCheck {
    instance: DxPolarChart = null;

    /**
     * [descr:dxPolarChartOptions.adaptiveLayout]
    
     */
    @Input()
    get adaptiveLayout(): { height?: number, keepLabels?: boolean, width?: number } {
        return this._getOption('adaptiveLayout');
    }
    set adaptiveLayout(value: { height?: number, keepLabels?: boolean, width?: number }) {
        this._setOption('adaptiveLayout', value);
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
     * [descr:dxPolarChartOptions.annotations]
    
     */
    @Input()
    get annotations(): Array<any | dxPolarChartAnnotationConfig> {
        return this._getOption('annotations');
    }
    set annotations(value: Array<any | dxPolarChartAnnotationConfig>) {
        this._setOption('annotations', value);
    }


    /**
     * [descr:dxPolarChartOptions.argumentAxis]
    
     */
    @Input()
    get argumentAxis(): { allowDecimals?: boolean | undefined, argumentType?: ChartsDataType | undefined, axisDivisionFactor?: number, categories?: Array<Date | number | string>, color?: string, constantLines?: { color?: string, dashStyle?: DashStyle, displayBehindSeries?: boolean, extendAxis?: boolean, label?: { font?: Font, text?: string | undefined, visible?: boolean }, value?: Date | number | string | undefined, width?: number }[], constantLineStyle?: { color?: string, dashStyle?: DashStyle, label?: { font?: Font, visible?: boolean }, width?: number }, discreteAxisDivisionMode?: DiscreteAxisDivisionMode, endOnTick?: boolean | undefined, firstPointOnStartAngle?: boolean, grid?: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }, hoverMode?: ArgumentAxisHoverMode, inverted?: boolean, label?: { customizeHint?: ((argument: { value: Date | number | string, valueText: string }) => string), customizeText?: ((argument: { value: Date | number | string, valueText: string }) => string), font?: Font, format?: Format | undefined, indentFromAxis?: number, overlappingBehavior?: LabelOverlap, visible?: boolean }, linearThreshold?: number | undefined, logarithmBase?: number, minorGrid?: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }, minorTick?: { color?: string, length?: number, opacity?: number, shift?: number, visible?: boolean, width?: number }, minorTickCount?: number | undefined, minorTickInterval?: number | TimeInterval | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }, opacity?: number | undefined, originValue?: number | undefined, period?: number | undefined, startAngle?: number, strips?: { color?: string | undefined, endValue?: Date | number | string | undefined, label?: { font?: Font, text?: string | undefined }, startValue?: Date | number | string | undefined }[], stripStyle?: { label?: { font?: Font } }, tick?: { color?: string, length?: number, opacity?: number | undefined, shift?: number, visible?: boolean, width?: number }, tickInterval?: number | TimeInterval | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }, type?: AxisScaleType | undefined, visible?: boolean, width?: number } {
        return this._getOption('argumentAxis');
    }
    set argumentAxis(value: { allowDecimals?: boolean | undefined, argumentType?: ChartsDataType | undefined, axisDivisionFactor?: number, categories?: Array<Date | number | string>, color?: string, constantLines?: { color?: string, dashStyle?: DashStyle, displayBehindSeries?: boolean, extendAxis?: boolean, label?: { font?: Font, text?: string | undefined, visible?: boolean }, value?: Date | number | string | undefined, width?: number }[], constantLineStyle?: { color?: string, dashStyle?: DashStyle, label?: { font?: Font, visible?: boolean }, width?: number }, discreteAxisDivisionMode?: DiscreteAxisDivisionMode, endOnTick?: boolean | undefined, firstPointOnStartAngle?: boolean, grid?: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }, hoverMode?: ArgumentAxisHoverMode, inverted?: boolean, label?: { customizeHint?: ((argument: { value: Date | number | string, valueText: string }) => string), customizeText?: ((argument: { value: Date | number | string, valueText: string }) => string), font?: Font, format?: Format | undefined, indentFromAxis?: number, overlappingBehavior?: LabelOverlap, visible?: boolean }, linearThreshold?: number | undefined, logarithmBase?: number, minorGrid?: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }, minorTick?: { color?: string, length?: number, opacity?: number, shift?: number, visible?: boolean, width?: number }, minorTickCount?: number | undefined, minorTickInterval?: number | TimeInterval | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }, opacity?: number | undefined, originValue?: number | undefined, period?: number | undefined, startAngle?: number, strips?: { color?: string | undefined, endValue?: Date | number | string | undefined, label?: { font?: Font, text?: string | undefined }, startValue?: Date | number | string | undefined }[], stripStyle?: { label?: { font?: Font } }, tick?: { color?: string, length?: number, opacity?: number | undefined, shift?: number, visible?: boolean, width?: number }, tickInterval?: number | TimeInterval | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }, type?: AxisScaleType | undefined, visible?: boolean, width?: number }) {
        this._setOption('argumentAxis', value);
    }


    /**
     * [descr:dxPolarChartOptions.barGroupPadding]
    
     */
    @Input()
    get barGroupPadding(): number {
        return this._getOption('barGroupPadding');
    }
    set barGroupPadding(value: number) {
        this._setOption('barGroupPadding', value);
    }


    /**
     * [descr:dxPolarChartOptions.barGroupWidth]
    
     */
    @Input()
    get barGroupWidth(): number | undefined {
        return this._getOption('barGroupWidth');
    }
    set barGroupWidth(value: number | undefined) {
        this._setOption('barGroupWidth', value);
    }


    /**
     * [descr:dxPolarChartOptions.commonAnnotationSettings]
    
     */
    @Input()
    get commonAnnotationSettings(): dxPolarChartCommonAnnotationConfig {
        return this._getOption('commonAnnotationSettings');
    }
    set commonAnnotationSettings(value: dxPolarChartCommonAnnotationConfig) {
        this._setOption('commonAnnotationSettings', value);
    }


    /**
     * [descr:dxPolarChartOptions.commonAxisSettings]
    
     */
    @Input()
    get commonAxisSettings(): { allowDecimals?: boolean | undefined, color?: string, constantLineStyle?: { color?: string, dashStyle?: DashStyle, label?: { font?: Font, visible?: boolean }, width?: number }, discreteAxisDivisionMode?: DiscreteAxisDivisionMode, endOnTick?: boolean | undefined, grid?: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }, inverted?: boolean, label?: { font?: Font, indentFromAxis?: number, overlappingBehavior?: LabelOverlap, visible?: boolean }, minorGrid?: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }, minorTick?: { color?: string, length?: number, opacity?: number, visible?: boolean, width?: number }, opacity?: number | undefined, stripStyle?: { label?: { font?: Font } }, tick?: { color?: string, length?: number, opacity?: number | undefined, visible?: boolean, width?: number }, visible?: boolean, width?: number } {
        return this._getOption('commonAxisSettings');
    }
    set commonAxisSettings(value: { allowDecimals?: boolean | undefined, color?: string, constantLineStyle?: { color?: string, dashStyle?: DashStyle, label?: { font?: Font, visible?: boolean }, width?: number }, discreteAxisDivisionMode?: DiscreteAxisDivisionMode, endOnTick?: boolean | undefined, grid?: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }, inverted?: boolean, label?: { font?: Font, indentFromAxis?: number, overlappingBehavior?: LabelOverlap, visible?: boolean }, minorGrid?: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }, minorTick?: { color?: string, length?: number, opacity?: number, visible?: boolean, width?: number }, opacity?: number | undefined, stripStyle?: { label?: { font?: Font } }, tick?: { color?: string, length?: number, opacity?: number | undefined, visible?: boolean, width?: number }, visible?: boolean, width?: number }) {
        this._setOption('commonAxisSettings', value);
    }


    /**
     * [descr:dxPolarChartOptions.commonSeriesSettings]
    
     */
    @Input()
    get commonSeriesSettings(): { area?: any, argumentField?: string, bar?: any, barPadding?: number | undefined, barWidth?: number | undefined, border?: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, closed?: boolean, color?: ChartsColor | string | undefined, dashStyle?: DashStyle, hoverMode?: SeriesHoverMode, hoverStyle?: { border?: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, dashStyle?: DashStyle, hatching?: { direction?: HatchDirection, opacity?: number, step?: number, width?: number }, highlight?: boolean, width?: number }, ignoreEmptyPoints?: boolean, label?: { argumentFormat?: Format | undefined, backgroundColor?: string | undefined, border?: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, connector?: { color?: string | undefined, visible?: boolean, width?: number }, customizeText?: ((pointInfo: any) => string), displayFormat?: string | undefined, font?: Font, format?: Format | undefined, position?: RelativePosition, rotationAngle?: number, showForZeroValues?: boolean, visible?: boolean }, line?: any, maxLabelCount?: number | undefined, minBarSize?: number | undefined, opacity?: number, point?: { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, hoverMode?: PointInteractionMode, hoverStyle?: { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, size?: number }, image?: string | undefined | { height?: number, url?: string | undefined, width?: number }, selectionMode?: PointInteractionMode, selectionStyle?: { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, size?: number }, size?: number, symbol?: PointSymbol, visible?: boolean }, scatter?: any, selectionMode?: SeriesSelectionMode, selectionStyle?: { border?: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, dashStyle?: DashStyle, hatching?: { direction?: HatchDirection, opacity?: number, step?: number, width?: number }, highlight?: boolean, width?: number }, showInLegend?: boolean, stack?: string, stackedbar?: any, tagField?: string, type?: PolarChartSeriesType, valueErrorBar?: { color?: string, displayMode?: ValueErrorBarDisplayMode, edgeLength?: number, highValueField?: string | undefined, lineWidth?: number, lowValueField?: string | undefined, opacity?: number | undefined, type?: undefined | ValueErrorBarType, value?: number }, valueField?: string, visible?: boolean, width?: number } {
        return this._getOption('commonSeriesSettings');
    }
    set commonSeriesSettings(value: { area?: any, argumentField?: string, bar?: any, barPadding?: number | undefined, barWidth?: number | undefined, border?: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, closed?: boolean, color?: ChartsColor | string | undefined, dashStyle?: DashStyle, hoverMode?: SeriesHoverMode, hoverStyle?: { border?: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, dashStyle?: DashStyle, hatching?: { direction?: HatchDirection, opacity?: number, step?: number, width?: number }, highlight?: boolean, width?: number }, ignoreEmptyPoints?: boolean, label?: { argumentFormat?: Format | undefined, backgroundColor?: string | undefined, border?: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, connector?: { color?: string | undefined, visible?: boolean, width?: number }, customizeText?: ((pointInfo: any) => string), displayFormat?: string | undefined, font?: Font, format?: Format | undefined, position?: RelativePosition, rotationAngle?: number, showForZeroValues?: boolean, visible?: boolean }, line?: any, maxLabelCount?: number | undefined, minBarSize?: number | undefined, opacity?: number, point?: { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, hoverMode?: PointInteractionMode, hoverStyle?: { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, size?: number }, image?: string | undefined | { height?: number, url?: string | undefined, width?: number }, selectionMode?: PointInteractionMode, selectionStyle?: { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, size?: number }, size?: number, symbol?: PointSymbol, visible?: boolean }, scatter?: any, selectionMode?: SeriesSelectionMode, selectionStyle?: { border?: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, dashStyle?: DashStyle, hatching?: { direction?: HatchDirection, opacity?: number, step?: number, width?: number }, highlight?: boolean, width?: number }, showInLegend?: boolean, stack?: string, stackedbar?: any, tagField?: string, type?: PolarChartSeriesType, valueErrorBar?: { color?: string, displayMode?: ValueErrorBarDisplayMode, edgeLength?: number, highValueField?: string | undefined, lineWidth?: number, lowValueField?: string | undefined, opacity?: number | undefined, type?: undefined | ValueErrorBarType, value?: number }, valueField?: string, visible?: boolean, width?: number }) {
        this._setOption('commonSeriesSettings', value);
    }


    /**
     * [descr:dxPolarChartOptions.containerBackgroundColor]
    
     */
    @Input()
    get containerBackgroundColor(): string {
        return this._getOption('containerBackgroundColor');
    }
    set containerBackgroundColor(value: string) {
        this._setOption('containerBackgroundColor', value);
    }


    /**
     * [descr:dxPolarChartOptions.customizeAnnotation]
    
     */
    @Input()
    get customizeAnnotation(): ((annotation: dxPolarChartAnnotationConfig | any) => dxPolarChartAnnotationConfig) | undefined {
        return this._getOption('customizeAnnotation');
    }
    set customizeAnnotation(value: ((annotation: dxPolarChartAnnotationConfig | any) => dxPolarChartAnnotationConfig) | undefined) {
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
     * [descr:dxPolarChartOptions.dataPrepareSettings]
    
     */
    @Input()
    get dataPrepareSettings(): { checkTypeForAllData?: boolean, convertToAxisDataType?: boolean, sortingMethod?: boolean | ((a: { arg: Date | number | string, val: Date | number | string }, b: { arg: Date | number | string, val: Date | number | string }) => number) } {
        return this._getOption('dataPrepareSettings');
    }
    set dataPrepareSettings(value: { checkTypeForAllData?: boolean, convertToAxisDataType?: boolean, sortingMethod?: boolean | ((a: { arg: Date | number | string, val: Date | number | string }, b: { arg: Date | number | string, val: Date | number | string }) => number) }) {
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
     * [descr:dxPolarChartOptions.legend]
    
     */
    @Input()
    get legend(): { backgroundColor?: string | undefined, border?: { color?: string, cornerRadius?: number, dashStyle?: DashStyle, opacity?: number | undefined, visible?: boolean, width?: number }, columnCount?: number, columnItemSpacing?: number, customizeHint?: ((seriesInfo: { seriesColor: string, seriesIndex: number, seriesName: any }) => string), customizeItems?: ((items: Array<LegendItem>) => Array<LegendItem>), customizeText?: ((seriesInfo: { seriesColor: string, seriesIndex: number, seriesName: any }) => string), font?: Font, horizontalAlignment?: HorizontalAlignment, hoverMode?: LegendHoverMode, itemsAlignment?: HorizontalAlignment | undefined, itemTextPosition?: Position | undefined, margin?: number | { bottom?: number, left?: number, right?: number, top?: number }, markerSize?: number, markerTemplate?: any, orientation?: Orientation | undefined, paddingLeftRight?: number, paddingTopBottom?: number, rowCount?: number, rowItemSpacing?: number, title?: string | { font?: Font, horizontalAlignment?: HorizontalAlignment | undefined, margin?: { bottom?: number, left?: number, right?: number, top?: number }, placeholderSize?: number | undefined, subtitle?: string | { font?: Font, offset?: number, text?: string }, text?: string, verticalAlignment?: VerticalEdge }, verticalAlignment?: VerticalEdge, visible?: boolean } {
        return this._getOption('legend');
    }
    set legend(value: { backgroundColor?: string | undefined, border?: { color?: string, cornerRadius?: number, dashStyle?: DashStyle, opacity?: number | undefined, visible?: boolean, width?: number }, columnCount?: number, columnItemSpacing?: number, customizeHint?: ((seriesInfo: { seriesColor: string, seriesIndex: number, seriesName: any }) => string), customizeItems?: ((items: Array<LegendItem>) => Array<LegendItem>), customizeText?: ((seriesInfo: { seriesColor: string, seriesIndex: number, seriesName: any }) => string), font?: Font, horizontalAlignment?: HorizontalAlignment, hoverMode?: LegendHoverMode, itemsAlignment?: HorizontalAlignment | undefined, itemTextPosition?: Position | undefined, margin?: number | { bottom?: number, left?: number, right?: number, top?: number }, markerSize?: number, markerTemplate?: any, orientation?: Orientation | undefined, paddingLeftRight?: number, paddingTopBottom?: number, rowCount?: number, rowItemSpacing?: number, title?: string | { font?: Font, horizontalAlignment?: HorizontalAlignment | undefined, margin?: { bottom?: number, left?: number, right?: number, top?: number }, placeholderSize?: number | undefined, subtitle?: string | { font?: Font, offset?: number, text?: string }, text?: string, verticalAlignment?: VerticalEdge }, verticalAlignment?: VerticalEdge, visible?: boolean }) {
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
     * [descr:dxPolarChartOptions.negativesAsZeroes]
    
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
     * [descr:dxPolarChartOptions.resolveLabelOverlapping]
    
     */
    @Input()
    get resolveLabelOverlapping(): LabelOverlap {
        return this._getOption('resolveLabelOverlapping');
    }
    set resolveLabelOverlapping(value: LabelOverlap) {
        this._setOption('resolveLabelOverlapping', value);
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
     * [descr:dxPolarChartOptions.series]
    
     */
    @Input()
    get series(): Array<PolarChartSeries> | PolarChartSeries | undefined {
        return this._getOption('series');
    }
    set series(value: Array<PolarChartSeries> | PolarChartSeries | undefined) {
        this._setOption('series', value);
    }


    /**
     * [descr:dxPolarChartOptions.seriesSelectionMode]
    
     */
    @Input()
    get seriesSelectionMode(): SingleOrMultiple {
        return this._getOption('seriesSelectionMode');
    }
    set seriesSelectionMode(value: SingleOrMultiple) {
        this._setOption('seriesSelectionMode', value);
    }


    /**
     * [descr:dxPolarChartOptions.seriesTemplate]
    
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
     * [descr:dxPolarChartOptions.tooltip]
    
     */
    @Input()
    get tooltip(): { argumentFormat?: Format | undefined, arrowLength?: number, border?: { color?: string, dashStyle?: DashStyle, opacity?: number | undefined, visible?: boolean, width?: number }, color?: string, container?: any | string | undefined, contentTemplate?: any, cornerRadius?: number, customizeTooltip?: ((pointInfo: any) => Record<string, any>) | undefined, enabled?: boolean, font?: Font, format?: Format | undefined, interactive?: boolean, opacity?: number | undefined, paddingLeftRight?: number, paddingTopBottom?: number, shadow?: { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number }, shared?: boolean, zIndex?: number | undefined } {
        return this._getOption('tooltip');
    }
    set tooltip(value: { argumentFormat?: Format | undefined, arrowLength?: number, border?: { color?: string, dashStyle?: DashStyle, opacity?: number | undefined, visible?: boolean, width?: number }, color?: string, container?: any | string | undefined, contentTemplate?: any, cornerRadius?: number, customizeTooltip?: ((pointInfo: any) => Record<string, any>) | undefined, enabled?: boolean, font?: Font, format?: Format | undefined, interactive?: boolean, opacity?: number | undefined, paddingLeftRight?: number, paddingTopBottom?: number, shadow?: { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number }, shared?: boolean, zIndex?: number | undefined }) {
        this._setOption('tooltip', value);
    }


    /**
     * [descr:dxPolarChartOptions.useSpiderWeb]
    
     */
    @Input()
    get useSpiderWeb(): boolean {
        return this._getOption('useSpiderWeb');
    }
    set useSpiderWeb(value: boolean) {
        this._setOption('useSpiderWeb', value);
    }


    /**
     * [descr:dxPolarChartOptions.valueAxis]
    
     */
    @Input()
    get valueAxis(): { allowDecimals?: boolean | undefined, axisDivisionFactor?: number, categories?: Array<Date | number | string>, color?: string, constantLines?: { color?: string, dashStyle?: DashStyle, displayBehindSeries?: boolean, extendAxis?: boolean, label?: { font?: Font, text?: string | undefined, visible?: boolean }, value?: Date | number | string | undefined, width?: number }[], constantLineStyle?: { color?: string, dashStyle?: DashStyle, label?: { font?: Font, visible?: boolean }, width?: number }, discreteAxisDivisionMode?: DiscreteAxisDivisionMode, endOnTick?: boolean, grid?: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }, inverted?: boolean, label?: { customizeHint?: ((axisValue: { value: Date | number | string, valueText: string }) => string), customizeText?: ((axisValue: { value: Date | number | string, valueText: string }) => string), font?: Font, format?: Format | undefined, indentFromAxis?: number, overlappingBehavior?: LabelOverlap, visible?: boolean }, linearThreshold?: number | undefined, logarithmBase?: number, maxValueMargin?: number | undefined, minorGrid?: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }, minorTick?: { color?: string, length?: number, opacity?: number, visible?: boolean, width?: number }, minorTickCount?: number | undefined, minorTickInterval?: number | TimeInterval | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }, minValueMargin?: number | undefined, minVisualRangeLength?: number | TimeInterval | undefined | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }, opacity?: number | undefined, showZero?: boolean | undefined, strips?: { color?: string | undefined, endValue?: Date | number | string | undefined, label?: { font?: Font, text?: string | undefined }, startValue?: Date | number | string | undefined }[], stripStyle?: { label?: { font?: Font } }, tick?: { color?: string, length?: number, opacity?: number | undefined, visible?: boolean, width?: number }, tickInterval?: number | TimeInterval | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }, type?: AxisScaleType | undefined, valueMarginsEnabled?: boolean, valueType?: ChartsDataType | undefined, visible?: boolean, visualRange?: Array<Date | number | string> | CommonChartTypes.VisualRange, visualRangeUpdateMode?: ValueAxisVisualRangeUpdateMode, wholeRange?: Array<Date | number | string> | undefined | CommonChartTypes.VisualRange, width?: number } {
        return this._getOption('valueAxis');
    }
    set valueAxis(value: { allowDecimals?: boolean | undefined, axisDivisionFactor?: number, categories?: Array<Date | number | string>, color?: string, constantLines?: { color?: string, dashStyle?: DashStyle, displayBehindSeries?: boolean, extendAxis?: boolean, label?: { font?: Font, text?: string | undefined, visible?: boolean }, value?: Date | number | string | undefined, width?: number }[], constantLineStyle?: { color?: string, dashStyle?: DashStyle, label?: { font?: Font, visible?: boolean }, width?: number }, discreteAxisDivisionMode?: DiscreteAxisDivisionMode, endOnTick?: boolean, grid?: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }, inverted?: boolean, label?: { customizeHint?: ((axisValue: { value: Date | number | string, valueText: string }) => string), customizeText?: ((axisValue: { value: Date | number | string, valueText: string }) => string), font?: Font, format?: Format | undefined, indentFromAxis?: number, overlappingBehavior?: LabelOverlap, visible?: boolean }, linearThreshold?: number | undefined, logarithmBase?: number, maxValueMargin?: number | undefined, minorGrid?: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }, minorTick?: { color?: string, length?: number, opacity?: number, visible?: boolean, width?: number }, minorTickCount?: number | undefined, minorTickInterval?: number | TimeInterval | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }, minValueMargin?: number | undefined, minVisualRangeLength?: number | TimeInterval | undefined | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }, opacity?: number | undefined, showZero?: boolean | undefined, strips?: { color?: string | undefined, endValue?: Date | number | string | undefined, label?: { font?: Font, text?: string | undefined }, startValue?: Date | number | string | undefined }[], stripStyle?: { label?: { font?: Font } }, tick?: { color?: string, length?: number, opacity?: number | undefined, visible?: boolean, width?: number }, tickInterval?: number | TimeInterval | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }, type?: AxisScaleType | undefined, valueMarginsEnabled?: boolean, valueType?: ChartsDataType | undefined, visible?: boolean, visualRange?: Array<Date | number | string> | CommonChartTypes.VisualRange, visualRangeUpdateMode?: ValueAxisVisualRangeUpdateMode, wholeRange?: Array<Date | number | string> | undefined | CommonChartTypes.VisualRange, width?: number }) {
        this._setOption('valueAxis', value);
    }

    /**
    
     * [descr:dxPolarChartOptions.onArgumentAxisClick]
    
    
     */
    @Output() onArgumentAxisClick: EventEmitter<ArgumentAxisClickEvent>;

    /**
    
     * [descr:dxPolarChartOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<DisposingEvent>;

    /**
    
     * [descr:dxPolarChartOptions.onDone]
    
    
     */
    @Output() onDone: EventEmitter<DoneEvent>;

    /**
    
     * [descr:dxPolarChartOptions.onDrawn]
    
    
     */
    @Output() onDrawn: EventEmitter<DrawnEvent>;

    /**
    
     * [descr:dxPolarChartOptions.onExported]
    
    
     */
    @Output() onExported: EventEmitter<ExportedEvent>;

    /**
    
     * [descr:dxPolarChartOptions.onExporting]
    
    
     */
    @Output() onExporting: EventEmitter<ExportingEvent>;

    /**
    
     * [descr:dxPolarChartOptions.onFileSaving]
    
    
     */
    @Output() onFileSaving: EventEmitter<FileSavingEvent>;

    /**
    
     * [descr:dxPolarChartOptions.onIncidentOccurred]
    
    
     */
    @Output() onIncidentOccurred: EventEmitter<IncidentOccurredEvent>;

    /**
    
     * [descr:dxPolarChartOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<InitializedEvent>;

    /**
    
     * [descr:dxPolarChartOptions.onLegendClick]
    
    
     */
    @Output() onLegendClick: EventEmitter<LegendClickEvent>;

    /**
    
     * [descr:dxPolarChartOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<OptionChangedEvent>;

    /**
    
     * [descr:dxPolarChartOptions.onPointClick]
    
    
     */
    @Output() onPointClick: EventEmitter<PointClickEvent>;

    /**
    
     * [descr:dxPolarChartOptions.onPointHoverChanged]
    
    
     */
    @Output() onPointHoverChanged: EventEmitter<PointHoverChangedEvent>;

    /**
    
     * [descr:dxPolarChartOptions.onPointSelectionChanged]
    
    
     */
    @Output() onPointSelectionChanged: EventEmitter<PointSelectionChangedEvent>;

    /**
    
     * [descr:dxPolarChartOptions.onSeriesClick]
    
    
     */
    @Output() onSeriesClick: EventEmitter<SeriesClickEvent>;

    /**
    
     * [descr:dxPolarChartOptions.onSeriesHoverChanged]
    
    
     */
    @Output() onSeriesHoverChanged: EventEmitter<SeriesHoverChangedEvent>;

    /**
    
     * [descr:dxPolarChartOptions.onSeriesSelectionChanged]
    
    
     */
    @Output() onSeriesSelectionChanged: EventEmitter<SeriesSelectionChangedEvent>;

    /**
    
     * [descr:dxPolarChartOptions.onTooltipHidden]
    
    
     */
    @Output() onTooltipHidden: EventEmitter<TooltipHiddenEvent>;

    /**
    
     * [descr:dxPolarChartOptions.onTooltipShown]
    
    
     */
    @Output() onTooltipShown: EventEmitter<TooltipShownEvent>;

    /**
    
     * [descr:dxPolarChartOptions.onZoomEnd]
    
    
     */
    @Output() onZoomEnd: EventEmitter<ZoomEndEvent>;

    /**
    
     * [descr:dxPolarChartOptions.onZoomStart]
    
    
     */
    @Output() onZoomStart: EventEmitter<ZoomStartEvent>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() adaptiveLayoutChange: EventEmitter<{ height?: number, keepLabels?: boolean, width?: number }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() animationChange: EventEmitter<boolean | { duration?: number, easing?: AnimationEaseMode, enabled?: boolean, maxPointCountSupported?: number }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() annotationsChange: EventEmitter<Array<any | dxPolarChartAnnotationConfig>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() argumentAxisChange: EventEmitter<{ allowDecimals?: boolean | undefined, argumentType?: ChartsDataType | undefined, axisDivisionFactor?: number, categories?: Array<Date | number | string>, color?: string, constantLines?: { color?: string, dashStyle?: DashStyle, displayBehindSeries?: boolean, extendAxis?: boolean, label?: { font?: Font, text?: string | undefined, visible?: boolean }, value?: Date | number | string | undefined, width?: number }[], constantLineStyle?: { color?: string, dashStyle?: DashStyle, label?: { font?: Font, visible?: boolean }, width?: number }, discreteAxisDivisionMode?: DiscreteAxisDivisionMode, endOnTick?: boolean | undefined, firstPointOnStartAngle?: boolean, grid?: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }, hoverMode?: ArgumentAxisHoverMode, inverted?: boolean, label?: { customizeHint?: ((argument: { value: Date | number | string, valueText: string }) => string), customizeText?: ((argument: { value: Date | number | string, valueText: string }) => string), font?: Font, format?: Format | undefined, indentFromAxis?: number, overlappingBehavior?: LabelOverlap, visible?: boolean }, linearThreshold?: number | undefined, logarithmBase?: number, minorGrid?: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }, minorTick?: { color?: string, length?: number, opacity?: number, shift?: number, visible?: boolean, width?: number }, minorTickCount?: number | undefined, minorTickInterval?: number | TimeInterval | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }, opacity?: number | undefined, originValue?: number | undefined, period?: number | undefined, startAngle?: number, strips?: { color?: string | undefined, endValue?: Date | number | string | undefined, label?: { font?: Font, text?: string | undefined }, startValue?: Date | number | string | undefined }[], stripStyle?: { label?: { font?: Font } }, tick?: { color?: string, length?: number, opacity?: number | undefined, shift?: number, visible?: boolean, width?: number }, tickInterval?: number | TimeInterval | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }, type?: AxisScaleType | undefined, visible?: boolean, width?: number }>;

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
    @Output() commonAnnotationSettingsChange: EventEmitter<dxPolarChartCommonAnnotationConfig>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() commonAxisSettingsChange: EventEmitter<{ allowDecimals?: boolean | undefined, color?: string, constantLineStyle?: { color?: string, dashStyle?: DashStyle, label?: { font?: Font, visible?: boolean }, width?: number }, discreteAxisDivisionMode?: DiscreteAxisDivisionMode, endOnTick?: boolean | undefined, grid?: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }, inverted?: boolean, label?: { font?: Font, indentFromAxis?: number, overlappingBehavior?: LabelOverlap, visible?: boolean }, minorGrid?: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }, minorTick?: { color?: string, length?: number, opacity?: number, visible?: boolean, width?: number }, opacity?: number | undefined, stripStyle?: { label?: { font?: Font } }, tick?: { color?: string, length?: number, opacity?: number | undefined, visible?: boolean, width?: number }, visible?: boolean, width?: number }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() commonSeriesSettingsChange: EventEmitter<{ area?: any, argumentField?: string, bar?: any, barPadding?: number | undefined, barWidth?: number | undefined, border?: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, closed?: boolean, color?: ChartsColor | string | undefined, dashStyle?: DashStyle, hoverMode?: SeriesHoverMode, hoverStyle?: { border?: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, dashStyle?: DashStyle, hatching?: { direction?: HatchDirection, opacity?: number, step?: number, width?: number }, highlight?: boolean, width?: number }, ignoreEmptyPoints?: boolean, label?: { argumentFormat?: Format | undefined, backgroundColor?: string | undefined, border?: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, connector?: { color?: string | undefined, visible?: boolean, width?: number }, customizeText?: ((pointInfo: any) => string), displayFormat?: string | undefined, font?: Font, format?: Format | undefined, position?: RelativePosition, rotationAngle?: number, showForZeroValues?: boolean, visible?: boolean }, line?: any, maxLabelCount?: number | undefined, minBarSize?: number | undefined, opacity?: number, point?: { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, hoverMode?: PointInteractionMode, hoverStyle?: { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, size?: number }, image?: string | undefined | { height?: number, url?: string | undefined, width?: number }, selectionMode?: PointInteractionMode, selectionStyle?: { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, size?: number }, size?: number, symbol?: PointSymbol, visible?: boolean }, scatter?: any, selectionMode?: SeriesSelectionMode, selectionStyle?: { border?: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, dashStyle?: DashStyle, hatching?: { direction?: HatchDirection, opacity?: number, step?: number, width?: number }, highlight?: boolean, width?: number }, showInLegend?: boolean, stack?: string, stackedbar?: any, tagField?: string, type?: PolarChartSeriesType, valueErrorBar?: { color?: string, displayMode?: ValueErrorBarDisplayMode, edgeLength?: number, highValueField?: string | undefined, lineWidth?: number, lowValueField?: string | undefined, opacity?: number | undefined, type?: undefined | ValueErrorBarType, value?: number }, valueField?: string, visible?: boolean, width?: number }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() containerBackgroundColorChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() customizeAnnotationChange: EventEmitter<((annotation: dxPolarChartAnnotationConfig | any) => dxPolarChartAnnotationConfig) | undefined>;

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
    @Output() dataPrepareSettingsChange: EventEmitter<{ checkTypeForAllData?: boolean, convertToAxisDataType?: boolean, sortingMethod?: boolean | ((a: { arg: Date | number | string, val: Date | number | string }, b: { arg: Date | number | string, val: Date | number | string }) => number) }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() dataSourceChange: EventEmitter<Array<any> | DataSource | DataSourceOptions | null | Store | string>;

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
    @Output() legendChange: EventEmitter<{ backgroundColor?: string | undefined, border?: { color?: string, cornerRadius?: number, dashStyle?: DashStyle, opacity?: number | undefined, visible?: boolean, width?: number }, columnCount?: number, columnItemSpacing?: number, customizeHint?: ((seriesInfo: { seriesColor: string, seriesIndex: number, seriesName: any }) => string), customizeItems?: ((items: Array<LegendItem>) => Array<LegendItem>), customizeText?: ((seriesInfo: { seriesColor: string, seriesIndex: number, seriesName: any }) => string), font?: Font, horizontalAlignment?: HorizontalAlignment, hoverMode?: LegendHoverMode, itemsAlignment?: HorizontalAlignment | undefined, itemTextPosition?: Position | undefined, margin?: number | { bottom?: number, left?: number, right?: number, top?: number }, markerSize?: number, markerTemplate?: any, orientation?: Orientation | undefined, paddingLeftRight?: number, paddingTopBottom?: number, rowCount?: number, rowItemSpacing?: number, title?: string | { font?: Font, horizontalAlignment?: HorizontalAlignment | undefined, margin?: { bottom?: number, left?: number, right?: number, top?: number }, placeholderSize?: number | undefined, subtitle?: string | { font?: Font, offset?: number, text?: string }, text?: string, verticalAlignment?: VerticalEdge }, verticalAlignment?: VerticalEdge, visible?: boolean }>;

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
    @Output() resolveLabelOverlappingChange: EventEmitter<LabelOverlap>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() rtlEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() seriesChange: EventEmitter<Array<PolarChartSeries> | PolarChartSeries | undefined>;

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
    @Output() themeChange: EventEmitter<Theme>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() titleChange: EventEmitter<string | { font?: Font, horizontalAlignment?: HorizontalAlignment, margin?: number | { bottom?: number, left?: number, right?: number, top?: number }, placeholderSize?: number | undefined, subtitle?: string | { font?: Font, offset?: number, text?: string, textOverflow?: TextOverflow, wordWrap?: WordWrap }, text?: string, textOverflow?: TextOverflow, verticalAlignment?: VerticalEdge, wordWrap?: WordWrap }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() tooltipChange: EventEmitter<{ argumentFormat?: Format | undefined, arrowLength?: number, border?: { color?: string, dashStyle?: DashStyle, opacity?: number | undefined, visible?: boolean, width?: number }, color?: string, container?: any | string | undefined, contentTemplate?: any, cornerRadius?: number, customizeTooltip?: ((pointInfo: any) => Record<string, any>) | undefined, enabled?: boolean, font?: Font, format?: Format | undefined, interactive?: boolean, opacity?: number | undefined, paddingLeftRight?: number, paddingTopBottom?: number, shadow?: { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number }, shared?: boolean, zIndex?: number | undefined }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() useSpiderWebChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() valueAxisChange: EventEmitter<{ allowDecimals?: boolean | undefined, axisDivisionFactor?: number, categories?: Array<Date | number | string>, color?: string, constantLines?: { color?: string, dashStyle?: DashStyle, displayBehindSeries?: boolean, extendAxis?: boolean, label?: { font?: Font, text?: string | undefined, visible?: boolean }, value?: Date | number | string | undefined, width?: number }[], constantLineStyle?: { color?: string, dashStyle?: DashStyle, label?: { font?: Font, visible?: boolean }, width?: number }, discreteAxisDivisionMode?: DiscreteAxisDivisionMode, endOnTick?: boolean, grid?: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }, inverted?: boolean, label?: { customizeHint?: ((axisValue: { value: Date | number | string, valueText: string }) => string), customizeText?: ((axisValue: { value: Date | number | string, valueText: string }) => string), font?: Font, format?: Format | undefined, indentFromAxis?: number, overlappingBehavior?: LabelOverlap, visible?: boolean }, linearThreshold?: number | undefined, logarithmBase?: number, maxValueMargin?: number | undefined, minorGrid?: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }, minorTick?: { color?: string, length?: number, opacity?: number, visible?: boolean, width?: number }, minorTickCount?: number | undefined, minorTickInterval?: number | TimeInterval | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }, minValueMargin?: number | undefined, minVisualRangeLength?: number | TimeInterval | undefined | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }, opacity?: number | undefined, showZero?: boolean | undefined, strips?: { color?: string | undefined, endValue?: Date | number | string | undefined, label?: { font?: Font, text?: string | undefined }, startValue?: Date | number | string | undefined }[], stripStyle?: { label?: { font?: Font } }, tick?: { color?: string, length?: number, opacity?: number | undefined, visible?: boolean, width?: number }, tickInterval?: number | TimeInterval | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }, type?: AxisScaleType | undefined, valueMarginsEnabled?: boolean, valueType?: ChartsDataType | undefined, visible?: boolean, visualRange?: Array<Date | number | string> | CommonChartTypes.VisualRange, visualRangeUpdateMode?: ValueAxisVisualRangeUpdateMode, wholeRange?: Array<Date | number | string> | undefined | CommonChartTypes.VisualRange, width?: number }>;




    @ContentChildren(DxiPolarChartAnnotationComponent)
    get annotationsChildren(): QueryList<DxiPolarChartAnnotationComponent> {
        return this._getOption('annotations');
    }
    set annotationsChildren(value) {
        this._setChildren('annotations', value, 'DxiPolarChartAnnotationComponent');
    }

    @ContentChildren(DxiPolarChartSeriesComponent)
    get seriesChildren(): QueryList<DxiPolarChartSeriesComponent> {
        return this._getOption('series');
    }
    set seriesChildren(value) {
        this._setChildren('series', value, 'DxiPolarChartSeriesComponent');
    }


    @ContentChildren(DxiAnnotationComponent)
    get annotationsLegacyChildren(): QueryList<DxiAnnotationComponent> {
        return this._getOption('annotations');
    }
    set annotationsLegacyChildren(value) {
        this._setChildren('annotations', value, 'DxiAnnotationComponent');
    }

    @ContentChildren(DxiSeriesComponent)
    get seriesLegacyChildren(): QueryList<DxiSeriesComponent> {
        return this._getOption('series');
    }
    set seriesLegacyChildren(value) {
        this._setChildren('series', value, 'DxiSeriesComponent');
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

    protected _createInstance(element, options) {

        return new DxPolarChart(element, options);
    }


    ngOnDestroy() {
        this._destroyWidget();
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        this.setupChanges('annotations', changes);
        this.setupChanges('dataSource', changes);
        this.setupChanges('palette', changes);
        this.setupChanges('series', changes);
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
        this._idh.doCheck('series');
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
    DxoPolarChartAdaptiveLayoutModule,
    DxoPolarChartAnimationModule,
    DxiPolarChartAnnotationModule,
    DxoPolarChartAnnotationBorderModule,
    DxoPolarChartArgumentAxisModule,
    DxoPolarChartArgumentAxisMinorTickModule,
    DxoPolarChartArgumentAxisTickModule,
    DxoPolarChartArgumentFormatModule,
    DxoPolarChartAxisLabelModule,
    DxoPolarChartBorderModule,
    DxoPolarChartColorModule,
    DxoPolarChartCommonAnnotationSettingsModule,
    DxoPolarChartCommonAxisSettingsModule,
    DxoPolarChartCommonAxisSettingsLabelModule,
    DxoPolarChartCommonAxisSettingsMinorTickModule,
    DxoPolarChartCommonAxisSettingsTickModule,
    DxoPolarChartCommonSeriesSettingsModule,
    DxoPolarChartCommonSeriesSettingsHoverStyleModule,
    DxoPolarChartCommonSeriesSettingsLabelModule,
    DxoPolarChartCommonSeriesSettingsSelectionStyleModule,
    DxoPolarChartConnectorModule,
    DxiPolarChartConstantLineModule,
    DxoPolarChartConstantLineLabelModule,
    DxoPolarChartConstantLineStyleModule,
    DxoPolarChartConstantLineStyleLabelModule,
    DxoPolarChartDataPrepareSettingsModule,
    DxoPolarChartExportModule,
    DxoPolarChartFontModule,
    DxoPolarChartFormatModule,
    DxoPolarChartGridModule,
    DxoPolarChartHatchingModule,
    DxoPolarChartHoverStyleModule,
    DxoPolarChartImageModule,
    DxoPolarChartLabelModule,
    DxoPolarChartLegendModule,
    DxoPolarChartLegendTitleModule,
    DxoPolarChartLegendTitleSubtitleModule,
    DxoPolarChartLengthModule,
    DxoPolarChartLoadingIndicatorModule,
    DxoPolarChartMarginModule,
    DxoPolarChartMinorGridModule,
    DxoPolarChartMinorTickModule,
    DxoPolarChartMinorTickIntervalModule,
    DxoPolarChartMinVisualRangeLengthModule,
    DxoPolarChartPointModule,
    DxoPolarChartPointBorderModule,
    DxoPolarChartPointHoverStyleModule,
    DxoPolarChartPointSelectionStyleModule,
    DxoPolarChartPolarChartTitleModule,
    DxoPolarChartPolarChartTitleSubtitleModule,
    DxoPolarChartSelectionStyleModule,
    DxiPolarChartSeriesModule,
    DxoPolarChartSeriesBorderModule,
    DxoPolarChartSeriesTemplateModule,
    DxoPolarChartShadowModule,
    DxoPolarChartSizeModule,
    DxiPolarChartStripModule,
    DxoPolarChartStripLabelModule,
    DxoPolarChartStripStyleModule,
    DxoPolarChartStripStyleLabelModule,
    DxoPolarChartSubtitleModule,
    DxoPolarChartTickModule,
    DxoPolarChartTickIntervalModule,
    DxoPolarChartTitleModule,
    DxoPolarChartTooltipModule,
    DxoPolarChartTooltipBorderModule,
    DxoPolarChartValueAxisModule,
    DxoPolarChartValueErrorBarModule,
    DxoPolarChartVisualRangeModule,
    DxoPolarChartWholeRangeModule,
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
    DxoPolarChartAdaptiveLayoutModule,
    DxoPolarChartAnimationModule,
    DxiPolarChartAnnotationModule,
    DxoPolarChartAnnotationBorderModule,
    DxoPolarChartArgumentAxisModule,
    DxoPolarChartArgumentAxisMinorTickModule,
    DxoPolarChartArgumentAxisTickModule,
    DxoPolarChartArgumentFormatModule,
    DxoPolarChartAxisLabelModule,
    DxoPolarChartBorderModule,
    DxoPolarChartColorModule,
    DxoPolarChartCommonAnnotationSettingsModule,
    DxoPolarChartCommonAxisSettingsModule,
    DxoPolarChartCommonAxisSettingsLabelModule,
    DxoPolarChartCommonAxisSettingsMinorTickModule,
    DxoPolarChartCommonAxisSettingsTickModule,
    DxoPolarChartCommonSeriesSettingsModule,
    DxoPolarChartCommonSeriesSettingsHoverStyleModule,
    DxoPolarChartCommonSeriesSettingsLabelModule,
    DxoPolarChartCommonSeriesSettingsSelectionStyleModule,
    DxoPolarChartConnectorModule,
    DxiPolarChartConstantLineModule,
    DxoPolarChartConstantLineLabelModule,
    DxoPolarChartConstantLineStyleModule,
    DxoPolarChartConstantLineStyleLabelModule,
    DxoPolarChartDataPrepareSettingsModule,
    DxoPolarChartExportModule,
    DxoPolarChartFontModule,
    DxoPolarChartFormatModule,
    DxoPolarChartGridModule,
    DxoPolarChartHatchingModule,
    DxoPolarChartHoverStyleModule,
    DxoPolarChartImageModule,
    DxoPolarChartLabelModule,
    DxoPolarChartLegendModule,
    DxoPolarChartLegendTitleModule,
    DxoPolarChartLegendTitleSubtitleModule,
    DxoPolarChartLengthModule,
    DxoPolarChartLoadingIndicatorModule,
    DxoPolarChartMarginModule,
    DxoPolarChartMinorGridModule,
    DxoPolarChartMinorTickModule,
    DxoPolarChartMinorTickIntervalModule,
    DxoPolarChartMinVisualRangeLengthModule,
    DxoPolarChartPointModule,
    DxoPolarChartPointBorderModule,
    DxoPolarChartPointHoverStyleModule,
    DxoPolarChartPointSelectionStyleModule,
    DxoPolarChartPolarChartTitleModule,
    DxoPolarChartPolarChartTitleSubtitleModule,
    DxoPolarChartSelectionStyleModule,
    DxiPolarChartSeriesModule,
    DxoPolarChartSeriesBorderModule,
    DxoPolarChartSeriesTemplateModule,
    DxoPolarChartShadowModule,
    DxoPolarChartSizeModule,
    DxiPolarChartStripModule,
    DxoPolarChartStripLabelModule,
    DxoPolarChartStripStyleModule,
    DxoPolarChartStripStyleLabelModule,
    DxoPolarChartSubtitleModule,
    DxoPolarChartTickModule,
    DxoPolarChartTickIntervalModule,
    DxoPolarChartTitleModule,
    DxoPolarChartTooltipModule,
    DxoPolarChartTooltipBorderModule,
    DxoPolarChartValueAxisModule,
    DxoPolarChartValueErrorBarModule,
    DxoPolarChartVisualRangeModule,
    DxoPolarChartWholeRangeModule,
    DxTemplateModule
  ]
})
export class DxPolarChartModule { }

import type * as DxPolarChartTypes from "devextreme/viz/polar_chart_types";
export { DxPolarChartTypes };


