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
import * as LocalizationTypes from 'devextreme/localization';
import { dxPieChartAnnotationConfig, dxPieChartCommonAnnotationConfig, PieChartLegendItem, DisposingEvent, DoneEvent, DrawnEvent, ExportedEvent, ExportingEvent, FileSavingEvent, IncidentOccurredEvent, InitializedEvent, LegendClickEvent, OptionChangedEvent, PointClickEvent, PointHoverChangedEvent, PointSelectionChangedEvent, TooltipHiddenEvent, TooltipShownEvent, PieChartSeries } from 'devextreme/viz/pie_chart';
import { ChartsColor, Font } from 'devextreme/common/charts';
import { dxChartSeriesTypes.CommonSeries.label, dxChartSeriesTypes.CommonSeries.point } from 'UNKNOWN_MODULE';
import { DataSourceOptions } from 'devextreme/data/data_source';
import { Store } from 'devextreme/data/store';

import DxPieChart from 'devextreme/viz/pie_chart';


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
import { DxoCommonAnnotationSettingsModule } from 'devextreme-angular/ui/nested';
import { DxoCommonSeriesSettingsModule } from 'devextreme-angular/ui/nested';
import { DxoColorModule } from 'devextreme-angular/ui/nested';
import { DxoHoverStyleModule } from 'devextreme-angular/ui/nested';
import { DxoHatchingModule } from 'devextreme-angular/ui/nested';
import { DxoLabelModule } from 'devextreme-angular/ui/nested';
import { DxoArgumentFormatModule } from 'devextreme-angular/ui/nested';
import { DxoConnectorModule } from 'devextreme-angular/ui/nested';
import { DxoFormatModule } from 'devextreme-angular/ui/nested';
import { DxoSelectionStyleModule } from 'devextreme-angular/ui/nested';
import { DxoSmallValuesGroupingModule } from 'devextreme-angular/ui/nested';
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

import { DxoPieChartAdaptiveLayoutModule } from 'devextreme-angular/ui/pie-chart/nested';
import { DxoPieChartAnimationModule } from 'devextreme-angular/ui/pie-chart/nested';
import { DxiPieChartAnnotationModule } from 'devextreme-angular/ui/pie-chart/nested';
import { DxoPieChartAnnotationBorderModule } from 'devextreme-angular/ui/pie-chart/nested';
import { DxoPieChartArgumentFormatModule } from 'devextreme-angular/ui/pie-chart/nested';
import { DxoPieChartBorderModule } from 'devextreme-angular/ui/pie-chart/nested';
import { DxoPieChartColorModule } from 'devextreme-angular/ui/pie-chart/nested';
import { DxoPieChartCommonAnnotationSettingsModule } from 'devextreme-angular/ui/pie-chart/nested';
import { DxoPieChartCommonSeriesSettingsModule } from 'devextreme-angular/ui/pie-chart/nested';
import { DxoPieChartConnectorModule } from 'devextreme-angular/ui/pie-chart/nested';
import { DxoPieChartExportModule } from 'devextreme-angular/ui/pie-chart/nested';
import { DxoPieChartFontModule } from 'devextreme-angular/ui/pie-chart/nested';
import { DxoPieChartFormatModule } from 'devextreme-angular/ui/pie-chart/nested';
import { DxoPieChartHatchingModule } from 'devextreme-angular/ui/pie-chart/nested';
import { DxoPieChartHoverStyleModule } from 'devextreme-angular/ui/pie-chart/nested';
import { DxoPieChartImageModule } from 'devextreme-angular/ui/pie-chart/nested';
import { DxoPieChartLabelModule } from 'devextreme-angular/ui/pie-chart/nested';
import { DxoPieChartLegendModule } from 'devextreme-angular/ui/pie-chart/nested';
import { DxoPieChartLegendTitleModule } from 'devextreme-angular/ui/pie-chart/nested';
import { DxoPieChartLegendTitleSubtitleModule } from 'devextreme-angular/ui/pie-chart/nested';
import { DxoPieChartLoadingIndicatorModule } from 'devextreme-angular/ui/pie-chart/nested';
import { DxoPieChartMarginModule } from 'devextreme-angular/ui/pie-chart/nested';
import { DxoPieChartPieChartTitleModule } from 'devextreme-angular/ui/pie-chart/nested';
import { DxoPieChartPieChartTitleSubtitleModule } from 'devextreme-angular/ui/pie-chart/nested';
import { DxoPieChartSelectionStyleModule } from 'devextreme-angular/ui/pie-chart/nested';
import { DxiPieChartSeriesModule } from 'devextreme-angular/ui/pie-chart/nested';
import { DxoPieChartSeriesBorderModule } from 'devextreme-angular/ui/pie-chart/nested';
import { DxoPieChartSeriesTemplateModule } from 'devextreme-angular/ui/pie-chart/nested';
import { DxoPieChartShadowModule } from 'devextreme-angular/ui/pie-chart/nested';
import { DxoPieChartSizeModule } from 'devextreme-angular/ui/pie-chart/nested';
import { DxoPieChartSmallValuesGroupingModule } from 'devextreme-angular/ui/pie-chart/nested';
import { DxoPieChartSubtitleModule } from 'devextreme-angular/ui/pie-chart/nested';
import { DxoPieChartTitleModule } from 'devextreme-angular/ui/pie-chart/nested';
import { DxoPieChartTooltipModule } from 'devextreme-angular/ui/pie-chart/nested';
import { DxoPieChartTooltipBorderModule } from 'devextreme-angular/ui/pie-chart/nested';

