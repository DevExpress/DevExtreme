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
import { DataSourceOptions } from 'devextreme/data/data_source';
import { Store } from 'devextreme/data/store';
import { DisposingEvent, DrawnEvent, ExportedEvent, ExportingEvent, FileSavingEvent, IncidentOccurredEvent, InitializedEvent, OptionChangedEvent, TooltipHiddenEvent, TooltipShownEvent, SparklineType } from 'devextreme/viz/sparkline';
import { PointSymbol, Theme, DashStyle, Font } from 'devextreme/common/charts';
import { Format } from 'devextreme/common/core/localization';

import DxSparkline from 'devextreme/viz/sparkline';


import {
    DxComponent,
    DxTemplateHost,
    DxIntegrationModule,
    DxTemplateModule,
    NestedOptionHost,
    IterableDifferHelper,
    WatcherHelper
} from 'devextreme-angular/core';

import { DxoMarginModule } from 'devextreme-angular/ui/nested';
import { DxoSizeModule } from 'devextreme-angular/ui/nested';
import { DxoTooltipModule } from 'devextreme-angular/ui/nested';
import { DxoBorderModule } from 'devextreme-angular/ui/nested';
import { DxoFontModule } from 'devextreme-angular/ui/nested';
import { DxoFormatModule } from 'devextreme-angular/ui/nested';
import { DxoShadowModule } from 'devextreme-angular/ui/nested';

import { DxoSparklineBorderModule } from 'devextreme-angular/ui/sparkline/nested';
import { DxoSparklineFontModule } from 'devextreme-angular/ui/sparkline/nested';
import { DxoSparklineFormatModule } from 'devextreme-angular/ui/sparkline/nested';
import { DxoSparklineMarginModule } from 'devextreme-angular/ui/sparkline/nested';
import { DxoSparklineShadowModule } from 'devextreme-angular/ui/sparkline/nested';
import { DxoSparklineSizeModule } from 'devextreme-angular/ui/sparkline/nested';
import { DxoSparklineTooltipModule } from 'devextreme-angular/ui/sparkline/nested';




/**
 * [descr:dxSparkline]

 */
@Component({
    selector: 'dx-sparkline',
    template: '',
    styles: [ ' :host {  display: block; }'],
    providers: [
        DxTemplateHost,
        WatcherHelper,
        NestedOptionHost,
        IterableDifferHelper
    ]
})
export class DxSparklineComponent extends DxComponent implements OnDestroy, OnChanges, DoCheck {
    instance: DxSparkline = null;

    /**
     * [descr:dxSparklineOptions.argumentField]
    
     */
    @Input()
    get argumentField(): string {
        return this._getOption('argumentField');
    }
    set argumentField(value: string) {
        this._setOption('argumentField', value);
    }


    /**
     * [descr:dxSparklineOptions.barNegativeColor]
    
     */
    @Input()
    get barNegativeColor(): string {
        return this._getOption('barNegativeColor');
    }
    set barNegativeColor(value: string) {
        this._setOption('barNegativeColor', value);
    }


    /**
     * [descr:dxSparklineOptions.barPositiveColor]
    
     */
    @Input()
    get barPositiveColor(): string {
        return this._getOption('barPositiveColor');
    }
    set barPositiveColor(value: string) {
        this._setOption('barPositiveColor', value);
    }


    /**
     * [descr:dxSparklineOptions.dataSource]
    
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
     * [descr:dxSparklineOptions.firstLastColor]
    
     */
    @Input()
    get firstLastColor(): string {
        return this._getOption('firstLastColor');
    }
    set firstLastColor(value: string) {
        this._setOption('firstLastColor', value);
    }


    /**
     * [descr:dxSparklineOptions.ignoreEmptyPoints]
    
     */
    @Input()
    get ignoreEmptyPoints(): boolean {
        return this._getOption('ignoreEmptyPoints');
    }
    set ignoreEmptyPoints(value: boolean) {
        this._setOption('ignoreEmptyPoints', value);
    }


    /**
     * [descr:dxSparklineOptions.lineColor]
    
     */
    @Input()
    get lineColor(): string {
        return this._getOption('lineColor');
    }
    set lineColor(value: string) {
        this._setOption('lineColor', value);
    }


    /**
     * [descr:dxSparklineOptions.lineWidth]
    
     */
    @Input()
    get lineWidth(): number {
        return this._getOption('lineWidth');
    }
    set lineWidth(value: number) {
        this._setOption('lineWidth', value);
    }


