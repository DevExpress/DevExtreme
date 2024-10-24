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


import * as LocalizationTypes from 'devextreme/localization';
import { Font } from 'devextreme/common/charts';
import { BarGaugeBarInfo, BarGaugeLegendItem, DisposingEvent, DrawnEvent, ExportedEvent, ExportingEvent, FileSavingEvent, IncidentOccurredEvent, InitializedEvent, OptionChangedEvent, TooltipHiddenEvent, TooltipShownEvent } from 'devextreme/viz/bar_gauge';

import DxBarGauge from 'devextreme/viz/bar_gauge';


import {
    DxComponent,
    DxTemplateHost,
    DxIntegrationModule,
    DxTemplateModule,
    NestedOptionHost,
    IterableDifferHelper,
    WatcherHelper
} from 'devextreme-angular/core';

import { DxoAnimationModule } from 'devextreme-angular/ui/nested';
import { DxoExportModule } from 'devextreme-angular/ui/nested';
import { DxoGeometryModule } from 'devextreme-angular/ui/nested';
import { DxoLabelModule } from 'devextreme-angular/ui/nested';
import { DxoFontModule } from 'devextreme-angular/ui/nested';
import { DxoFormatModule } from 'devextreme-angular/ui/nested';
import { DxoLegendModule } from 'devextreme-angular/ui/nested';
import { DxoBorderModule } from 'devextreme-angular/ui/nested';
import { DxoItemTextFormatModule } from 'devextreme-angular/ui/nested';
import { DxoMarginModule } from 'devextreme-angular/ui/nested';
import { DxoTitleModule } from 'devextreme-angular/ui/nested';
import { DxoSubtitleModule } from 'devextreme-angular/ui/nested';
import { DxoLoadingIndicatorModule } from 'devextreme-angular/ui/nested';
import { DxoSizeModule } from 'devextreme-angular/ui/nested';
import { DxoTooltipModule } from 'devextreme-angular/ui/nested';
import { DxoShadowModule } from 'devextreme-angular/ui/nested';

import { DxoBarGaugeAnimationModule } from 'devextreme-angular/ui/bar-gauge/nested';
import { DxoBarGaugeBarGaugeTitleModule } from 'devextreme-angular/ui/bar-gauge/nested';
import { DxoBarGaugeBarGaugeTitleSubtitleModule } from 'devextreme-angular/ui/bar-gauge/nested';
import { DxoBarGaugeBorderModule } from 'devextreme-angular/ui/bar-gauge/nested';
import { DxoBarGaugeExportModule } from 'devextreme-angular/ui/bar-gauge/nested';
import { DxoBarGaugeFontModule } from 'devextreme-angular/ui/bar-gauge/nested';
import { DxoBarGaugeFormatModule } from 'devextreme-angular/ui/bar-gauge/nested';
import { DxoBarGaugeGeometryModule } from 'devextreme-angular/ui/bar-gauge/nested';
import { DxoBarGaugeItemTextFormatModule } from 'devextreme-angular/ui/bar-gauge/nested';
import { DxoBarGaugeLabelModule } from 'devextreme-angular/ui/bar-gauge/nested';
import { DxoBarGaugeLegendModule } from 'devextreme-angular/ui/bar-gauge/nested';
import { DxoBarGaugeLegendBorderModule } from 'devextreme-angular/ui/bar-gauge/nested';
import { DxoBarGaugeLegendTitleModule } from 'devextreme-angular/ui/bar-gauge/nested';
import { DxoBarGaugeLegendTitleSubtitleModule } from 'devextreme-angular/ui/bar-gauge/nested';
import { DxoBarGaugeLoadingIndicatorModule } from 'devextreme-angular/ui/bar-gauge/nested';
import { DxoBarGaugeMarginModule } from 'devextreme-angular/ui/bar-gauge/nested';
import { DxoBarGaugeShadowModule } from 'devextreme-angular/ui/bar-gauge/nested';
import { DxoBarGaugeSizeModule } from 'devextreme-angular/ui/bar-gauge/nested';
import { DxoBarGaugeSubtitleModule } from 'devextreme-angular/ui/bar-gauge/nested';
import { DxoBarGaugeTitleModule } from 'devextreme-angular/ui/bar-gauge/nested';
import { DxoBarGaugeTooltipModule } from 'devextreme-angular/ui/bar-gauge/nested';
import { DxoBarGaugeTooltipBorderModule } from 'devextreme-angular/ui/bar-gauge/nested';




