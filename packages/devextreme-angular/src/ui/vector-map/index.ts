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
import { dxVectorMapAnnotationConfig, dxVectorMapCommonAnnotationConfig, MapLayerElement, VectorMapMarkerType, VectorMapLayerType, VectorMapLegendItem, VectorMapMarkerShape, CenterChangedEvent, ClickEvent, DisposingEvent, DrawnEvent, ExportedEvent, ExportingEvent, FileSavingEvent, IncidentOccurredEvent, InitializedEvent, OptionChangedEvent, SelectionChangedEvent, TooltipHiddenEvent, TooltipShownEvent, ZoomFactorChangedEvent } from 'devextreme/viz/vector_map';
import { HorizontalAlignment, VerticalEdge, ExportFormat, SingleMultipleOrNone, Position, Orientation } from 'devextreme/common';
import { DataSourceOptions } from 'devextreme/data/data_source';
import { Store } from 'devextreme/data/store';
import { Font, Palette, DashStyle, Theme, TextOverflow, WordWrap } from 'devextreme/common/charts';
import { VectorMapProjection, VectorMapProjectionConfig } from 'devextreme/viz/vector_map/projection';

import DxVectorMap from 'devextreme/viz/vector_map';


import {
    DxComponent,
    DxTemplateHost,
    DxIntegrationModule,
    DxTemplateModule,
    NestedOptionHost,
    IterableDifferHelper,
    WatcherHelper
} from 'devextreme-angular/core';

import { DxiAnnotationModule } from 'devextreme-angular/ui/nested';
import { DxoBorderModule } from 'devextreme-angular/ui/nested';
import { DxoFontModule } from 'devextreme-angular/ui/nested';
import { DxoImageModule } from 'devextreme-angular/ui/nested';
import { DxoShadowModule } from 'devextreme-angular/ui/nested';
import { DxoBackgroundModule } from 'devextreme-angular/ui/nested';
import { DxoCommonAnnotationSettingsModule } from 'devextreme-angular/ui/nested';
import { DxoControlBarModule } from 'devextreme-angular/ui/nested';
import { DxoExportModule } from 'devextreme-angular/ui/nested';
import { DxiLayerModule } from 'devextreme-angular/ui/nested';
import { DxoLabelModule } from 'devextreme-angular/ui/nested';
import { DxiLegendModule } from 'devextreme-angular/ui/nested';
import { DxoMarginModule } from 'devextreme-angular/ui/nested';
import { DxoSourceModule } from 'devextreme-angular/ui/nested';
import { DxoTitleModule } from 'devextreme-angular/ui/nested';
import { DxoSubtitleModule } from 'devextreme-angular/ui/nested';
import { DxoLoadingIndicatorModule } from 'devextreme-angular/ui/nested';
import { DxoProjectionModule } from 'devextreme-angular/ui/nested';
import { DxoSizeModule } from 'devextreme-angular/ui/nested';
import { DxoTooltipModule } from 'devextreme-angular/ui/nested';

