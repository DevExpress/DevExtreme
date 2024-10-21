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
import { DisposingEvent, DrawnEvent, ExportedEvent, ExportingEvent, FileSavingEvent, HoverChangedEvent, IncidentOccurredEvent, InitializedEvent, ItemClickEvent, LegendClickEvent, OptionChangedEvent, SelectionChangedEvent } from 'devextreme/viz/funnel';

import DxFunnel from 'devextreme/viz/funnel';


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
import { DxoItemModule } from 'devextreme-angular/ui/nested';
import { DxoBorderModule } from 'devextreme-angular/ui/nested';
import { DxoHoverStyleModule } from 'devextreme-angular/ui/nested';
import { DxoHatchingModule } from 'devextreme-angular/ui/nested';
import { DxoSelectionStyleModule } from 'devextreme-angular/ui/nested';
import { DxoLabelModule } from 'devextreme-angular/ui/nested';
import { DxoConnectorModule } from 'devextreme-angular/ui/nested';
import { DxoFontModule } from 'devextreme-angular/ui/nested';
import { DxoFormatModule } from 'devextreme-angular/ui/nested';
import { DxoLegendModule } from 'devextreme-angular/ui/nested';
import { DxoMarginModule } from 'devextreme-angular/ui/nested';
import { DxoTitleModule } from 'devextreme-angular/ui/nested';
import { DxoSubtitleModule } from 'devextreme-angular/ui/nested';
import { DxoLoadingIndicatorModule } from 'devextreme-angular/ui/nested';
import { DxoSizeModule } from 'devextreme-angular/ui/nested';
import { DxoTooltipModule } from 'devextreme-angular/ui/nested';
import { DxoShadowModule } from 'devextreme-angular/ui/nested';

import { DxoFunnelAdaptiveLayoutModule } from 'devextreme-angular/ui/funnel/nested';
import { DxoFunnelBorderModule } from 'devextreme-angular/ui/funnel/nested';
import { DxoFunnelConnectorModule } from 'devextreme-angular/ui/funnel/nested';
import { DxoFunnelExportModule } from 'devextreme-angular/ui/funnel/nested';
import { DxoFunnelFontModule } from 'devextreme-angular/ui/funnel/nested';
import { DxoFunnelFormatModule } from 'devextreme-angular/ui/funnel/nested';
import { DxoFunnelFunnelTitleModule } from 'devextreme-angular/ui/funnel/nested';
import { DxoFunnelFunnelTitleSubtitleModule } from 'devextreme-angular/ui/funnel/nested';
import { DxoFunnelHatchingModule } from 'devextreme-angular/ui/funnel/nested';
import { DxoFunnelHoverStyleModule } from 'devextreme-angular/ui/funnel/nested';
import { DxoFunnelItemModule } from 'devextreme-angular/ui/funnel/nested';
import { DxoFunnelItemBorderModule } from 'devextreme-angular/ui/funnel/nested';
import { DxoFunnelLabelModule } from 'devextreme-angular/ui/funnel/nested';
import { DxoFunnelLabelBorderModule } from 'devextreme-angular/ui/funnel/nested';
import { DxoFunnelLegendModule } from 'devextreme-angular/ui/funnel/nested';
import { DxoFunnelLegendBorderModule } from 'devextreme-angular/ui/funnel/nested';
import { DxoFunnelLegendTitleModule } from 'devextreme-angular/ui/funnel/nested';
import { DxoFunnelLegendTitleSubtitleModule } from 'devextreme-angular/ui/funnel/nested';
import { DxoFunnelLoadingIndicatorModule } from 'devextreme-angular/ui/funnel/nested';
import { DxoFunnelMarginModule } from 'devextreme-angular/ui/funnel/nested';
import { DxoFunnelSelectionStyleModule } from 'devextreme-angular/ui/funnel/nested';
import { DxoFunnelShadowModule } from 'devextreme-angular/ui/funnel/nested';
import { DxoFunnelSizeModule } from 'devextreme-angular/ui/funnel/nested';
import { DxoFunnelSubtitleModule } from 'devextreme-angular/ui/funnel/nested';
import { DxoFunnelTitleModule } from 'devextreme-angular/ui/funnel/nested';
import { DxoFunnelTooltipModule } from 'devextreme-angular/ui/funnel/nested';
import { DxoFunnelTooltipBorderModule } from 'devextreme-angular/ui/funnel/nested';