import { DxiAnnotationComponent } from 'devextreme-angular/ui/nested';
import { DxiSeriesComponent } from 'devextreme-angular/ui/nested';

import { DxiPieChartAnnotationComponent } from 'devextreme-angular/ui/pie-chart/nested';
import { DxiPieChartSeriesComponent } from 'devextreme-angular/ui/pie-chart/nested';


/**
 * [descr:dxPieChart]

 */
@Component({
    selector: 'dx-pie-chart',
    template: '',
    styles: [ ' :host {  display: block; }'],
    providers: [
        DxTemplateHost,
        WatcherHelper,
        NestedOptionHost,
        IterableDifferHelper
    ]
})
export class DxPieChartComponent extends DxComponent implements OnDestroy, OnChanges, DoCheck {
    instance: DxPieChart = null;

    /**
     * [descr:dxPieChartOptions.adaptiveLayout]
    
     */
    @Input()
    get adaptiveLayout(): Record<string, any> | { height?: number, keepLabels?: boolean, width?: number } {
        return this._getOption('adaptiveLayout');
    }
    set adaptiveLayout(value: Record<string, any> | { height?: number, keepLabels?: boolean, width?: number }) {
        this._setOption('adaptiveLayout', value);
    }


    /**
     * [descr:BaseChartOptions.animation]
    
     */
    @Input()
    get animation(): boolean | Record<string, any> | { duration?: number, easing?: "easeOutCubic" | "linear", enabled?: boolean, maxPointCountSupported?: number } {
        return this._getOption('animation');
    }
    set animation(value: boolean | Record<string, any> | { duration?: number, easing?: "easeOutCubic" | "linear", enabled?: boolean, maxPointCountSupported?: number }) {
        this._setOption('animation', value);
    }


    /**
     * [descr:dxPieChartOptions.annotations]
    
     */
    @Input()
    get annotations(): Array<any | dxPieChartAnnotationConfig> {
        return this._getOption('annotations');
    }
    set annotations(value: Array<any | dxPieChartAnnotationConfig>) {
        this._setOption('annotations', value);
    }


    /**
     * [descr:dxPieChartOptions.centerTemplate]
    
     */
    @Input()
    get centerTemplate(): any {
        return this._getOption('centerTemplate');
    }
    set centerTemplate(value: any) {
        this._setOption('centerTemplate', value);
    }


    /**
     * [descr:dxPieChartOptions.commonAnnotationSettings]
    
     */
    @Input()
    get commonAnnotationSettings(): dxPieChartCommonAnnotationConfig {
        return this._getOption('commonAnnotationSettings');
    }
    set commonAnnotationSettings(value: dxPieChartCommonAnnotationConfig) {
        this._setOption('commonAnnotationSettings', value);
    }


    /**
     * [descr:dxPieChartOptions.commonSeriesSettings]
    
     */
    @Input()
    get commonSeriesSettings(): any | { argumentField?: string, argumentType?: "datetime" | "numeric" | "string", border?: Record<string, any> | { color?: string, dashStyle?: "dash" | "dot" | "longDash" | "solid", visible?: boolean, width?: number }, color?: ChartsColor | string, hoverMode?: "none" | "onlyPoint", hoverStyle?: Record<string, any> | { border?: Record<string, any> | { color?: string, dashStyle?: "dash" | "dot" | "longDash" | "solid", visible?: boolean, width?: number }, color?: ChartsColor | string, hatching?: Record<string, any> | { direction?: "left" | "none" | "right", opacity?: number, step?: number, width?: number }, highlight?: boolean }, label?: Record<string, any> | { argumentFormat?: LocalizationTypes.Format, backgroundColor?: string, border?: Record<string, any> | { color?: string, dashStyle?: "dash" | "dot" | "longDash" | "solid", visible?: boolean, width?: number }, connector?: Record<string, any> | { color?: string, visible?: boolean, width?: number }, customizeText?: ((pointInfo: any) => string), displayFormat?: string, font?: Font, format?: LocalizationTypes.Format, position?: "columns" | "inside" | "outside", radialOffset?: number, rotationAngle?: number, textOverflow?: "ellipsis" | "hide" | "none", visible?: boolean, wordWrap?: "normal" | "breakWord" | "none" }, maxLabelCount?: number, minSegmentSize?: number, selectionMode?: "none" | "onlyPoint", selectionStyle?: Record<string, any> | { border?: Record<string, any> | { color?: string, dashStyle?: "dash" | "dot" | "longDash" | "solid", visible?: boolean, width?: number }, color?: ChartsColor | string, hatching?: Record<string, any> | { direction?: "left" | "none" | "right", opacity?: number, step?: number, width?: number }, highlight?: boolean }, smallValuesGrouping?: Record<string, any> | { groupName?: string, mode?: "none" | "smallValueThreshold" | "topN", threshold?: number, topCount?: number }, tagField?: string, valueField?: string } {
        return this._getOption('commonSeriesSettings');
    }
    set commonSeriesSettings(value: any | { argumentField?: string, argumentType?: "datetime" | "numeric" | "string", border?: Record<string, any> | { color?: string, dashStyle?: "dash" | "dot" | "longDash" | "solid", visible?: boolean, width?: number }, color?: ChartsColor | string, hoverMode?: "none" | "onlyPoint", hoverStyle?: Record<string, any> | { border?: Record<string, any> | { color?: string, dashStyle?: "dash" | "dot" | "longDash" | "solid", visible?: boolean, width?: number }, color?: ChartsColor | string, hatching?: Record<string, any> | { direction?: "left" | "none" | "right", opacity?: number, step?: number, width?: number }, highlight?: boolean }, label?: Record<string, any> | { argumentFormat?: LocalizationTypes.Format, backgroundColor?: string, border?: Record<string, any> | { color?: string, dashStyle?: "dash" | "dot" | "longDash" | "solid", visible?: boolean, width?: number }, connector?: Record<string, any> | { color?: string, visible?: boolean, width?: number }, customizeText?: ((pointInfo: any) => string), displayFormat?: string, font?: Font, format?: LocalizationTypes.Format, position?: "columns" | "inside" | "outside", radialOffset?: number, rotationAngle?: number, textOverflow?: "ellipsis" | "hide" | "none", visible?: boolean, wordWrap?: "normal" | "breakWord" | "none" }, maxLabelCount?: number, minSegmentSize?: number, selectionMode?: "none" | "onlyPoint", selectionStyle?: Record<string, any> | { border?: Record<string, any> | { color?: string, dashStyle?: "dash" | "dot" | "longDash" | "solid", visible?: boolean, width?: number }, color?: ChartsColor | string, hatching?: Record<string, any> | { direction?: "left" | "none" | "right", opacity?: number, step?: number, width?: number }, highlight?: boolean }, smallValuesGrouping?: Record<string, any> | { groupName?: string, mode?: "none" | "smallValueThreshold" | "topN", threshold?: number, topCount?: number }, tagField?: string, valueField?: string }) {
        this._setOption('commonSeriesSettings', value);
    }