import { DxiVectorMapAnnotationModule } from 'devextreme-angular/ui/vector-map/nested';
import { DxoVectorMapAnnotationBorderModule } from 'devextreme-angular/ui/vector-map/nested';
import { DxoVectorMapBackgroundModule } from 'devextreme-angular/ui/vector-map/nested';
import { DxoVectorMapBorderModule } from 'devextreme-angular/ui/vector-map/nested';
import { DxoVectorMapCommonAnnotationSettingsModule } from 'devextreme-angular/ui/vector-map/nested';
import { DxoVectorMapControlBarModule } from 'devextreme-angular/ui/vector-map/nested';
import { DxoVectorMapExportModule } from 'devextreme-angular/ui/vector-map/nested';
import { DxoVectorMapFontModule } from 'devextreme-angular/ui/vector-map/nested';
import { DxoVectorMapImageModule } from 'devextreme-angular/ui/vector-map/nested';
import { DxoVectorMapLabelModule } from 'devextreme-angular/ui/vector-map/nested';
import { DxiVectorMapLayerModule } from 'devextreme-angular/ui/vector-map/nested';
import { DxiVectorMapLegendModule } from 'devextreme-angular/ui/vector-map/nested';
import { DxoVectorMapLegendTitleModule } from 'devextreme-angular/ui/vector-map/nested';
import { DxoVectorMapLegendTitleSubtitleModule } from 'devextreme-angular/ui/vector-map/nested';
import { DxoVectorMapLoadingIndicatorModule } from 'devextreme-angular/ui/vector-map/nested';
import { DxoVectorMapMarginModule } from 'devextreme-angular/ui/vector-map/nested';
import { DxoVectorMapProjectionModule } from 'devextreme-angular/ui/vector-map/nested';
import { DxoVectorMapShadowModule } from 'devextreme-angular/ui/vector-map/nested';
import { DxoVectorMapSizeModule } from 'devextreme-angular/ui/vector-map/nested';
import { DxoVectorMapSourceModule } from 'devextreme-angular/ui/vector-map/nested';
import { DxoVectorMapSubtitleModule } from 'devextreme-angular/ui/vector-map/nested';
import { DxoVectorMapTitleModule } from 'devextreme-angular/ui/vector-map/nested';
import { DxoVectorMapTooltipModule } from 'devextreme-angular/ui/vector-map/nested';
import { DxoVectorMapTooltipBorderModule } from 'devextreme-angular/ui/vector-map/nested';
import { DxoVectorMapVectorMapTitleModule } from 'devextreme-angular/ui/vector-map/nested';
import { DxoVectorMapVectorMapTitleSubtitleModule } from 'devextreme-angular/ui/vector-map/nested';

import { DxiAnnotationComponent } from 'devextreme-angular/ui/nested';
import { DxiLayerComponent } from 'devextreme-angular/ui/nested';
import { DxiLegendComponent } from 'devextreme-angular/ui/nested';

import { DxiVectorMapAnnotationComponent } from 'devextreme-angular/ui/vector-map/nested';
import { DxiVectorMapLayerComponent } from 'devextreme-angular/ui/vector-map/nested';
import { DxiVectorMapLegendComponent } from 'devextreme-angular/ui/vector-map/nested';


/**
 * [descr:dxVectorMap]

 */