/**
 * [descr:dxBarGauge]

 */
@Component({
    selector: 'dx-bar-gauge',
    template: '',
    styles: [ ' :host {  display: block; }'],
    providers: [
        DxTemplateHost,
        WatcherHelper,
        NestedOptionHost,
        IterableDifferHelper
    ]
})
export class DxBarGaugeComponent extends DxComponent implements OnDestroy, OnChanges, DoCheck {
    instance: DxBarGauge = null;

    /**
     * [descr:dxBarGaugeOptions.animation]
    
     */
    @Input()
    get animation(): any | { duration?: number, easing?: "easeOutCubic" | "linear", enabled?: boolean } {
        return this._getOption('animation');
    }
    set animation(value: any | { duration?: number, easing?: "easeOutCubic" | "linear", enabled?: boolean }) {
        this._setOption('animation', value);
    }


    /**
     * [descr:dxBarGaugeOptions.backgroundColor]
    
     */
    @Input()
    get backgroundColor(): string {
        return this._getOption('backgroundColor');
    }
    set backgroundColor(value: string) {
        this._setOption('backgroundColor', value);
    }


    /**
     * [descr:dxBarGaugeOptions.barSpacing]
    
     */
    @Input()
    get barSpacing(): number {
        return this._getOption('barSpacing');
    }
    set barSpacing(value: number) {
        this._setOption('barSpacing', value);
    }


    /**
     * [descr:dxBarGaugeOptions.baseValue]
    
     */
    @Input()
    get baseValue(): number {
        return this._getOption('baseValue');
    }
    set baseValue(value: number) {
        this._setOption('baseValue', value);
    }


