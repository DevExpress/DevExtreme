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


import DevExpress from 'devextreme/bundles/dx.all';
import { UserDefinedElement } from 'devextreme/core/element';
import { Format } from 'devextreme/localization';
import { Font } from 'devextreme/viz/core/base_widget';
import { DisposingEvent, DrawnEvent, ExportedEvent, ExportingEvent, FileSavingEvent, IncidentOccurredEvent, InitializedEvent, OptionChangedEvent, TooltipHiddenEvent, TooltipShownEvent } from 'devextreme/viz/linear_gauge';

import DxLinearGauge from 'devextreme/viz/linear_gauge';


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
import { DxoLoadingIndicatorModule } from 'devextreme-angular/ui/nested';
import { DxoFontModule } from 'devextreme-angular/ui/nested';
import { DxoMarginModule } from 'devextreme-angular/ui/nested';
import { DxoRangeContainerModule } from 'devextreme-angular/ui/nested';
import { DxoBackgroundColorModule } from 'devextreme-angular/ui/nested';
import { DxiRangeModule } from 'devextreme-angular/ui/nested';
import { DxoColorModule } from 'devextreme-angular/ui/nested';
import { DxoWidthModule } from 'devextreme-angular/ui/nested';
import { DxoScaleModule } from 'devextreme-angular/ui/nested';
import { DxoLabelModule } from 'devextreme-angular/ui/nested';
import { DxoFormatModule } from 'devextreme-angular/ui/nested';
import { DxoMinorTickModule } from 'devextreme-angular/ui/nested';
import { DxoTickModule } from 'devextreme-angular/ui/nested';
import { DxoSizeModule } from 'devextreme-angular/ui/nested';
import { DxoSubvalueIndicatorModule } from 'devextreme-angular/ui/nested';
import { DxoTextModule } from 'devextreme-angular/ui/nested';
import { DxoTitleModule } from 'devextreme-angular/ui/nested';
import { DxoSubtitleModule } from 'devextreme-angular/ui/nested';
import { DxoTooltipModule } from 'devextreme-angular/ui/nested';
import { DxoBorderModule } from 'devextreme-angular/ui/nested';
import { DxoShadowModule } from 'devextreme-angular/ui/nested';
import { DxoValueIndicatorModule } from 'devextreme-angular/ui/nested';




/**
 * [descr:dxLinearGauge]

 */
@Component({
    selector: 'dx-linear-gauge',
    template: '',
    styles: [ ' :host {  display: block; }'],
    providers: [
        DxTemplateHost,
        WatcherHelper,
        NestedOptionHost,
        IterableDifferHelper
    ]
})
export class DxLinearGaugeComponent extends DxComponent implements OnDestroy, OnChanges, DoCheck {
    instance: DxLinearGauge;

    /**
     * [descr:BaseGaugeOptions.animation]
    
     */
    @Input()
    get animation(): { duration?: number, easing?: string, enabled?: boolean } {
        return this._getOption('animation');
    }
    set animation(value: { duration?: number, easing?: string, enabled?: boolean }) {
        this._setOption('animation', value);
    }


