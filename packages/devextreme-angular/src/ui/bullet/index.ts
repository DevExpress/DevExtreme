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
    EventEmitter
} from '@angular/core';


import { DisposingEvent, DrawnEvent, ExportedEvent, ExportingEvent, FileSavingEvent, IncidentOccurredEvent, InitializedEvent, OptionChangedEvent, TooltipHiddenEvent, TooltipShownEvent } from 'devextreme/viz/bullet';
import { Theme, DashStyle, Font } from 'devextreme/common/charts';
import { Format } from 'devextreme/common/core/localization';

import DxBullet from 'devextreme/viz/bullet';


import {
    DxComponent,
    DxTemplateHost,
    DxIntegrationModule,
    DxTemplateModule,
    NestedOptionHost,
    WatcherHelper
} from 'devextreme-angular/core';

import { DxoMarginModule } from 'devextreme-angular/ui/nested';
import { DxoSizeModule } from 'devextreme-angular/ui/nested';
import { DxoTooltipModule } from 'devextreme-angular/ui/nested';
import { DxoBorderModule } from 'devextreme-angular/ui/nested';
import { DxoFontModule } from 'devextreme-angular/ui/nested';
import { DxoFormatModule } from 'devextreme-angular/ui/nested';
import { DxoShadowModule } from 'devextreme-angular/ui/nested';

import { DxoBulletBorderModule } from 'devextreme-angular/ui/bullet/nested';
import { DxoBulletFontModule } from 'devextreme-angular/ui/bullet/nested';
import { DxoBulletFormatModule } from 'devextreme-angular/ui/bullet/nested';
import { DxoBulletMarginModule } from 'devextreme-angular/ui/bullet/nested';
import { DxoBulletShadowModule } from 'devextreme-angular/ui/bullet/nested';
import { DxoBulletSizeModule } from 'devextreme-angular/ui/bullet/nested';
import { DxoBulletTooltipModule } from 'devextreme-angular/ui/bullet/nested';




/**
 * [descr:dxBullet]

 */
@Component({
    selector: 'dx-bullet',
    template: '',
    styles: [ ' :host {  display: block; }'],
    host: { ngSkipHydration: 'true' },
    providers: [
        DxTemplateHost,
        WatcherHelper,
        NestedOptionHost
    ]
})
export class DxBulletComponent extends DxComponent implements OnDestroy {
    instance: DxBullet = null;