    /**
     * [descr:dxBarGaugeOptions.centerTemplate]
    
     */
    @Input()
    get centerTemplate(): any {
        return this._getOption('centerTemplate');
    }
    set centerTemplate(value: any) {
        this._setOption('centerTemplate', value);
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
     * [descr:dxBarGaugeOptions.endValue]
    
     */
    @Input()
    get endValue(): number {
        return this._getOption('endValue');
    }
    set endValue(value: number) {
        this._setOption('endValue', value);
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
     * [descr:dxBarGaugeOptions.geometry]
    
     */
    @Input()
    get geometry(): Record<string, any> | { endAngle?: number, startAngle?: number } {
        return this._getOption('geometry');
    }
    set geometry(value: Record<string, any> | { endAngle?: number, startAngle?: number }) {
        this._setOption('geometry', value);
    }


    /**
     * [descr:dxBarGaugeOptions.label]
    
     */
    @Input()
    get label(): Record<string, any> | { connectorColor?: string, connectorWidth?: number, customizeText?: ((barValue: { value: number, valueText: string }) => string), font?: Font, format?: LocalizationTypes.Format, indent?: number, visible?: boolean } {
        return this._getOption('label');
    }
    set label(value: Record<string, any> | { connectorColor?: string, connectorWidth?: number, customizeText?: ((barValue: { value: number, valueText: string }) => string), font?: Font, format?: LocalizationTypes.Format, indent?: number, visible?: boolean }) {
        this._setOption('label', value);
    }


    /**
     * [descr:dxBarGaugeOptions.legend]
    
     */
    @Input()
    get legend(): Record<string, any> | { backgroundColor?: string, border?: Record<string, any> | { color?: string, cornerRadius?: number, dashStyle?: "dash" | "dot" | "longDash" | "solid", opacity?: number, visible?: boolean, width?: number }, columnCount?: number, columnItemSpacing?: number, customizeHint?: ((arg: { item: BarGaugeBarInfo, text: string }) => string), customizeItems?: ((items: Array<BarGaugeLegendItem>) => Array<BarGaugeLegendItem>), customizeText?: ((arg: { item: BarGaugeBarInfo, text: string }) => string), font?: Font, horizontalAlignment?: "center" | "left" | "right", itemsAlignment?: "center" | "left" | "right", itemTextFormat?: LocalizationTypes.Format, itemTextPosition?: "bottom" | "left" | "right" | "top", margin?: number | Record<string, any> | { bottom?: number, left?: number, right?: number, top?: number }, markerSize?: number, markerTemplate?: any, orientation?: "horizontal" | "vertical", paddingLeftRight?: number, paddingTopBottom?: number, rowCount?: number, rowItemSpacing?: number, title?: string | { font?: Font, horizontalAlignment?: "center" | "left" | "right", margin?: Record<string, any> | { bottom?: number, left?: number, right?: number, top?: number }, placeholderSize?: number, subtitle?: string | { font?: Font, offset?: number, text?: string }, text?: string, verticalAlignment?: "bottom" | "top" }, verticalAlignment?: "bottom" | "top", visible?: boolean } {
        return this._getOption('legend');
    }
    set legend(value: Record<string, any> | { backgroundColor?: string, border?: Record<string, any> | { color?: string, cornerRadius?: number, dashStyle?: "dash" | "dot" | "longDash" | "solid", opacity?: number, visible?: boolean, width?: number }, columnCount?: number, columnItemSpacing?: number, customizeHint?: ((arg: { item: BarGaugeBarInfo, text: string }) => string), customizeItems?: ((items: Array<BarGaugeLegendItem>) => Array<BarGaugeLegendItem>), customizeText?: ((arg: { item: BarGaugeBarInfo, text: string }) => string), font?: Font, horizontalAlignment?: "center" | "left" | "right", itemsAlignment?: "center" | "left" | "right", itemTextFormat?: LocalizationTypes.Format, itemTextPosition?: "bottom" | "left" | "right" | "top", margin?: number | Record<string, any> | { bottom?: number, left?: number, right?: number, top?: number }, markerSize?: number, markerTemplate?: any, orientation?: "horizontal" | "vertical", paddingLeftRight?: number, paddingTopBottom?: number, rowCount?: number, rowItemSpacing?: number, title?: string | { font?: Font, horizontalAlignment?: "center" | "left" | "right", margin?: Record<string, any> | { bottom?: number, left?: number, right?: number, top?: number }, placeholderSize?: number, subtitle?: string | { font?: Font, offset?: number, text?: string }, text?: string, verticalAlignment?: "bottom" | "top" }, verticalAlignment?: "bottom" | "top", visible?: boolean }) {
        this._setOption('legend', value);
    }


    /**
     * [descr:dxBarGaugeOptions.loadingIndicator]
    
     */
    @Input()
    get loadingIndicator(): Record<string, any> | { backgroundColor?: string, font?: Font, show?: boolean, text?: string } {
        return this._getOption('loadingIndicator');
    }
    set loadingIndicator(value: Record<string, any> | { backgroundColor?: string, font?: Font, show?: boolean, text?: string }) {
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
     * [descr:dxBarGaugeOptions.palette]
    
     */
    @Input()
    get palette(): Array<string> | "Bright" | "Harmony Light" | "Ocean" | "Pastel" | "Soft" | "Soft Pastel" | "Vintage" | "Violet" | "Carmine" | "Dark Moon" | "Dark Violet" | "Green Mist" | "Soft Blue" | "Material" | "Office" {
        return this._getOption('palette');
    }
    set palette(value: Array<string> | "Bright" | "Harmony Light" | "Ocean" | "Pastel" | "Soft" | "Soft Pastel" | "Vintage" | "Violet" | "Carmine" | "Dark Moon" | "Dark Violet" | "Green Mist" | "Soft Blue" | "Material" | "Office") {
        this._setOption('palette', value);
    }


    /**
     * [descr:dxBarGaugeOptions.paletteExtensionMode]
    
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
     * [descr:dxBarGaugeOptions.relativeInnerRadius]
    
     */
    @Input()
    get relativeInnerRadius(): number {
        return this._getOption('relativeInnerRadius');
    }
    set relativeInnerRadius(value: number) {
        this._setOption('relativeInnerRadius', value);
    }


    /**
     * [descr:dxBarGaugeOptions.resolveLabelOverlapping]
    
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
     * [descr:dxBarGaugeOptions.startValue]
    
     */
    @Input()
    get startValue(): number {
        return this._getOption('startValue');
    }
    set startValue(value: number) {
        this._setOption('startValue', value);
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
     * [descr:dxBarGaugeOptions.tooltip]
    
     */
    @Input()
    get tooltip(): Record<string, any> | { arrowLength?: number, border?: Record<string, any> | { color?: string, dashStyle?: "dash" | "dot" | "longDash" | "solid", opacity?: number, visible?: boolean, width?: number }, color?: string, container?: any | string, contentTemplate?: any, cornerRadius?: number, customizeTooltip?: ((scaleValue: { index: number, value: number, valueText: string }) => Record<string, any>), enabled?: boolean, font?: Font, format?: LocalizationTypes.Format, interactive?: boolean, opacity?: number, paddingLeftRight?: number, paddingTopBottom?: number, shadow?: Record<string, any> | { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number }, zIndex?: number } {
        return this._getOption('tooltip');
    }
    set tooltip(value: Record<string, any> | { arrowLength?: number, border?: Record<string, any> | { color?: string, dashStyle?: "dash" | "dot" | "longDash" | "solid", opacity?: number, visible?: boolean, width?: number }, color?: string, container?: any | string, contentTemplate?: any, cornerRadius?: number, customizeTooltip?: ((scaleValue: { index: number, value: number, valueText: string }) => Record<string, any>), enabled?: boolean, font?: Font, format?: LocalizationTypes.Format, interactive?: boolean, opacity?: number, paddingLeftRight?: number, paddingTopBottom?: number, shadow?: Record<string, any> | { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number }, zIndex?: number }) {
        this._setOption('tooltip', value);
    }


    /**
     * [descr:dxBarGaugeOptions.values]
    
     */
    @Input()
    get values(): Array<number> {
        return this._getOption('values');
    }
    set values(value: Array<number>) {
        this._setOption('values', value);
    }

    /**
    
     * [descr:dxBarGaugeOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<DisposingEvent>;

    /**
    
     * [descr:dxBarGaugeOptions.onDrawn]
    
    
     */
    @Output() onDrawn: EventEmitter<DrawnEvent>;

    /**
    
     * [descr:dxBarGaugeOptions.onExported]
    
    
     */
    @Output() onExported: EventEmitter<ExportedEvent>;

    /**
    
     * [descr:dxBarGaugeOptions.onExporting]
    
    
     */
    @Output() onExporting: EventEmitter<ExportingEvent>;

    /**
    
     * [descr:dxBarGaugeOptions.onFileSaving]
    
    
     */
    @Output() onFileSaving: EventEmitter<FileSavingEvent>;

    /**
    
     * [descr:dxBarGaugeOptions.onIncidentOccurred]
    
    
     */
    @Output() onIncidentOccurred: EventEmitter<IncidentOccurredEvent>;

    /**
    
     * [descr:dxBarGaugeOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<InitializedEvent>;

    /**
    
     * [descr:dxBarGaugeOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<OptionChangedEvent>;

    /**
    
     * [descr:dxBarGaugeOptions.onTooltipHidden]
    
    
     */
    @Output() onTooltipHidden: EventEmitter<TooltipHiddenEvent>;

    /**
    
     * [descr:dxBarGaugeOptions.onTooltipShown]
    
    
     */
    @Output() onTooltipShown: EventEmitter<TooltipShownEvent>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() animationChange: EventEmitter<any | { duration?: number, easing?: "easeOutCubic" | "linear", enabled?: boolean }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() backgroundColorChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() barSpacingChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() baseValueChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() centerTemplateChange: EventEmitter<any>;

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
    @Output() endValueChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() exportChange: EventEmitter<Record<string, any> | { backgroundColor?: string, enabled?: boolean, fileName?: string, formats?: Array<"GIF" | "JPEG" | "PDF" | "PNG" | "SVG">, margin?: number, printingEnabled?: boolean, svgToCanvas?: ((svg: any, canvas: any) => any) }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() geometryChange: EventEmitter<Record<string, any> | { endAngle?: number, startAngle?: number }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() labelChange: EventEmitter<Record<string, any> | { connectorColor?: string, connectorWidth?: number, customizeText?: ((barValue: { value: number, valueText: string }) => string), font?: Font, format?: LocalizationTypes.Format, indent?: number, visible?: boolean }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() legendChange: EventEmitter<Record<string, any> | { backgroundColor?: string, border?: Record<string, any> | { color?: string, cornerRadius?: number, dashStyle?: "dash" | "dot" | "longDash" | "solid", opacity?: number, visible?: boolean, width?: number }, columnCount?: number, columnItemSpacing?: number, customizeHint?: ((arg: { item: BarGaugeBarInfo, text: string }) => string), customizeItems?: ((items: Array<BarGaugeLegendItem>) => Array<BarGaugeLegendItem>), customizeText?: ((arg: { item: BarGaugeBarInfo, text: string }) => string), font?: Font, horizontalAlignment?: "center" | "left" | "right", itemsAlignment?: "center" | "left" | "right", itemTextFormat?: LocalizationTypes.Format, itemTextPosition?: "bottom" | "left" | "right" | "top", margin?: number | Record<string, any> | { bottom?: number, left?: number, right?: number, top?: number }, markerSize?: number, markerTemplate?: any, orientation?: "horizontal" | "vertical", paddingLeftRight?: number, paddingTopBottom?: number, rowCount?: number, rowItemSpacing?: number, title?: string | { font?: Font, horizontalAlignment?: "center" | "left" | "right", margin?: Record<string, any> | { bottom?: number, left?: number, right?: number, top?: number }, placeholderSize?: number, subtitle?: string | { font?: Font, offset?: number, text?: string }, text?: string, verticalAlignment?: "bottom" | "top" }, verticalAlignment?: "bottom" | "top", visible?: boolean }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() loadingIndicatorChange: EventEmitter<Record<string, any> | { backgroundColor?: string, font?: Font, show?: boolean, text?: string }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() marginChange: EventEmitter<Record<string, any> | { bottom?: number, left?: number, right?: number, top?: number }>;

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
    @Output() relativeInnerRadiusChange: EventEmitter<number>;

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
    @Output() sizeChange: EventEmitter<Record<string, any> | { height?: number, width?: number }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() startValueChange: EventEmitter<number>;

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
    @Output() tooltipChange: EventEmitter<Record<string, any> | { arrowLength?: number, border?: Record<string, any> | { color?: string, dashStyle?: "dash" | "dot" | "longDash" | "solid", opacity?: number, visible?: boolean, width?: number }, color?: string, container?: any | string, contentTemplate?: any, cornerRadius?: number, customizeTooltip?: ((scaleValue: { index: number, value: number, valueText: string }) => Record<string, any>), enabled?: boolean, font?: Font, format?: LocalizationTypes.Format, interactive?: boolean, opacity?: number, paddingLeftRight?: number, paddingTopBottom?: number, shadow?: Record<string, any> | { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number }, zIndex?: number }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() valuesChange: EventEmitter<Array<number>>;








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
            { subscribe: 'optionChanged', emit: 'onOptionChanged' },
            { subscribe: 'tooltipHidden', emit: 'onTooltipHidden' },
            { subscribe: 'tooltipShown', emit: 'onTooltipShown' },
            { emit: 'animationChange' },
            { emit: 'backgroundColorChange' },
            { emit: 'barSpacingChange' },
            { emit: 'baseValueChange' },
            { emit: 'centerTemplateChange' },
            { emit: 'disabledChange' },
            { emit: 'elementAttrChange' },
            { emit: 'endValueChange' },
            { emit: 'exportChange' },
            { emit: 'geometryChange' },
            { emit: 'labelChange' },
            { emit: 'legendChange' },
            { emit: 'loadingIndicatorChange' },
            { emit: 'marginChange' },
            { emit: 'paletteChange' },
            { emit: 'paletteExtensionModeChange' },
            { emit: 'pathModifiedChange' },
            { emit: 'redrawOnResizeChange' },
            { emit: 'relativeInnerRadiusChange' },
            { emit: 'resolveLabelOverlappingChange' },
            { emit: 'rtlEnabledChange' },
            { emit: 'sizeChange' },
            { emit: 'startValueChange' },
            { emit: 'themeChange' },
            { emit: 'titleChange' },
            { emit: 'tooltipChange' },
            { emit: 'valuesChange' }
        ]);

        this._idh.setHost(this);
        optionHost.setHost(this);
    }

    protected _createInstance(element, options) {

        return new DxBarGauge(element, options);
    }


    ngOnDestroy() {
        this._destroyWidget();
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        this.setupChanges('palette', changes);
        this.setupChanges('values', changes);
    }

    setupChanges(prop: string, changes: SimpleChanges) {
        if (!(prop in this._optionsToUpdate)) {
            this._idh.setup(prop, changes);
        }
    }

    ngDoCheck() {
        this._idh.doCheck('palette');
        this._idh.doCheck('values');
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
    DxoAnimationModule,
    DxoExportModule,
    DxoGeometryModule,
    DxoLabelModule,
    DxoFontModule,
    DxoFormatModule,
    DxoLegendModule,
    DxoBorderModule,
    DxoItemTextFormatModule,
    DxoMarginModule,
    DxoTitleModule,
    DxoSubtitleModule,
    DxoLoadingIndicatorModule,
    DxoSizeModule,
    DxoTooltipModule,
    DxoShadowModule,
    DxoBarGaugeAnimationModule,
    DxoBarGaugeBarGaugeTitleModule,
    DxoBarGaugeBarGaugeTitleSubtitleModule,
    DxoBarGaugeBorderModule,
    DxoBarGaugeExportModule,
    DxoBarGaugeFontModule,
    DxoBarGaugeFormatModule,
    DxoBarGaugeGeometryModule,
    DxoBarGaugeItemTextFormatModule,
    DxoBarGaugeLabelModule,
    DxoBarGaugeLegendModule,
    DxoBarGaugeLegendBorderModule,
    DxoBarGaugeLegendTitleModule,
    DxoBarGaugeLegendTitleSubtitleModule,
    DxoBarGaugeLoadingIndicatorModule,
    DxoBarGaugeMarginModule,
    DxoBarGaugeShadowModule,
    DxoBarGaugeSizeModule,
    DxoBarGaugeSubtitleModule,
    DxoBarGaugeTitleModule,
    DxoBarGaugeTooltipModule,
    DxoBarGaugeTooltipBorderModule,
    DxIntegrationModule,
    DxTemplateModule
  ],
  declarations: [
    DxBarGaugeComponent
  ],
  exports: [
    DxBarGaugeComponent,
    DxoAnimationModule,
    DxoExportModule,
    DxoGeometryModule,
    DxoLabelModule,
    DxoFontModule,
    DxoFormatModule,
    DxoLegendModule,
    DxoBorderModule,
    DxoItemTextFormatModule,
    DxoMarginModule,
    DxoTitleModule,
    DxoSubtitleModule,
    DxoLoadingIndicatorModule,
    DxoSizeModule,
    DxoTooltipModule,
    DxoShadowModule,
    DxoBarGaugeAnimationModule,
    DxoBarGaugeBarGaugeTitleModule,
    DxoBarGaugeBarGaugeTitleSubtitleModule,
    DxoBarGaugeBorderModule,
    DxoBarGaugeExportModule,
    DxoBarGaugeFontModule,
    DxoBarGaugeFormatModule,
    DxoBarGaugeGeometryModule,
    DxoBarGaugeItemTextFormatModule,
    DxoBarGaugeLabelModule,
    DxoBarGaugeLegendModule,
    DxoBarGaugeLegendBorderModule,
    DxoBarGaugeLegendTitleModule,
    DxoBarGaugeLegendTitleSubtitleModule,
    DxoBarGaugeLoadingIndicatorModule,
    DxoBarGaugeMarginModule,
    DxoBarGaugeShadowModule,
    DxoBarGaugeSizeModule,
    DxoBarGaugeSubtitleModule,
    DxoBarGaugeTitleModule,
    DxoBarGaugeTooltipModule,
    DxoBarGaugeTooltipBorderModule,
    DxTemplateModule
  ]
})
export class DxBarGaugeModule { }

import type * as DxBarGaugeTypes from "devextreme/viz/bar_gauge_types";
export { DxBarGaugeTypes };