    /**
     * [descr:BaseGaugeOptions.containerBackgroundColor]
    
     */
    @Input()
    get containerBackgroundColor(): string {
        return this._getOption('containerBackgroundColor');
    }
    set containerBackgroundColor(value: string) {
        this._setOption('containerBackgroundColor', value);
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
    get export(): { backgroundColor?: string, enabled?: boolean, fileName?: string, formats?: Array<string>, margin?: number, printingEnabled?: boolean, svgToCanvas?: Function | undefined } {
        return this._getOption('export');
    }
    set export(value: { backgroundColor?: string, enabled?: boolean, fileName?: string, formats?: Array<string>, margin?: number, printingEnabled?: boolean, svgToCanvas?: Function | undefined }) {
        this._setOption('export', value);
    }


    /**
     * [descr:dxLinearGaugeOptions.geometry]
    
     */
    @Input()
    get geometry(): { orientation?: string } {
        return this._getOption('geometry');
    }
    set geometry(value: { orientation?: string }) {
        this._setOption('geometry', value);
    }


    /**
     * [descr:BaseGaugeOptions.loadingIndicator]
    
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
     * [descr:dxLinearGaugeOptions.rangeContainer]
    
     */
    @Input()
    get rangeContainer(): { backgroundColor?: DevExpress.common.charts.ChartsColor | string, horizontalOrientation?: string, offset?: number, palette?: string | Array<string>, paletteExtensionMode?: string, ranges?: Array<any | { color?: DevExpress.common.charts.ChartsColor | string, endValue?: number, startValue?: number }>, verticalOrientation?: string, width?: number | { end?: number, start?: number } } {
        return this._getOption('rangeContainer');
    }
    set rangeContainer(value: { backgroundColor?: DevExpress.common.charts.ChartsColor | string, horizontalOrientation?: string, offset?: number, palette?: string | Array<string>, paletteExtensionMode?: string, ranges?: Array<any | { color?: DevExpress.common.charts.ChartsColor | string, endValue?: number, startValue?: number }>, verticalOrientation?: string, width?: number | { end?: number, start?: number } }) {
        this._setOption('rangeContainer', value);
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
     * [descr:dxLinearGaugeOptions.scale]
    
     */
    @Input()
    get scale(): { allowDecimals?: boolean | undefined, customMinorTicks?: Array<number>, customTicks?: Array<number>, endValue?: number, horizontalOrientation?: string, label?: { customizeText?: Function, font?: Font, format?: Format | string | undefined, indentFromTick?: number, overlappingBehavior?: string, useRangeColors?: boolean, visible?: boolean }, minorTick?: { color?: string, length?: number, opacity?: number, visible?: boolean, width?: number }, minorTickInterval?: number | undefined, scaleDivisionFactor?: number, startValue?: number, tick?: { color?: string, length?: number, opacity?: number, visible?: boolean, width?: number }, tickInterval?: number | undefined, verticalOrientation?: string } {
        return this._getOption('scale');
    }
    set scale(value: { allowDecimals?: boolean | undefined, customMinorTicks?: Array<number>, customTicks?: Array<number>, endValue?: number, horizontalOrientation?: string, label?: { customizeText?: Function, font?: Font, format?: Format | string | undefined, indentFromTick?: number, overlappingBehavior?: string, useRangeColors?: boolean, visible?: boolean }, minorTick?: { color?: string, length?: number, opacity?: number, visible?: boolean, width?: number }, minorTickInterval?: number | undefined, scaleDivisionFactor?: number, startValue?: number, tick?: { color?: string, length?: number, opacity?: number, visible?: boolean, width?: number }, tickInterval?: number | undefined, verticalOrientation?: string }) {
        this._setOption('scale', value);
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
     * [descr:dxLinearGaugeOptions.subvalueIndicator]
    
     */
    @Input()
    get subvalueIndicator(): any {
        return this._getOption('subvalueIndicator');
    }
    set subvalueIndicator(value: any) {
        this._setOption('subvalueIndicator', value);
    }


    /**
     * [descr:BaseGaugeOptions.subvalues]
    
     */
    @Input()
    get subvalues(): Array<number> {
        return this._getOption('subvalues');
    }
    set subvalues(value: Array<number>) {
        this._setOption('subvalues', value);
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
     * [descr:BaseGaugeOptions.tooltip]
    
     */
    @Input()
    get tooltip(): { arrowLength?: number, border?: { color?: string, dashStyle?: string, opacity?: number | undefined, visible?: boolean, width?: number }, color?: string, container?: string | UserDefinedElement | undefined, contentTemplate?: any | undefined, cornerRadius?: number, customizeTooltip?: Function | undefined, enabled?: boolean, font?: Font, format?: Format | string | undefined, interactive?: boolean, opacity?: number | undefined, paddingLeftRight?: number, paddingTopBottom?: number, shadow?: { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number }, zIndex?: number | undefined } {
        return this._getOption('tooltip');
    }
    set tooltip(value: { arrowLength?: number, border?: { color?: string, dashStyle?: string, opacity?: number | undefined, visible?: boolean, width?: number }, color?: string, container?: string | UserDefinedElement | undefined, contentTemplate?: any | undefined, cornerRadius?: number, customizeTooltip?: Function | undefined, enabled?: boolean, font?: Font, format?: Format | string | undefined, interactive?: boolean, opacity?: number | undefined, paddingLeftRight?: number, paddingTopBottom?: number, shadow?: { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number }, zIndex?: number | undefined }) {
        this._setOption('tooltip', value);
    }


    /**
     * [descr:BaseGaugeOptions.value]
    
     */
    @Input()
    get value(): number | undefined {
        return this._getOption('value');
    }
    set value(value: number | undefined) {
        this._setOption('value', value);
    }


    /**
     * [descr:dxLinearGaugeOptions.valueIndicator]
    
     */
    @Input()
    get valueIndicator(): any {
        return this._getOption('valueIndicator');
    }
    set valueIndicator(value: any) {
        this._setOption('valueIndicator', value);
    }

    /**
    
     * [descr:dxLinearGaugeOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<DisposingEvent>;

    /**
    
     * [descr:dxLinearGaugeOptions.onDrawn]
    
    
     */
    @Output() onDrawn: EventEmitter<DrawnEvent>;

    /**
    
     * [descr:dxLinearGaugeOptions.onExported]
    
    
     */
    @Output() onExported: EventEmitter<ExportedEvent>;

    /**
    
     * [descr:dxLinearGaugeOptions.onExporting]
    
    
     */
    @Output() onExporting: EventEmitter<ExportingEvent>;

    /**
    
     * [descr:dxLinearGaugeOptions.onFileSaving]
    
    
     */
    @Output() onFileSaving: EventEmitter<FileSavingEvent>;

    /**
    
     * [descr:dxLinearGaugeOptions.onIncidentOccurred]
    
    
     */
    @Output() onIncidentOccurred: EventEmitter<IncidentOccurredEvent>;

    /**
    
     * [descr:dxLinearGaugeOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<InitializedEvent>;

    /**
    
     * [descr:dxLinearGaugeOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<OptionChangedEvent>;

    /**
    
     * [descr:dxLinearGaugeOptions.onTooltipHidden]
    
    
     */
    @Output() onTooltipHidden: EventEmitter<TooltipHiddenEvent>;

    /**
    
     * [descr:dxLinearGaugeOptions.onTooltipShown]
    
    
     */
    @Output() onTooltipShown: EventEmitter<TooltipShownEvent>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() animationChange: EventEmitter<{ duration?: number, easing?: string, enabled?: boolean }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() containerBackgroundColorChange: EventEmitter<string>;

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
    @Output() exportChange: EventEmitter<{ backgroundColor?: string, enabled?: boolean, fileName?: string, formats?: Array<string>, margin?: number, printingEnabled?: boolean, svgToCanvas?: Function | undefined }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() geometryChange: EventEmitter<{ orientation?: string }>;

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
    @Output() pathModifiedChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() rangeContainerChange: EventEmitter<{ backgroundColor?: DevExpress.common.charts.ChartsColor | string, horizontalOrientation?: string, offset?: number, palette?: string | Array<string>, paletteExtensionMode?: string, ranges?: Array<any | { color?: DevExpress.common.charts.ChartsColor | string, endValue?: number, startValue?: number }>, verticalOrientation?: string, width?: number | { end?: number, start?: number } }>;

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
    @Output() scaleChange: EventEmitter<{ allowDecimals?: boolean | undefined, customMinorTicks?: Array<number>, customTicks?: Array<number>, endValue?: number, horizontalOrientation?: string, label?: { customizeText?: Function, font?: Font, format?: Format | string | undefined, indentFromTick?: number, overlappingBehavior?: string, useRangeColors?: boolean, visible?: boolean }, minorTick?: { color?: string, length?: number, opacity?: number, visible?: boolean, width?: number }, minorTickInterval?: number | undefined, scaleDivisionFactor?: number, startValue?: number, tick?: { color?: string, length?: number, opacity?: number, visible?: boolean, width?: number }, tickInterval?: number | undefined, verticalOrientation?: string }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() sizeChange: EventEmitter<{ height?: number | undefined, width?: number | undefined }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() subvalueIndicatorChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() subvaluesChange: EventEmitter<Array<number>>;

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
    @Output() valueChange: EventEmitter<number | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() valueIndicatorChange: EventEmitter<any>;







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
            { emit: 'containerBackgroundColorChange' },
            { emit: 'disabledChange' },
            { emit: 'elementAttrChange' },
            { emit: 'exportChange' },
            { emit: 'geometryChange' },
            { emit: 'loadingIndicatorChange' },
            { emit: 'marginChange' },
            { emit: 'pathModifiedChange' },
            { emit: 'rangeContainerChange' },
            { emit: 'redrawOnResizeChange' },
            { emit: 'rtlEnabledChange' },
            { emit: 'scaleChange' },
            { emit: 'sizeChange' },
            { emit: 'subvalueIndicatorChange' },
            { emit: 'subvaluesChange' },
            { emit: 'themeChange' },
            { emit: 'titleChange' },
            { emit: 'tooltipChange' },
            { emit: 'valueChange' },
            { emit: 'valueIndicatorChange' }
        ]);

        this._idh.setHost(this);
        optionHost.setHost(this);
    }

    protected _createInstance(element, options) {

        return new DxLinearGauge(element, options);
    }


    ngOnDestroy() {
        this._destroyWidget();
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        this.setupChanges('subvalues', changes);
    }

    setupChanges(prop: string, changes: SimpleChanges) {
        if (!(prop in this._optionsToUpdate)) {
            this._idh.setup(prop, changes);
        }
    }

    ngDoCheck() {
        this._idh.doCheck('subvalues');
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
    DxoLoadingIndicatorModule,
    DxoFontModule,
    DxoMarginModule,
    DxoRangeContainerModule,
    DxoBackgroundColorModule,
    DxiRangeModule,
    DxoColorModule,
    DxoWidthModule,
    DxoScaleModule,
    DxoLabelModule,
    DxoFormatModule,
    DxoMinorTickModule,
    DxoTickModule,
    DxoSizeModule,
    DxoSubvalueIndicatorModule,
    DxoTextModule,
    DxoTitleModule,
    DxoSubtitleModule,
    DxoTooltipModule,
    DxoBorderModule,
    DxoShadowModule,
    DxoValueIndicatorModule,
    DxIntegrationModule,
    DxTemplateModule
  ],
  declarations: [
    DxLinearGaugeComponent
  ],
  exports: [
    DxLinearGaugeComponent,
    DxoAnimationModule,
    DxoExportModule,
    DxoGeometryModule,
    DxoLoadingIndicatorModule,
    DxoFontModule,
    DxoMarginModule,
    DxoRangeContainerModule,
    DxoBackgroundColorModule,
    DxiRangeModule,
    DxoColorModule,
    DxoWidthModule,
    DxoScaleModule,
    DxoLabelModule,
    DxoFormatModule,
    DxoMinorTickModule,
    DxoTickModule,
    DxoSizeModule,
    DxoSubvalueIndicatorModule,
    DxoTextModule,
    DxoTitleModule,
    DxoSubtitleModule,
    DxoTooltipModule,
    DxoBorderModule,
    DxoShadowModule,
    DxoValueIndicatorModule,
    DxTemplateModule
  ]
})
export class DxLinearGaugeModule { }

import type * as DxLinearGaugeTypes from "devextreme/viz/linear_gauge_types";
export { DxLinearGaugeTypes };


