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
    SimpleChanges
} from '@angular/core';


import DataSource from 'devextreme/data/data_source';
import * as LocalizationTypes from 'devextreme/localization';
import { DataSourceOptions } from 'devextreme/data/data_source';
import { Store } from 'devextreme/data/store';
import { dxSankeyNode, DisposingEvent, DrawnEvent, ExportedEvent, ExportingEvent, FileSavingEvent, IncidentOccurredEvent, InitializedEvent, LinkClickEvent, LinkHoverEvent, NodeClickEvent, NodeHoverEvent, OptionChangedEvent } from 'devextreme/viz/sankey';
import { Font } from 'devextreme/common/charts';

import DxSankey from 'devextreme/viz/sankey';


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
import { DxoExportModule } from 'devextreme-angular/ui/nested';
import { DxoLabelModule } from 'devextreme-angular/ui/nested';
import { DxoBorderModule } from 'devextreme-angular/ui/nested';
import { DxoFontModule } from 'devextreme-angular/ui/nested';
import { DxoShadowModule } from 'devextreme-angular/ui/nested';
import { DxoLinkModule } from 'devextreme-angular/ui/nested';
import { DxoHoverStyleModule } from 'devextreme-angular/ui/nested';
import { DxoHatchingModule } from 'devextreme-angular/ui/nested';
import { DxoLoadingIndicatorModule } from 'devextreme-angular/ui/nested';
import { DxoMarginModule } from 'devextreme-angular/ui/nested';
import { DxoNodeModule } from 'devextreme-angular/ui/nested';
import { DxoSizeModule } from 'devextreme-angular/ui/nested';
import { DxoTitleModule } from 'devextreme-angular/ui/nested';
import { DxoSubtitleModule } from 'devextreme-angular/ui/nested';
import { DxoTooltipModule } from 'devextreme-angular/ui/nested';
import { DxoFormatModule } from 'devextreme-angular/ui/nested';

import { DxoSankeyAdaptiveLayoutModule } from 'devextreme-angular/ui/sankey/nested';
import { DxoSankeyBorderModule } from 'devextreme-angular/ui/sankey/nested';
import { DxoSankeyExportModule } from 'devextreme-angular/ui/sankey/nested';
import { DxoSankeyFontModule } from 'devextreme-angular/ui/sankey/nested';
import { DxoSankeyFormatModule } from 'devextreme-angular/ui/sankey/nested';
import { DxoSankeyHatchingModule } from 'devextreme-angular/ui/sankey/nested';
import { DxoSankeyHoverStyleModule } from 'devextreme-angular/ui/sankey/nested';
import { DxoSankeyLabelModule } from 'devextreme-angular/ui/sankey/nested';
import { DxoSankeyLinkModule } from 'devextreme-angular/ui/sankey/nested';
import { DxoSankeyLoadingIndicatorModule } from 'devextreme-angular/ui/sankey/nested';
import { DxoSankeyMarginModule } from 'devextreme-angular/ui/sankey/nested';
import { DxoSankeyNodeModule } from 'devextreme-angular/ui/sankey/nested';
import { DxoSankeySankeyborderModule } from 'devextreme-angular/ui/sankey/nested';
import { DxoSankeyShadowModule } from 'devextreme-angular/ui/sankey/nested';
import { DxoSankeySizeModule } from 'devextreme-angular/ui/sankey/nested';
import { DxoSankeySubtitleModule } from 'devextreme-angular/ui/sankey/nested';
import { DxoSankeyTitleModule } from 'devextreme-angular/ui/sankey/nested';
import { DxoSankeyTooltipModule } from 'devextreme-angular/ui/sankey/nested';
import { DxoSankeyTooltipBorderModule } from 'devextreme-angular/ui/sankey/nested';




/**
 * [descr:dxSankey]

 */