    /**
     * [descr:dxPieChartOptions.customizeAnnotation]
    
     */
    @Input()
    get customizeAnnotation(): ((annotation: dxPieChartAnnotationConfig | any) => dxPieChartAnnotationConfig) {
        return this._getOption('customizeAnnotation');
    }
    set customizeAnnotation(value: ((annotation: dxPieChartAnnotationConfig | any) => dxPieChartAnnotationConfig)) {
        this._setOption('customizeAnnotation', value);
    }


    /**
     * [descr:BaseChartOptions.customizeLabel]
    
     */
    @Input()
    get customizeLabel(): ((pointInfo: any) => dxChartSeriesTypes.CommonSeries.label) {
        return this._getOption('customizeLabel');
    }
    set customizeLabel(value: ((pointInfo: any) => dxChartSeriesTypes.CommonSeries.label)) {
        this._setOption('customizeLabel', value);
    }


    /**
     * [descr:BaseChartOptions.customizePoint]
    
     */
    @Input()
    get customizePoint(): ((pointInfo: any) => dxChartSeriesTypes.CommonSeries.point) {
        return this._getOption('customizePoint');
    }
    set customizePoint(value: ((pointInfo: any) => dxChartSeriesTypes.CommonSeries.point)) {
        this._setOption('customizePoint', value);
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
     * [descr:dxPieChartOptions.diameter]
    
     */
    @Input()
    get diameter(): number {
        return this._getOption('diameter');
    }
    set diameter(value: number) {
        this._setOption('diameter', value);
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
    get export(): Record<string, any> | { backgroundColor?: string, enabled?: boolean, fileName?: string, formats?: Array<"GIF" | "JPEG" | "PDF" | "PNG" | "SVG">, margin?: number, printingEnabled?: boolean, svgToCanvas?: ((svg: any, canvas: any) => any) } {
        return this._getOption('export');
    }
    set export(value: Record<string, any> | { backgroundColor?: string, enabled?: boolean, fileName?: string, formats?: Array<"GIF" | "JPEG" | "PDF" | "PNG" | "SVG">, margin?: number, printingEnabled?: boolean, svgToCanvas?: ((svg: any, canvas: any) => any) }) {
        this._setOption('export', value);
    }


    /**
     * [descr:dxPieChartOptions.innerRadius]
    
     */
    @Input()
    get innerRadius(): number {
        return this._getOption('innerRadius');
    }
    set innerRadius(value: number) {
        this._setOption('innerRadius', value);
    }


    /**
     * [descr:dxPieChartOptions.legend]
    
     */
    @Input()
    get legend(): Record<string, any> | { backgroundColor?: string, border?: Record<string, any> | { color?: string, cornerRadius?: number, dashStyle?: "dash" | "dot" | "longDash" | "solid", opacity?: number, visible?: boolean, width?: number }, columnCount?: number, columnItemSpacing?: number, customizeHint?: ((pointInfo: { pointColor: string, pointIndex: number, pointName: any }) => string), customizeItems?: ((items: Array<PieChartLegendItem>) => Array<PieChartLegendItem>), customizeText?: ((pointInfo: { pointColor: string, pointIndex: number, pointName: any }) => string), font?: Font, horizontalAlignment?: "center" | "left" | "right", hoverMode?: "none" | "allArgumentPoints", itemsAlignment?: "center" | "left" | "right", itemTextPosition?: "bottom" | "left" | "right" | "top", margin?: number | Record<string, any> | { bottom?: number, left?: number, right?: number, top?: number }, markerSize?: number, markerTemplate?: any, orientation?: "horizontal" | "vertical", paddingLeftRight?: number, paddingTopBottom?: number, rowCount?: number, rowItemSpacing?: number, title?: string | { font?: Font, horizontalAlignment?: "center" | "left" | "right", margin?: Record<string, any> | { bottom?: number, left?: number, right?: number, top?: number }, placeholderSize?: number, subtitle?: string | { font?: Font, offset?: number, text?: string }, text?: string, verticalAlignment?: "bottom" | "top" }, verticalAlignment?: "bottom" | "top", visible?: boolean } {
        return this._getOption('legend');
    }
    set legend(value: Record<string, any> | { backgroundColor?: string, border?: Record<string, any> | { color?: string, cornerRadius?: number, dashStyle?: "dash" | "dot" | "longDash" | "solid", opacity?: number, visible?: boolean, width?: number }, columnCount?: number, columnItemSpacing?: number, customizeHint?: ((pointInfo: { pointColor: string, pointIndex: number, pointName: any }) => string), customizeItems?: ((items: Array<PieChartLegendItem>) => Array<PieChartLegendItem>), customizeText?: ((pointInfo: { pointColor: string, pointIndex: number, pointName: any }) => string), font?: Font, horizontalAlignment?: "center" | "left" | "right", hoverMode?: "none" | "allArgumentPoints", itemsAlignment?: "center" | "left" | "right", itemTextPosition?: "bottom" | "left" | "right" | "top", margin?: number | Record<string, any> | { bottom?: number, left?: number, right?: number, top?: number }, markerSize?: number, markerTemplate?: any, orientation?: "horizontal" | "vertical", paddingLeftRight?: number, paddingTopBottom?: number, rowCount?: number, rowItemSpacing?: number, title?: string | { font?: Font, horizontalAlignment?: "center" | "left" | "right", margin?: Record<string, any> | { bottom?: number, left?: number, right?: number, top?: number }, placeholderSize?: number, subtitle?: string | { font?: Font, offset?: number, text?: string }, text?: string, verticalAlignment?: "bottom" | "top" }, verticalAlignment?: "bottom" | "top", visible?: boolean }) {
        this._setOption('legend', value);
    }


    /**
     * [descr:BaseWidgetOptions.loadingIndicator]
    
     */
    @Input()
    get loadingIndicator(): Record<string, any> | { backgroundColor?: string, enabled?: boolean, font?: Font, show?: boolean, text?: string } {
        return this._getOption('loadingIndicator');
    }
    set loadingIndicator(value: Record<string, any> | { backgroundColor?: string, enabled?: boolean, font?: Font, show?: boolean, text?: string }) {
        this._setOption('loadingIndicator', value);
    }


    /**
     * [descr:BaseWidgetOptions.margin]
    
     */
    @Input()
    get margin(): Record<string, any> | { bottom?: number, left?: number, right?: number, top?: number } {
        return this._getOption('margin');
    }
    set margin(value: Record<string, any> | { bottom?: number, left?: number, right?: number, top?: number }) {
        this._setOption('margin', value);
    }


    /**
     * [descr:dxPieChartOptions.minDiameter]
    
     */
    @Input()
    get minDiameter(): number {
        return this._getOption('minDiameter');
    }
    set minDiameter(value: number) {
        this._setOption('minDiameter', value);
    }


    /**
     * [descr:dxPieChartOptions.palette]
    
     */
    @Input()
    get palette(): Array<string> | "Bright" | "Harmony Light" | "Ocean" | "Pastel" | "Soft" | "Soft Pastel" | "Vintage" | "Violet" | "Carmine" | "Dark Moon" | "Dark Violet" | "Green Mist" | "Soft Blue" | "Material" | "Office" {
        return this._getOption('palette');
    }
    set palette(value: Array<string> | "Bright" | "Harmony Light" | "Ocean" | "Pastel" | "Soft" | "Soft Pastel" | "Vintage" | "Violet" | "Carmine" | "Dark Moon" | "Dark Violet" | "Green Mist" | "Soft Blue" | "Material" | "Office") {
        this._setOption('palette', value);
    }


    /**
     * [descr:BaseChartOptions.paletteExtensionMode]
    
     */
    @Input()
    get paletteExtensionMode(): "alternate" | "blend" | "extrapolate" {
        return this._getOption('paletteExtensionMode');
    }
    set paletteExtensionMode(value: "alternate" | "blend" | "extrapolate") {
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
    get pointSelectionMode(): "single" | "multiple" {
        return this._getOption('pointSelectionMode');
    }
    set pointSelectionMode(value: "single" | "multiple") {
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
     * [descr:dxPieChartOptions.resolveLabelOverlapping]
    
     */
    @Input()
    get resolveLabelOverlapping(): "hide" | "none" | "shift" {
        return this._getOption('resolveLabelOverlapping');
    }
    set resolveLabelOverlapping(value: "hide" | "none" | "shift") {
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
     * [descr:dxPieChartOptions.segmentsDirection]
    
     */
    @Input()
    get segmentsDirection(): "anticlockwise" | "clockwise" {
        return this._getOption('segmentsDirection');
    }
    set segmentsDirection(value: "anticlockwise" | "clockwise") {
        this._setOption('segmentsDirection', value);
    }


    /**
     * [descr:dxPieChartOptions.series]
    
     */
    @Input()
    get series(): Array<PieChartSeries> | PieChartSeries {
        return this._getOption('series');
    }
    set series(value: Array<PieChartSeries> | PieChartSeries) {
        this._setOption('series', value);
    }


    /**
     * [descr:dxPieChartOptions.seriesTemplate]
    
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
    get size(): Record<string, any> | { height?: number, width?: number } {
        return this._getOption('size');
    }
    set size(value: Record<string, any> | { height?: number, width?: number }) {
        this._setOption('size', value);
    }


    /**
     * [descr:dxPieChartOptions.sizeGroup]
    
     */
    @Input()
    get sizeGroup(): string {
        return this._getOption('sizeGroup');
    }
    set sizeGroup(value: string) {
        this._setOption('sizeGroup', value);
    }


    /**
     * [descr:dxPieChartOptions.startAngle]
    
     */
    @Input()
    get startAngle(): number {
        return this._getOption('startAngle');
    }
    set startAngle(value: number) {
        this._setOption('startAngle', value);
    }


    /**
     * [descr:BaseWidgetOptions.theme]
    
     */
    @Input()
    get theme(): "generic.dark" | "generic.light" | "generic.contrast" | "generic.carmine" | "generic.darkmoon" | "generic.darkviolet" | "generic.greenmist" | "generic.softblue" | "material.blue.light" | "material.lime.light" | "material.orange.light" | "material.purple.light" | "material.teal.light" {
        return this._getOption('theme');
    }
    set theme(value: "generic.dark" | "generic.light" | "generic.contrast" | "generic.carmine" | "generic.darkmoon" | "generic.darkviolet" | "generic.greenmist" | "generic.softblue" | "material.blue.light" | "material.lime.light" | "material.orange.light" | "material.purple.light" | "material.teal.light") {
        this._setOption('theme', value);
    }


    /**
     * [descr:BaseWidgetOptions.title]
    
     */
    @Input()
    get title(): string | { font?: Font, horizontalAlignment?: "center" | "left" | "right", margin?: number | Record<string, any> | { bottom?: number, left?: number, right?: number, top?: number }, placeholderSize?: number, subtitle?: string | { font?: Font, offset?: number, text?: string, textOverflow?: "ellipsis" | "hide" | "none", wordWrap?: "normal" | "breakWord" | "none" }, text?: string, textOverflow?: "ellipsis" | "hide" | "none", verticalAlignment?: "bottom" | "top", wordWrap?: "normal" | "breakWord" | "none" } {
        return this._getOption('title');
    }
    set title(value: string | { font?: Font, horizontalAlignment?: "center" | "left" | "right", margin?: number | Record<string, any> | { bottom?: number, left?: number, right?: number, top?: number }, placeholderSize?: number, subtitle?: string | { font?: Font, offset?: number, text?: string, textOverflow?: "ellipsis" | "hide" | "none", wordWrap?: "normal" | "breakWord" | "none" }, text?: string, textOverflow?: "ellipsis" | "hide" | "none", verticalAlignment?: "bottom" | "top", wordWrap?: "normal" | "breakWord" | "none" }) {
        this._setOption('title', value);
    }


    /**
     * [descr:BaseChartOptions.tooltip]
    
     */
    @Input()
    get tooltip(): Record<string, any> | { argumentFormat?: LocalizationTypes.Format, arrowLength?: number, border?: Record<string, any> | { color?: string, dashStyle?: "dash" | "dot" | "longDash" | "solid", opacity?: number, visible?: boolean, width?: number }, color?: string, container?: any | string, contentTemplate?: any, cornerRadius?: number, customizeTooltip?: ((pointInfo: any) => Record<string, any>), enabled?: boolean, font?: Font, format?: LocalizationTypes.Format, interactive?: boolean, opacity?: number, paddingLeftRight?: number, paddingTopBottom?: number, shadow?: Record<string, any> | { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number }, shared?: boolean, zIndex?: number } {
        return this._getOption('tooltip');
    }
    set tooltip(value: Record<string, any> | { argumentFormat?: LocalizationTypes.Format, arrowLength?: number, border?: Record<string, any> | { color?: string, dashStyle?: "dash" | "dot" | "longDash" | "solid", opacity?: number, visible?: boolean, width?: number }, color?: string, container?: any | string, contentTemplate?: any, cornerRadius?: number, customizeTooltip?: ((pointInfo: any) => Record<string, any>), enabled?: boolean, font?: Font, format?: LocalizationTypes.Format, interactive?: boolean, opacity?: number, paddingLeftRight?: number, paddingTopBottom?: number, shadow?: Record<string, any> | { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number }, shared?: boolean, zIndex?: number }) {
        this._setOption('tooltip', value);
    }


    /**
     * [descr:dxPieChartOptions.type]
    
     */
    @Input()
    get type(): "donut" | "doughnut" | "pie" {
        return this._getOption('type');
    }
    set type(value: "donut" | "doughnut" | "pie") {
        this._setOption('type', value);
    }

    /**
    
     * [descr:dxPieChartOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<DisposingEvent>;

    /**
    
     * [descr:dxPieChartOptions.onDone]
    
    
     */
    @Output() onDone: EventEmitter<DoneEvent>;

    /**
    
     * [descr:dxPieChartOptions.onDrawn]
    
    
     */
    @Output() onDrawn: EventEmitter<DrawnEvent>;

    /**
    
     * [descr:dxPieChartOptions.onExported]
    
    
     */
    @Output() onExported: EventEmitter<ExportedEvent>;

    /**
    
     * [descr:dxPieChartOptions.onExporting]
    
    
     */
    @Output() onExporting: EventEmitter<ExportingEvent>;

    /**
    
     * [descr:dxPieChartOptions.onFileSaving]
    
    
     */
    @Output() onFileSaving: EventEmitter<FileSavingEvent>;

    /**
    
     * [descr:dxPieChartOptions.onIncidentOccurred]
    
    
     */
    @Output() onIncidentOccurred: EventEmitter<IncidentOccurredEvent>;

    /**
    
     * [descr:dxPieChartOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<InitializedEvent>;

    /**
    
     * [descr:dxPieChartOptions.onLegendClick]
    
    
     */
    @Output() onLegendClick: EventEmitter<LegendClickEvent>;

    /**
    
     * [descr:dxPieChartOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<OptionChangedEvent>;

    /**
    
     * [descr:dxPieChartOptions.onPointClick]
    
    
     */
    @Output() onPointClick: EventEmitter<PointClickEvent>;

    /**
    
     * [descr:dxPieChartOptions.onPointHoverChanged]
    
    
     */
    @Output() onPointHoverChanged: EventEmitter<PointHoverChangedEvent>;

    /**
    
     * [descr:dxPieChartOptions.onPointSelectionChanged]
    
    
     */
    @Output() onPointSelectionChanged: EventEmitter<PointSelectionChangedEvent>;

    /**
    
     * [descr:dxPieChartOptions.onTooltipHidden]
    
    
     */
    @Output() onTooltipHidden: EventEmitter<TooltipHiddenEvent>;

    /**
    
     * [descr:dxPieChartOptions.onTooltipShown]
    
    
     */
    @Output() onTooltipShown: EventEmitter<TooltipShownEvent>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() adaptiveLayoutChange: EventEmitter<Record<string, any> | { height?: number, keepLabels?: boolean, width?: number }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() animationChange: EventEmitter<boolean | Record<string, any> | { duration?: number, easing?: "easeOutCubic" | "linear", enabled?: boolean, maxPointCountSupported?: number }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() annotationsChange: EventEmitter<Array<any | dxPieChartAnnotationConfig>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() centerTemplateChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() commonAnnotationSettingsChange: EventEmitter<dxPieChartCommonAnnotationConfig>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() commonSeriesSettingsChange: EventEmitter<any | { argumentField?: string, argumentType?: "datetime" | "numeric" | "string", border?: Record<string, any> | { color?: string, dashStyle?: "dash" | "dot" | "longDash" | "solid", visible?: boolean, width?: number }, color?: ChartsColor | string, hoverMode?: "none" | "onlyPoint", hoverStyle?: Record<string, any> | { border?: Record<string, any> | { color?: string, dashStyle?: "dash" | "dot" | "longDash" | "solid", visible?: boolean, width?: number }, color?: ChartsColor | string, hatching?: Record<string, any> | { direction?: "left" | "none" | "right", opacity?: number, step?: number, width?: number }, highlight?: boolean }, label?: Record<string, any> | { argumentFormat?: LocalizationTypes.Format, backgroundColor?: string, border?: Record<string, any> | { color?: string, dashStyle?: "dash" | "dot" | "longDash" | "solid", visible?: boolean, width?: number }, connector?: Record<string, any> | { color?: string, visible?: boolean, width?: number }, customizeText?: ((pointInfo: any) => string), displayFormat?: string, font?: Font, format?: LocalizationTypes.Format, position?: "columns" | "inside" | "outside", radialOffset?: number, rotationAngle?: number, textOverflow?: "ellipsis" | "hide" | "none", visible?: boolean, wordWrap?: "normal" | "breakWord" | "none" }, maxLabelCount?: number, minSegmentSize?: number, selectionMode?: "none" | "onlyPoint", selectionStyle?: Record<string, any> | { border?: Record<string, any> | { color?: string, dashStyle?: "dash" | "dot" | "longDash" | "solid", visible?: boolean, width?: number }, color?: ChartsColor | string, hatching?: Record<string, any> | { direction?: "left" | "none" | "right", opacity?: number, step?: number, width?: number }, highlight?: boolean }, smallValuesGrouping?: Record<string, any> | { groupName?: string, mode?: "none" | "smallValueThreshold" | "topN", threshold?: number, topCount?: number }, tagField?: string, valueField?: string }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() customizeAnnotationChange: EventEmitter<((annotation: dxPieChartAnnotationConfig | any) => dxPieChartAnnotationConfig)>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() customizeLabelChange: EventEmitter<((pointInfo: any) => dxChartSeriesTypes.CommonSeries.label)>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() customizePointChange: EventEmitter<((pointInfo: any) => dxChartSeriesTypes.CommonSeries.point)>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() dataSourceChange: EventEmitter<Array<any> | DataSource | DataSourceOptions | null | Store | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() diameterChange: EventEmitter<number>;

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
    @Output() exportChange: EventEmitter<Record<string, any> | { backgroundColor?: string, enabled?: boolean, fileName?: string, formats?: Array<"GIF" | "JPEG" | "PDF" | "PNG" | "SVG">, margin?: number, printingEnabled?: boolean, svgToCanvas?: ((svg: any, canvas: any) => any) }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() innerRadiusChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() legendChange: EventEmitter<Record<string, any> | { backgroundColor?: string, border?: Record<string, any> | { color?: string, cornerRadius?: number, dashStyle?: "dash" | "dot" | "longDash" | "solid", opacity?: number, visible?: boolean, width?: number }, columnCount?: number, columnItemSpacing?: number, customizeHint?: ((pointInfo: { pointColor: string, pointIndex: number, pointName: any }) => string), customizeItems?: ((items: Array<PieChartLegendItem>) => Array<PieChartLegendItem>), customizeText?: ((pointInfo: { pointColor: string, pointIndex: number, pointName: any }) => string), font?: Font, horizontalAlignment?: "center" | "left" | "right", hoverMode?: "none" | "allArgumentPoints", itemsAlignment?: "center" | "left" | "right", itemTextPosition?: "bottom" | "left" | "right" | "top", margin?: number | Record<string, any> | { bottom?: number, left?: number, right?: number, top?: number }, markerSize?: number, markerTemplate?: any, orientation?: "horizontal" | "vertical", paddingLeftRight?: number, paddingTopBottom?: number, rowCount?: number, rowItemSpacing?: number, title?: string | { font?: Font, horizontalAlignment?: "center" | "left" | "right", margin?: Record<string, any> | { bottom?: number, left?: number, right?: number, top?: number }, placeholderSize?: number, subtitle?: string | { font?: Font, offset?: number, text?: string }, text?: string, verticalAlignment?: "bottom" | "top" }, verticalAlignment?: "bottom" | "top", visible?: boolean }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() loadingIndicatorChange: EventEmitter<Record<string, any> | { backgroundColor?: string, enabled?: boolean, font?: Font, show?: boolean, text?: string }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() marginChange: EventEmitter<Record<string, any> | { bottom?: number, left?: number, right?: number, top?: number }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() minDiameterChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() paletteChange: EventEmitter<Array<string> | "Bright" | "Harmony Light" | "Ocean" | "Pastel" | "Soft" | "Soft Pastel" | "Vintage" | "Violet" | "Carmine" | "Dark Moon" | "Dark Violet" | "Green Mist" | "Soft Blue" | "Material" | "Office">;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() paletteExtensionModeChange: EventEmitter<"alternate" | "blend" | "extrapolate">;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() pathModifiedChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() pointSelectionModeChange: EventEmitter<"single" | "multiple">;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() redrawOnResizeChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() resolveLabelOverlappingChange: EventEmitter<"hide" | "none" | "shift">;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() rtlEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() segmentsDirectionChange: EventEmitter<"anticlockwise" | "clockwise">;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() seriesChange: EventEmitter<Array<PieChartSeries> | PieChartSeries>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() seriesTemplateChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() sizeChange: EventEmitter<Record<string, any> | { height?: number, width?: number }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() sizeGroupChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() startAngleChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() themeChange: EventEmitter<"generic.dark" | "generic.light" | "generic.contrast" | "generic.carmine" | "generic.darkmoon" | "generic.darkviolet" | "generic.greenmist" | "generic.softblue" | "material.blue.light" | "material.lime.light" | "material.orange.light" | "material.purple.light" | "material.teal.light">;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() titleChange: EventEmitter<string | { font?: Font, horizontalAlignment?: "center" | "left" | "right", margin?: number | Record<string, any> | { bottom?: number, left?: number, right?: number, top?: number }, placeholderSize?: number, subtitle?: string | { font?: Font, offset?: number, text?: string, textOverflow?: "ellipsis" | "hide" | "none", wordWrap?: "normal" | "breakWord" | "none" }, text?: string, textOverflow?: "ellipsis" | "hide" | "none", verticalAlignment?: "bottom" | "top", wordWrap?: "normal" | "breakWord" | "none" }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() tooltipChange: EventEmitter<Record<string, any> | { argumentFormat?: LocalizationTypes.Format, arrowLength?: number, border?: Record<string, any> | { color?: string, dashStyle?: "dash" | "dot" | "longDash" | "solid", opacity?: number, visible?: boolean, width?: number }, color?: string, container?: any | string, contentTemplate?: any, cornerRadius?: number, customizeTooltip?: ((pointInfo: any) => Record<string, any>), enabled?: boolean, font?: Font, format?: LocalizationTypes.Format, interactive?: boolean, opacity?: number, paddingLeftRight?: number, paddingTopBottom?: number, shadow?: Record<string, any> | { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number }, shared?: boolean, zIndex?: number }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() typeChange: EventEmitter<"donut" | "doughnut" | "pie">;




    @ContentChildren(DxiPieChartAnnotationComponent)
    get annotationsChildren(): QueryList<DxiPieChartAnnotationComponent> {
        return this._getOption('annotations');
    }
    set annotationsChildren(value) {
        this.setContentChildren('annotations', value, 'DxiPieChartAnnotationComponent');
        this.setChildren('annotations', value);
    }

    @ContentChildren(DxiPieChartSeriesComponent)
    get seriesChildren(): QueryList<DxiPieChartSeriesComponent> {
        return this._getOption('series');
    }
    set seriesChildren(value) {
        this.setContentChildren('series', value, 'DxiPieChartSeriesComponent');
        this.setChildren('series', value);
    }


    @ContentChildren(DxiAnnotationComponent)
    get annotationsLegacyChildren(): QueryList<DxiAnnotationComponent> {
        return this._getOption('annotations');
    }
    set annotationsLegacyChildren(value) {
        if (this.checkContentChildren('annotations', value, 'DxiAnnotationComponent')) {
           this.setChildren('annotations', value);
        }
    }

    @ContentChildren(DxiSeriesComponent)
    get seriesLegacyChildren(): QueryList<DxiSeriesComponent> {
        return this._getOption('series');
    }
    set seriesLegacyChildren(value) {
        if (this.checkContentChildren('series', value, 'DxiSeriesComponent')) {
           this.setChildren('series', value);
        }
    }




    constructor(elementRef: ElementRef, ngZone: NgZone, templateHost: DxTemplateHost,
            private _watcherHelper: WatcherHelper,
            private _idh: IterableDifferHelper,
            optionHost: NestedOptionHost,
            transferState: TransferState,
            @Inject(PLATFORM_ID) platformId: any) {

        super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);

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

    protected _createInstance(element, options) {

        return new DxPieChart(element, options);
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
    DxoPieChartAdaptiveLayoutModule,
    DxoPieChartAnimationModule,
    DxiPieChartAnnotationModule,
    DxoPieChartAnnotationBorderModule,
    DxoPieChartArgumentFormatModule,
    DxoPieChartBorderModule,
    DxoPieChartColorModule,
    DxoPieChartCommonAnnotationSettingsModule,
    DxoPieChartCommonSeriesSettingsModule,
    DxoPieChartConnectorModule,
    DxoPieChartExportModule,
    DxoPieChartFontModule,
    DxoPieChartFormatModule,
    DxoPieChartHatchingModule,
    DxoPieChartHoverStyleModule,
    DxoPieChartImageModule,
    DxoPieChartLabelModule,
    DxoPieChartLegendModule,
    DxoPieChartLegendTitleModule,
    DxoPieChartLegendTitleSubtitleModule,
    DxoPieChartLoadingIndicatorModule,
    DxoPieChartMarginModule,
    DxoPieChartPieChartTitleModule,
    DxoPieChartPieChartTitleSubtitleModule,
    DxoPieChartSelectionStyleModule,
    DxiPieChartSeriesModule,
    DxoPieChartSeriesBorderModule,
    DxoPieChartSeriesTemplateModule,
    DxoPieChartShadowModule,
    DxoPieChartSizeModule,
    DxoPieChartSmallValuesGroupingModule,
    DxoPieChartSubtitleModule,
    DxoPieChartTitleModule,
    DxoPieChartTooltipModule,
    DxoPieChartTooltipBorderModule,
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
    DxoPieChartAdaptiveLayoutModule,
    DxoPieChartAnimationModule,
    DxiPieChartAnnotationModule,
    DxoPieChartAnnotationBorderModule,
    DxoPieChartArgumentFormatModule,
    DxoPieChartBorderModule,
    DxoPieChartColorModule,
    DxoPieChartCommonAnnotationSettingsModule,
    DxoPieChartCommonSeriesSettingsModule,
    DxoPieChartConnectorModule,
    DxoPieChartExportModule,
    DxoPieChartFontModule,
    DxoPieChartFormatModule,
    DxoPieChartHatchingModule,
    DxoPieChartHoverStyleModule,
    DxoPieChartImageModule,
    DxoPieChartLabelModule,
    DxoPieChartLegendModule,
    DxoPieChartLegendTitleModule,
    DxoPieChartLegendTitleSubtitleModule,
    DxoPieChartLoadingIndicatorModule,
    DxoPieChartMarginModule,
    DxoPieChartPieChartTitleModule,
    DxoPieChartPieChartTitleSubtitleModule,
    DxoPieChartSelectionStyleModule,
    DxiPieChartSeriesModule,
    DxoPieChartSeriesBorderModule,
    DxoPieChartSeriesTemplateModule,
    DxoPieChartShadowModule,
    DxoPieChartSizeModule,
    DxoPieChartSmallValuesGroupingModule,
    DxoPieChartSubtitleModule,
    DxoPieChartTitleModule,
    DxoPieChartTooltipModule,
    DxoPieChartTooltipBorderModule,
    DxTemplateModule
  ]
})
export class DxPieChartModule { }

import type * as DxPieChartTypes from "devextreme/viz/pie_chart_types";
export { DxPieChartTypes };