/**
 * [descr:dxFunnel]

 */
@Component({
    selector: 'dx-funnel',
    template: '',
    styles: [ ' :host {  display: block; }'],
    providers: [
        DxTemplateHost,
        WatcherHelper,
        NestedOptionHost,
        IterableDifferHelper
    ]
})
export class DxFunnelComponent extends DxComponent implements OnDestroy, OnChanges, DoCheck {
    instance: DxFunnel = null;

    /**
     * [descr:dxFunnelOptions.adaptiveLayout]
    
     */
    @Input()
    get adaptiveLayout(): Record<string, any> {
        return this._getOption('adaptiveLayout');
    }
    set adaptiveLayout(value: Record<string, any>) {
        this._setOption('adaptiveLayout', value);
    }


    /**
     * [descr:dxFunnelOptions.algorithm]
    
     */
    @Input()
    get algorithm(): "dynamicHeight" | "dynamicSlope" {
        return this._getOption('algorithm');
    }
    set algorithm(value: "dynamicHeight" | "dynamicSlope") {
        this._setOption('algorithm', value);
    }


    /**
     * [descr:dxFunnelOptions.argumentField]
    
     */
    @Input()
    get argumentField(): string {
        return this._getOption('argumentField');
    }
    set argumentField(value: string) {
        this._setOption('argumentField', value);
    }


    /**
     * [descr:dxFunnelOptions.colorField]
    
     */
    @Input()
    get colorField(): string {
        return this._getOption('colorField');
    }
    set colorField(value: string) {
        this._setOption('colorField', value);
    }


    /**
     * [descr:dxFunnelOptions.dataSource]
    
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
    get export(): Record<string, any> {
        return this._getOption('export');
    }
    set export(value: Record<string, any>) {
        this._setOption('export', value);
    }


    /**
     * [descr:dxFunnelOptions.hoverEnabled]
    
     */
    @Input()
    get hoverEnabled(): boolean {
        return this._getOption('hoverEnabled');
    }
    set hoverEnabled(value: boolean) {
        this._setOption('hoverEnabled', value);
    }


    /**
     * [descr:dxFunnelOptions.inverted]
    
     */
    @Input()
    get inverted(): boolean {
        return this._getOption('inverted');
    }
    set inverted(value: boolean) {
        this._setOption('inverted', value);
    }


    /**
     * [descr:dxFunnelOptions.item]
    
     */
    @Input()
    get item(): Record<string, any> {
        return this._getOption('item');
    }
    set item(value: Record<string, any>) {
        this._setOption('item', value);
    }


    /**
     * [descr:dxFunnelOptions.label]
    
     */
    @Input()
    get label(): Record<string, any> {
        return this._getOption('label');
    }
    set label(value: Record<string, any>) {
        this._setOption('label', value);
    }


    /**
     * [descr:dxFunnelOptions.legend]
    
     */
    @Input()
    get legend(): Record<string, any> {
        return this._getOption('legend');
    }
    set legend(value: Record<string, any>) {
        this._setOption('legend', value);
    }


    /**
     * [descr:BaseWidgetOptions.loadingIndicator]
    
     */
    @Input()
    get loadingIndicator(): Record<string, any> {
        return this._getOption('loadingIndicator');
    }
    set loadingIndicator(value: Record<string, any>) {
        this._setOption('loadingIndicator', value);
    }


    /**
     * [descr:BaseWidgetOptions.margin]
    
     */
    @Input()
    get margin(): Record<string, any> {
        return this._getOption('margin');
    }
    set margin(value: Record<string, any>) {
        this._setOption('margin', value);
    }