@Component({
    selector: 'dx-sankey',
    template: '',
    styles: [ ' :host {  display: block; }'],
    providers: [
        DxTemplateHost,
        WatcherHelper,
        NestedOptionHost,
        IterableDifferHelper
    ]
})
export class DxSankeyComponent extends DxComponent implements OnDestroy, OnChanges, DoCheck {
    instance: DxSankey = null;

    /**
     * [descr:dxSankeyOptions.adaptiveLayout]
    
     */
    @Input()
    get adaptiveLayout(): Record<string, any> | { height?: number, keepLabels?: boolean, width?: number } {
        return this._getOption('adaptiveLayout');
    }
    set adaptiveLayout(value: Record<string, any> | { height?: number, keepLabels?: boolean, width?: number }) {
        this._setOption('adaptiveLayout', value);
    }


    /**
     * [descr:dxSankeyOptions.alignment]
    
     */
    @Input()
    get alignment(): Array<"bottom" | "center" | "top"> | "bottom" | "center" | "top" {
        return this._getOption('alignment');
    }
    set alignment(value: Array<"bottom" | "center" | "top"> | "bottom" | "center" | "top") {
        this._setOption('alignment', value);
    }


    /**
     * [descr:dxSankeyOptions.dataSource]
    
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
    get export(): Record<string, any> | { backgroundColor?: string, enabled?: boolean, fileName?: string, formats?: Array<"GIF" | "JPEG" | "PDF" | "PNG" | "SVG">, margin?: number, printingEnabled?: boolean, svgToCanvas?: ((svg: any, canvas: any) => any) } {
        return this._getOption('export');
    }
    set export(value: Record<string, any> | { backgroundColor?: string, enabled?: boolean, fileName?: string, formats?: Array<"GIF" | "JPEG" | "PDF" | "PNG" | "SVG">, margin?: number, printingEnabled?: boolean, svgToCanvas?: ((svg: any, canvas: any) => any) }) {
        this._setOption('export', value);
    }


    /**
     * [descr:dxSankeyOptions.hoverEnabled]
    
     */
    @Input()
    get hoverEnabled(): boolean {
        return this._getOption('hoverEnabled');
    }
    set hoverEnabled(value: boolean) {
        this._setOption('hoverEnabled', value);
    }


    /**
     * [descr:dxSankeyOptions.label]
    
     */
    @Input()
    get label(): Record<string, any> | { border?: Record<string, any> | { color?: string, visible?: boolean, width?: number }, customizeText?: ((itemInfo: dxSankeyNode) => string), font?: Font, horizontalOffset?: number, overlappingBehavior?: "ellipsis" | "hide" | "none", shadow?: Record<string, any> | { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number }, useNodeColors?: boolean, verticalOffset?: number, visible?: boolean } {
        return this._getOption('label');
    }
    set label(value: Record<string, any> | { border?: Record<string, any> | { color?: string, visible?: boolean, width?: number }, customizeText?: ((itemInfo: dxSankeyNode) => string), font?: Font, horizontalOffset?: number, overlappingBehavior?: "ellipsis" | "hide" | "none", shadow?: Record<string, any> | { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number }, useNodeColors?: boolean, verticalOffset?: number, visible?: boolean }) {
        this._setOption('label', value);
    }


