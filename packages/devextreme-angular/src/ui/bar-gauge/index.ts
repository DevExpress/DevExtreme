/* tslint:disable:max-line-length */


import { TransferState } from '@angular/platform-browser';

import {
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


import { UserDefinedElement } from 'devextreme/core/element';
import { Format } from 'devextreme/localization';
import { DisposingEvent, DrawnEvent, ExportedEvent, ExportingEvent, FileSavingEvent, IncidentOccurredEvent, InitializedEvent, OptionChangedEvent, TooltipHiddenEvent, TooltipShownEvent } from 'devextreme/viz/bar_gauge';
import { Font } from 'devextreme/viz/core/base_widget';

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
    instance: DxBarGauge;

    /**
     * [descr:dxBarGaugeOptions.animation]
    
     */
    @Input()
    get animation(): { duration?: number, easing?: string, enabled?: boolean } {
        return this._getOption('animation');
    }
    set animation(value: { duration?: number, easing?: string, enabled?: boolean }) {
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
    get centerTemplate(): any | undefined {
        return this._getOption('centerTemplate');
    }
    set centerTemplate(value: any | undefined) {
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
    get elementAttr(): any {
        return this._getOption('elementAttr');
    }
    set elementAttr(value: any) {
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
    get export(): { backgroundColor?: string, enabled?: boolean, fileName?: string, formats?: Array<string>, margin?: number, printingEnabled?: boolean, svgToCanvas?: Function | undefined } {
        return this._getOption('export');
    }
    set export(value: { backgroundColor?: string, enabled?: boolean, fileName?: string, formats?: Array<string>, margin?: number, printingEnabled?: boolean, svgToCanvas?: Function | undefined }) {
        this._setOption('export', value);
    }


    /**
     * [descr:dxBarGaugeOptions.geometry]
    
     */
    @Input()
    get geometry(): { endAngle?: number, startAngle?: number } {
        return this._getOption('geometry');
    }
    set geometry(value: { endAngle?: number, startAngle?: number }) {
        this._setOption('geometry', value);
    }


    /**
     * [descr:dxBarGaugeOptions.label]
    
     */
    @Input()
    get label(): { connectorColor?: string | undefined, connectorWidth?: number, customizeText?: Function, font?: Font, format?: Format | string | undefined, indent?: number, visible?: boolean } {
        return this._getOption('label');
    }
    set label(value: { connectorColor?: string | undefined, connectorWidth?: number, customizeText?: Function, font?: Font, format?: Format | string | undefined, indent?: number, visible?: boolean }) {
        this._setOption('label', value);
    }


    /**
     * [descr:dxBarGaugeOptions.legend]
    
     */
    @Input()
    get legend(): { backgroundColor?: string | undefined, border?: { color?: string, cornerRadius?: number, dashStyle?: string, opacity?: number | undefined, visible?: boolean, width?: number }, columnCount?: number, columnItemSpacing?: number, customizeHint?: Function, customizeItems?: Function, customizeText?: Function, font?: Font, horizontalAlignment?: string, itemsAlignment?: string | undefined, itemTextFormat?: Format | string | undefined, itemTextPosition?: string | undefined, margin?: number | { bottom?: number, left?: number, right?: number, top?: number }, markerSize?: number, markerTemplate?: any | undefined, orientation?: string | undefined, paddingLeftRight?: number, paddingTopBottom?: number, rowCount?: number, rowItemSpacing?: number, title?: string | { font?: Font, horizontalAlignment?: string | undefined, margin?: { bottom?: number, left?: number, right?: number, top?: number }, placeholderSize?: number | undefined, subtitle?: string | { font?: Font, offset?: number, text?: string }, text?: string, verticalAlignment?: string }, verticalAlignment?: string, visible?: boolean } {
        return this._getOption('legend');
    }
    set legend(value: { backgroundColor?: string | undefined, border?: { color?: string, cornerRadius?: number, dashStyle?: string, opacity?: number | undefined, visible?: boolean, width?: number }, columnCount?: number, columnItemSpacing?: number, customizeHint?: Function, customizeItems?: Function, customizeText?: Function, font?: Font, horizontalAlignment?: string, itemsAlignment?: string | undefined, itemTextFormat?: Format | string | undefined, itemTextPosition?: string | undefined, margin?: number | { bottom?: number, left?: number, right?: number, top?: number }, markerSize?: number, markerTemplate?: any | undefined, orientation?: string | undefined, paddingLeftRight?: number, paddingTopBottom?: number, rowCount?: number, rowItemSpacing?: number, title?: string | { font?: Font, horizontalAlignment?: string | undefined, margin?: { bottom?: number, left?: number, right?: number, top?: number }, placeholderSize?: number | undefined, subtitle?: string | { font?: Font, offset?: number, text?: string }, text?: string, verticalAlignment?: string }, verticalAlignment?: string, visible?: boolean }) {
        this._setOption('legend', value);
    }


    /**
     * [descr:dxBarGaugeOptions.loadingIndicator]
    
     */
    @Input()
    get loadingIndicator(): { backgroundColor?: string, font?: Font, show?: boolean, text?: string } {
        return this._getOption('loadingIndicator');
    }
    set loadingIndicator(value: { backgroundColor?: string, font?: Font, show?: boolean, text?: string }) {
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
     * [descr:dxBarGaugeOptions.palette]
    
     */
    @Input()
    get palette(): string | Array<string> {
        return this._getOption('palette');
    }
    set palette(value: string | Array<string>) {
        this._setOption('palette', value);
    }


    /**
     * [descr:dxBarGaugeOptions.paletteExtensionMode]
    
     */
    @Input()
    get paletteExtensionMode(): string {
        return this._getOption('paletteExtensionMode');
    }
    set paletteExtensionMode(value: string) {
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
    get resolveLabelOverlapping(): string {
        return this._getOption('resolveLabelOverlapping');
    }
    set resolveLabelOverlapping(value: string) {
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
    get size(): { height?: number | undefined, width?: number | undefined } {
        return this._getOption('size');
    }
    set size(value: { height?: number | undefined, width?: number | undefined }) {
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
    get theme(): string {
        return this._getOption('theme');
    }
    set theme(value: string) {
        this._setOption('theme', value);
    }


    /**
     * [descr:BaseWidgetOptions.title]
    
     */
    @Input()
    get title(): string | { font?: Font, horizontalAlignment?: string, margin?: number | { bottom?: number, left?: number, right?: number, top?: number }, placeholderSize?: number | undefined, subtitle?: string | { font?: Font, offset?: number, text?: string, textOverflow?: string, wordWrap?: string }, text?: string, textOverflow?: string, verticalAlignment?: string, wordWrap?: string } {
        return this._getOption('title');
    }
    set title(value: string | { font?: Font, horizontalAlignment?: string, margin?: number | { bottom?: number, left?: number, right?: number, top?: number }, placeholderSize?: number | undefined, subtitle?: string | { font?: Font, offset?: number, text?: string, textOverflow?: string, wordWrap?: string }, text?: string, textOverflow?: string, verticalAlignment?: string, wordWrap?: string }) {
        this._setOption('title', value);
    }


    /**
     * [descr:dxBarGaugeOptions.tooltip]
    
     */
    @Input()
    get tooltip(): { arrowLength?: number, border?: { color?: string, dashStyle?: string, opacity?: number | undefined, visible?: boolean, width?: number }, color?: string, container?: string | UserDefinedElement | undefined, contentTemplate?: any | undefined, cornerRadius?: number, customizeTooltip?: Function | undefined, enabled?: boolean, font?: Font, format?: Format | string | undefined, interactive?: boolean, opacity?: number | undefined, paddingLeftRight?: number, paddingTopBottom?: number, shadow?: { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number }, zIndex?: number | undefined } {
        return this._getOption('tooltip');
    }
    set tooltip(value: { arrowLength?: number, border?: { color?: string, dashStyle?: string, opacity?: number | undefined, visible?: boolean, width?: number }, color?: string, container?: string | UserDefinedElement | undefined, contentTemplate?: any | undefined, cornerRadius?: number, customizeTooltip?: Function | undefined, enabled?: boolean, font?: Font, format?: Format | string | undefined, interactive?: boolean, opacity?: number | undefined, paddingLeftRight?: number, paddingTopBottom?: number, shadow?: { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number }, zIndex?: number | undefined }) {
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
    @Output() animationChange: EventEmitter<{ duration?: number, easing?: string, enabled?: boolean }>;

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
    @Output() centerTemplateChange: EventEmitter<any | undefined>;

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
    @Output() endValueChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() exportChange: EventEmitter<{ backgroundColor?: string, enabled?: boolean, fileName?: string, formats?: Array<string>, margin?: number, printingEnabled?: boolean, svgToCanvas?: Function | undefined }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() geometryChange: EventEmitter<{ endAngle?: number, startAngle?: number }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() labelChange: EventEmitter<{ connectorColor?: string | undefined, connectorWidth?: number, customizeText?: Function, font?: Font, format?: Format | string | undefined, indent?: number, visible?: boolean }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() legendChange: EventEmitter<{ backgroundColor?: string | undefined, border?: { color?: string, cornerRadius?: number, dashStyle?: string, opacity?: number | undefined, visible?: boolean, width?: number }, columnCount?: number, columnItemSpacing?: number, customizeHint?: Function, customizeItems?: Function, customizeText?: Function, font?: Font, horizontalAlignment?: string, itemsAlignment?: string | undefined, itemTextFormat?: Format | string | undefined, itemTextPosition?: string | undefined, margin?: number | { bottom?: number, left?: number, right?: number, top?: number }, markerSize?: number, markerTemplate?: any | undefined, orientation?: string | undefined, paddingLeftRight?: number, paddingTopBottom?: number, rowCount?: number, rowItemSpacing?: number, title?: string | { font?: Font, horizontalAlignment?: string | undefined, margin?: { bottom?: number, left?: number, right?: number, top?: number }, placeholderSize?: number | undefined, subtitle?: string | { font?: Font, offset?: number, text?: string }, text?: string, verticalAlignment?: string }, verticalAlignment?: string, visible?: boolean }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() loadingIndicatorChange: EventEmitter<{ backgroundColor?: string, font?: Font, show?: boolean, text?: string }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() marginChange: EventEmitter<{ bottom?: number, left?: number, right?: number, top?: number }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() paletteChange: EventEmitter<string | Array<string>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() paletteExtensionModeChange: EventEmitter<string>;

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
    @Output() resolveLabelOverlappingChange: EventEmitter<string>;

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
    @Output() startValueChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() themeChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() titleChange: EventEmitter<string | { font?: Font, horizontalAlignment?: string, margin?: number | { bottom?: number, left?: number, right?: number, top?: number }, placeholderSize?: number | undefined, subtitle?: string | { font?: Font, offset?: number, text?: string, textOverflow?: string, wordWrap?: string }, text?: string, textOverflow?: string, verticalAlignment?: string, wordWrap?: string }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() tooltipChange: EventEmitter<{ arrowLength?: number, border?: { color?: string, dashStyle?: string, opacity?: number | undefined, visible?: boolean, width?: number }, color?: string, container?: string | UserDefinedElement | undefined, contentTemplate?: any | undefined, cornerRadius?: number, customizeTooltip?: Function | undefined, enabled?: boolean, font?: Font, format?: Format | string | undefined, interactive?: boolean, opacity?: number | undefined, paddingLeftRight?: number, paddingTopBottom?: number, shadow?: { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number }, zIndex?: number | undefined }>;

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
    DxTemplateModule
  ]
})
export class DxBarGaugeModule { }

import type * as DxBarGaugeTypes from "devextreme/viz/bar_gauge_types";
export { DxBarGaugeTypes };