    /**
     * [descr:dxFunnelOptions.neckHeight]
    
     */
    @Input()
    get neckHeight(): number {
        return this._getOption('neckHeight');
    }
    set neckHeight(value: number) {
        this._setOption('neckHeight', value);
    }


    /**
     * [descr:dxFunnelOptions.neckWidth]
    
     */
    @Input()
    get neckWidth(): number {
        return this._getOption('neckWidth');
    }
    set neckWidth(value: number) {
        this._setOption('neckWidth', value);
    }


    /**
     * [descr:dxFunnelOptions.palette]
    
     */
    @Input()
    get palette(): Array<string> | "Bright" | "Harmony Light" | "Ocean" | "Pastel" | "Soft" | "Soft Pastel" | "Vintage" | "Violet" | "Carmine" | "Dark Moon" | "Dark Violet" | "Green Mist" | "Soft Blue" | "Material" | "Office" {
        return this._getOption('palette');
    }
    set palette(value: Array<string> | "Bright" | "Harmony Light" | "Ocean" | "Pastel" | "Soft" | "Soft Pastel" | "Vintage" | "Violet" | "Carmine" | "Dark Moon" | "Dark Violet" | "Green Mist" | "Soft Blue" | "Material" | "Office") {
        this._setOption('palette', value);
    }


    /**
     * [descr:dxFunnelOptions.paletteExtensionMode]
    
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
     * [descr:dxFunnelOptions.resolveLabelOverlapping]
    
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
     * [descr:dxFunnelOptions.selectionMode]
    
     */
    @Input()
    get selectionMode(): "single" | "multiple" | "none" {
        return this._getOption('selectionMode');
    }
    set selectionMode(value: "single" | "multiple" | "none") {
        this._setOption('selectionMode', value);
    }


    /**
     * [descr:BaseWidgetOptions.size]
    
     */
    @Input()
    get size(): Record<string, any> {
        return this._getOption('size');
    }
    set size(value: Record<string, any>) {
        this._setOption('size', value);
    }