    /**
     * [descr:dxSankeyOptions.link]
    
     */
    @Input()
    get link(): Record<string, any> | { border?: Record<string, any> | { color?: string, visible?: boolean, width?: number }, color?: string, colorMode?: "none" | "source" | "target" | "gradient", hoverStyle?: Record<string, any> | { border?: Record<string, any> | { color?: string, visible?: boolean, width?: number }, color?: string, hatching?: Record<string, any> | { direction?: "left" | "none" | "right", opacity?: number, step?: number, width?: number }, opacity?: number }, opacity?: number } {
        return this._getOption('link');
    }
    set link(value: Record<string, any> | { border?: Record<string, any> | { color?: string, visible?: boolean, width?: number }, color?: string, colorMode?: "none" | "source" | "target" | "gradient", hoverStyle?: Record<string, any> | { border?: Record<string, any> | { color?: string, visible?: boolean, width?: number }, color?: string, hatching?: Record<string, any> | { direction?: "left" | "none" | "right", opacity?: number, step?: number, width?: number }, opacity?: number }, opacity?: number }) {
        this._setOption('link', value);
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
     * [descr:dxSankeyOptions.node]
    
     */
    @Input()
    get node(): Record<string, any> | { border?: Record<string, any> | { color?: string, visible?: boolean, width?: number }, color?: string, hoverStyle?: Record<string, any> | { border?: Record<string, any> | { color?: string, visible?: boolean, width?: number }, color?: string, hatching?: Record<string, any> | { direction?: "left" | "none" | "right", opacity?: number, step?: number, width?: number }, opacity?: number }, opacity?: number, padding?: number, width?: number } {
        return this._getOption('node');
    }
    set node(value: Record<string, any> | { border?: Record<string, any> | { color?: string, visible?: boolean, width?: number }, color?: string, hoverStyle?: Record<string, any> | { border?: Record<string, any> | { color?: string, visible?: boolean, width?: number }, color?: string, hatching?: Record<string, any> | { direction?: "left" | "none" | "right", opacity?: number, step?: number, width?: number }, opacity?: number }, opacity?: number, padding?: number, width?: number }) {
        this._setOption('node', value);
    }


    /**
     * [descr:dxSankeyOptions.palette]
    
     */
    @Input()
    get palette(): Array<string> | "Bright" | "Harmony Light" | "Ocean" | "Pastel" | "Soft" | "Soft Pastel" | "Vintage" | "Violet" | "Carmine" | "Dark Moon" | "Dark Violet" | "Green Mist" | "Soft Blue" | "Material" | "Office" {
        return this._getOption('palette');
    }
    set palette(value: Array<string> | "Bright" | "Harmony Light" | "Ocean" | "Pastel" | "Soft" | "Soft Pastel" | "Vintage" | "Violet" | "Carmine" | "Dark Moon" | "Dark Violet" | "Green Mist" | "Soft Blue" | "Material" | "Office") {
        this._setOption('palette', value);
    }


    /**
     * [descr:dxSankeyOptions.paletteExtensionMode]
    
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
    get size(): Record<string, any> | { height?: number, width?: number } {
        return this._getOption('size');
    }
    set size(value: Record<string, any> | { height?: number, width?: number }) {
        this._setOption('size', value);
    }


    /**
     * [descr:dxSankeyOptions.sortData]
    
     */
    @Input()
    get sortData(): any {
        return this._getOption('sortData');
    }
    set sortData(value: any) {
        this._setOption('sortData', value);
    }


    /**
     * [descr:dxSankeyOptions.sourceField]
    
     */
    @Input()
    get sourceField(): string {
        return this._getOption('sourceField');
    }
    set sourceField(value: string) {
        this._setOption('sourceField', value);
    }


    /**
     * [descr:dxSankeyOptions.targetField]
    
     */
    @Input()
    get targetField(): string {
        return this._getOption('targetField');
    }
    set targetField(value: string) {
        this._setOption('targetField', value);
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
     * [descr:dxSankeyOptions.tooltip]
    
     */
    @Input()
    get tooltip(): Record<string, any> | { arrowLength?: number, border?: Record<string, any> | { color?: string, dashStyle?: "dash" | "dot" | "longDash" | "solid", opacity?: number, visible?: boolean, width?: number }, color?: string, container?: any | string, cornerRadius?: number, customizeLinkTooltip?: ((info: { source: string, target: string, weight: number }) => Record<string, any>), customizeNodeTooltip?: ((info: { label: string, title: string, weightIn: number, weightOut: number }) => Record<string, any>), enabled?: boolean, font?: Font, format?: LocalizationTypes.Format, linkTooltipTemplate?: any, nodeTooltipTemplate?: any, opacity?: number, paddingLeftRight?: number, paddingTopBottom?: number, shadow?: Record<string, any> | { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number }, zIndex?: number } {
        return this._getOption('tooltip');
    }
    set tooltip(value: Record<string, any> | { arrowLength?: number, border?: Record<string, any> | { color?: string, dashStyle?: "dash" | "dot" | "longDash" | "solid", opacity?: number, visible?: boolean, width?: number }, color?: string, container?: any | string, cornerRadius?: number, customizeLinkTooltip?: ((info: { source: string, target: string, weight: number }) => Record<string, any>), customizeNodeTooltip?: ((info: { label: string, title: string, weightIn: number, weightOut: number }) => Record<string, any>), enabled?: boolean, font?: Font, format?: LocalizationTypes.Format, linkTooltipTemplate?: any, nodeTooltipTemplate?: any, opacity?: number, paddingLeftRight?: number, paddingTopBottom?: number, shadow?: Record<string, any> | { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number }, zIndex?: number }) {
        this._setOption('tooltip', value);
    }


    /**
     * [descr:dxSankeyOptions.weightField]
    
     */
    @Input()
    get weightField(): string {
        return this._getOption('weightField');
    }
    set weightField(value: string) {
        this._setOption('weightField', value);
    }

    /**
    
     * [descr:dxSankeyOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<DisposingEvent>;

    /**
    
     * [descr:dxSankeyOptions.onDrawn]
    
    
     */
    @Output() onDrawn: EventEmitter<DrawnEvent>;

    /**
    
     * [descr:dxSankeyOptions.onExported]
    
    
     */
    @Output() onExported: EventEmitter<ExportedEvent>;

    /**
    
     * [descr:dxSankeyOptions.onExporting]
    
    
     */
    @Output() onExporting: EventEmitter<ExportingEvent>;

    /**
    
     * [descr:dxSankeyOptions.onFileSaving]
    
    
     */
    @Output() onFileSaving: EventEmitter<FileSavingEvent>;

    /**
    
     * [descr:dxSankeyOptions.onIncidentOccurred]
    
    
     */
    @Output() onIncidentOccurred: EventEmitter<IncidentOccurredEvent>;

    /**
    
     * [descr:dxSankeyOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<InitializedEvent>;

    /**
    
     * [descr:dxSankeyOptions.onLinkClick]
    
    
     */
    @Output() onLinkClick: EventEmitter<LinkClickEvent>;

    /**
    
     * [descr:dxSankeyOptions.onLinkHoverChanged]
    
    
     */
    @Output() onLinkHoverChanged: EventEmitter<LinkHoverEvent>;

    /**
    
     * [descr:dxSankeyOptions.onNodeClick]
    
    
     */
    @Output() onNodeClick: EventEmitter<NodeClickEvent>;

    /**
    
     * [descr:dxSankeyOptions.onNodeHoverChanged]
    
    
     */
    @Output() onNodeHoverChanged: EventEmitter<NodeHoverEvent>;

    /**
    
     * [descr:dxSankeyOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<OptionChangedEvent>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() adaptiveLayoutChange: EventEmitter<Record<string, any> | { height?: number, keepLabels?: boolean, width?: number }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() alignmentChange: EventEmitter<Array<"bottom" | "center" | "top"> | "bottom" | "center" | "top">;

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
    @Output() exportChange: EventEmitter<Record<string, any> | { backgroundColor?: string, enabled?: boolean, fileName?: string, formats?: Array<"GIF" | "JPEG" | "PDF" | "PNG" | "SVG">, margin?: number, printingEnabled?: boolean, svgToCanvas?: ((svg: any, canvas: any) => any) }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() hoverEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() labelChange: EventEmitter<Record<string, any> | { border?: Record<string, any> | { color?: string, visible?: boolean, width?: number }, customizeText?: ((itemInfo: dxSankeyNode) => string), font?: Font, horizontalOffset?: number, overlappingBehavior?: "ellipsis" | "hide" | "none", shadow?: Record<string, any> | { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number }, useNodeColors?: boolean, verticalOffset?: number, visible?: boolean }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() linkChange: EventEmitter<Record<string, any> | { border?: Record<string, any> | { color?: string, visible?: boolean, width?: number }, color?: string, colorMode?: "none" | "source" | "target" | "gradient", hoverStyle?: Record<string, any> | { border?: Record<string, any> | { color?: string, visible?: boolean, width?: number }, color?: string, hatching?: Record<string, any> | { direction?: "left" | "none" | "right", opacity?: number, step?: number, width?: number }, opacity?: number }, opacity?: number }>;

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
    @Output() nodeChange: EventEmitter<Record<string, any> | { border?: Record<string, any> | { color?: string, visible?: boolean, width?: number }, color?: string, hoverStyle?: Record<string, any> | { border?: Record<string, any> | { color?: string, visible?: boolean, width?: number }, color?: string, hatching?: Record<string, any> | { direction?: "left" | "none" | "right", opacity?: number, step?: number, width?: number }, opacity?: number }, opacity?: number, padding?: number, width?: number }>;

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
    @Output() redrawOnResizeChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() rtlEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() sizeChange: EventEmitter<Record<string, any> | { height?: number, width?: number }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() sortDataChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() sourceFieldChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() targetFieldChange: EventEmitter<string>;

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
    @Output() tooltipChange: EventEmitter<Record<string, any> | { arrowLength?: number, border?: Record<string, any> | { color?: string, dashStyle?: "dash" | "dot" | "longDash" | "solid", opacity?: number, visible?: boolean, width?: number }, color?: string, container?: any | string, cornerRadius?: number, customizeLinkTooltip?: ((info: { source: string, target: string, weight: number }) => Record<string, any>), customizeNodeTooltip?: ((info: { label: string, title: string, weightIn: number, weightOut: number }) => Record<string, any>), enabled?: boolean, font?: Font, format?: LocalizationTypes.Format, linkTooltipTemplate?: any, nodeTooltipTemplate?: any, opacity?: number, paddingLeftRight?: number, paddingTopBottom?: number, shadow?: Record<string, any> | { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number }, zIndex?: number }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() weightFieldChange: EventEmitter<string>;








    constructor(elementRef: ElementRef, ngZone: NgZone, templateHost: DxTemplateHost,
            private _watcherHelper: WatcherHelper,
            private _idh: IterableDifferHelper,
            optionHost: NestedOptionHost,
            transferState: TransferState,
            @Inject(PLATFORM_ID) platformId: any) {

        super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);

        this._createEventEmitters([
            { subscribe: 'disposing', emit: 'onDisposing' },
            { subscribe: 'drawn', emit: 'onDrawn' },
            { subscribe: 'exported', emit: 'onExported' },
            { subscribe: 'exporting', emit: 'onExporting' },
            { subscribe: 'fileSaving', emit: 'onFileSaving' },
            { subscribe: 'incidentOccurred', emit: 'onIncidentOccurred' },
            { subscribe: 'initialized', emit: 'onInitialized' },
            { subscribe: 'linkClick', emit: 'onLinkClick' },
            { subscribe: 'linkHoverChanged', emit: 'onLinkHoverChanged' },
            { subscribe: 'nodeClick', emit: 'onNodeClick' },
            { subscribe: 'nodeHoverChanged', emit: 'onNodeHoverChanged' },
            { subscribe: 'optionChanged', emit: 'onOptionChanged' },
            { emit: 'adaptiveLayoutChange' },
            { emit: 'alignmentChange' },
            { emit: 'dataSourceChange' },
            { emit: 'disabledChange' },
            { emit: 'elementAttrChange' },
            { emit: 'exportChange' },
            { emit: 'hoverEnabledChange' },
            { emit: 'labelChange' },
            { emit: 'linkChange' },
            { emit: 'loadingIndicatorChange' },
            { emit: 'marginChange' },
            { emit: 'nodeChange' },
            { emit: 'paletteChange' },
            { emit: 'paletteExtensionModeChange' },
            { emit: 'pathModifiedChange' },
            { emit: 'redrawOnResizeChange' },
            { emit: 'rtlEnabledChange' },
            { emit: 'sizeChange' },
            { emit: 'sortDataChange' },
            { emit: 'sourceFieldChange' },
            { emit: 'targetFieldChange' },
            { emit: 'themeChange' },
            { emit: 'titleChange' },
            { emit: 'tooltipChange' },
            { emit: 'weightFieldChange' }
        ]);

        this._idh.setHost(this);
        optionHost.setHost(this);
    }

    protected _createInstance(element, options) {

        return new DxSankey(element, options);
    }


    ngOnDestroy() {
        this._destroyWidget();
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        this.setupChanges('alignment', changes);
        this.setupChanges('dataSource', changes);
        this.setupChanges('palette', changes);
    }

    setupChanges(prop: string, changes: SimpleChanges) {
        if (!(prop in this._optionsToUpdate)) {
            this._idh.setup(prop, changes);
        }
    }

    ngDoCheck() {
        this._idh.doCheck('alignment');
        this._idh.doCheck('dataSource');
        this._idh.doCheck('palette');
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
    DxoExportModule,
    DxoLabelModule,
    DxoBorderModule,
    DxoFontModule,
    DxoShadowModule,
    DxoLinkModule,
    DxoHoverStyleModule,
    DxoHatchingModule,
    DxoLoadingIndicatorModule,
    DxoMarginModule,
    DxoNodeModule,
    DxoSizeModule,
    DxoTitleModule,
    DxoSubtitleModule,
    DxoTooltipModule,
    DxoFormatModule,
    DxoSankeyAdaptiveLayoutModule,
    DxoSankeyBorderModule,
    DxoSankeyExportModule,
    DxoSankeyFontModule,
    DxoSankeyFormatModule,
    DxoSankeyHatchingModule,
    DxoSankeyHoverStyleModule,
    DxoSankeyLabelModule,
    DxoSankeyLinkModule,
    DxoSankeyLoadingIndicatorModule,
    DxoSankeyMarginModule,
    DxoSankeyNodeModule,
    DxoSankeySankeyborderModule,
    DxoSankeyShadowModule,
    DxoSankeySizeModule,
    DxoSankeySubtitleModule,
    DxoSankeyTitleModule,
    DxoSankeyTooltipModule,
    DxoSankeyTooltipBorderModule,
    DxIntegrationModule,
    DxTemplateModule
  ],
  declarations: [
    DxSankeyComponent
  ],
  exports: [
    DxSankeyComponent,
    DxoAdaptiveLayoutModule,
    DxoExportModule,
    DxoLabelModule,
    DxoBorderModule,
    DxoFontModule,
    DxoShadowModule,
    DxoLinkModule,
    DxoHoverStyleModule,
    DxoHatchingModule,
    DxoLoadingIndicatorModule,
    DxoMarginModule,
    DxoNodeModule,
    DxoSizeModule,
    DxoTitleModule,
    DxoSubtitleModule,
    DxoTooltipModule,
    DxoFormatModule,
    DxoSankeyAdaptiveLayoutModule,
    DxoSankeyBorderModule,
    DxoSankeyExportModule,
    DxoSankeyFontModule,
    DxoSankeyFormatModule,
    DxoSankeyHatchingModule,
    DxoSankeyHoverStyleModule,
    DxoSankeyLabelModule,
    DxoSankeyLinkModule,
    DxoSankeyLoadingIndicatorModule,
    DxoSankeyMarginModule,
    DxoSankeyNodeModule,
    DxoSankeySankeyborderModule,
    DxoSankeyShadowModule,
    DxoSankeySizeModule,
    DxoSankeySubtitleModule,
    DxoSankeyTitleModule,
    DxoSankeyTooltipModule,
    DxoSankeyTooltipBorderModule,
    DxTemplateModule
  ]
})
export class DxSankeyModule { }

import type * as DxSankeyTypes from "devextreme/viz/sankey_types";
export { DxSankeyTypes };