    /**
     * [descr:dxSparklineOptions.lossColor]
    
     */
    @Input()
    get lossColor(): string {
        return this._getOption('lossColor');
    }
    set lossColor(value: string) {
        this._setOption('lossColor', value);
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
     * [descr:dxSparklineOptions.maxColor]
    
     */
    @Input()
    get maxColor(): string {
        return this._getOption('maxColor');
    }
    set maxColor(value: string) {
        this._setOption('maxColor', value);
    }


    /**
     * [descr:dxSparklineOptions.maxValue]
    
     */
    @Input()
    get maxValue(): number | undefined {
        return this._getOption('maxValue');
    }
    set maxValue(value: number | undefined) {
        this._setOption('maxValue', value);
    }


    /**
     * [descr:dxSparklineOptions.minColor]
    
     */
    @Input()
    get minColor(): string {
        return this._getOption('minColor');
    }
    set minColor(value: string) {
        this._setOption('minColor', value);
    }


    /**
     * [descr:dxSparklineOptions.minValue]
    
     */
    @Input()
    get minValue(): number | undefined {
        return this._getOption('minValue');
    }
    set minValue(value: number | undefined) {
        this._setOption('minValue', value);
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
     * [descr:dxSparklineOptions.pointColor]
    
     */
    @Input()
    get pointColor(): string {
        return this._getOption('pointColor');
    }
    set pointColor(value: string) {
        this._setOption('pointColor', value);
    }


    /**
     * [descr:dxSparklineOptions.pointSize]
    
     */
    @Input()
    get pointSize(): number {
        return this._getOption('pointSize');
    }
    set pointSize(value: number) {
        this._setOption('pointSize', value);
    }


    /**
     * [descr:dxSparklineOptions.pointSymbol]
    
     */
    @Input()
    get pointSymbol(): PointSymbol {
        return this._getOption('pointSymbol');
    }
    set pointSymbol(value: PointSymbol) {
        this._setOption('pointSymbol', value);
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
     * [descr:dxSparklineOptions.showFirstLast]
    
     */
    @Input()
    get showFirstLast(): boolean {
        return this._getOption('showFirstLast');
    }
    set showFirstLast(value: boolean) {
        this._setOption('showFirstLast', value);
    }


    /**
     * [descr:dxSparklineOptions.showMinMax]
    
     */
    @Input()
    get showMinMax(): boolean {
        return this._getOption('showMinMax');
    }
    set showMinMax(value: boolean) {
        this._setOption('showMinMax', value);
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
     * [descr:dxSparklineOptions.type]
    
     */
    @Input()
    get type(): SparklineType {
        return this._getOption('type');
    }
    set type(value: SparklineType) {
        this._setOption('type', value);
    }


    /**
     * [descr:dxSparklineOptions.valueField]
    
     */
    @Input()
    get valueField(): string {
        return this._getOption('valueField');
    }
    set valueField(value: string) {
        this._setOption('valueField', value);
    }


    /**
     * [descr:dxSparklineOptions.winColor]
    
     */
    @Input()
    get winColor(): string {
        return this._getOption('winColor');
    }
    set winColor(value: string) {
        this._setOption('winColor', value);
    }


    /**
     * [descr:dxSparklineOptions.winlossThreshold]
    
     */
    @Input()
    get winlossThreshold(): number {
        return this._getOption('winlossThreshold');
    }
    set winlossThreshold(value: number) {
        this._setOption('winlossThreshold', value);
    }

    /**
    
     * [descr:dxSparklineOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<DisposingEvent>;

    /**
    
     * [descr:dxSparklineOptions.onDrawn]
    
    
     */
    @Output() onDrawn: EventEmitter<DrawnEvent>;

    /**
    
     * [descr:dxSparklineOptions.onExported]
    
    
     */
    @Output() onExported: EventEmitter<ExportedEvent>;

    /**
    
     * [descr:dxSparklineOptions.onExporting]
    
    
     */
    @Output() onExporting: EventEmitter<ExportingEvent>;

    /**
    
     * [descr:dxSparklineOptions.onFileSaving]
    
    
     */
    @Output() onFileSaving: EventEmitter<FileSavingEvent>;

    /**
    
     * [descr:dxSparklineOptions.onIncidentOccurred]
    
    
     */
    @Output() onIncidentOccurred: EventEmitter<IncidentOccurredEvent>;

    /**
    
     * [descr:dxSparklineOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<InitializedEvent>;

    /**
    
     * [descr:dxSparklineOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<OptionChangedEvent>;

    /**
    
     * [descr:dxSparklineOptions.onTooltipHidden]
    
    
     */
    @Output() onTooltipHidden: EventEmitter<TooltipHiddenEvent>;

    /**
    
     * [descr:dxSparklineOptions.onTooltipShown]
    
    
     */
    @Output() onTooltipShown: EventEmitter<TooltipShownEvent>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() argumentFieldChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() barNegativeColorChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() barPositiveColorChange: EventEmitter<string>;

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
    @Output() firstLastColorChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() ignoreEmptyPointsChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() lineColorChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() lineWidthChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() lossColorChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() marginChange: EventEmitter<{ bottom?: number, left?: number, right?: number, top?: number }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() maxColorChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() maxValueChange: EventEmitter<number | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() minColorChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() minValueChange: EventEmitter<number | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() pathModifiedChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() pointColorChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() pointSizeChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() pointSymbolChange: EventEmitter<PointSymbol>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() rtlEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showFirstLastChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showMinMaxChange: EventEmitter<boolean>;

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
    @Output() tooltipChange: EventEmitter<{ arrowLength?: number, border?: { color?: string, dashStyle?: DashStyle, opacity?: number | undefined, visible?: boolean, width?: number }, color?: string, container?: any | string | undefined, contentTemplate?: any, cornerRadius?: number, customizeTooltip?: ((pointsInfo: any) => Record<string, any>) | undefined, enabled?: boolean, font?: Font, format?: Format | undefined, interactive?: boolean, opacity?: number | undefined, paddingLeftRight?: number, paddingTopBottom?: number, shadow?: { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number }, zIndex?: number | undefined }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() typeChange: EventEmitter<SparklineType>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() valueFieldChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() winColorChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() winlossThresholdChange: EventEmitter<number>;








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
            { emit: 'argumentFieldChange' },
            { emit: 'barNegativeColorChange' },
            { emit: 'barPositiveColorChange' },
            { emit: 'dataSourceChange' },
            { emit: 'disabledChange' },
            { emit: 'elementAttrChange' },
            { emit: 'firstLastColorChange' },
            { emit: 'ignoreEmptyPointsChange' },
            { emit: 'lineColorChange' },
            { emit: 'lineWidthChange' },
            { emit: 'lossColorChange' },
            { emit: 'marginChange' },
            { emit: 'maxColorChange' },
            { emit: 'maxValueChange' },
            { emit: 'minColorChange' },
            { emit: 'minValueChange' },
            { emit: 'pathModifiedChange' },
            { emit: 'pointColorChange' },
            { emit: 'pointSizeChange' },
            { emit: 'pointSymbolChange' },
            { emit: 'rtlEnabledChange' },
            { emit: 'showFirstLastChange' },
            { emit: 'showMinMaxChange' },
            { emit: 'sizeChange' },
            { emit: 'themeChange' },
            { emit: 'tooltipChange' },
            { emit: 'typeChange' },
            { emit: 'valueFieldChange' },
            { emit: 'winColorChange' },
            { emit: 'winlossThresholdChange' }
        ]);

        this._idh.setHost(this);
        optionHost.setHost(this);
    }

    protected _createInstance(element, options) {

        return new DxSparkline(element, options);
    }


    ngOnDestroy() {
        this._destroyWidget();
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        this.setupChanges('dataSource', changes);
    }

    setupChanges(prop: string, changes: SimpleChanges) {
        if (!(prop in this._optionsToUpdate)) {
            this._idh.setup(prop, changes);
        }
    }

    ngDoCheck() {
        this._idh.doCheck('dataSource');
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
    DxoMarginModule,
    DxoSizeModule,
    DxoTooltipModule,
    DxoBorderModule,
    DxoFontModule,
    DxoFormatModule,
    DxoShadowModule,
    DxoSparklineBorderModule,
    DxoSparklineFontModule,
    DxoSparklineFormatModule,
    DxoSparklineMarginModule,
    DxoSparklineShadowModule,
    DxoSparklineSizeModule,
    DxoSparklineTooltipModule,
    DxIntegrationModule,
    DxTemplateModule
  ],
  declarations: [
    DxSparklineComponent
  ],
  exports: [
    DxSparklineComponent,
    DxoMarginModule,
    DxoSizeModule,
    DxoTooltipModule,
    DxoBorderModule,
    DxoFontModule,
    DxoFormatModule,
    DxoShadowModule,
    DxoSparklineBorderModule,
    DxoSparklineFontModule,
    DxoSparklineFormatModule,
    DxoSparklineMarginModule,
    DxoSparklineShadowModule,
    DxoSparklineSizeModule,
    DxoSparklineTooltipModule,
    DxTemplateModule
  ]
})
export class DxSparklineModule { }

import type * as DxSparklineTypes from "devextreme/viz/sparkline_types";
export { DxSparklineTypes };