    /**
     * [descr:dxFunnelOptions.sortData]
    
     */
    @Input()
    get sortData(): boolean {
        return this._getOption('sortData');
    }
    set sortData(value: boolean) {
        this._setOption('sortData', value);
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
    get title(): Record<string, any> | string {
        return this._getOption('title');
    }
    set title(value: Record<string, any> | string) {
        this._setOption('title', value);
    }


    /**
     * [descr:dxFunnelOptions.tooltip]
    
     */
    @Input()
    get tooltip(): Record<string, any> {
        return this._getOption('tooltip');
    }
    set tooltip(value: Record<string, any>) {
        this._setOption('tooltip', value);
    }


    /**
     * [descr:dxFunnelOptions.valueField]
    
     */
    @Input()
    get valueField(): string {
        return this._getOption('valueField');
    }
    set valueField(value: string) {
        this._setOption('valueField', value);
    }

    /**
    
     * [descr:dxFunnelOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<DisposingEvent>;

    /**
    
     * [descr:dxFunnelOptions.onDrawn]
    
    
     */
    @Output() onDrawn: EventEmitter<DrawnEvent>;

    /**
    
     * [descr:dxFunnelOptions.onExported]
    
    
     */
    @Output() onExported: EventEmitter<ExportedEvent>;

    /**
    
     * [descr:dxFunnelOptions.onExporting]
    
    
     */
    @Output() onExporting: EventEmitter<ExportingEvent>;

    /**
    
     * [descr:dxFunnelOptions.onFileSaving]
    
    
     */
    @Output() onFileSaving: EventEmitter<FileSavingEvent>;

    /**
    
     * [descr:dxFunnelOptions.onHoverChanged]
    
    
     */
    @Output() onHoverChanged: EventEmitter<HoverChangedEvent>;

    /**
    
     * [descr:dxFunnelOptions.onIncidentOccurred]
    
    
     */
    @Output() onIncidentOccurred: EventEmitter<IncidentOccurredEvent>;

    /**
    
     * [descr:dxFunnelOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<InitializedEvent>;

    /**
    
     * [descr:dxFunnelOptions.onItemClick]
    
    
     */
    @Output() onItemClick: EventEmitter<ItemClickEvent>;

    /**
    
     * [descr:dxFunnelOptions.onLegendClick]
    
    
     */
    @Output() onLegendClick: EventEmitter<LegendClickEvent>;

    /**
    
     * [descr:dxFunnelOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<OptionChangedEvent>;

    /**
    
     * [descr:dxFunnelOptions.onSelectionChanged]
    
    
     */
    @Output() onSelectionChanged: EventEmitter<SelectionChangedEvent>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() adaptiveLayoutChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() algorithmChange: EventEmitter<"dynamicHeight" | "dynamicSlope">;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() argumentFieldChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() colorFieldChange: EventEmitter<string>;

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
    @Output() exportChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() hoverEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() invertedChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() itemChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() labelChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() legendChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() loadingIndicatorChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() marginChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() neckHeightChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() neckWidthChange: EventEmitter<number>;

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
    @Output() resolveLabelOverlappingChange: EventEmitter<"hide" | "none" | "shift">;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() rtlEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() selectionModeChange: EventEmitter<"single" | "multiple" | "none">;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() sizeChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() sortDataChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() themeChange: EventEmitter<"generic.dark" | "generic.light" | "generic.contrast" | "generic.carmine" | "generic.darkmoon" | "generic.darkviolet" | "generic.greenmist" | "generic.softblue" | "material.blue.light" | "material.lime.light" | "material.orange.light" | "material.purple.light" | "material.teal.light">;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() titleChange: EventEmitter<Record<string, any> | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() tooltipChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() valueFieldChange: EventEmitter<string>;








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
            { subscribe: 'hoverChanged', emit: 'onHoverChanged' },
            { subscribe: 'incidentOccurred', emit: 'onIncidentOccurred' },
            { subscribe: 'initialized', emit: 'onInitialized' },
            { subscribe: 'itemClick', emit: 'onItemClick' },
            { subscribe: 'legendClick', emit: 'onLegendClick' },
            { subscribe: 'optionChanged', emit: 'onOptionChanged' },
            { subscribe: 'selectionChanged', emit: 'onSelectionChanged' },
            { emit: 'adaptiveLayoutChange' },
            { emit: 'algorithmChange' },
            { emit: 'argumentFieldChange' },
            { emit: 'colorFieldChange' },
            { emit: 'dataSourceChange' },
            { emit: 'disabledChange' },
            { emit: 'elementAttrChange' },
            { emit: 'exportChange' },
            { emit: 'hoverEnabledChange' },
            { emit: 'invertedChange' },
            { emit: 'itemChange' },
            { emit: 'labelChange' },
            { emit: 'legendChange' },
            { emit: 'loadingIndicatorChange' },
            { emit: 'marginChange' },
            { emit: 'neckHeightChange' },
            { emit: 'neckWidthChange' },
            { emit: 'paletteChange' },
            { emit: 'paletteExtensionModeChange' },
            { emit: 'pathModifiedChange' },
            { emit: 'redrawOnResizeChange' },
            { emit: 'resolveLabelOverlappingChange' },
            { emit: 'rtlEnabledChange' },
            { emit: 'selectionModeChange' },
            { emit: 'sizeChange' },
            { emit: 'sortDataChange' },
            { emit: 'themeChange' },
            { emit: 'titleChange' },
            { emit: 'tooltipChange' },
            { emit: 'valueFieldChange' }
        ]);

        this._idh.setHost(this);
        optionHost.setHost(this);
    }

    protected _createInstance(element, options) {

        return new DxFunnel(element, options);
    }


    ngOnDestroy() {
        this._destroyWidget();
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        this.setupChanges('dataSource', changes);
        this.setupChanges('palette', changes);
    }

    setupChanges(prop: string, changes: SimpleChanges) {
        if (!(prop in this._optionsToUpdate)) {
            this._idh.setup(prop, changes);
        }
    }

    ngDoCheck() {
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
    DxoItemModule,
    DxoBorderModule,
    DxoHoverStyleModule,
    DxoHatchingModule,
    DxoSelectionStyleModule,
    DxoLabelModule,
    DxoConnectorModule,
    DxoFontModule,
    DxoFormatModule,
    DxoLegendModule,
    DxoMarginModule,
    DxoTitleModule,
    DxoSubtitleModule,
    DxoLoadingIndicatorModule,
    DxoSizeModule,
    DxoTooltipModule,
    DxoShadowModule,
    DxoFunnelAdaptiveLayoutModule,
    DxoFunnelBorderModule,
    DxoFunnelConnectorModule,
    DxoFunnelExportModule,
    DxoFunnelFontModule,
    DxoFunnelFormatModule,
    DxoFunnelFunnelTitleModule,
    DxoFunnelFunnelTitleSubtitleModule,
    DxoFunnelHatchingModule,
    DxoFunnelHoverStyleModule,
    DxoFunnelItemModule,
    DxoFunnelItemBorderModule,
    DxoFunnelLabelModule,
    DxoFunnelLabelBorderModule,
    DxoFunnelLegendModule,
    DxoFunnelLegendBorderModule,
    DxoFunnelLegendTitleModule,
    DxoFunnelLegendTitleSubtitleModule,
    DxoFunnelLoadingIndicatorModule,
    DxoFunnelMarginModule,
    DxoFunnelSelectionStyleModule,
    DxoFunnelShadowModule,
    DxoFunnelSizeModule,
    DxoFunnelSubtitleModule,
    DxoFunnelTitleModule,
    DxoFunnelTooltipModule,
    DxoFunnelTooltipBorderModule,
    DxIntegrationModule,
    DxTemplateModule
  ],
  declarations: [
    DxFunnelComponent
  ],
  exports: [
    DxFunnelComponent,
    DxoAdaptiveLayoutModule,
    DxoExportModule,
    DxoItemModule,
    DxoBorderModule,
    DxoHoverStyleModule,
    DxoHatchingModule,
    DxoSelectionStyleModule,
    DxoLabelModule,
    DxoConnectorModule,
    DxoFontModule,
    DxoFormatModule,
    DxoLegendModule,
    DxoMarginModule,
    DxoTitleModule,
    DxoSubtitleModule,
    DxoLoadingIndicatorModule,
    DxoSizeModule,
    DxoTooltipModule,
    DxoShadowModule,
    DxoFunnelAdaptiveLayoutModule,
    DxoFunnelBorderModule,
    DxoFunnelConnectorModule,
    DxoFunnelExportModule,
    DxoFunnelFontModule,
    DxoFunnelFormatModule,
    DxoFunnelFunnelTitleModule,
    DxoFunnelFunnelTitleSubtitleModule,
    DxoFunnelHatchingModule,
    DxoFunnelHoverStyleModule,
    DxoFunnelItemModule,
    DxoFunnelItemBorderModule,
    DxoFunnelLabelModule,
    DxoFunnelLabelBorderModule,
    DxoFunnelLegendModule,
    DxoFunnelLegendBorderModule,
    DxoFunnelLegendTitleModule,
    DxoFunnelLegendTitleSubtitleModule,
    DxoFunnelLoadingIndicatorModule,
    DxoFunnelMarginModule,
    DxoFunnelSelectionStyleModule,
    DxoFunnelShadowModule,
    DxoFunnelSizeModule,
    DxoFunnelSubtitleModule,
    DxoFunnelTitleModule,
    DxoFunnelTooltipModule,
    DxoFunnelTooltipBorderModule,
    DxTemplateModule
  ]
})
export class DxFunnelModule { }

import type * as DxFunnelTypes from "devextreme/viz/funnel_types";
export { DxFunnelTypes };