    /**
     * [descr:dxBulletOptions.color]
    
     */
    @Input()
    get color(): string {
        return this._getOption('color');
    }
    set color(value: string) {
        this._setOption('color', value);
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
     * [descr:dxBulletOptions.endScaleValue]
    
     */
    @Input()
    get endScaleValue(): number | undefined {
        return this._getOption('endScaleValue');
    }
    set endScaleValue(value: number | undefined) {
        this._setOption('endScaleValue', value);
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
     * [descr:dxBulletOptions.showTarget]
    
     */
    @Input()
    get showTarget(): boolean {
        return this._getOption('showTarget');
    }
    set showTarget(value: boolean) {
        this._setOption('showTarget', value);
    }


    /**
     * [descr:dxBulletOptions.showZeroLevel]
    
     */
    @Input()
    get showZeroLevel(): boolean {
        return this._getOption('showZeroLevel');
    }
    set showZeroLevel(value: boolean) {
        this._setOption('showZeroLevel', value);
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
     * [descr:dxBulletOptions.startScaleValue]
    
     */
    @Input()
    get startScaleValue(): number {
        return this._getOption('startScaleValue');
    }
    set startScaleValue(value: number) {
        this._setOption('startScaleValue', value);
    }


    /**
     * [descr:dxBulletOptions.target]
    
     */
    @Input()
    get target(): number {
        return this._getOption('target');
    }
    set target(value: number) {
        this._setOption('target', value);
    }


    /**
     * [descr:dxBulletOptions.targetColor]
    
     */
    @Input()
    get targetColor(): string {
        return this._getOption('targetColor');
    }
    set targetColor(value: string) {
        this._setOption('targetColor', value);
    }


    /**
     * [descr:dxBulletOptions.targetWidth]
    
     */
    @Input()
    get targetWidth(): number {
        return this._getOption('targetWidth');
    }
    set targetWidth(value: number) {
        this._setOption('targetWidth', value);
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
     * [descr:BaseSparklineOptions.tooltip]
    
     */
    @Input()
    get tooltip(): { arrowLength?: number, border?: { color?: string, dashStyle?: DashStyle, opacity?: number | undefined, visible?: boolean, width?: number }, color?: string, container?: any | string | undefined, contentTemplate?: any, cornerRadius?: number, customizeTooltip?: ((pointsInfo: any) => Record<string, any>) | undefined, enabled?: boolean, font?: Font, format?: Format | undefined, interactive?: boolean, opacity?: number | undefined, paddingLeftRight?: number, paddingTopBottom?: number, shadow?: { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number }, zIndex?: number | undefined } {
        return this._getOption('tooltip');
    }
    set tooltip(value: { arrowLength?: number, border?: { color?: string, dashStyle?: DashStyle, opacity?: number | undefined, visible?: boolean, width?: number }, color?: string, container?: any | string | undefined, contentTemplate?: any, cornerRadius?: number, customizeTooltip?: ((pointsInfo: any) => Record<string, any>) | undefined, enabled?: boolean, font?: Font, format?: Format | undefined, interactive?: boolean, opacity?: number | undefined, paddingLeftRight?: number, paddingTopBottom?: number, shadow?: { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number }, zIndex?: number | undefined }) {
        this._setOption('tooltip', value);
    }


    /**
     * [descr:dxBulletOptions.value]
    
     */
    @Input()
    get value(): number {
        return this._getOption('value');
    }
    set value(value: number) {
        this._setOption('value', value);
    }

    /**
    
     * [descr:dxBulletOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<DisposingEvent>;

    /**
    
     * [descr:dxBulletOptions.onDrawn]
    
    
     */
    @Output() onDrawn: EventEmitter<DrawnEvent>;

    /**
    
     * [descr:dxBulletOptions.onExported]
    
    
     */
    @Output() onExported: EventEmitter<ExportedEvent>;

    /**
    
     * [descr:dxBulletOptions.onExporting]
    
    
     */
    @Output() onExporting: EventEmitter<ExportingEvent>;

    /**
    
     * [descr:dxBulletOptions.onFileSaving]
    
    
     */
    @Output() onFileSaving: EventEmitter<FileSavingEvent>;

    /**
    
     * [descr:dxBulletOptions.onIncidentOccurred]
    
    
     */
    @Output() onIncidentOccurred: EventEmitter<IncidentOccurredEvent>;

    /**
    
     * [descr:dxBulletOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<InitializedEvent>;

    /**
    
     * [descr:dxBulletOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<OptionChangedEvent>;

    /**
    
     * [descr:dxBulletOptions.onTooltipHidden]
    
    
     */
    @Output() onTooltipHidden: EventEmitter<TooltipHiddenEvent>;

    /**
    
     * [descr:dxBulletOptions.onTooltipShown]
    
    
     */
    @Output() onTooltipShown: EventEmitter<TooltipShownEvent>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() colorChange: EventEmitter<string>;

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
    @Output() endScaleValueChange: EventEmitter<number | undefined>;

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
    @Output() rtlEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showTargetChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showZeroLevelChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() sizeChange: EventEmitter<{ height?: number | undefined, width?: number | undefined }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() startScaleValueChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() targetChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() targetColorChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() targetWidthChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() themeChange: EventEmitter<Theme>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() tooltipChange: EventEmitter<{ arrowLength?: number, border?: { color?: string, dashStyle?: DashStyle, opacity?: number | undefined, visible?: boolean, width?: number }, color?: string, container?: any | string | undefined, contentTemplate?: any, cornerRadius?: number, customizeTooltip?: ((pointsInfo: any) => Record<string, any>) | undefined, enabled?: boolean, font?: Font, format?: Format | undefined, interactive?: boolean, opacity?: number | undefined, paddingLeftRight?: number, paddingTopBottom?: number, shadow?: { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number }, zIndex?: number | undefined }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() valueChange: EventEmitter<number>;








    constructor(elementRef: ElementRef, ngZone: NgZone, templateHost: DxTemplateHost,
            _watcherHelper: WatcherHelper,
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
            { emit: 'colorChange' },
            { emit: 'disabledChange' },
            { emit: 'elementAttrChange' },
            { emit: 'endScaleValueChange' },
            { emit: 'marginChange' },
            { emit: 'pathModifiedChange' },
            { emit: 'rtlEnabledChange' },
            { emit: 'showTargetChange' },
            { emit: 'showZeroLevelChange' },
            { emit: 'sizeChange' },
            { emit: 'startScaleValueChange' },
            { emit: 'targetChange' },
            { emit: 'targetColorChange' },
            { emit: 'targetWidthChange' },
            { emit: 'themeChange' },
            { emit: 'tooltipChange' },
            { emit: 'valueChange' }
        ]);
        optionHost.setHost(this);
    }

    protected _createInstance(element, options) {

        return new DxBullet(element, options);
    }


    ngOnDestroy() {
        this._destroyWidget();
    }

}

@NgModule({
  imports: [
    DxoMarginModule,
    DxoSizeModule,
    DxoTooltipModule,
    DxoBorderModule,
    DxoFontModule,
    DxoFormatModule,
    DxoShadowModule,
    DxoBulletBorderModule,
    DxoBulletFontModule,
    DxoBulletFormatModule,
    DxoBulletMarginModule,
    DxoBulletShadowModule,
    DxoBulletSizeModule,
    DxoBulletTooltipModule,
    DxIntegrationModule,
    DxTemplateModule
  ],
  declarations: [
    DxBulletComponent
  ],
  exports: [
    DxBulletComponent,
    DxoMarginModule,
    DxoSizeModule,
    DxoTooltipModule,
    DxoBorderModule,
    DxoFontModule,
    DxoFormatModule,
    DxoShadowModule,
    DxoBulletBorderModule,
    DxoBulletFontModule,
    DxoBulletFormatModule,
    DxoBulletMarginModule,
    DxoBulletShadowModule,
    DxoBulletSizeModule,
    DxoBulletTooltipModule,
    DxTemplateModule
  ]
})
export class DxBulletModule { }

import type * as DxBulletTypes from "devextreme/viz/bullet_types";
export { DxBulletTypes };


