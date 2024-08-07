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


import { ExportFormat, HorizontalAlignment, Orientation, Position, SingleOrMultiple, VerticalEdge } from 'devextreme/common';
import { AnimationEaseMode, ArgumentAxisHoverMode, AxisScaleType, ChartsDataType, DashStyle, DiscreteAxisDivisionMode, Font, LabelOverlap, LegendHoverMode, Palette, PaletteExtensionMode, TextOverflow, Theme, TimeInterval, VisualRange, WordWrap } from 'devextreme/common/charts';
import { UserDefinedElement } from 'devextreme/core/element';
import { Store } from 'devextreme/data';
import DataSource, { Options as DataSourceOptions } from 'devextreme/data/data_source';
import { Format } from 'devextreme/localization';
import { ArgumentAxisClickEvent, DisposingEvent, DoneEvent, DrawnEvent, dxPolarChartAnnotationConfig, dxPolarChartCommonAnnotationConfig, ExportedEvent, ExportingEvent, FileSavingEvent, IncidentOccurredEvent, InitializedEvent, LegendClickEvent, OptionChangedEvent, PointClickEvent, PointHoverChangedEvent, PointSelectionChangedEvent, PolarChartSeries, SeriesClickEvent, SeriesHoverChangedEvent, SeriesSelectionChangedEvent, TooltipHiddenEvent, TooltipShownEvent, ValueAxisVisualRangeUpdateMode, ZoomEndEvent, ZoomStartEvent } from 'devextreme/viz/polar_chart';

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

import { DxoAdaptiveLayoutModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoAnimationModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxiAnnotationModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoBorderModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoFontModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoImageModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoShadowModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoArgumentAxisModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxiConstantLineModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoLabelModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoConstantLineStyleModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoGridModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoFormatModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoMinorGridModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoMinorTickModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoMinorTickIntervalModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxiStripModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoStripStyleModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoTickModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoTickIntervalModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoCommonAnnotationSettingsModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoCommonAxisSettingsModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoCommonSeriesSettingsModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoAreaModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoHoverStyleModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoHatchingModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoConnectorModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoPointModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoSelectionStyleModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoValueErrorBarModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoBarModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoColorModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoArgumentFormatModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoLineModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoScatterModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoStackedbarModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoDataPrepareSettingsModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoExportModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoLegendModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoMarginModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoTitleModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoSubtitleModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoLoadingIndicatorModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxiSeriesModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoSeriesTemplateModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoSizeModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoTooltipModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoValueAxisModule } from 'devextreme-angular/ui/polar-chart/nested';
import { DxoMinVisualRangeLengthModule } from 'devextreme-angular/ui/polar-chart/nested';

import { DxiAnnotationComponent } from 'devextreme-angular/ui/polar-chart/nested';
import { DxiSeriesComponent } from 'devextreme-angular/ui/polar-chart/nested';



/**
 * [descr:dxPolarChart]

 */