@Component({
    selector: 'dx-vector-map',
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
export class DxVectorMapComponent extends DxComponent implements OnDestroy, OnChanges, DoCheck {
    instance: DxVectorMap = null;

    /**
     * [descr:dxVectorMapOptions.annotations]
    
     */
    @Input()
    get annotations(): Array<any | dxVectorMapAnnotationConfig> {
        return this._getOption('annotations');
    }
    set annotations(value: Array<any | dxVectorMapAnnotationConfig>) {
        this._setOption('annotations', value);
    }


    /**
     * [descr:dxVectorMapOptions.background]
    
     */
    @Input()
    get background(): { borderColor?: string, color?: string } {
        return this._getOption('background');
    }
    set background(value: { borderColor?: string, color?: string }) {
        this._setOption('background', value);
    }


    /**
     * [descr:dxVectorMapOptions.bounds]
    
     */
    @Input()
    get bounds(): Array<number> {
        return this._getOption('bounds');
    }
    set bounds(value: Array<number>) {
        this._setOption('bounds', value);
    }


    /**
     * [descr:dxVectorMapOptions.center]
    
     */
    @Input()
    get center(): Array<number> {
        return this._getOption('center');
    }
    set center(value: Array<number>) {
        this._setOption('center', value);
    }


    /**
     * [descr:dxVectorMapOptions.commonAnnotationSettings]
    
     */
    @Input()
    get commonAnnotationSettings(): dxVectorMapCommonAnnotationConfig {
        return this._getOption('commonAnnotationSettings');
    }
    set commonAnnotationSettings(value: dxVectorMapCommonAnnotationConfig) {
        this._setOption('commonAnnotationSettings', value);
    }


    /**
     * [descr:dxVectorMapOptions.controlBar]
    
     */
    @Input()
    get controlBar(): { borderColor?: string, color?: string, enabled?: boolean, horizontalAlignment?: HorizontalAlignment, margin?: number, opacity?: number, panVisible?: boolean, verticalAlignment?: VerticalEdge, zoomVisible?: boolean } {
        return this._getOption('controlBar');
    }
    set controlBar(value: { borderColor?: string, color?: string, enabled?: boolean, horizontalAlignment?: HorizontalAlignment, margin?: number, opacity?: number, panVisible?: boolean, verticalAlignment?: VerticalEdge, zoomVisible?: boolean }) {
        this._setOption('controlBar', value);
    }


    /**
     * [descr:dxVectorMapOptions.customizeAnnotation]
    
     */
    @Input()
    get customizeAnnotation(): ((annotation: dxVectorMapAnnotationConfig | any) => dxVectorMapAnnotationConfig) | undefined {
        return this._getOption('customizeAnnotation');
    }
    set customizeAnnotation(value: ((annotation: dxVectorMapAnnotationConfig | any) => dxVectorMapAnnotationConfig) | undefined) {
        this._setOption('customizeAnnotation', value);
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
     * [descr:dxVectorMapOptions.layers]
    
     */
    @Input()
    get layers(): { borderColor?: string, borderWidth?: number, color?: string, colorGroupingField?: string | undefined, colorGroups?: Array<number>, customize?: ((elements: Array<MapLayerElement>) => void), dataField?: string | undefined, dataSource?: Array<any> | DataSource | DataSourceOptions | null | Record<string, any> | Store | string, elementType?: VectorMapMarkerType, hoveredBorderColor?: string, hoveredBorderWidth?: number, hoveredColor?: string, hoverEnabled?: boolean, label?: { dataField?: string, enabled?: boolean, font?: Font }, maxSize?: number, minSize?: number, name?: string, opacity?: number, palette?: Array<string> | Palette, paletteIndex?: number, paletteSize?: number, selectedBorderColor?: string, selectedBorderWidth?: number, selectedColor?: string, selectionMode?: SingleMultipleOrNone, size?: number, sizeGroupingField?: string | undefined, sizeGroups?: Array<number>, type?: VectorMapLayerType }[] {
        return this._getOption('layers');
    }
    set layers(value: { borderColor?: string, borderWidth?: number, color?: string, colorGroupingField?: string | undefined, colorGroups?: Array<number>, customize?: ((elements: Array<MapLayerElement>) => void), dataField?: string | undefined, dataSource?: Array<any> | DataSource | DataSourceOptions | null | Record<string, any> | Store | string, elementType?: VectorMapMarkerType, hoveredBorderColor?: string, hoveredBorderWidth?: number, hoveredColor?: string, hoverEnabled?: boolean, label?: { dataField?: string, enabled?: boolean, font?: Font }, maxSize?: number, minSize?: number, name?: string, opacity?: number, palette?: Array<string> | Palette, paletteIndex?: number, paletteSize?: number, selectedBorderColor?: string, selectedBorderWidth?: number, selectedColor?: string, selectionMode?: SingleMultipleOrNone, size?: number, sizeGroupingField?: string | undefined, sizeGroups?: Array<number>, type?: VectorMapLayerType }[]) {
        this._setOption('layers', value);
    }


    /**
     * [descr:dxVectorMapOptions.legends]
    
     */
    @Input()
    get legends(): { backgroundColor?: string | undefined, border?: { color?: string, cornerRadius?: number, dashStyle?: DashStyle, opacity?: number | undefined, visible?: boolean, width?: number }, columnCount?: number, columnItemSpacing?: number, customizeHint?: ((itemInfo: { color: string, end: number, index: number, size: number, start: number }) => string), customizeItems?: ((items: Array<VectorMapLegendItem>) => Array<VectorMapLegendItem>), customizeText?: ((itemInfo: { color: string, end: number, index: number, size: number, start: number }) => string), font?: Font, horizontalAlignment?: HorizontalAlignment, itemsAlignment?: HorizontalAlignment | undefined, itemTextPosition?: Position | undefined, margin?: number | { bottom?: number, left?: number, right?: number, top?: number }, markerColor?: string | undefined, markerShape?: VectorMapMarkerShape, markerSize?: number, markerTemplate?: any, orientation?: Orientation | undefined, paddingLeftRight?: number, paddingTopBottom?: number, rowCount?: number, rowItemSpacing?: number, source?: { grouping?: string, layer?: string }, title?: string | { font?: Font, horizontalAlignment?: HorizontalAlignment | undefined, margin?: { bottom?: number, left?: number, right?: number, top?: number }, placeholderSize?: number | undefined, subtitle?: string | { font?: Font, offset?: number, text?: string }, text?: string, verticalAlignment?: VerticalEdge }, verticalAlignment?: VerticalEdge, visible?: boolean }[] {
        return this._getOption('legends');
    }
    set legends(value: { backgroundColor?: string | undefined, border?: { color?: string, cornerRadius?: number, dashStyle?: DashStyle, opacity?: number | undefined, visible?: boolean, width?: number }, columnCount?: number, columnItemSpacing?: number, customizeHint?: ((itemInfo: { color: string, end: number, index: number, size: number, start: number }) => string), customizeItems?: ((items: Array<VectorMapLegendItem>) => Array<VectorMapLegendItem>), customizeText?: ((itemInfo: { color: string, end: number, index: number, size: number, start: number }) => string), font?: Font, horizontalAlignment?: HorizontalAlignment, itemsAlignment?: HorizontalAlignment | undefined, itemTextPosition?: Position | undefined, margin?: number | { bottom?: number, left?: number, right?: number, top?: number }, markerColor?: string | undefined, markerShape?: VectorMapMarkerShape, markerSize?: number, markerTemplate?: any, orientation?: Orientation | undefined, paddingLeftRight?: number, paddingTopBottom?: number, rowCount?: number, rowItemSpacing?: number, source?: { grouping?: string, layer?: string }, title?: string | { font?: Font, horizontalAlignment?: HorizontalAlignment | undefined, margin?: { bottom?: number, left?: number, right?: number, top?: number }, placeholderSize?: number | undefined, subtitle?: string | { font?: Font, offset?: number, text?: string }, text?: string, verticalAlignment?: VerticalEdge }, verticalAlignment?: VerticalEdge, visible?: boolean }[]) {
        this._setOption('legends', value);
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
     * [descr:dxVectorMapOptions.maxZoomFactor]
    
     */
    @Input()
    get maxZoomFactor(): number {
        return this._getOption('maxZoomFactor');
    }
    set maxZoomFactor(value: number) {
        this._setOption('maxZoomFactor', value);
    }


    /**
     * [descr:dxVectorMapOptions.panningEnabled]
    
     */
    @Input()
    get panningEnabled(): boolean {
        return this._getOption('panningEnabled');
    }
    set panningEnabled(value: boolean) {
        this._setOption('panningEnabled', value);
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
     * [descr:dxVectorMapOptions.projection]
    
     */
    @Input()
    get projection(): Record<string, any> | string | VectorMapProjection | VectorMapProjectionConfig {
        return this._getOption('projection');
    }
    set projection(value: Record<string, any> | string | VectorMapProjection | VectorMapProjectionConfig) {
        this._setOption('projection', value);
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
     * [descr:dxVectorMapOptions.tooltip]
    
     */
    @Input()
    get tooltip(): { arrowLength?: number, border?: { color?: string, dashStyle?: DashStyle, opacity?: number | undefined, visible?: boolean, width?: number }, color?: string, container?: any | string | undefined, contentTemplate?: any, cornerRadius?: number, customizeTooltip?: ((info: MapLayerElement) => Record<string, any>) | undefined, enabled?: boolean, font?: Font, opacity?: number | undefined, paddingLeftRight?: number, paddingTopBottom?: number, shadow?: { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number }, zIndex?: number | undefined } {
        return this._getOption('tooltip');
    }
    set tooltip(value: { arrowLength?: number, border?: { color?: string, dashStyle?: DashStyle, opacity?: number | undefined, visible?: boolean, width?: number }, color?: string, container?: any | string | undefined, contentTemplate?: any, cornerRadius?: number, customizeTooltip?: ((info: MapLayerElement) => Record<string, any>) | undefined, enabled?: boolean, font?: Font, opacity?: number | undefined, paddingLeftRight?: number, paddingTopBottom?: number, shadow?: { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number }, zIndex?: number | undefined }) {
        this._setOption('tooltip', value);
    }


    /**
     * [descr:dxVectorMapOptions.touchEnabled]
    
     */
    @Input()
    get touchEnabled(): boolean {
        return this._getOption('touchEnabled');
    }
    set touchEnabled(value: boolean) {
        this._setOption('touchEnabled', value);
    }


    /**
     * [descr:dxVectorMapOptions.wheelEnabled]
    
     */
    @Input()
    get wheelEnabled(): boolean {
        return this._getOption('wheelEnabled');
    }
    set wheelEnabled(value: boolean) {
        this._setOption('wheelEnabled', value);
    }


    /**
     * [descr:dxVectorMapOptions.zoomFactor]
    
     */
    @Input()
    get zoomFactor(): number {
        return this._getOption('zoomFactor');
    }
    set zoomFactor(value: number) {
        this._setOption('zoomFactor', value);
    }


    /**
     * [descr:dxVectorMapOptions.zoomingEnabled]
    
     */
    @Input()
    get zoomingEnabled(): boolean {
        return this._getOption('zoomingEnabled');
    }
    set zoomingEnabled(value: boolean) {
        this._setOption('zoomingEnabled', value);
    }

    /**
    
     * [descr:dxVectorMapOptions.onCenterChanged]
    
    
     */
    @Output() onCenterChanged: EventEmitter<CenterChangedEvent>;

    /**
    
     * [descr:dxVectorMapOptions.onClick]
    
    
     */
    @Output() onClick: EventEmitter<ClickEvent>;

    /**
    
     * [descr:dxVectorMapOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<DisposingEvent>;

    /**
    
     * [descr:dxVectorMapOptions.onDrawn]
    
    
     */
    @Output() onDrawn: EventEmitter<DrawnEvent>;

    /**
    
     * [descr:dxVectorMapOptions.onExported]
    
    
     */
    @Output() onExported: EventEmitter<ExportedEvent>;

    /**
    
     * [descr:dxVectorMapOptions.onExporting]
    
    
     */
    @Output() onExporting: EventEmitter<ExportingEvent>;

    /**
    
     * [descr:dxVectorMapOptions.onFileSaving]
    
    
     */
    @Output() onFileSaving: EventEmitter<FileSavingEvent>;

    /**
    
     * [descr:dxVectorMapOptions.onIncidentOccurred]
    
    
     */
    @Output() onIncidentOccurred: EventEmitter<IncidentOccurredEvent>;

    /**
    
     * [descr:dxVectorMapOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<InitializedEvent>;

    /**
    
     * [descr:dxVectorMapOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<OptionChangedEvent>;

    /**
    
     * [descr:dxVectorMapOptions.onSelectionChanged]
    
    
     */
    @Output() onSelectionChanged: EventEmitter<SelectionChangedEvent>;

    /**
    
     * [descr:dxVectorMapOptions.onTooltipHidden]
    
    
     */
    @Output() onTooltipHidden: EventEmitter<TooltipHiddenEvent>;

    /**
    
     * [descr:dxVectorMapOptions.onTooltipShown]
    
    
     */
    @Output() onTooltipShown: EventEmitter<TooltipShownEvent>;

    /**
    
     * [descr:dxVectorMapOptions.onZoomFactorChanged]
    
    
     */
    @Output() onZoomFactorChanged: EventEmitter<ZoomFactorChangedEvent>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() annotationsChange: EventEmitter<Array<any | dxVectorMapAnnotationConfig>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() backgroundChange: EventEmitter<{ borderColor?: string, color?: string }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() boundsChange: EventEmitter<Array<number>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() centerChange: EventEmitter<Array<number>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() commonAnnotationSettingsChange: EventEmitter<dxVectorMapCommonAnnotationConfig>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() controlBarChange: EventEmitter<{ borderColor?: string, color?: string, enabled?: boolean, horizontalAlignment?: HorizontalAlignment, margin?: number, opacity?: number, panVisible?: boolean, verticalAlignment?: VerticalEdge, zoomVisible?: boolean }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() customizeAnnotationChange: EventEmitter<((annotation: dxVectorMapAnnotationConfig | any) => dxVectorMapAnnotationConfig) | undefined>;

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
    @Output() layersChange: EventEmitter<{ borderColor?: string, borderWidth?: number, color?: string, colorGroupingField?: string | undefined, colorGroups?: Array<number>, customize?: ((elements: Array<MapLayerElement>) => void), dataField?: string | undefined, dataSource?: Array<any> | DataSource | DataSourceOptions | null | Record<string, any> | Store | string, elementType?: VectorMapMarkerType, hoveredBorderColor?: string, hoveredBorderWidth?: number, hoveredColor?: string, hoverEnabled?: boolean, label?: { dataField?: string, enabled?: boolean, font?: Font }, maxSize?: number, minSize?: number, name?: string, opacity?: number, palette?: Array<string> | Palette, paletteIndex?: number, paletteSize?: number, selectedBorderColor?: string, selectedBorderWidth?: number, selectedColor?: string, selectionMode?: SingleMultipleOrNone, size?: number, sizeGroupingField?: string | undefined, sizeGroups?: Array<number>, type?: VectorMapLayerType }[]>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() legendsChange: EventEmitter<{ backgroundColor?: string | undefined, border?: { color?: string, cornerRadius?: number, dashStyle?: DashStyle, opacity?: number | undefined, visible?: boolean, width?: number }, columnCount?: number, columnItemSpacing?: number, customizeHint?: ((itemInfo: { color: string, end: number, index: number, size: number, start: number }) => string), customizeItems?: ((items: Array<VectorMapLegendItem>) => Array<VectorMapLegendItem>), customizeText?: ((itemInfo: { color: string, end: number, index: number, size: number, start: number }) => string), font?: Font, horizontalAlignment?: HorizontalAlignment, itemsAlignment?: HorizontalAlignment | undefined, itemTextPosition?: Position | undefined, margin?: number | { bottom?: number, left?: number, right?: number, top?: number }, markerColor?: string | undefined, markerShape?: VectorMapMarkerShape, markerSize?: number, markerTemplate?: any, orientation?: Orientation | undefined, paddingLeftRight?: number, paddingTopBottom?: number, rowCount?: number, rowItemSpacing?: number, source?: { grouping?: string, layer?: string }, title?: string | { font?: Font, horizontalAlignment?: HorizontalAlignment | undefined, margin?: { bottom?: number, left?: number, right?: number, top?: number }, placeholderSize?: number | undefined, subtitle?: string | { font?: Font, offset?: number, text?: string }, text?: string, verticalAlignment?: VerticalEdge }, verticalAlignment?: VerticalEdge, visible?: boolean }[]>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() loadingIndicatorChange: EventEmitter<{ backgroundColor?: string, enabled?: boolean, font?: Font, show?: boolean, text?: string }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() maxZoomFactorChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() panningEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() pathModifiedChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() projectionChange: EventEmitter<Record<string, any> | string | VectorMapProjection | VectorMapProjectionConfig>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() redrawOnResizeChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() rtlEnabledChange: EventEmitter<boolean>;

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
    @Output() tooltipChange: EventEmitter<{ arrowLength?: number, border?: { color?: string, dashStyle?: DashStyle, opacity?: number | undefined, visible?: boolean, width?: number }, color?: string, container?: any | string | undefined, contentTemplate?: any, cornerRadius?: number, customizeTooltip?: ((info: MapLayerElement) => Record<string, any>) | undefined, enabled?: boolean, font?: Font, opacity?: number | undefined, paddingLeftRight?: number, paddingTopBottom?: number, shadow?: { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number }, zIndex?: number | undefined }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() touchEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() wheelEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() zoomFactorChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() zoomingEnabledChange: EventEmitter<boolean>;




    @ContentChildren(DxiVectorMapAnnotationComponent)
    get annotationsChildren(): QueryList<DxiVectorMapAnnotationComponent> {
        return this._getOption('annotations');
    }
    set annotationsChildren(value) {
        this._setChildren('annotations', value, 'DxiVectorMapAnnotationComponent');
    }

    @ContentChildren(DxiVectorMapLayerComponent)
    get layersChildren(): QueryList<DxiVectorMapLayerComponent> {
        return this._getOption('layers');
    }
    set layersChildren(value) {
        this._setChildren('layers', value, 'DxiVectorMapLayerComponent');
    }

    @ContentChildren(DxiVectorMapLegendComponent)
    get legendsChildren(): QueryList<DxiVectorMapLegendComponent> {
        return this._getOption('legends');
    }
    set legendsChildren(value) {
        this._setChildren('legends', value, 'DxiVectorMapLegendComponent');
    }


    @ContentChildren(DxiAnnotationComponent)
    get annotationsLegacyChildren(): QueryList<DxiAnnotationComponent> {
        return this._getOption('annotations');
    }
    set annotationsLegacyChildren(value) {
        this._setChildren('annotations', value, 'DxiAnnotationComponent');
    }

    @ContentChildren(DxiLayerComponent)
    get layersLegacyChildren(): QueryList<DxiLayerComponent> {
        return this._getOption('layers');
    }
    set layersLegacyChildren(value) {
        this._setChildren('layers', value, 'DxiLayerComponent');
    }

    @ContentChildren(DxiLegendComponent)
    get legendsLegacyChildren(): QueryList<DxiLegendComponent> {
        return this._getOption('legends');
    }
    set legendsLegacyChildren(value) {
        this._setChildren('legends', value, 'DxiLegendComponent');
    }




    constructor(elementRef: ElementRef, ngZone: NgZone, templateHost: DxTemplateHost,
            private _watcherHelper: WatcherHelper,
            private _idh: IterableDifferHelper,
            optionHost: NestedOptionHost,
            transferState: TransferState,
            @Inject(PLATFORM_ID) platformId: any) {

        super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);

        this._createEventEmitters([
            { subscribe: 'centerChanged', emit: 'onCenterChanged' },
            { subscribe: 'click', emit: 'onClick' },
            { subscribe: 'disposing', emit: 'onDisposing' },
            { subscribe: 'drawn', emit: 'onDrawn' },
            { subscribe: 'exported', emit: 'onExported' },
            { subscribe: 'exporting', emit: 'onExporting' },
            { subscribe: 'fileSaving', emit: 'onFileSaving' },
            { subscribe: 'incidentOccurred', emit: 'onIncidentOccurred' },
            { subscribe: 'initialized', emit: 'onInitialized' },
            { subscribe: 'optionChanged', emit: 'onOptionChanged' },
            { subscribe: 'selectionChanged', emit: 'onSelectionChanged' },
            { subscribe: 'tooltipHidden', emit: 'onTooltipHidden' },
            { subscribe: 'tooltipShown', emit: 'onTooltipShown' },
            { subscribe: 'zoomFactorChanged', emit: 'onZoomFactorChanged' },
            { emit: 'annotationsChange' },
            { emit: 'backgroundChange' },
            { emit: 'boundsChange' },
            { emit: 'centerChange' },
            { emit: 'commonAnnotationSettingsChange' },
            { emit: 'controlBarChange' },
            { emit: 'customizeAnnotationChange' },
            { emit: 'disabledChange' },
            { emit: 'elementAttrChange' },
            { emit: 'exportChange' },
            { emit: 'layersChange' },
            { emit: 'legendsChange' },
            { emit: 'loadingIndicatorChange' },
            { emit: 'maxZoomFactorChange' },
            { emit: 'panningEnabledChange' },
            { emit: 'pathModifiedChange' },
            { emit: 'projectionChange' },
            { emit: 'redrawOnResizeChange' },
            { emit: 'rtlEnabledChange' },
            { emit: 'sizeChange' },
            { emit: 'themeChange' },
            { emit: 'titleChange' },
            { emit: 'tooltipChange' },
            { emit: 'touchEnabledChange' },
            { emit: 'wheelEnabledChange' },
            { emit: 'zoomFactorChange' },
            { emit: 'zoomingEnabledChange' }
        ]);

        this._idh.setHost(this);
        optionHost.setHost(this);
    }

    protected _createInstance(element, options) {

        return new DxVectorMap(element, options);
    }


    ngOnDestroy() {
        this._destroyWidget();
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        this.setupChanges('annotations', changes);
        this.setupChanges('bounds', changes);
        this.setupChanges('center', changes);
        this.setupChanges('layers', changes);
        this.setupChanges('legends', changes);
    }

    setupChanges(prop: string, changes: SimpleChanges) {
        if (!(prop in this._optionsToUpdate)) {
            this._idh.setup(prop, changes);
        }
    }

    ngDoCheck() {
        this._idh.doCheck('annotations');
        this._idh.doCheck('bounds');
        this._idh.doCheck('center');
        this._idh.doCheck('layers');
        this._idh.doCheck('legends');
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
    DxiAnnotationModule,
    DxoBorderModule,
    DxoFontModule,
    DxoImageModule,
    DxoShadowModule,
    DxoBackgroundModule,
    DxoCommonAnnotationSettingsModule,
    DxoControlBarModule,
    DxoExportModule,
    DxiLayerModule,
    DxoLabelModule,
    DxiLegendModule,
    DxoMarginModule,
    DxoSourceModule,
    DxoTitleModule,
    DxoSubtitleModule,
    DxoLoadingIndicatorModule,
    DxoProjectionModule,
    DxoSizeModule,
    DxoTooltipModule,
    DxiVectorMapAnnotationModule,
    DxoVectorMapAnnotationBorderModule,
    DxoVectorMapBackgroundModule,
    DxoVectorMapBorderModule,
    DxoVectorMapCommonAnnotationSettingsModule,
    DxoVectorMapControlBarModule,
    DxoVectorMapExportModule,
    DxoVectorMapFontModule,
    DxoVectorMapImageModule,
    DxoVectorMapLabelModule,
    DxiVectorMapLayerModule,
    DxiVectorMapLegendModule,
    DxoVectorMapLegendTitleModule,
    DxoVectorMapLegendTitleSubtitleModule,
    DxoVectorMapLoadingIndicatorModule,
    DxoVectorMapMarginModule,
    DxoVectorMapProjectionModule,
    DxoVectorMapShadowModule,
    DxoVectorMapSizeModule,
    DxoVectorMapSourceModule,
    DxoVectorMapSubtitleModule,
    DxoVectorMapTitleModule,
    DxoVectorMapTooltipModule,
    DxoVectorMapTooltipBorderModule,
    DxoVectorMapVectorMapTitleModule,
    DxoVectorMapVectorMapTitleSubtitleModule,
    DxIntegrationModule,
    DxTemplateModule
  ],
  declarations: [
    DxVectorMapComponent
  ],
  exports: [
    DxVectorMapComponent,
    DxiAnnotationModule,
    DxoBorderModule,
    DxoFontModule,
    DxoImageModule,
    DxoShadowModule,
    DxoBackgroundModule,
    DxoCommonAnnotationSettingsModule,
    DxoControlBarModule,
    DxoExportModule,
    DxiLayerModule,
    DxoLabelModule,
    DxiLegendModule,
    DxoMarginModule,
    DxoSourceModule,
    DxoTitleModule,
    DxoSubtitleModule,
    DxoLoadingIndicatorModule,
    DxoProjectionModule,
    DxoSizeModule,
    DxoTooltipModule,
    DxiVectorMapAnnotationModule,
    DxoVectorMapAnnotationBorderModule,
    DxoVectorMapBackgroundModule,
    DxoVectorMapBorderModule,
    DxoVectorMapCommonAnnotationSettingsModule,
    DxoVectorMapControlBarModule,
    DxoVectorMapExportModule,
    DxoVectorMapFontModule,
    DxoVectorMapImageModule,
    DxoVectorMapLabelModule,
    DxiVectorMapLayerModule,
    DxiVectorMapLegendModule,
    DxoVectorMapLegendTitleModule,
    DxoVectorMapLegendTitleSubtitleModule,
    DxoVectorMapLoadingIndicatorModule,
    DxoVectorMapMarginModule,
    DxoVectorMapProjectionModule,
    DxoVectorMapShadowModule,
    DxoVectorMapSizeModule,
    DxoVectorMapSourceModule,
    DxoVectorMapSubtitleModule,
    DxoVectorMapTitleModule,
    DxoVectorMapTooltipModule,
    DxoVectorMapTooltipBorderModule,
    DxoVectorMapVectorMapTitleModule,
    DxoVectorMapVectorMapTitleSubtitleModule,
    DxTemplateModule
  ]
})
export class DxVectorMapModule { }

import type * as DxVectorMapTypes from "devextreme/viz/vector_map_types";
export { DxVectorMapTypes };