@Component({
    selector: 'dx-polar-chart',
    template: '',
    styles: [ ' :host {  display: block; }'],
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
    get annotations(): Array<dxPolarChartAnnotationConfig | any> {
        return this._getOption('annotations');
    }
    set annotations(value: Array<dxPolarChartAnnotationConfig | any>) {
        this._setOption('annotations', value);
    }


    /**
     * [descr:dxPolarChartOptions.argumentAxis]
    
     */
    @Input()
    get argumentAxis(): { allowDecimals?: boolean | undefined, argumentType?: ChartsDataType | undefined, axisDivisionFactor?: number, categories?: Array<number | string | Date>, color?: string, constantLines?: Array<any | { color?: string, dashStyle?: DashStyle, displayBehindSeries?: boolean, extendAxis?: boolean, label?: { font?: Font, text?: string | undefined, visible?: boolean }, value?: Date | number | string | undefined, width?: number }>, constantLineStyle?: { color?: string, dashStyle?: DashStyle, label?: { font?: Font, visible?: boolean }, width?: number }, discreteAxisDivisionMode?: DiscreteAxisDivisionMode, endOnTick?: boolean | undefined, firstPointOnStartAngle?: boolean, grid?: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }, hoverMode?: ArgumentAxisHoverMode, inverted?: boolean, label?: { customizeHint?: Function, customizeText?: Function, font?: Font, format?: Format | string | undefined, indentFromAxis?: number, overlappingBehavior?: LabelOverlap, visible?: boolean }, linearThreshold?: number | undefined, logarithmBase?: number, minorGrid?: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }, minorTick?: { color?: string, length?: number, opacity?: number, shift?: number, visible?: boolean, width?: number }, minorTickCount?: number | undefined, minorTickInterval?: TimeInterval | number | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }, opacity?: number | undefined, originValue?: number | undefined, period?: number | undefined, startAngle?: number, strips?: Array<any | { color?: string | undefined, endValue?: Date | number | string | undefined, label?: { font?: Font, text?: string | undefined }, startValue?: Date | number | string | undefined }>, stripStyle?: { label?: { font?: Font } }, tick?: { color?: string, length?: number, opacity?: number | undefined, shift?: number, visible?: boolean, width?: number }, tickInterval?: TimeInterval | number | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }, type?: AxisScaleType | undefined, visible?: boolean, width?: number } {
        return this._getOption('argumentAxis');
    }
    set argumentAxis(value: { allowDecimals?: boolean | undefined, argumentType?: ChartsDataType | undefined, axisDivisionFactor?: number, categories?: Array<number | string | Date>, color?: string, constantLines?: Array<any | { color?: string, dashStyle?: DashStyle, displayBehindSeries?: boolean, extendAxis?: boolean, label?: { font?: Font, text?: string | undefined, visible?: boolean }, value?: Date | number | string | undefined, width?: number }>, constantLineStyle?: { color?: string, dashStyle?: DashStyle, label?: { font?: Font, visible?: boolean }, width?: number }, discreteAxisDivisionMode?: DiscreteAxisDivisionMode, endOnTick?: boolean | undefined, firstPointOnStartAngle?: boolean, grid?: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }, hoverMode?: ArgumentAxisHoverMode, inverted?: boolean, label?: { customizeHint?: Function, customizeText?: Function, font?: Font, format?: Format | string | undefined, indentFromAxis?: number, overlappingBehavior?: LabelOverlap, visible?: boolean }, linearThreshold?: number | undefined, logarithmBase?: number, minorGrid?: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }, minorTick?: { color?: string, length?: number, opacity?: number, shift?: number, visible?: boolean, width?: number }, minorTickCount?: number | undefined, minorTickInterval?: TimeInterval | number | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }, opacity?: number | undefined, originValue?: number | undefined, period?: number | undefined, startAngle?: number, strips?: Array<any | { color?: string | undefined, endValue?: Date | number | string | undefined, label?: { font?: Font, text?: string | undefined }, startValue?: Date | number | string | undefined }>, stripStyle?: { label?: { font?: Font } }, tick?: { color?: string, length?: number, opacity?: number | undefined, shift?: number, visible?: boolean, width?: number }, tickInterval?: TimeInterval | number | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }, type?: AxisScaleType | undefined, visible?: boolean, width?: number }) {
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
    get commonSeriesSettings(): any {
        return this._getOption('commonSeriesSettings');
    }
    set commonSeriesSettings(value: any) {
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
    get customizeAnnotation(): Function | undefined {
        return this._getOption('customizeAnnotation');
    }
    set customizeAnnotation(value: Function | undefined) {
        this._setOption('customizeAnnotation', value);
    }


    /**
     * [descr:BaseChartOptions.customizeLabel]
    
     */
    @Input()
    get customizeLabel(): Function {
        return this._getOption('customizeLabel');
    }
    set customizeLabel(value: Function) {
        this._setOption('customizeLabel', value);
    }


    /**
     * [descr:BaseChartOptions.customizePoint]
    
     */
    @Input()
    get customizePoint(): Function {
        return this._getOption('customizePoint');
    }
    set customizePoint(value: Function) {
        this._setOption('customizePoint', value);
    }


    /**
     * [descr:dxPolarChartOptions.dataPrepareSettings]
    
     */
    @Input()
    get dataPrepareSettings(): { checkTypeForAllData?: boolean, convertToAxisDataType?: boolean, sortingMethod?: boolean | Function } {
        return this._getOption('dataPrepareSettings');
    }
    set dataPrepareSettings(value: { checkTypeForAllData?: boolean, convertToAxisDataType?: boolean, sortingMethod?: boolean | Function }) {
        this._setOption('dataPrepareSettings', value);
    }


    /**
     * [descr:BaseChartOptions.dataSource]
    
     */
    @Input()
    get dataSource(): Store | DataSource | DataSourceOptions | null | string | Array<any> {
        return this._getOption('dataSource');
    }
    set dataSource(value: Store | DataSource | DataSourceOptions | null | string | Array<any>) {
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
    get elementAttr(): any {
        return this._getOption('elementAttr');
    }
    set elementAttr(value: any) {
        this._setOption('elementAttr', value);
    }


    /**
     * [descr:BaseWidgetOptions.export]
    
     */
    @Input()
    get export(): { backgroundColor?: string, enabled?: boolean, fileName?: string, formats?: any | Array<ExportFormat>, margin?: number, printingEnabled?: boolean, svgToCanvas?: Function | undefined } {
        return this._getOption('export');
    }
    set export(value: { backgroundColor?: string, enabled?: boolean, fileName?: string, formats?: any | Array<ExportFormat>, margin?: number, printingEnabled?: boolean, svgToCanvas?: Function | undefined }) {
        this._setOption('export', value);
    }


    /**
     * [descr:dxPolarChartOptions.legend]
    
     */
    @Input()
    get legend(): { backgroundColor?: string | undefined, border?: { color?: string, cornerRadius?: number, dashStyle?: DashStyle, opacity?: number | undefined, visible?: boolean, width?: number }, columnCount?: number, columnItemSpacing?: number, customizeHint?: Function, customizeItems?: Function, customizeText?: Function, font?: Font, horizontalAlignment?: HorizontalAlignment, hoverMode?: LegendHoverMode, itemsAlignment?: HorizontalAlignment | undefined, itemTextPosition?: Position | undefined, margin?: number | { bottom?: number, left?: number, right?: number, top?: number }, markerSize?: number, markerTemplate?: any | undefined, orientation?: Orientation | undefined, paddingLeftRight?: number, paddingTopBottom?: number, rowCount?: number, rowItemSpacing?: number, title?: string | { font?: Font, horizontalAlignment?: HorizontalAlignment | undefined, margin?: { bottom?: number, left?: number, right?: number, top?: number }, placeholderSize?: number | undefined, subtitle?: string | { font?: Font, offset?: number, text?: string }, text?: string, verticalAlignment?: VerticalEdge }, verticalAlignment?: VerticalEdge, visible?: boolean } {
        return this._getOption('legend');
    }
    set legend(value: { backgroundColor?: string | undefined, border?: { color?: string, cornerRadius?: number, dashStyle?: DashStyle, opacity?: number | undefined, visible?: boolean, width?: number }, columnCount?: number, columnItemSpacing?: number, customizeHint?: Function, customizeItems?: Function, customizeText?: Function, font?: Font, horizontalAlignment?: HorizontalAlignment, hoverMode?: LegendHoverMode, itemsAlignment?: HorizontalAlignment | undefined, itemTextPosition?: Position | undefined, margin?: number | { bottom?: number, left?: number, right?: number, top?: number }, markerSize?: number, markerTemplate?: any | undefined, orientation?: Orientation | undefined, paddingLeftRight?: number, paddingTopBottom?: number, rowCount?: number, rowItemSpacing?: number, title?: string | { font?: Font, horizontalAlignment?: HorizontalAlignment | undefined, margin?: { bottom?: number, left?: number, right?: number, top?: number }, placeholderSize?: number | undefined, subtitle?: string | { font?: Font, offset?: number, text?: string }, text?: string, verticalAlignment?: VerticalEdge }, verticalAlignment?: VerticalEdge, visible?: boolean }) {
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
    get palette(): Palette | string | Array<string> {
        return this._getOption('palette');
    }
    set palette(value: Palette | string | Array<string>) {
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
    get series(): PolarChartSeries | any | undefined | Array<PolarChartSeries | any> {
        return this._getOption('series');
    }
    set series(value: PolarChartSeries | any | undefined | Array<PolarChartSeries | any>) {
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
    get seriesTemplate(): { customizeSeries?: Function, nameField?: string } {
        return this._getOption('seriesTemplate');
    }
    set seriesTemplate(value: { customizeSeries?: Function, nameField?: string }) {
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
    get tooltip(): { argumentFormat?: Format | string | undefined, arrowLength?: number, border?: { color?: string, dashStyle?: DashStyle, opacity?: number | undefined, visible?: boolean, width?: number }, color?: string, container?: UserDefinedElement | string | undefined, contentTemplate?: any | undefined, cornerRadius?: number, customizeTooltip?: Function | undefined, enabled?: boolean, font?: Font, format?: Format | string | undefined, interactive?: boolean, opacity?: number | undefined, paddingLeftRight?: number, paddingTopBottom?: number, shadow?: { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number }, shared?: boolean, zIndex?: number | undefined } {
        return this._getOption('tooltip');
    }
    set tooltip(value: { argumentFormat?: Format | string | undefined, arrowLength?: number, border?: { color?: string, dashStyle?: DashStyle, opacity?: number | undefined, visible?: boolean, width?: number }, color?: string, container?: UserDefinedElement | string | undefined, contentTemplate?: any | undefined, cornerRadius?: number, customizeTooltip?: Function | undefined, enabled?: boolean, font?: Font, format?: Format | string | undefined, interactive?: boolean, opacity?: number | undefined, paddingLeftRight?: number, paddingTopBottom?: number, shadow?: { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number }, shared?: boolean, zIndex?: number | undefined }) {
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
    get valueAxis(): { allowDecimals?: boolean | undefined, axisDivisionFactor?: number, categories?: Array<number | string | Date>, color?: string, constantLines?: Array<any | { color?: string, dashStyle?: DashStyle, displayBehindSeries?: boolean, extendAxis?: boolean, label?: { font?: Font, text?: string | undefined, visible?: boolean }, value?: Date | number | string | undefined, width?: number }>, constantLineStyle?: { color?: string, dashStyle?: DashStyle, label?: { font?: Font, visible?: boolean }, width?: number }, discreteAxisDivisionMode?: DiscreteAxisDivisionMode, endOnTick?: boolean, grid?: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }, inverted?: boolean, label?: { customizeHint?: Function, customizeText?: Function, font?: Font, format?: Format | string | undefined, indentFromAxis?: number, overlappingBehavior?: LabelOverlap, visible?: boolean }, linearThreshold?: number | undefined, logarithmBase?: number, maxValueMargin?: number | undefined, minorGrid?: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }, minorTick?: { color?: string, length?: number, opacity?: number, visible?: boolean, width?: number }, minorTickCount?: number | undefined, minorTickInterval?: TimeInterval | number | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }, minValueMargin?: number | undefined, minVisualRangeLength?: TimeInterval | number | undefined | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }, opacity?: number | undefined, showZero?: boolean | undefined, strips?: Array<any | { color?: string | undefined, endValue?: Date | number | string | undefined, label?: { font?: Font, text?: string | undefined }, startValue?: Date | number | string | undefined }>, stripStyle?: { label?: { font?: Font } }, tick?: { color?: string, length?: number, opacity?: number | undefined, visible?: boolean, width?: number }, tickInterval?: TimeInterval | number | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }, type?: AxisScaleType | undefined, valueMarginsEnabled?: boolean, valueType?: ChartsDataType | undefined, visible?: boolean, visualRange?: VisualRange | Array<number | string | Date>, visualRangeUpdateMode?: ValueAxisVisualRangeUpdateMode, wholeRange?: VisualRange | undefined | Array<number | string | Date>, width?: number } {
        return this._getOption('valueAxis');
    }
    set valueAxis(value: { allowDecimals?: boolean | undefined, axisDivisionFactor?: number, categories?: Array<number | string | Date>, color?: string, constantLines?: Array<any | { color?: string, dashStyle?: DashStyle, displayBehindSeries?: boolean, extendAxis?: boolean, label?: { font?: Font, text?: string | undefined, visible?: boolean }, value?: Date | number | string | undefined, width?: number }>, constantLineStyle?: { color?: string, dashStyle?: DashStyle, label?: { font?: Font, visible?: boolean }, width?: number }, discreteAxisDivisionMode?: DiscreteAxisDivisionMode, endOnTick?: boolean, grid?: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }, inverted?: boolean, label?: { customizeHint?: Function, customizeText?: Function, font?: Font, format?: Format | string | undefined, indentFromAxis?: number, overlappingBehavior?: LabelOverlap, visible?: boolean }, linearThreshold?: number | undefined, logarithmBase?: number, maxValueMargin?: number | undefined, minorGrid?: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }, minorTick?: { color?: string, length?: number, opacity?: number, visible?: boolean, width?: number }, minorTickCount?: number | undefined, minorTickInterval?: TimeInterval | number | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }, minValueMargin?: number | undefined, minVisualRangeLength?: TimeInterval | number | undefined | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }, opacity?: number | undefined, showZero?: boolean | undefined, strips?: Array<any | { color?: string | undefined, endValue?: Date | number | string | undefined, label?: { font?: Font, text?: string | undefined }, startValue?: Date | number | string | undefined }>, stripStyle?: { label?: { font?: Font } }, tick?: { color?: string, length?: number, opacity?: number | undefined, visible?: boolean, width?: number }, tickInterval?: TimeInterval | number | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }, type?: AxisScaleType | undefined, valueMarginsEnabled?: boolean, valueType?: ChartsDataType | undefined, visible?: boolean, visualRange?: VisualRange | Array<number | string | Date>, visualRangeUpdateMode?: ValueAxisVisualRangeUpdateMode, wholeRange?: VisualRange | undefined | Array<number | string | Date>, width?: number }) {
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
    @Output() annotationsChange: EventEmitter<Array<dxPolarChartAnnotationConfig | any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() argumentAxisChange: EventEmitter<{ allowDecimals?: boolean | undefined, argumentType?: ChartsDataType | undefined, axisDivisionFactor?: number, categories?: Array<number | string | Date>, color?: string, constantLines?: Array<any | { color?: string, dashStyle?: DashStyle, displayBehindSeries?: boolean, extendAxis?: boolean, label?: { font?: Font, text?: string | undefined, visible?: boolean }, value?: Date | number | string | undefined, width?: number }>, constantLineStyle?: { color?: string, dashStyle?: DashStyle, label?: { font?: Font, visible?: boolean }, width?: number }, discreteAxisDivisionMode?: DiscreteAxisDivisionMode, endOnTick?: boolean | undefined, firstPointOnStartAngle?: boolean, grid?: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }, hoverMode?: ArgumentAxisHoverMode, inverted?: boolean, label?: { customizeHint?: Function, customizeText?: Function, font?: Font, format?: Format | string | undefined, indentFromAxis?: number, overlappingBehavior?: LabelOverlap, visible?: boolean }, linearThreshold?: number | undefined, logarithmBase?: number, minorGrid?: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }, minorTick?: { color?: string, length?: number, opacity?: number, shift?: number, visible?: boolean, width?: number }, minorTickCount?: number | undefined, minorTickInterval?: TimeInterval | number | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }, opacity?: number | undefined, originValue?: number | undefined, period?: number | undefined, startAngle?: number, strips?: Array<any | { color?: string | undefined, endValue?: Date | number | string | undefined, label?: { font?: Font, text?: string | undefined }, startValue?: Date | number | string | undefined }>, stripStyle?: { label?: { font?: Font } }, tick?: { color?: string, length?: number, opacity?: number | undefined, shift?: number, visible?: boolean, width?: number }, tickInterval?: TimeInterval | number | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }, type?: AxisScaleType | undefined, visible?: boolean, width?: number }>;

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
    @Output() commonSeriesSettingsChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() containerBackgroundColorChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() customizeAnnotationChange: EventEmitter<Function | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() customizeLabelChange: EventEmitter<Function>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() customizePointChange: EventEmitter<Function>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() dataPrepareSettingsChange: EventEmitter<{ checkTypeForAllData?: boolean, convertToAxisDataType?: boolean, sortingMethod?: boolean | Function }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() dataSourceChange: EventEmitter<Store | DataSource | DataSourceOptions | null | string | Array<any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() disabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() elementAttrChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() exportChange: EventEmitter<{ backgroundColor?: string, enabled?: boolean, fileName?: string, formats?: any | Array<ExportFormat>, margin?: number, printingEnabled?: boolean, svgToCanvas?: Function | undefined }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() legendChange: EventEmitter<{ backgroundColor?: string | undefined, border?: { color?: string, cornerRadius?: number, dashStyle?: DashStyle, opacity?: number | undefined, visible?: boolean, width?: number }, columnCount?: number, columnItemSpacing?: number, customizeHint?: Function, customizeItems?: Function, customizeText?: Function, font?: Font, horizontalAlignment?: HorizontalAlignment, hoverMode?: LegendHoverMode, itemsAlignment?: HorizontalAlignment | undefined, itemTextPosition?: Position | undefined, margin?: number | { bottom?: number, left?: number, right?: number, top?: number }, markerSize?: number, markerTemplate?: any | undefined, orientation?: Orientation | undefined, paddingLeftRight?: number, paddingTopBottom?: number, rowCount?: number, rowItemSpacing?: number, title?: string | { font?: Font, horizontalAlignment?: HorizontalAlignment | undefined, margin?: { bottom?: number, left?: number, right?: number, top?: number }, placeholderSize?: number | undefined, subtitle?: string | { font?: Font, offset?: number, text?: string }, text?: string, verticalAlignment?: VerticalEdge }, verticalAlignment?: VerticalEdge, visible?: boolean }>;

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
    @Output() paletteChange: EventEmitter<Palette | string | Array<string>>;

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
    @Output() seriesChange: EventEmitter<PolarChartSeries | any | undefined | Array<PolarChartSeries | any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() seriesSelectionModeChange: EventEmitter<SingleOrMultiple>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() seriesTemplateChange: EventEmitter<{ customizeSeries?: Function, nameField?: string }>;

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
    @Output() tooltipChange: EventEmitter<{ argumentFormat?: Format | string | undefined, arrowLength?: number, border?: { color?: string, dashStyle?: DashStyle, opacity?: number | undefined, visible?: boolean, width?: number }, color?: string, container?: UserDefinedElement | string | undefined, contentTemplate?: any | undefined, cornerRadius?: number, customizeTooltip?: Function | undefined, enabled?: boolean, font?: Font, format?: Format | string | undefined, interactive?: boolean, opacity?: number | undefined, paddingLeftRight?: number, paddingTopBottom?: number, shadow?: { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number }, shared?: boolean, zIndex?: number | undefined }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() useSpiderWebChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() valueAxisChange: EventEmitter<{ allowDecimals?: boolean | undefined, axisDivisionFactor?: number, categories?: Array<number | string | Date>, color?: string, constantLines?: Array<any | { color?: string, dashStyle?: DashStyle, displayBehindSeries?: boolean, extendAxis?: boolean, label?: { font?: Font, text?: string | undefined, visible?: boolean }, value?: Date | number | string | undefined, width?: number }>, constantLineStyle?: { color?: string, dashStyle?: DashStyle, label?: { font?: Font, visible?: boolean }, width?: number }, discreteAxisDivisionMode?: DiscreteAxisDivisionMode, endOnTick?: boolean, grid?: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }, inverted?: boolean, label?: { customizeHint?: Function, customizeText?: Function, font?: Font, format?: Format | string | undefined, indentFromAxis?: number, overlappingBehavior?: LabelOverlap, visible?: boolean }, linearThreshold?: number | undefined, logarithmBase?: number, maxValueMargin?: number | undefined, minorGrid?: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }, minorTick?: { color?: string, length?: number, opacity?: number, visible?: boolean, width?: number }, minorTickCount?: number | undefined, minorTickInterval?: TimeInterval | number | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }, minValueMargin?: number | undefined, minVisualRangeLength?: TimeInterval | number | undefined | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }, opacity?: number | undefined, showZero?: boolean | undefined, strips?: Array<any | { color?: string | undefined, endValue?: Date | number | string | undefined, label?: { font?: Font, text?: string | undefined }, startValue?: Date | number | string | undefined }>, stripStyle?: { label?: { font?: Font } }, tick?: { color?: string, length?: number, opacity?: number | undefined, visible?: boolean, width?: number }, tickInterval?: TimeInterval | number | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }, type?: AxisScaleType | undefined, valueMarginsEnabled?: boolean, valueType?: ChartsDataType | undefined, visible?: boolean, visualRange?: VisualRange | Array<number | string | Date>, visualRangeUpdateMode?: ValueAxisVisualRangeUpdateMode, wholeRange?: VisualRange | undefined | Array<number | string | Date>, width?: number }>;




    @ContentChildren(DxiAnnotationComponent)
    get annotationsChildren(): QueryList<DxiAnnotationComponent> {
        return this._getOption('annotations');
    }
    set annotationsChildren(value) {
        this.setChildren('annotations', value);
    }

    @ContentChildren(DxiSeriesComponent)
    get seriesChildren(): QueryList<DxiSeriesComponent> {
        return this._getOption('series');
    }
    set seriesChildren(value) {
        this.setChildren('series', value);
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
})
export class DxPolarChartModule { }

import type * as DxPolarChartTypes from "devextreme/viz/polar_chart_types";
export { DxPolarChartTypes };


